const fs = require('fs');
const path = require('path');
// @google/genai 為 ESM 套件，使用動態 import 取得類別
let genAIClientPromise = null;

// 確保目錄存在
const blogDir = path.join(process.cwd(), 'content/blog');
if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
}

// 取得今天的日期和時間戳
const today = new Date();
const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
const timeStr = today.toISOString().split('T')[1].split('.')[0].replace(/:/g, ''); // HHMMSS
const timestamp = `${dateStr.replace(/-/g, '')}-${timeStr}`; // YYYYMMDD-HHMMSS
const dateFormatted = new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
}).format(today);

// 使用時間戳作為資料夾名稱（符合資料結構：content/blog/[日期時間]/）
const slug = timestamp;
const postFolder = path.join(blogDir, slug);
const articlePathZh = path.join(postFolder, 'article.zh-TW.md');
const articlePathEn = path.join(postFolder, 'article.en.md');

// 檢查今天是否已經生成過日報（檢查資料夾是否存在）
if (fs.existsSync(postFolder)) {
    console.log(`Daily report for ${dateStr} already exists. Skipping...`);
    process.exit(0);
}

// 建立文章資料夾
if (!fs.existsSync(postFolder)) {
    fs.mkdirSync(postFolder, { recursive: true });
}

// 初始化 Google Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error('Error: GEMINI_API_KEY environment variable is not set');
    process.exit(1);
}

// 動態建立 Gen AI Client（處理 ESM 匯入）
async function getGenAIClient() {
    if (!genAIClientPromise) {
        genAIClientPromise = import('@google/genai').then((mod) => {
            // 優先使用 GoogleGenAI（新 SDK 主要入口）
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
            // 新版 SDK 以 ai.models.* 提供存取
            if (!client.models || typeof client.models.generateContent !== 'function') {
                const keys = Object.keys(client || {});
                throw new Error(`Loaded client does not expose models.generateContent. Client keys: ${keys.join(', ')}`);
            }
            return client;
        });
    }

    return genAIClientPromise;
}

// 模型列表按優先順序排列（優先使用 Gemini 2.5）
// Gemini 2.5 是 Google 發布的 AI 模型，具備強大的推理能力和多模態理解
const modelNames = [
    'gemini-2.5-pro',            // Gemini 2.5 Pro - 專業版本（優先使用）
    'gemini-2.5-flash',          // Gemini 2.5 Flash - 快速版本
    'gemini-2.5-pro-latest',     // Gemini 2.5 Pro Latest（備用命名）
    'gemini-2.5-flash-latest',   // Gemini 2.5 Flash Latest（備用命名）
    'gemini-2.0-flash-exp',      // Gemini 2.0 Flash Experimental（後備）
    'gemini-1.5-flash-latest',   // Gemini 1.5 Flash Latest（後備）
    'gemini-1.5-pro-latest',     // Gemini 1.5 Pro Latest（後備）
    'gemini-pro',                // Gemini Pro 穩定版（最後後備）
];

// 生成 AI 日報的 Prompt（改進版，確保使用當天新聞）
const articlePromptZh = `你是一位專業的 AI 領域新聞編輯，請生成一份 AI 領域的每日日報（繁體中文）。

**⚠️ 重要：當前日期資訊（請嚴格遵守）**
- 今天的完整日期：${dateFormatted}
- 今天的日期格式（YYYY-MM-DD）：${dateStr}
- 今天是星期：${dateFormatted.split('，')[1] || '未知'}

**嚴格要求：**
1. **時效性要求（最重要）**：
   - 只使用 ${dateStr}（今天）發布或發生的新聞和動態
   - 絕對不要使用昨天或更早的新聞
   - 如果今天沒有足夠的新聞，可以包含最近 24 小時內的重要動態
   - 每則新聞必須明確標註時間或說明是「今日」或「${dateStr}」發生
   - 如果某則新聞沒有明確的日期標註，請不要包含它

2. **內容結構**：
   - 標題要吸引人，必須包含完整日期：${dateFormatted}
   - 內容要包含以下部分（每個部分都要有實際內容）：
     * **今日要聞**：${dateStr} 當天最重要的 AI 新聞（至少 2-3 則）
     * **技術突破**：今天發布或公開的重要技術進展、研究論文、產品更新
     * **開源專案**：今天發布、更新或熱門的開源專案和工具
     * **開發實務**：實用的開發技巧、最佳實踐、工具推薦
     * **趨勢觀察**：基於今日動態的短期趨勢分析

3. **內容品質**：
   - 使用繁體中文撰寫
   - 內容要有結構，使用 Markdown 格式
   - 包含適當的標題層級（##, ###）
   - 內容要專業但易懂，適合技術人員閱讀
   - 長度約 1000-1500 字
   - 每則新聞都要有具體來源或事件描述，避免模糊或虛構資訊
   - 如果某個類別今天沒有相關內容，可以標註「今日無重大更新」但不要編造

4. **格式要求**：
   - 使用 Markdown 格式
   - 標題使用 ## 和 ###
   - 重要資訊可以使用 **粗體** 強調
   - 每則新聞前使用 - 或 * 作為列表項
   - 不需要包含 frontmatter（我會另外加上）

**最後提醒：**
- 所有新聞必須是 ${dateStr}（今天）發生或發布的
- 如果無法確定某則新聞是否為今天，請不要包含它
- 寧可內容少一些，也不要包含過時的新聞
- 每則新聞都應該能夠明確說明是「今日」或「${dateStr}」的內容

**請直接輸出 Markdown 格式的內容，確保所有內容都是 ${dateStr} 當天的新聞和動態。**`;

