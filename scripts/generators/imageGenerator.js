const fs = require('fs');
const path = require('path');
const { getGenAIClient } = require('../api/geminiClient');
const { imageModelCandidates } = require('../config');

/**
 * 使用 Gemini 生成圖片（參考 trendpulse 的實現）
 * 優先使用 Gemini 2.5 Flash Image 模型
 * @param {string} apiKey - API 金鑰
 * @param {string} prompt - 圖片生成提示
 * @param {string} timestamp - 時間戳（用於檔名）
 * @param {string} postFolder - 文章資料夾路徑
 * @returns {Promise<string|null>} 圖片檔名，失敗時返回 null
 */
async function generateImageWithGemini(apiKey, prompt, timestamp, postFolder) {
    const ai = await getGenAIClient(apiKey);

    // 優化 Prompt：強制使用「RPG 遊戲風格資訊圖表」（參考 trendpulse）
    const enhancedPrompt = `${prompt}, RPG game-style infographic, data visualization style, isometric 3d chart, concept map, business intelligence, clean vector art, white background, high contrast, professional, 8k, no text, textless, without words, no letters, no watermark, clean design, simple geometric shapes`;

    for (const model of imageModelCandidates) {
        try {
            console.log(`Generating cover image with model: ${model}...`);
            // 參考 trendpulse 的格式：contents: { parts: [{ text: enhancedPrompt }] }
            const result = await ai.models.generateContent({
                model,
                contents: {
                    parts: [{ text: enhancedPrompt }],
                },
                config: {
                    imageConfig: { aspectRatio: '16:9' },
                },
            });

            // 檢查回傳的圖片資料
            for (const candidate of result.candidates || []) {
                for (const part of candidate.content?.parts || []) {
                    if (part.inlineData) {
                        const imageBuffer = Buffer.from(part.inlineData.data, 'base64');
                        const imageFileName = `cover-${timestamp}.png`;
                        const imagePath = path.join(postFolder, imageFileName);
                        fs.writeFileSync(imagePath, imageBuffer);
                        console.log(`✅ Cover image generated: ${imageFileName}`);
                        return imageFileName;
                    }
                }
            }

            // 嘗試其他可能的格式
            const img =
                result.data?.[0]?.b64Json ||
                result.data?.[0]?.bytesBase64Encoded ||
                result.data?.[0]?.image?.base64 ||
                result.data?.[0]?.imageBase64;

            if (img) {
                const imageBuffer = Buffer.from(img, 'base64');
                const imageFileName = `cover-${timestamp}.png`;
                const imagePath = path.join(postFolder, imageFileName);
                fs.writeFileSync(imagePath, imageBuffer);
                console.log(`✅ Cover image generated: ${imageFileName}`);
                return imageFileName;
            }
        } catch (error) {
            console.error(`⚠️  Image model ${model} failed:`, error.message);
            continue;
        }
    }

    console.log('⚠️  Could not generate cover image, continuing without it...');
    return null;
}

module.exports = {
    generateImageWithGemini,
};

