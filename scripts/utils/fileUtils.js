const fs = require('fs');
const path = require('path');

/**
 * 檢查今天是否已經有生成過（依資料夾日期或檔名含今日日期）
 * 必須同時存在 .generation-success 標記才視為已生成，
 * 避免先前執行失敗留下空資料夾，導致後續所有執行都被略過。
 * @param {string} blogDir - 部落格目錄
 * @param {string} dateStr - 日期字串 (YYYY-MM-DD)
 * @returns {boolean} 是否已生成
 */
function isTodayGenerated(blogDir, dateStr) {
    try {
        const entries = fs.readdirSync(blogDir, { withFileTypes: true });
        return entries.some((entry) => {
            if (entry.isDirectory() && entry.name.startsWith(dateStr)) {
                // 新結構：YYYY-MM-DD-HHMMSS
                // 只有在成功標記存在時才視為已生成，避免失敗留下的空資料夾導致跳過
                const markerPath = path.join(blogDir, entry.name, '.generation-success');
                return fs.existsSync(markerPath);
            }
            if (entry.isFile()) {
                // 舊結構：ai-daily-report-YYYY-MM-DD.mdx 或其他含今日日期的檔名
                return entry.name.includes(dateStr) && (entry.name.endsWith('.mdx') || entry.name.endsWith('.md'));
            }
            return false;
        });
    } catch {
        return false;
    }
}

/**
 * 確保目錄存在
 * @param {string} dirPath - 目錄路徑
 */
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

module.exports = {
    isTodayGenerated,
    ensureDirectoryExists,
};