const articlePromptEn = `You are a professional AI news editor. Please write today's AI daily report in English.

**Date context (must be strictly followed)**
- Full date today: ${dateFormatted}
- ISO date (YYYY-MM-DD): ${dateStr}
- Weekday: ${dateFormatted.split('，')[1] || 'Unknown'}

**Strict rules**
1) Freshness (most important):
   - Only include news/events published or happened on ${dateStr}
   - No items from previous days
   - If few items today, include important items from the last 24h and label them clearly
   - Each item must mention it is today (${dateStr}) or clearly give today’s timestamp

2) Structure:
   - Catchy title with the full date: ${dateFormatted}
   - Sections (all must have content):
     * Top Stories (2-3 items minimum)
     * Technical Breakthroughs
     * Open Source
     * Dev Practices / Tips
     * Trend Watch

3) Quality:
   - English, Markdown, with headings (##, ###)
   - Professional but readable, 1000-1500 words
   - Every item must have concrete source/event details; avoid vague or fabricated info
   - If a section truly has nothing today, say “No major update today” but don’t invent

4) Formatting:
   - Markdown, headings with ##/###
   - Use **bold** for emphasis; bullet with - or *
   - No frontmatter (handled separately)

**Reminder**:
- Every item must be from today (${dateStr}); skip if unsure.
- Prefer fewer items over outdated info.
- Output Markdown only.`;

// 生成封面圖片描述的 Prompt
const imagePrompt = `請為 ${dateFormatted} AI 每日日報生成「RPG 遊戲風格的資訊圖表」封面描述，使用繁體中文：
要求：
1. 風格：RPG / 像素或手繪風格的資訊圖表，清晰易懂
2. 內容：以角色面板/任務清單方式，快速展現今日 AI 重點（要聞、技術、開源、實務、趨勢）
3. 構圖：可有簡化地圖或任務列表圖示，箭頭/圖示指向重點，避免過度複雜
4. 色調：清爽易讀（可用深色底配亮色重點），保持專業與科技感
5. 請只輸出圖片描述，不要附帶其他文字。`;

/**
 * 使用新的 @google/genai SDK 調用 Google Gemini API
 * @param {string} modelName - 模型名稱
 * @param {string} prompt - 提示詞
 * @returns {Promise<string>} 生成的內容
 */
async function callGeminiAPI(modelName, prompt) {
    try {
        const ai = await getGenAIClient();
        const result = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
        });

        const text =
            result.text ||
            result.response?.candidates?.[0]?.content?.parts
                ?.map((p) => p.text || '')
                .join('')
                .trim() ||
            '';
        return text;
    } catch (error) {
        // 重新拋出錯誤以便上層處理
        throw error;
    }
}

/**
 * 使用 OpenAI DALL-E API 生成圖片（如果可用）
 * @param {string} prompt - 圖片描述
 * @returns {Promise<string|null>} 圖片 URL 或 null
 */
async function generateImageWithGemini(prompt) {
    const ai = await getGenAIClient();
    const imageModelCandidates = [
        'imagen-3.0-generate-001',
        'gemini-2.0-flash-exp',
        'gemini-1.5-flash-latest',
    ];

    for (const model of imageModelCandidates) {
        try {
            console.log(`Generating cover image with model: ${model}...`);
            const res = await ai.models.generateImages({
                model,
                prompt,
            });

            const img =
                res?.data?.[0]?.b64Json ||
                res?.data?.[0]?.bytesBase64Encoded ||
                res?.data?.[0]?.image?.base64 ||
                res?.data?.[0]?.imageBase64;

            if (!img) {
                console.error('⚠️  Image response missing base64 data');
                continue;
            }

            const imageBuffer = Buffer.from(img, 'base64');
            const imageFileName = `cover-${timestamp}.png`;
            const imagePath = path.join(postFolder, imageFileName);
            fs.writeFileSync(imagePath, imageBuffer);
            console.log(`✅ Cover image generated: ${imageFileName}`);
            return imageFileName;
        } catch (error) {
            console.error(`⚠️  Image model ${model} failed:`, error.message);
            continue;
        }
    }

    console.log('⚠️  Could not generate cover image, continuing without it...');
    return null;
}

