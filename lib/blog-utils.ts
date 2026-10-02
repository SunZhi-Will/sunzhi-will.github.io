/**
 * 格式化日期顯示（用於客戶端）
 */
export function formatDate(dateString: string, locale: string = 'zh-TW'): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

// 中文每分鐘約 400 字，英文約 220 字；互動元件每個另外算 15 秒
const CJK_PER_MINUTE = 400;
const WORDS_PER_MINUTE = 220;
const MINUTES_PER_WIDGET = 0.25;

/**
 * 由文章原始碼（Markdown / MDX）估算閱讀時間，單位為分鐘。
 * 先拿掉 frontmatter 以外的標記，再分別計算中文字數與英文單字數。
 */
export function estimateReadingMinutes(source: string): number {
    const widgets = (source.match(/<[A-Z][A-Za-z]*[^>]*\/>/g) ?? []).length;
    const text = source
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[#>*_`|-]/g, ' ');

    const cjk = (text.match(/[㐀-鿿豈-﫿]/g) ?? []).length;
    const words = (text.replace(/[㐀-鿿豈-﫿]/g, ' ').match(/[A-Za-z0-9]+/g) ?? []).length;

    return Math.max(1, Math.round(cjk / CJK_PER_MINUTE + words / WORDS_PER_MINUTE + widgets * MINUTES_PER_WIDGET));
}
