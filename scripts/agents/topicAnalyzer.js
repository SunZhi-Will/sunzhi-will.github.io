const { callGeminiAPI } = require('../api/geminiAPI');

/**
 * Agent Step 1: 分析今天的新聞主題和關鍵字
 * @param {string} apiKey - API 金鑰
 * @param {string} modelName - 模型名稱
 * @param {string} dateStr - 日期字串
 * @returns {Promise<{topics: Array, keywords: Array, summary: string}>} 主題、關鍵字和摘要
 */
async function analyzeTodayTopics(apiKey, modelName, dateStr) {
    const analysisPrompt = `
【System: News Topic Analyzer Agent】
你是一位新聞分析專家。請先搜尋今天（${dateStr}）的 AI 相關新聞，然後分析今天的主要主題和關鍵字。

【任務】
1. 使用 Google Search 搜尋今天（${dateStr}）的 AI 最新動態
2. 分析今天的主要新聞主題（3-5 個）
3. 提取關鍵字（10-15 個，包括公司名、產品名、技術名詞等）

【輸出格式】
<<<TOPICS>>>
主題1：簡短描述
主題2：簡短描述
主題3：簡短描述
...
<<<KEYWORDS>>>
關鍵字1, 關鍵字2, 關鍵字3, ...
<<<SUMMARY>>>
今天的主要新聞摘要（100-150字）
`;

    console.log('🔍 Agent Step 1: Analyzing today\'s topics...');
    const result = await callGeminiAPI(apiKey, modelName, analysisPrompt, true);

    // 解析主題和關鍵字
    const topics = [];
    const keywords = [];
    let summary = '';

    if (result.text.includes('<<<TOPICS>>>')) {
        const topicsPart = result.text.split('<<<TOPICS>>>')[1]?.split('<<<')[0] || '';
        topicsPart.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('<<<')) {
                topics.push(trimmed);
            }
        });
    }

    if (result.text.includes('<<<KEYWORDS>>>')) {
        const keywordsPart = result.text.split('<<<KEYWORDS>>>')[1]?.split('<<<')[0] || '';
        keywordsPart.split(',').forEach(kw => {
            const trimmed = kw.trim();
            if (trimmed) {
                keywords.push(trimmed);
            }
        });
    }

    if (result.text.includes('<<<SUMMARY>>>')) {
        summary = result.text.split('<<<SUMMARY>>>')[1]?.split('<<<')[0]?.trim() || '';
    }

    console.log(`✅ Found ${topics.length} topics and ${keywords.length} keywords`);
    return { topics, keywords, summary };
}

module.exports = {
    analyzeTodayTopics,
};

