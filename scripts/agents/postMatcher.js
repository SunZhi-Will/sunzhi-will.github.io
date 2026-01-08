/**
 * Agent Step 2: 根據主題和關鍵字匹配相關文章
 * @param {Array} allPosts - 所有文章列表
 * @param {Array} topics - 主題列表
 * @param {Array} keywords - 關鍵字列表
 * @returns {Array} 相關文章列表
 */
function findRelevantPosts(allPosts, topics, keywords) {
    if (allPosts.length === 0) return [];

    // 建立關鍵字匹配分數
    const scoredPosts = allPosts.map(post => {
        let score = 0;
        const searchText = `${post.title} ${post.description} ${post.tags.join(' ')}`.toLowerCase();

        // 檢查關鍵字匹配
        keywords.forEach(keyword => {
            const keywordLower = keyword.toLowerCase();
            if (searchText.includes(keywordLower)) {
                score += 2; // 關鍵字匹配加 2 分
            }
        });

        // 檢查標籤匹配
        post.tags.forEach(tag => {
            if (keywords.some(kw => tag.toLowerCase().includes(kw.toLowerCase()) || kw.toLowerCase().includes(tag.toLowerCase()))) {
                score += 3; // 標籤匹配加 3 分
            }
        });

        // 檢查標題匹配
        const titleLower = post.title.toLowerCase();
        keywords.forEach(keyword => {
            if (titleLower.includes(keyword.toLowerCase())) {
                score += 5; // 標題匹配加 5 分
            }
        });

        return { ...post, relevanceScore: score };
    });

    // 按分數排序，取前 8 篇相關文章
    const relevantPosts = scoredPosts
        .filter(post => post.relevanceScore > 0)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 8);

    // 如果相關文章少於 5 篇，補充最近的文章
    if (relevantPosts.length < 5) {
        const recentPosts = allPosts
            .slice(0, 5 - relevantPosts.length)
            .filter(post => !relevantPosts.find(rp => rp.slug === post.slug));
        relevantPosts.push(...recentPosts);
    }

    console.log(`📌 Found ${relevantPosts.length} relevant posts`);
    return relevantPosts;
}

module.exports = {
    findRelevantPosts,
};

