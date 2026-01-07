/**
 * 測試 Gemini 2.5 Flash Image 圖片生成功能
 * 
 * 使用方法：
 * node scripts/test-image-generation.js
 */

const fs = require('fs');
const path = require('path');

// 確保目錄存在
const testDir = path.join(process.cwd(), 'content/blog', 'test-image-generation');
if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
}

// 初始化 Google Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error('❌ Error: GEMINI_API_KEY environment variable is not set');
    console.error('   請設置環境變數：export GEMINI_API_KEY=your_api_key');
    process.exit(1);
}

// 動態建立 Gen AI Client（處理 ESM 匯入）
let genAIClientPromise = null;
async function getGenAIClient() {
    if (!genAIClientPromise) {
        genAIClientPromise = import('@google/genai').then((mod) => {
            const ClientClass =
                mod.GoogleGenAI ||
                mod.GoogleAI ||
                mod.GoogleGenerativeAI ||
                mod.default?.GoogleGenAI ||
                mod.default?.GoogleAI ||
                mod.default?.GoogleGenerativeAI ||
                (typeof mod.default === 'function' ? mod.default : null);

            if (!ClientClass) {
                const availableKeys = Object.keys(mod || {}).concat(Object.keys(mod?.default || {}));
                throw new Error(
                    `Cannot find GoogleGenAI/GoogleAI/GoogleGenerativeAI in @google/genai. Export keys: ${availableKeys.join(', ')}`
                );
            }

            const client = new ClientClass({ apiKey });
            if (!client.models || typeof client.models.generateContent !== 'function') {
                const keys = Object.keys(client || {});
                throw new Error(`Loaded client does not expose models.generateContent. Client keys: ${keys.join(', ')}`);
            }
            return client;
        });
    }

    return genAIClientPromise;
}

/**
 * 測試圖片生成功能
 */
async function testImageGeneration() {
    console.log('🧪 開始測試 Gemini 2.5 Flash Image 圖片生成...\n');

    const ai = await getGenAIClient();
    
    // 圖片生成模型列表（按優先順序）
    const imageModelCandidates = [
        'gemini-2.5-flash-image',   // Gemini 2.5 Flash Image（優先使用）
        'gemini-2.0-flash-exp-image', // Gemini 2.0 Flash Experimental Image（備用）
    ];

    // 測試用的圖片描述
    const testPrompt = 'AI technology, artificial intelligence, futuristic concept';
    const enhancedPrompt = `${testPrompt}, RPG game-style infographic, data visualization style, isometric 3d chart, concept map, business intelligence, clean vector art, white background, high contrast, professional, 8k, no text, textless, without words, no letters, no watermark, clean design, simple geometric shapes`;

    console.log('📝 測試 Prompt:');
    console.log(`   ${testPrompt}\n`);
    console.log('🔧 增強後的 Prompt:');
    console.log(`   ${enhancedPrompt}\n`);

    for (const model of imageModelCandidates) {
        try {
            console.log(`🔄 嘗試使用模型: ${model}...`);
            
            const result = await ai.models.generateContent({
                model,
                contents: {
                    parts: [{ text: enhancedPrompt }],
                },
                config: {
                    imageConfig: { aspectRatio: '16:9' },
                },
            });

            console.log('✅ API 呼叫成功！');
            console.log('📦 檢查回傳結果...\n');

            // 檢查回傳的圖片資料
            let imageFound = false;
            for (const candidate of result.candidates || []) {
                for (const part of candidate.content?.parts || []) {
                    if (part.inlineData) {
                        console.log('✅ 找到 inlineData 格式的圖片資料');
                        const imageBuffer = Buffer.from(part.inlineData.data, 'base64');
                        const imageFileName = `test-cover-${Date.now()}.png`;
                        const imagePath = path.join(testDir, imageFileName);
                        fs.writeFileSync(imagePath, imageBuffer);
                        console.log(`✅ 圖片已保存: ${imagePath}`);
                        console.log(`📊 圖片大小: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
                        imageFound = true;
                        return imageFileName;
                    }
                }
            }

            // 嘗試其他可能的格式
            if (!imageFound) {
                console.log('⚠️  未找到 inlineData，嘗試其他格式...');
                const img =
                    result.data?.[0]?.b64Json ||
                    result.data?.[0]?.bytesBase64Encoded ||
                    result.data?.[0]?.image?.base64 ||
                    result.data?.[0]?.imageBase64;

                if (img) {
                    console.log('✅ 找到其他格式的圖片資料');
                    const imageBuffer = Buffer.from(img, 'base64');
                    const imageFileName = `test-cover-${Date.now()}.png`;
                    const imagePath = path.join(testDir, imageFileName);
                    fs.writeFileSync(imagePath, imageBuffer);
                    console.log(`✅ 圖片已保存: ${imagePath}`);
                    console.log(`📊 圖片大小: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
                    return imageFileName;
                }
            }

            // 如果沒有找到圖片，輸出結果結構以便調試
            if (!imageFound) {
                console.log('⚠️  未找到圖片資料，輸出結果結構以便調試：');
                console.log(JSON.stringify(result, null, 2).substring(0, 500) + '...');
            }

        } catch (error) {
            console.error(`❌ 模型 ${model} 失敗:`);
            console.error(`   錯誤訊息: ${error.message}`);
            if (error.status) {
                console.error(`   狀態碼: ${error.status}`);
            }
            if (error.code) {
                console.error(`   錯誤代碼: ${error.code}`);
            }
            console.log('');
            continue;
        }
    }

    console.log('❌ 所有模型都失敗了，無法生成圖片');
    return null;
}

// 執行測試
testImageGeneration()
    .then((imageFileName) => {
        if (imageFileName) {
            console.log('\n✅ 測試成功！圖片已生成。');
            console.log(`📁 圖片位置: content/blog/test-image-generation/${imageFileName}`);
        } else {
            console.log('\n❌ 測試失敗，無法生成圖片。');
            process.exit(1);
        }
    })
    .catch((error) => {
        console.error('\n❌ 測試過程中發生錯誤:');
        console.error(error);
        process.exit(1);
    });

