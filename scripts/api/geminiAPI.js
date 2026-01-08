const { getGenAIClient } = require('./geminiClient');
const { isHallucinated } = require('../utils/textUtils');

/**
 * 使用新的 @google/genai SDK 調用 Google Gemini API（帶重試機制）
 * @param {string} apiKey - API 金鑰
 * @param {string} modelName - 模型名稱
 * @param {string} prompt - 提示詞
 * @param {boolean} useSearch - 是否使用 Google Search 工具
 * @param {number} maxRetries - 最大重試次數
 * @returns {Promise<{text: string, sources?: any[]}>} 生成的內容和來源
 */
async function callGeminiAPI(apiKey, modelName, prompt, useSearch = true, maxRetries = 3) {
    const ai = await getGenAIClient(apiKey);

    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            // 參考 trendpulse：將所有參數放在一個物件中
            const params = {
                model: modelName,
                contents: prompt,
            };

            // 只有在需要搜尋時才加入 tools
            if (useSearch) {
                params.config = {
                    tools: [{ googleSearch: {} }],
                };
            }

            const result = await ai.models.generateContent(params);

            const text =
                result.text ||
                result.response?.candidates?.[0]?.content?.parts
                    ?.map((p) => p.text || '')
                    .join('')
                    .trim() ||
                '';

            // 檢查 Hallucination
            if (isHallucinated(text)) {
                console.warn(`Attempt ${i + 1}: Hallucination detected.`);
                if (i === maxRetries - 1) throw new Error('Hallucination detected in response');
                continue;
            }

            // 提取來源
            const sources = [];
            if (result.candidates?.[0]?.groundingMetadata?.groundingChunks) {
                result.candidates[0].groundingMetadata.groundingChunks.forEach((chunk) => {
                    if (chunk.web?.uri) {
                        sources.push({
                            title: chunk.web.title || 'Reference Source',
                            uri: chunk.web.uri,
                        });
                    }
                });
            }

            return { text, sources };
        } catch (error) {
            lastError = error;
            console.warn(`GenAI API Attempt ${i + 1} failed.`, error.message);
            if (i === maxRetries - 1) break;

            // 處理配額錯誤（429）：解析重試時間
            let delay = 2000 * Math.pow(2, i); // 預設指數退避
            if (error.status === 429 || error.code === 429) {
                let retrySeconds = null;

                // 方法1：從錯誤的 details 中提取 retryDelay（優先）
                if (error.details && Array.isArray(error.details)) {
                    for (const detail of error.details) {
                        if (detail['@type'] === 'type.googleapis.com/google.rpc.RetryInfo' && detail.retryDelay) {
                            // retryDelay 可能是字串 "58s" 或物件
                            const delayStr = typeof detail.retryDelay === 'string'
                                ? detail.retryDelay
                                : detail.retryDelay.seconds || detail.retryDelay;
                            const match = String(delayStr).match(/([\d.]+)s?/);
                            if (match) {
                                retrySeconds = parseFloat(match[1]);
                                break;
                            }
                        }
                    }
                }

                // 方法2：從錯誤訊息中提取（備用）
                if (retrySeconds === null) {
                    const errorMessage = error.message || JSON.stringify(error);
                    const retryMatch = errorMessage.match(/retry in ([\d.]+)s/i);
                    if (retryMatch) {
                        retrySeconds = parseFloat(retryMatch[1]);
                    }
                }

                if (retrySeconds !== null) {
                    delay = Math.ceil(retrySeconds * 1000) + 1000; // 轉換為毫秒，加1秒緩衝
                    console.log(`⏳ Quota exceeded, waiting ${retrySeconds.toFixed(1)}s before retry...`);
                } else {
                    // 如果無法解析，使用較長的等待時間
                    delay = 60000; // 1分鐘
                    console.log(`⏳ Quota exceeded, waiting 60s before retry...`);
                }
            }

            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    throw lastError || new Error('API call failed after retries');
}

module.exports = {
    callGeminiAPI,
};

