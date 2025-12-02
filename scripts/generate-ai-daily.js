const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 確保目錄存在
const blogDir = path.join(process.cwd(), 'content/blog');
if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
}

// 取得今天的日期
const today = new Date();
const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
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

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// 生成 AI 日報的 Prompt
const prompt = `請生成一份 AI 領域的每日日報，日期是 ${dateStr}。

要求：
1. 標題要吸引人，包含日期
2. 內容要包含：
   - AI 領域的最新動態和新聞
   - 重要的技術突破或研究進展
   - 熱門的開源專案或工具
   - 實用的開發技巧或最佳實踐
   - 對未來的展望或趨勢分析

3. 使用繁體中文撰寫
4. 內容要有結構，使用 Markdown 格式
5. 包含適當的標題層級（##, ###）
6. 內容要專業但易懂
7. 長度約 800-1200 字
8. 內容要真實、有價值，避免虛構資訊

請直接輸出 Markdown 格式的內容，不需要包含 frontmatter（我會另外加上）。`;

async function generateDailyReport() {
    try {
        console.log('Generating AI daily report...');

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const content = response.text();

        // 格式化日期為中文
        const dateFormatted = new Intl.DateTimeFormat('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        }).format(today);

        // 生成 frontmatter
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

    } catch (error) {
        console.error('Error generating daily report:', error);
        process.exit(1);
    }
}

generateDailyReport();

