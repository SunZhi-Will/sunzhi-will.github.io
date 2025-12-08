const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/genai');

// 確保目錄存在
const blogDir = path.join(process.cwd(), 'content/blog');
if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
}

// 取得今天的日期
const today = new Date();
const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
const dateFormatted = new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
}).format(today);
const slug = `ai-daily-report-${dateStr}`;
const filePath = path.join(blogDir, `${slug}.md`);

// 檢查今天是否已經生成過日報
if (fs.existsSync(filePath)) {
    console.log(`Daily report for ${dateStr} already exists. Skipping...`);
    process.exit(0);
}

// 初始化 Google Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error('Error: GEMINI_API_KEY environment variable is not set');
    process.exit(1);
}

// 初始化新的 Google Gen AI SDK
const genAI = new GoogleGenerativeAI(apiKey);

// 模型列表按優先順序排列（使用最新的模型名稱）
const modelNames = [
    'gemini-2.0-flash-exp',      // Gemini 2.0 Flash Experimental
    'gemini-1.5-flash-latest',   // Gemini 1.5 Flash Latest
    'gemini-1.5-pro-latest',     // Gemini 1.5 Pro Latest
    'gemini-pro',                // Gemini Pro (穩定版)
];

// 生成 AI 日報的 Prompt（改進版，確保使用當天新聞）
const prompt = `你是一位專業的 AI 領域新聞編輯，請生成一份 AI 領域的每日日報。

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

/**
 * 使用新的 @google/genai SDK 調用 Google Gemini API
 * @param {string} modelName - 模型名稱
 * @param {string} prompt - 提示詞
 * @returns {Promise<string>} 生成的內容
 */
async function callGeminiAPI(modelName, prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        // 重新拋出錯誤以便上層處理
        throw error;
    }
}

async function generateDailyReport() {
    let lastError = null;

    // 嘗試每個模型直到成功
    for (const modelName of modelNames) {
        try {
            console.log(`Trying model: ${modelName}...`);
            const content = await callGeminiAPI(modelName, prompt);

            // 成功！處理內容
            processContent(content);
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

function processContent(content) {
    // 生成 frontmatter（使用已計算的 dateFormatted）
    const frontmatter = `---
title: "AI 每日日報 - ${dateFormatted}"
date: "${dateStr}"
description: "每日精選 AI 領域的最新動態、技術突破、開源專案與實用技巧，幫助你掌握 AI 發展趨勢。"
tags: ["AI", "每日日報", "技術趨勢"]
---

`;

    // 組合完整內容
    const fullContent = frontmatter + content;

    // 寫入文件
    fs.writeFileSync(filePath, fullContent, 'utf8');

    console.log(`✅ Daily report generated successfully: ${filePath}`);
    console.log(`📝 File: ${slug}.md`);
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
