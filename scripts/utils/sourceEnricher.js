const https = require('https');
const http = require('http');

/**
 * 從 URL 獲取網頁標題
 * @param {string} url - 網頁 URL
 * @param {number} timeout - 超時時間（毫秒），預設 3000
 * @returns {Promise<string>} 網頁標題，失敗時返回 null
 */
async function fetchWebPageTitle(url, timeout = 3000) {
    return new Promise((resolve) => {
        try {
            const urlObj = new URL(url);
            const client = urlObj.protocol === 'https:' ? https : http;

            const req = client.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                },
            }, (res) => {
                let html = '';
                let contentLength = 0;
                const maxLength = 100000; // 限制讀取長度，避免記憶體問題

                res.on('data', (chunk) => {
                    contentLength += chunk.length;
                    if (contentLength < maxLength) {
                        html += chunk.toString('utf8');
                        // 如果已經找到 title 標籤，可以提前結束
                        if (html.includes('</title>')) {
                            res.destroy();
                        }
                    } else {
                        res.destroy();
                    }
                });

                res.on('end', () => {
                    // 提取 title 標籤內容
                    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
                    if (titleMatch && titleMatch[1]) {
                        let title = titleMatch[1]
                            .replace(/\s+/g, ' ')
                            .trim()
                            .substring(0, 200); // 限制標題長度
                        // 清理常見的後綴
                        title = title.replace(/\s*[-|]\s*(.*?)$/, '').trim();
                        resolve(title || null);
                    } else {
                        resolve(null);
                    }
                });
            });

            req.on('error', () => {
                resolve(null);
            });

            // 設置超時
            req.setTimeout(timeout, () => {
                req.destroy();
                resolve(null);
            });

        } catch (error) {
            resolve(null);
        }
    });
}

/**
 * 檢查標題是否只是網域（需要獲取實際網頁標題）
 * @param {string} title - 標題
 * @param {string} uri - URL
 * @returns {boolean} 是否只是網域
 */
function isTitleJustDomain(title, uri) {
    if (!title || title.length < 2) return true;
    try {
        const url = new URL(uri);
        const hostname = url.hostname.replace(/^www\./, '');
        const titleLower = title.toLowerCase().trim();
        // 檢查標題是否只是網域或常見的預設值
        return titleLower === hostname ||
            titleLower === `www.${hostname}` ||
            titleLower === 'Reference Source' ||
            titleLower === 'External Source' ||
            titleLower === '來源' ||
            titleLower === 'Source';
    } catch {
        return false;
    }
}

/**
 * 批量獲取網頁標題（並發處理）
 * @param {Array<{title: string, uri: string}>} sources - 來源列表
 * @returns {Promise<Array<{title: string, uri: string}>>} 更新後的來源列表
 */
async function enrichSourceTitles(sources) {
    if (!sources || sources.length === 0) return sources;

    const promises = sources.map(async (source) => {
        // 如果標題有效且不只是網域，直接返回
        if (source.title && !isTitleJustDomain(source.title, source.uri)) {
            return source;
        }

        // 嘗試獲取網頁標題
        const pageTitle = await fetchWebPageTitle(source.uri);
        if (pageTitle && pageTitle.length > 2) {
            return { ...source, title: pageTitle };
        }

        // 如果獲取失敗，嘗試從 URL 路徑中提取有意義的名稱
        try {
            const url = new URL(source.uri);
            const pathParts = url.pathname.split('/').filter(p => p && p.length > 2);
            if (pathParts.length > 0) {
                // 使用最後一個路徑段作為標題（通常是最具體的）
                const lastPart = pathParts[pathParts.length - 1];
                // 移除檔案擴展名和 URL 編碼
                const cleanPart = decodeURIComponent(lastPart)
                    .replace(/\.(html|htm|php|aspx?)$/i, '')
                    .replace(/[-_]/g, ' ')
                    .trim();
                if (cleanPart.length > 2 && cleanPart.length < 100) {
                    return { ...source, title: cleanPart };
                }
            }
        } catch {
            // 忽略錯誤
        }

        // 如果都失敗，使用網域作為標題（但格式更好）
        try {
            const url = new URL(source.uri);
            const hostname = url.hostname.replace(/^www\./, '');
            // 將 hostname 轉換為更友好的格式
            const friendlyName = hostname
                .split('.')
                .slice(0, -1) // 移除 TLD
                .join(' ')
                .replace(/\b\w/g, l => l.toUpperCase()) || hostname;
            return { ...source, title: friendlyName };
        } catch {
            return { ...source, title: source.title || 'External Source' };
        }
    });

    return Promise.all(promises);
}

module.exports = {
    enrichSourceTitles,
};

