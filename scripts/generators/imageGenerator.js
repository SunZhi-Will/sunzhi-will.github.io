const fs = require('fs');
const path = require('path');
const { getGenAIClient } = require('../api/geminiClient');
const { imageModelCandidates } = require('../config');
const { generateFreeImage } = require('../utils/imageGenerator-free');

/**
 * 生成圖片（支援 Gemini 和 Imagen 模型）
 * 自動選擇可用的模型
 * @param {string} apiKey - API 金鑰
 * @param {string} prompt - 圖片生成提示
 * @param {string} timestamp - 時間戳（用於檔名）
 * @param {string} postFolder - 文章資料夾路徑
 * @returns {Promise<string|null>} 圖片檔名，失敗時返回 null
 */
async function generateImageWithGemini(apiKey, prompt, timestamp, postFolder) {
    const ai = await getGenAIClient(apiKey);

    // 讀取文章內容用於生成更準確的圖片
    let articleContent = '';
    try {
        const articlePath = path.join(postFolder, 'article.zh-TW.mdx');
        if (fs.existsSync(articlePath)) {
            articleContent = fs.readFileSync(articlePath, 'utf8');
        }
    } catch (error) {
        console.log('⚠️  無法讀取文章內容，將使用通用提示詞');
    }

    // 優化 Prompt：專業文章封面風格
    const enhancedPrompt = `${prompt}, modern minimalist design, professional magazine cover style, abstract technology background, gradient colors, clean composition, high quality, 4k, no text, no watermark, elegant and simple`;

    for (const model of imageModelCandidates) {
        try {
            console.log(`Generating cover image with model: ${model}...`);

            // 檢查模型類型並使用對應的方法
            if (model.startsWith('imagen-')) {
                // 使用 Imagen 的 generateImages 方法
                const response = await ai.models.generateImages({
                    model: model,
                    prompt: enhancedPrompt,
                    config: {
                        numberOfImages: 1,  // 只生成一張圖片
                        aspectRatio: '16:9', // 16:9 寬高比
                    },
                });

                // 處理生成的圖片
                if (response.generatedImages && response.generatedImages.length > 0) {
                    const generatedImage = response.generatedImages[0];

                    // 從 generatedImage 中提取圖片數據
                    let imgBytes;
                    if (generatedImage.image && generatedImage.image.imageBytes) {
                        imgBytes = generatedImage.image.imageBytes;
                    } else if (generatedImage.imageBytes) {
                        imgBytes = generatedImage.imageBytes;
                    }

                    if (imgBytes) {
                        const imageBuffer = Buffer.from(imgBytes, 'base64');
                        const imageFileName = `cover-${timestamp}.png`;
                        const imagePath = path.join(postFolder, imageFileName);
                        fs.writeFileSync(imagePath, imageBuffer);
                        console.log(`✅ Cover image generated with Imagen: ${imageFileName}`);
                        return imageFileName;
                    }
                }
            } else if (model.includes('flash-image') || model.includes('gemini')) {
                // 使用 Gemini 的 generateContent 方法
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
                            console.log(`✅ Cover image generated with Gemini: ${imageFileName}`);
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
                    console.log(`✅ Cover image generated with Gemini: ${imageFileName}`);
                    return imageFileName;
                }
            }

            console.warn(`⚠️  No image data found in response from ${model}`);

        } catch (error) {
            // 檢查錯誤類型
            const errorObj = error.error || error;
            const errorCode = errorObj.code || errorObj.status;
            const errorMessage = errorObj.message || error.message || JSON.stringify(error);

            console.log(`🔍 Detailed error for model ${model}:`);
            console.log(`   Error code: ${errorCode}`);
            console.log(`   Error message: ${errorMessage.substring(0, 300)}`);

            // 配額錯誤：優雅處理，不影響文章生成
            if (errorCode === 429 || errorCode === 'RESOURCE_EXHAUSTED' || errorMessage.includes('quota')) {
                console.warn(`⚠️  Image model ${model} quota exceeded. Skipping image generation for this model.`);
                continue;
            }

            // 模型不存在：跳過這個模型
            if (errorCode === 404 || errorCode === 'NOT_FOUND' || errorMessage.includes('not found')) {
                console.warn(`⚠️  Image model ${model} not found or not available. Trying next model...`);
                continue;
            }

            // Imagen 需要付費帳戶的錯誤
            if (errorCode === 400 && errorMessage.includes('only accessible to billed users')) {
                console.warn(`⚠️  ${model} requires a paid account. Skipping to next model...`);
                console.warn(`   💡 To use Imagen, upgrade to a paid Google Cloud account.`);
                continue;
            }

            // API 金鑰錯誤
            if (errorCode === 403 || errorCode === 'PERMISSION_DENIED' || errorMessage.includes('API_KEY')) {
                console.warn(`⚠️  API key issue with model ${model}. Check if image generation is enabled for this API key.`);
                continue;
            }

            // 其他錯誤：記錄但繼續
            console.warn(`⚠️  Image model ${model} failed:`, errorMessage.substring(0, 200));
            continue;
        }
    }

    // 嘗試免費圖片生成服務作為最後手段
    console.log('\n🆓 嘗試免費圖片生成服務...');
    try {
        const freeImageResult = await generateFreeImage(prompt, timestamp, postFolder, articleContent);
        if (freeImageResult) {
            console.log(`✅ 使用免費服務成功生成圖片: ${freeImageResult}`);
            return freeImageResult;
        }
    } catch (error) {
        console.warn('⚠️  免費圖片生成也失敗:', error.message);
    }

    console.log('⚠️  Could not generate cover image (all services failed).');
    console.log('   Article will be generated without cover image.');
    return null;
}

module.exports = {
    generateImageWithGemini,
};

