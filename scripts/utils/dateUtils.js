/**
 * 日期相關工具函數
 */

/**
 * 取得今天的日期和時間戳
 * @returns {Object} 包含各種日期格式的物件
 */
function getDateInfo() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeStr = today.toISOString().split('T')[1].split('.')[0].replace(/:/g, ''); // HHMMSS
    const timestamp = `${dateStr}-${timeStr}`; // YYYY-MM-DD-HHMMSS（與現有資料夾格式一致）
    const dateFormatted = new Intl.DateTimeFormat('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    }).format(today);

    // 計算昨天的日期（用於搜尋過濾）
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayISO = yesterday.toISOString().split('T')[0]; // YYYY-MM-DD

    return {
        today,
        dateStr,
        timeStr,
        timestamp,
        dateFormatted,
        yesterdayISO,
    };
}

module.exports = {
    getDateInfo,
};

