const fs = require('fs');
const path = require('path');

/**
 * 檢查今天是否已經有生成過（依資料夾日期或檔名含今日日期）
 * @param {string} blogDir - 部落格目錄
 * @param {string} dateStr - 日期字串 (YYYY-MM-DD)
 * @returns {boolean} 是否已生成
 */
function isTodayGenerated(blogDir, dateStr) {
    try {
        const entries = fs.readdirSync(blogDir, { withFileTypes: true });
        return entries.some((entry) => {
            if (entry.isDirectory()) {
                // 新結構：YYYY-MM-DD-HHMMSS 或 YYYYMMDD-HHMMSS
                return entry.name.startsWith(dateStr); // 以 YYYY-MM-DD 開頭
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

