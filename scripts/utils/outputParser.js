const { cleanStr, cleanupHtmlTags } = require('./textUtils');

/**
 * 解析結構化輸出
 * @param {string} text - AI 生成的文字
 * @param {string} dateStr - 日期字串（用於預設圖片提示）
 * @returns {Object} 解析後的結構化資料
 */
function parseStructuredOutput(text, dateStr) {
    let titlePart = '',
        summaryPart = '',
        bulletSummaryPart = '',
        searchQueriesPart = '',
        imagePromptPart = '',
        contentPart = '',
        sourcesPart = '';

    if (text.includes('<<<TITLE>>>')) titlePart = text.split('<<<TITLE>>>')[1]?.split('<<<')[0] || '';
    if (text.includes('<<<SUMMARY>>>')) summaryPart = text.split('<<<SUMMARY>>>')[1]?.split('<<<')[0] || '';
    if (text.includes('<<<BULLET_SUMMARY>>>')) bulletSummaryPart = text.split('<<<BULLET_SUMMARY>>>')[1]?.split('<<<')[0] || '';
    if (text.includes('<<<SEARCH_QUERIES>>>')) searchQueriesPart = text.split('<<<SEARCH_QUERIES>>>')[1]?.split('<<<')[0] || '';
    if (text.includes('<<<IMAGE_PROMPT>>>')) imagePromptPart = text.split('<<<IMAGE_PROMPT>>>')[1]?.split('<<<')[0] || '';
    if (text.includes('<<<CONTENT>>>')) contentPart = text.split('<<<CONTENT>>>')[1]?.split('<<<')[0] || '';
    if (text.includes('<<<SOURCES>>>')) sourcesPart = text.split('<<<SOURCES>>>')[1] || '';

    // 如果沒有結構化輸出，使用整個文字作為內容
    if (!contentPart && !titlePart) {
        contentPart = text;
    }

    // 清理標題（移除 Markdown 標題符號和方括號）
    let rawTitle = cleanStr(titlePart) || '今日精選';
    rawTitle = rawTitle.replace(/^#+\s*/, '').trim();
    rawTitle = cleanupHtmlTags(rawTitle);

    // 移除所有可能的「【AI日報】」或「【AI Daily】」前綴（避免重複）
    rawTitle = rawTitle.replace(/^【AI日報】\s*/g, '');
    rawTitle = rawTitle.replace(/^【AI Daily】\s*/g, '');
    rawTitle = rawTitle.replace(/^AI日報\s*/g, '');
    rawTitle = rawTitle.replace(/^AI Daily\s*/g, '');
    rawTitle = rawTitle.trim();

    // 統一加上【AI日報】前綴
    if (!rawTitle) {
        rawTitle = '今日精選';
    }
    rawTitle = `【AI日報】${rawTitle}`;

    const summary = cleanupHtmlTags(cleanStr(summaryPart) || '本篇報導整合了多方來源的即時數據與分析...');
    const bulletSummary = cleanupHtmlTags(cleanStr(bulletSummaryPart) || '');
    const imagePrompt = cleanStr(imagePromptPart) || `AI daily report ${dateStr}, RPG game-style infographic, minimalist chart, no text`;
    let content = cleanStr(contentPart) || text;
    if (content.includes('<<<SOURCES>>>')) content = content.split('<<<SOURCES>>>')[0];
    content = cleanupHtmlTags(content);
    content = content.replace(/!\[(.*?)\]\(generate_inline\)/g, ''); // 移除 generate_inline

    // 如果內容中沒有條列式摘要，且從 BULLET_SUMMARY 區塊解析到了摘要，則插入到內容開頭
    // 檢查中文和英文版本的條列式摘要標題
    const hasBulletSummary = content.includes('### 📋 快速重點摘要') ||
        content.includes('### 快速重點摘要') ||
        content.includes('### 📋 Quick Highlights') ||
        content.includes('### Quick Highlights');

    if (bulletSummary && !hasBulletSummary) {
        // 根據內容語言決定使用哪個標題（簡單判斷：如果內容包含中文字符，使用中文標題）
        const hasChinese = /[\u4e00-\u9fa5]/.test(content);
        const bulletTitle = hasChinese ? '### 📋 快速重點摘要' : '### 📋 Quick Highlights';
        const bulletSection = `${bulletTitle}\n\n${bulletSummary.trim()}\n\n`;
        content = bulletSection + content;
    }

    // 解析搜尋關鍵字
    const rawQueries = cleanStr(searchQueriesPart);
    const searchQueries = rawQueries
        ? rawQueries.split(/,|、|\n/).map((q) => q.trim()).filter((q) => q.length > 0)
        : [];

    // 解析來源（從結構化輸出和 API 回傳的來源）
    const sources = [];
    // 從 sourcesPart 提取 URL
    if (sourcesPart) {
        const lines = sourcesPart.split('\n');
        lines.forEach((line) => {
            const urlMatch = line.match(/(https?:\/\/[^\s\)]+)/);
            if (urlMatch) {
                const uri = urlMatch[0];
                let title = line.replace(uri, '').replace(/^[0-9]+[\.\)]\s*/, '').replace(/^[\-\*•]\s*/, '').replace(/[\||：:]/g, '').trim();
                if (!title || title.length < 2) {
                    try {
                        title = new URL(uri).hostname;
                    } catch {
                        title = 'External Source';
                    }
                }
                if (!sources.find((s) => s.uri === uri)) {
                    sources.push({ title, uri });
                }
            }
        });
    }

    return {
        title: rawTitle,
        summary,
        bulletSummary,
        content,
        imagePrompt,
        searchQueries,
        sources,
    };
}

module.exports = {
    parseStructuredOutput,
};

