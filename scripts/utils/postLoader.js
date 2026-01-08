const fs = require('fs');
const path = require('path');

let matterPromise = null;

/**
 * 動態載入 gray-matter（處理 ESM 匯入）
 */
async function getMatter() {
    if (!matterPromise) {
        matterPromise = import('gray-matter').then((mod) => mod.default || mod);
    }
    return matterPromise;
}

/**
 * 讀取所有現有文章的摘要資訊（用於避免重複和建立連結）
 * @param {string} blogDir - 部落格目錄
 * @param {string} slug - 今天要生成的文章 slug（用於跳過）
 * @param {string} dateStr - 今天的日期字串（用於跳過）
 * @returns {Promise<Array>} 文章摘要列表
 */
async function getAllExistingPosts(blogDir, slug, dateStr) {
    try {
        const entries = fs.readdirSync(blogDir, { withFileTypes: true });
        const posts = [];
        const matter = await getMatter();

        for (const entry of entries) {
            if (!entry.isDirectory()) continue;

            const folderName = entry.name;
            const folderPath = path.join(blogDir, folderName);

            // 跳過今天要生成的文章
            if (folderName === slug || folderName.startsWith(dateStr)) {
                continue;
            }

            // 嘗試讀取中文版本的文章
            const articlePathZh = path.join(folderPath, 'article.zh-TW.mdx');
            const articlePathZhMd = path.join(folderPath, 'article.zh-TW.md');
            const articlePathDefault = path.join(folderPath, 'article.mdx');
            const articlePathDefaultMd = path.join(folderPath, 'article.md');

            let articlePath = null;
            if (fs.existsSync(articlePathZh)) {
                articlePath = articlePathZh;
            } else if (fs.existsSync(articlePathZhMd)) {
                articlePath = articlePathZhMd;
            } else if (fs.existsSync(articlePathDefault)) {
                articlePath = articlePathDefault;
            } else if (fs.existsSync(articlePathDefaultMd)) {
                articlePath = articlePathDefaultMd;
            }

            if (articlePath) {
                try {
                    const fileContents = fs.readFileSync(articlePath, 'utf8');
                    const { data } = matter(fileContents);

                    // 簡化描述（如果太長就截斷，減少 prompt 長度）
                    let description = data.description || '';
                    if (description.length > 100) {
                        description = description.substring(0, 100) + '...';
                    }

                    posts.push({
                        slug: folderName,
                        title: data.title || 'Untitled',
                        date: data.date || folderName,
                        description: description,
                        tags: data.tags || [],
                        url: `/blog/${folderName}`, // 文章 URL
                    });
                } catch (error) {
                    console.warn(`⚠️  Failed to read article ${folderName}:`, error.message);
                }
            }
        }

        // 按日期排序（最新的在前）
        posts.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        });

        return posts;
    } catch (error) {
        console.warn('⚠️  Failed to load existing posts:', error.message);
        return [];
    }
}

module.exports = {
    getAllExistingPosts,
};