/**
 * 生成圖片描述並嘗試生成圖片
 */
async function generateCoverImage(articleContent) {
    let lastError = null;

    // 嘗試使用 Gemini 生成圖片描述
    for (const modelName of modelNames) {
        try {
            console.log(`Generating image description with model: ${modelName}...`);
            const imageDescription = await callGeminiAPI(modelName, imagePrompt);

            // 嘗試使用 Gemini 生成圖片
            const imageFileName = await generateImageWithGemini(imageDescription.trim());
            return imageFileName;

        } catch (error) {
            lastError = error;
            const isModelNotFound =
                error.status === 404 ||
                error.message?.includes('not found') ||
                error.message?.includes('404') ||
                error.message?.includes('Model') ||
                error.code === 404;

            if (isModelNotFound) {
                console.log(`Model ${modelName} not available for image description, trying next...`);
                continue;
            } else {
                console.error(`Error with model ${modelName}:`, error.message);
                break;
            }
        }
    }

    console.log('⚠️  Could not generate cover image, continuing without it...');
    return null;
}

async function generateDailyReport() {
    let lastError = null;

    // 嘗試每個模型直到成功生成文章（中英）
    for (const modelName of modelNames) {
        try {
            console.log(`Trying model: ${modelName}...`);
            const contentZh = await callGeminiAPI(modelName, articlePromptZh);
            const contentEn = await callGeminiAPI(modelName, articlePromptEn);

            // 成功生成文章！先處理圖片，再寫雙語檔案
            const coverImage = await generateCoverImage(contentZh);
            processContent(contentZh, contentEn, coverImage);
            return; // 成功退出

        } catch (error) {
            lastError = error;
            // 檢查是否為模型不存在的錯誤
            const isModelNotFound =
                error.status === 404 ||
                error.message?.includes('not found') ||
                error.message?.includes('404') ||
                error.message?.includes('Model') ||
                error.code === 404;

            if (isModelNotFound) {
                console.log(`Model ${modelName} not available, trying next...`);
                continue; // 嘗試下一個模型
            } else {
                // 其他錯誤，重新拋出
                console.error(`Error with model ${modelName}:`, error.message);
                throw error;
            }
        }
    }

    // 如果所有模型都失敗
    throw lastError || new Error('All models failed');
}

function buildFrontmatter({ title, coverImage }) {
    return `---
title: "${title}"
date: "${dateStr}"
description: "每日精選 AI 領域的最新動態、技術突破、開源專案與實用技巧，幫助你掌握 AI 發展趨勢。"
tags: ["AI", "每日日報", "技術趨勢"]
${coverImage ? `coverImage: "${coverImage}"` : ''}
---

`;
}

function processContent(contentZh, contentEn, coverImage) {
    const fmZh = buildFrontmatter({ title: `AI 每日日報 - ${dateFormatted}`, coverImage });
    const fmEn = buildFrontmatter({ title: `AI Daily Report - ${dateFormatted}`, coverImage });

    const fullZh = fmZh + contentZh;
    const fullEn = fmEn + contentEn;

    fs.writeFileSync(articlePathZh, fullZh, 'utf8');
    fs.writeFileSync(articlePathEn, fullEn, 'utf8');

    console.log(`✅ Daily report generated successfully!`);
    console.log(`📁 Folder: ${slug}/`);
    console.log(`📝 Files: article.zh-TW.md, article.en.md`);
    if (coverImage) {
        console.log(`🖼️  Cover image: ${coverImage}`);
    }
}

generateDailyReport().catch((error) => {
    console.error('Error generating daily report:', error);

    // 如果模型未找到，提供建議
    if (error.status === 404 || error.message?.includes('not found') || error.message?.includes('404')) {
        console.error('\n💡 Tip: None of the tried models are available.');
        console.error('   Tried models:', modelNames.join(', '));
        console.error('\nYou can check available models or update the modelNames array in the script.');
    }

    // 顯示詳細錯誤信息
    if (error.message) {
        console.error('\nError details:', error.message);
    }

    process.exit(1);
});
