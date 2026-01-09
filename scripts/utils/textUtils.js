/**
 * 文字處理工具函數
 */

/**
 * 清理 HTML 標籤，轉換為 Markdown
 * @param {string} text - 原始文字
 * @returns {string} 清理後的文字
 */
function cleanupHtmlTags(text) {
    if (!text) return '';
    let cleaned = text;
    cleaned = cleaned.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1');
    cleaned = cleaned.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1');
    cleaned = cleaned.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1');
    cleaned = cleaned.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1');
    cleaned = cleaned.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    cleaned = cleaned.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    cleaned = cleaned.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    cleaned = cleaned.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
    cleaned = cleaned.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
    cleaned = cleaned.replace(/<ul[^>]*>/gi, '').replace(/<\/ul>/gi, '');
    cleaned = cleaned.replace(/<ol[^>]*>/gi, '').replace(/<\/ol>/gi, '');
    cleaned = cleaned.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1');
    cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
    return cleaned;
}

/**
 * 檢查是否產生 Hallucination（程式碼或 HTML）
 * @param {string} text - 要檢查的文字
 * @returns {boolean} 是否為 Hallucination
 */
function isHallucinated(text) {
    if (!text) return false;
    const forbiddenPatterns = [
        '<!DOCTYPE html>',
        '<body',
        '<html',
        '<div id="root"',
        'export default function',
        'import React',
        'react-dom/client',
    ];
    return forbiddenPatterns.some((p) => text.includes(p));
}

/**
 * 清理字串（移除多餘空白和標記）- 參考 trendpulse 的實現
 * @param {string} str - 原始字串
 * @returns {string} 清理後的字串
 */
function cleanStr(str) {
    if (!str) return '';
    // 參考 trendpulse：先移除 <<< 之後的內容，再 trim
    return str.split('<<<')[0].trim();
}

/**
 * 移除日期相關內容（各種日期格式）
 * @param {string} text - 原始文字
 * @returns {string} 清理後的文字
 */
function removeDatePatterns(text) {
    if (!text) return '';
    const datePatterns = [
        /\d{4}年\d{1,2}月\d{1,2}日/g,
        /\d{4}-\d{2}-\d{2}/g,
        /\d{1,2}\/\d{1,2}\/\d{4}/g,
        /(今天|昨天|明天|今日|昨日|明日)/g,
        /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/gi,
        /\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}/gi,
        // 移除年份（如 "2026"、"CES 2026" 等，但要保留數字金額如 "200 億美元"）
        /(?:^|\s)(\d{4})(?=\s|$|，|,|。|\.)/g, // 單獨的年份
        /CES\s+\d{4}/gi, // CES 年份
    ];

    let cleaned = text;
    datePatterns.forEach(pattern => {
        cleaned = cleaned.replace(pattern, '');
    });

    // 清理移除日期後留下的標點符號（如 "，2026年1月9日" 移除日期後留下 "，"）
    cleaned = cleaned.replace(/([，。、；：,.;:]\s*)+/g, (match, p1) => {
        // 如果標點符號在開頭，移除它
        return cleaned.indexOf(match) === 0 ? '' : match;
    });
    
    // 清理多餘空白和開頭標點
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    cleaned = cleaned.replace(/^[，。、；：,.;:\s]+/, '').trim();
    
    return cleaned;
}

/**
 * 截斷摘要到指定長度（在完整句子處截斷，不添加省略號）
 * @param {string} text - 原始摘要
 * @param {number} maxLength - 最大長度
 * @param {boolean} isChinese - 是否為中文（影響句子結尾符號）
 * @returns {string} 截斷後的摘要（完整句子，不包含省略號）
 */
function truncateSummary(text, maxLength, isChinese = false) {
    if (!text || text.length <= maxLength) return text;

    // 優先：在完整句子處截斷（句號、問號、驚嘆號）
    const sentenceEnd = isChinese ? /[。！？]/g : /[.!?]/g;
    const sentences = text.match(isChinese ? /[^。！？]+[。！？]/g : /[^.!?]+[.!?]/g);

    if (sentences && sentences.length > 0) {
        let truncated = '';
        for (const sentence of sentences) {
            if ((truncated + sentence).length <= maxLength) {
                truncated += sentence;
            } else {
                // 如果第一句話就超過長度，嘗試在句子內部找合適的截斷點
                if (truncated === '' && sentence.length > maxLength) {
                    // 嘗試在分號、逗號處截斷
                    const breakPoints = isChinese ? /[；，]/g : /[;,]/g;
                    const parts = sentence.split(breakPoints);
                    let partial = '';
                    for (const part of parts) {
                        const separator = isChinese ? '，' : ',';
                        if ((partial + part + separator).length <= maxLength) {
                            partial += part + separator;
                        } else {
                            break;
                        }
                    }
                    return partial.trim() || sentence.substring(0, maxLength).trim();
                }
                break;
            }
        }
        // 返回完整的句子，不添加省略號
        return truncated.trim();
    }

    // 如果沒有找到完整句子，嘗試在分號、逗號處截斷
    const breakPoints = isChinese ? /[；，]/g : /[;,]/g;
    const parts = text.split(breakPoints);
    let truncated = '';
    for (const part of parts) {
        const separator = isChinese ? '，' : ',';
        if ((truncated + part + separator).length <= maxLength) {
            truncated += part + separator;
        } else {
            break;
        }
    }
    
    // 如果還是太長，直接截斷到最大長度（不添加省略號）
    if (!truncated || truncated.length > maxLength) {
        truncated = text.substring(0, maxLength).trim();
        // 移除末尾可能的不完整標點
        truncated = truncated.replace(/[，。、；：,.;:\s]+$/, '').trim();
    }
    
    return truncated.trim();
}

module.exports = {
    cleanupHtmlTags,
    isHallucinated,
    cleanStr,
    removeDatePatterns,
    truncateSummary,
};

