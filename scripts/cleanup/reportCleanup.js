const fs = require('fs');
const path = require('path');

/**
 * 檢查是否為 AI 日報資料夾
 * @param {string} folderPath - 資料夾路徑
 * @param {string} folderName - 資料夾名稱
 * @returns {boolean} 是否為 AI 日報
 */
function isAIDailyReport(folderPath, folderName) {
    // 1. 嚴格匹配 AI 日報命名格式：YYYY-MM-DD-HHMMSS（必須有連字號和 6 位數時間戳）
    const aiReportPattern = /^\d{4}-\d{2}-\d{2}-\d{6}$/;
    if (!aiReportPattern.test(folderName)) {
        return false;
    }

    // 2. 檢查是否有 article.zh-TW.mdx 或 article.zh-TW.md 文件（AI 日報的特徵文件）
    const articleZhPathMdx = path.join(folderPath, 'article.zh-TW.mdx');
    const articleZhPathMd = path.join(folderPath, 'article.zh-TW.md');
    if (!fs.existsSync(articleZhPathMdx) && !fs.existsSync(articleZhPathMd)) {
        return false;
    }

    // 3. 必須檢查 frontmatter 中的標題或標籤（嚴格安全檢查，避免誤刪技術文章）
    try {
        const articlePath = fs.existsSync(articleZhPathMdx) ? articleZhPathMdx : articleZhPathMd;
        const articleContent = fs.readFileSync(articlePath, 'utf8');
        const frontmatterMatch = articleContent.match(/^---\s*\n([\s\S]*?)\n---/);
        
        if (frontmatterMatch) {
            const frontmatter = frontmatterMatch[1];
            // 檢查標題是否包含 AI 日報標記，或 tags 是否包含每日日報
            const hasAITitle = /【AI日報】|【AI Daily】/i.test(frontmatter);
            const hasDailyTag = /tags:.*["\[]每日日報|Daily Report/i.test(frontmatter);
            
            // 只有在明確找到 AI 日報標記時，才返回 true
            if (hasAITitle || hasDailyTag) {
                return true;
            }
            // 如果沒有 AI 日報標記，不刪除（可能是技術文章）
            return false;
        } else {
            // 如果沒有 frontmatter，無法確認是否為 AI 日報，不刪除
            console.warn(`⚠️  No frontmatter found for ${folderName}, skipping to avoid deleting non-AI-daily articles`);
            return false;
        }
    } catch (error) {
        // 如果讀取失敗，無法確認是否為 AI 日報，不刪除（安全起見）
        console.warn(`⚠️  Could not read frontmatter for ${folderName}:`, error.message);
        console.warn(`⚠️  Skipping to avoid deleting non-AI-daily articles`);
        return false;
    }
}

/**
 * 清理超過指定天數的舊日報
 * @param {string} blogDir - 部落格目錄
 * @param {number} keepDays - 保留的天數（預設 10 天）
 */
function cleanupOldReports(blogDir, keepDays = 10) {
    try {
        const publicBlogDir = path.join(process.cwd(), 'public/blog');
        const entries = fs.readdirSync(blogDir, { withFileTypes: true });
        const now = new Date();
        let deletedCount = 0;

        entries.forEach((entry) => {
            if (!entry.isDirectory()) return;

            const folderName = entry.name;
            const folderPath = path.join(blogDir, folderName);

            // 嚴格檢查是否為 AI 日報（避免誤刪其他文章）
            if (!isAIDailyReport(folderPath, folderName)) {
                return; // 跳過非 AI 日報的資料夾
            }

            // 解析日期格式：YYYY-MM-DD-HHMMSS
            const dateMatch = folderName.match(/^(\d{4})-(\d{2})-(\d{2})-(\d{6})$/);
            if (!dateMatch) return;

            const year = parseInt(dateMatch[1], 10);
            const month = parseInt(dateMatch[2], 10) - 1; // JavaScript 月份從 0 開始
            const day = parseInt(dateMatch[3], 10);

            // 將日期標準化到當天的開始時間（00:00:00）來計算天數差異
            const reportDate = new Date(year, month, day);
            reportDate.setHours(0, 0, 0, 0);
            const todayStart = new Date(now);
            todayStart.setHours(0, 0, 0, 0);
            const daysDiff = Math.floor((todayStart - reportDate) / (1000 * 60 * 60 * 24));

            if (daysDiff > keepDays) {
                // 刪除 content/blog 中的資料夾
                try {
                    fs.rmSync(folderPath, { recursive: true, force: true });
                    console.log(`🗑️  Deleted old AI daily report: ${folderName} (${daysDiff} days old)`);
                    deletedCount++;

                    // 刪除 public/blog 中對應的圖片資料夾
                    const publicFolderPath = path.join(publicBlogDir, folderName);
                    if (fs.existsSync(publicFolderPath)) {
                        fs.rmSync(publicFolderPath, { recursive: true, force: true });
                        console.log(`🗑️  Deleted public images: ${folderName}`);
                    }
                } catch (error) {
                    console.error(`⚠️  Failed to delete ${folderName}:`, error.message);
                }
            }
        });

        if (deletedCount > 0) {
            console.log(`✅ Cleaned up ${deletedCount} old report(s) (keeping last ${keepDays} days)`);
        } else {
            console.log(`ℹ️  No old reports to clean (keeping last ${keepDays} days)`);
        }
    } catch (error) {
        console.error('⚠️  Error cleaning up old reports:', error.message);
    }
}

module.exports = {
    cleanupOldReports,
};

