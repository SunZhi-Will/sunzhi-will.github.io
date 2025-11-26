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
