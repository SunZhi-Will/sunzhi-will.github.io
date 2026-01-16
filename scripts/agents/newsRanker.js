const { callGeminiAPI } = require('../api/geminiAPI');

/**
 * News Ranker Agent - 評估和排序新聞的重要性
 */
class NewsRanker {
    constructor() {
        this.importanceWeights = {
            recency: 0.3,      // 新鮮度權重
            relevance: 0.4,    // 相關性權重
            credibility: 0.2,  // 可信度權重
            impact: 0.1        // 影響力權重
        };
    }

    /**
     * 使用AI評估新聞的重要性
     * @param {Array} news - 新聞陣列
     * @param {string} apiKey - Gemini API金鑰
     * @param {string} modelName - 模型名稱
     * @returns {Promise<Array>} 評分後排序的新聞
     */
    async rankNewsWithAI(news, apiKey, modelName) {
        if (!news || news.length === 0) return [];

        console.log('🧠 AI-powered news ranking...');

        const rankingPrompt = `
【System: News Importance Ranker Agent】
你是一位專業的新聞評估專家，請評估以下AI相關新聞的重要性。

【評估標準】
1. **新鮮度 (Recency)**: 越新的新聞分數越高
2. **相關性 (Relevance)**: 與AI技術發展的相關程度
3. **可信度 (Credibility)**: 新聞來源的可靠性
4. **影響力 (Impact)**: 對AI業界和社會的潛在影響

【新聞列表】
${news.map((item, index) => `
${index + 1}. 《${item.title}》
   來源: ${item.source}
   時間: ${item.publishedAt || '未知'}
   平台: ${item.platform}
`).join('\n')}

【任務】
請為每條新聞評分（1-10分），並簡要說明理由。輸出格式如下：

<<<RANKINGS>>>
新聞1: 分數/理由
新聞2: 分數/理由
新聞3: 分數/理由
...
<<<SUMMARY>>>
挑選出最重要的3-5條新聞，並簡要說明為什麼這些新聞重要。
`;

        try {
            const result = await callGeminiAPI(apiKey, modelName, rankingPrompt, false);

            // 解析AI評分結果
            const rankings = this.parseRankings(result.text, news.length);

            // 將評分應用到新聞
            const rankedNews = news.map((item, index) => ({
                ...item,
                aiScore: rankings[index] || 5, // 預設分數5
                rank: index + 1
            }));

            // 按AI評分排序（降序）
            rankedNews.sort((a, b) => b.aiScore - a.aiScore);

            console.log('✅ News ranking completed');
            return rankedNews;

        } catch (error) {
            console.warn('⚠️ AI ranking failed, using fallback method:', error.message);
            return this.fallbackRanking(news);
        }
    }

    /**
     * 解析AI評分結果
     * @param {string} text - AI回應文字
     * @param {number} newsCount - 新聞數量
     * @returns {Array} 分數陣列
     */
    parseRankings(text, newsCount) {
        const rankings = new Array(newsCount).fill(5); // 預設分數

        try {
            if (text.includes('<<<RANKINGS>>>')) {
                const rankingsText = text.split('<<<RANKINGS>>>')[1]?.split('<<<')[0] || '';

                rankingsText.split('\n').forEach(line => {
                    const match = line.match(/新聞(\d+):\s*(\d+)/);
                    if (match) {
                        const index = parseInt(match[1]) - 1;
                        const score = parseInt(match[2]);
                        if (index >= 0 && index < newsCount && score >= 1 && score <= 10) {
                            rankings[index] = score;
                        }
                    }
                });
            }
        } catch (error) {
            console.warn('⚠️ Failed to parse rankings:', error.message);
        }

        return rankings;
    }

    /**
     * 備用評分方法（當AI評分失敗時使用）
     * @param {Array} news - 新聞陣列
     * @returns {Array} 評分後的新聞
     */
    fallbackRanking(news) {
        console.log('🔄 Using fallback ranking method...');

        return news.map((item, index) => {
            let score = 5; // 基礎分數

            // 根據來源調整分數
            const credibleSources = ['Reuters', 'Bloomberg', 'CNBC', 'The New York Times', 'BBC', 'Wall Street Journal'];
            if (credibleSources.some(source => item.source.toLowerCase().includes(source.toLowerCase()))) {
                score += 2;
            }

            // 根據標題關鍵字調整分數
            const importantKeywords = ['breakthrough', 'launch', 'partnership', 'acquisition', 'milestone', 'record', 'revolution'];
            const title = item.title.toLowerCase();
            if (importantKeywords.some(keyword => title.includes(keyword))) {
                score += 1;
            }

            // 確保分數在1-10範圍內
            score = Math.max(1, Math.min(10, score));

            return {
                ...item,
                aiScore: score,
                rank: index + 1
            };
        }).sort((a, b) => b.aiScore - a.aiScore);
    }

    /**
     * 選擇最重要的前N條新聞
     * @param {Array} rankedNews - 已排序的新聞
     * @param {number} limit - 限制數量
     * @returns {Array} 選中的新聞
     */
    selectTopNews(rankedNews, limit = 5) {
        return rankedNews.slice(0, limit);
    }

    /**
     * 生成新聞評分報告
     * @param {Array} rankedNews - 已排序的新聞
     * @returns {string} 評分報告
     */
    generateRankingReport(rankedNews) {
        if (!rankedNews || rankedNews.length === 0) {
            return '無新聞資料可供評分。';
        }

        let report = '## 🏆 AI新聞重要性評分報告\n\n';
        report += `總計評估了 ${rankedNews.length} 條新聞\n\n`;

        rankedNews.slice(0, 10).forEach((news, index) => {
            report += `### ${index + 1}. ${news.title}\n`;
            report += `**來源**: ${news.source}\n`;
            report += `**AI評分**: ${news.aiScore}/10\n`;
            report += `**平台**: ${news.platform}\n\n`;
        });

        return report;
    }
}

module.exports = {
    NewsRanker
};