// 訂閱與取消訂閱共用的請求邏輯。後端是 Google Apps Script（scripts/google-apps-script-example.js），
// 回傳的 message 多半是英文，這裡轉成原因代碼，文案交給各元件依語言顯示

export type NewsletterLang = 'zh-TW' | 'en';

export type NewsletterFailure =
    | 'invalid_email'
    | 'not_configured'
    | 'rate_limited'
    | 'not_found'
    | 'not_subscribed'
    | 'verification_not_sent'
    | 'timeout'
    | 'network'
    | 'unknown';

export type NewsletterResult = { ok: true } | { ok: false; reason: NewsletterFailure };

const TIMEOUT_MS = 15000;

export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function reasonFromMessage(message: string): NewsletterFailure {
    const text = message.toLowerCase();
    if (text.includes('too many requests') || text.includes('please wait') || text.includes('rate limit')) return 'rate_limited';
    if (text.includes('invalid email') || text.includes('too long')) return 'invalid_email';
    if (text.includes('no subscription found') || text.includes('找不到')) return 'not_found';
    if (text.includes('already') || text.includes('not verified') || text.includes('已經取消') || text.includes('尚未驗證')) return 'not_subscribed';
    return 'unknown';
}

export async function postNewsletter(fields: Record<string, string>): Promise<NewsletterResult> {
    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
        if (process.env.NODE_ENV === 'development') {
            console.error('NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL is not set');
        }
        return { ok: false, reason: 'not_configured' };
    }

    try {
        new URL(scriptUrl);
    } catch {
        return { ok: false, reason: 'not_configured' };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        // 用表單編碼送出，避免 CORS 預檢請求
        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(fields).toString(),
            signal: controller.signal,
            mode: 'cors',
        });

        if (!response.ok) {
            return { ok: false, reason: response.status === 429 ? 'rate_limited' : 'unknown' };
        }

        const responseText = await response.text();
        let data: { success?: boolean; message?: string; verificationSent?: boolean };
        try {
            data = JSON.parse(responseText);
        } catch {
            // Apps Script 偶爾回傳非 JSON 內容，狀態碼 200 就視為已處理
            return { ok: true };
        }

        if (!data.success) {
            return { ok: false, reason: reasonFromMessage(data.message || '') };
        }
        if (data.verificationSent === false) {
            return { ok: false, reason: 'verification_not_sent' };
        }
        return { ok: true };
    } catch (error) {
        if (process.env.NODE_ENV === 'development') console.error('Newsletter request error:', error);
        if (error instanceof Error && error.name === 'AbortError') return { ok: false, reason: 'timeout' };
        const message = error instanceof Error ? error.message : '';
        if (message.includes('Failed to fetch') || message.includes('NetworkError')) return { ok: false, reason: 'network' };
        return { ok: false, reason: 'unknown' };
    } finally {
        clearTimeout(timeoutId);
    }
}
