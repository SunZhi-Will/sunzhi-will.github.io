const fs = require('fs');
const { removeDatePatterns, truncateSummary } = require('../utils/textUtils');
const { enrichSourceTitles } = require('../utils/sourceEnricher');

/**
 * 處理內容並寫入檔案
 * @param {Object} parsedZh - 解析後的中文內容
 * @param {Object} parsedEn - 解析後的英文內容
 * @param {string|null} coverImage - 封面圖片檔名
 * @param {string} dateStr - 日期字串
 * @param {string} slug - 文章 slug
 * @param {string} articlePathZh - 中文文章路徑
 * @param {string} articlePathEn - 英文文章路徑
 */
async function processContent(parsedZh, parsedEn, coverImage, dateStr, slug, articlePathZh, articlePathEn) {
    // 處理 description：移除日期、簡短化
    let descriptionZh = (parsedZh.summary || '').trim();
    let descriptionEn = (parsedEn.summary || '').trim();

    // 移除日期相關內容
    descriptionZh = removeDatePatterns(descriptionZh);
    descriptionEn = removeDatePatterns(descriptionEn);

    // 限制長度（中文約 80 字，英文約 100 字符）
    descriptionZh = truncateSummary(descriptionZh, 80, true);
    descriptionEn = truncateSummary(descriptionEn, 100, false);

    // 生成中文 frontmatter
    const frontmatterZh = `---
title: "${parsedZh.title}"
date: "${dateStr}"
description: "${descriptionZh.replace(/"/g, '\\"')}"
tags: ["AI", "每日日報", "技術趨勢"]
${coverImage ? `coverImage: "${coverImage}"` : ''}
---

`;

    // 生成英文 frontmatter
    const frontmatterEn = `---
title: "${parsedEn.title}"
date: "${dateStr}"
description: "${descriptionEn.replace(/"/g, '\\"')}"
tags: ["AI", "Daily Report", "Tech Trends"]
${coverImage ? `coverImage: "${coverImage}"` : ''}
---

`;

    // 處理來源（中英文共用相同的來源）
    let enrichedSources = [];
    if (parsedZh.sources && parsedZh.sources.length > 0) {
        // 去重來源（根據 URI）
        const uniqueSources = [];
        const seenUris = new Set();
        parsedZh.sources.forEach((source) => {
            if (source.uri && !seenUris.has(source.uri)) {
                seenUris.add(source.uri);
                uniqueSources.push(source);
            }
        });

        // 獲取並豐富來源標題
        console.log(`📡 Fetching page titles for ${uniqueSources.length} sources...`);
        enrichedSources = await enrichSourceTitles(uniqueSources);
    }

    // 組合完整內容（包含來源）
    let contentZh = parsedZh.content;
    // 確保來源區塊一定會顯示
    contentZh += '\n\n---\n\n## 參考來源\n\n';
    if (enrichedSources.length > 0) {
        enrichedSources.forEach((source, index) => {
            contentZh += `${index + 1}. [${source.title || '來源'}](${source.uri})\n`;
        });
    } else {
        contentZh += '本文資訊來源於 Google Search 即時查詢結果。\n';
    }

    let contentEn = parsedEn.content;
    // 確保來源區塊一定會顯示
    contentEn += '\n\n---\n\n## References\n\n';
    if (enrichedSources.length > 0) {
        enrichedSources.forEach((source, index) => {
            contentEn += `${index + 1}. [${source.title || 'Source'}](${source.uri})\n`;
        });
    } else {
        contentEn += 'Information sources from Google Search real-time queries.\n';
    }

    // 寫入檔案
    fs.writeFileSync(articlePathZh, frontmatterZh + contentZh, 'utf8');
    fs.writeFileSync(articlePathEn, frontmatterEn + contentEn, 'utf8');

    console.log(`✅ Daily report generated successfully!`);
    console.log(`📁 Folder: ${slug}/`);
    console.log(`📝 File: article.zh-TW.mdx`);
    console.log(`📝 File: article.en.mdx`);
    if (coverImage) {
        console.log(`🖼️  Cover image: ${coverImage}`);
    }
}

module.exports = {
    processContent,
};

