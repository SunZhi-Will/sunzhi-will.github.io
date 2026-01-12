'use client'

import { useState } from 'react';
import { Lang } from '@/types';
import { useTheme } from '@/app/blog/ThemeProvider';

interface NewsletterUnsubscribeProps {
    lang: Lang;
}

const translations = {
    'zh-TW': {
        title: '取消訂閱電子報',
        subtitle: '輸入您的 Email 地址來取消訂閱',
        emailPlaceholder: '輸入您的 Email',
        unsubscribe: '取消訂閱',
        unsubscribing: '取消訂閱中...',
        success: '取消訂閱成功。您將不會再收到我們的電子報。',
        error: '取消訂閱失敗，請稍後再試',
        invalidEmail: '請輸入有效的 Email 地址',
        notFound: '找不到此 Email 的訂閱記錄',
        alreadyUnsubscribed: '此 Email 已經取消訂閱',
    },
    'en': {
        title: 'Unsubscribe from Newsletter',
        subtitle: 'Enter your email address to unsubscribe',
        emailPlaceholder: 'Enter your Email',
        unsubscribe: 'Unsubscribe',
        unsubscribing: 'Unsubscribing...',
        success: 'Successfully unsubscribed. You will no longer receive our newsletter.',
        error: 'Unsubscribe failed, please try again',
        invalidEmail: 'Please enter a valid Email address',
        notFound: 'No subscription found for this email address',
        alreadyUnsubscribed: 'This email has already been unsubscribed',
    }
};

export function NewsletterUnsubscribe({ lang }: NewsletterUnsubscribeProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const t = translations[lang];

    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!email || !validateEmail(email)) {
            setMessage({ type: 'error', text: t.invalidEmail });
            return;
        }

        setIsSubmitting(true);

        try {
            // 從環境變數獲取 Google Apps Script URL
            const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL;

            if (!scriptUrl) {
                if (process.env.NODE_ENV === 'development') {
                    console.error('NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL is not set');
                }
                setMessage({
                    type: 'error',
                    text: lang === 'zh-TW'
                        ? '取消訂閱服務未配置，請聯繫管理員'
                        : 'Unsubscribe service not configured, please contact administrator'
                });
                setIsSubmitting(false);
                return;
            }

            // 驗證 URL 格式
            try {
                new URL(scriptUrl);
            } catch (urlError) {
                if (process.env.NODE_ENV === 'development') {
                    console.error('Invalid script URL:', scriptUrl, urlError);
                }
                setMessage({
                    type: 'error',
                    text: lang === 'zh-TW'
                        ? '取消訂閱服務配置錯誤，請聯繫管理員'
                        : 'Unsubscribe service configuration error, please contact administrator'
                });
                setIsSubmitting(false);
                return;
            }

            if (process.env.NODE_ENV === 'development') {
                console.log('Unsubscribing email:', email.substring(0, 3) + '***');
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 秒超時

            // 使用表單提交方式避免 CORS 預檢請求
            const formData = new URLSearchParams();
            formData.append('email', email);
            formData.append('action', 'unsubscribe');

            const response = await fetch(scriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
                signal: controller.signal,
                mode: 'cors',
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                if (process.env.NODE_ENV === 'development') {
                    console.error('Response not OK:', response.status, response.statusText);
                    const errorText = await response.text().catch(() => 'Unknown error');
                    console.error('Error response:', errorText);
                } else {
                    await response.text().catch(() => 'Unknown error');
                }
                setMessage({
                    type: 'error',
                    text: lang === 'zh-TW'
                        ? `取消訂閱失敗 (${response.status})，請稍後再試`
                        : `Unsubscribe failed (${response.status}), please try again`
                });
                setIsSubmitting(false);
                return;
            }

            const responseText = await response.text();
            if (process.env.NODE_ENV === 'development') {
                console.log('Response text:', responseText);
            }

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                if (process.env.NODE_ENV === 'development') {
                    console.error('Failed to parse JSON response:', parseError);
                }
                if (responseText.toLowerCase().includes('success') || response.status === 200) {
                    setMessage({
                        type: 'success',
                        text: lang === 'zh-TW'
                            ? '取消訂閱請求已處理'
                            : 'Unsubscribe request processed'
                    });
                    setEmail('');
                } else {
                    setMessage({ type: 'error', text: t.error });
                }
                setIsSubmitting(false);
                return;
            }

            if (data.success) {
                const successMessage = data.message || t.success;
                setMessage({ type: 'success', text: successMessage });
                setEmail('');
            } else {
                // 處理特定的錯誤情況
                let errorMessage = data.message || t.error;
                if (data.message && data.message.includes('not found')) {
                    errorMessage = t.notFound;
                } else if (data.message && data.message.includes('already unsubscribed')) {
                    errorMessage = t.alreadyUnsubscribed;
                }
                setMessage({ type: 'error', text: errorMessage });
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Unsubscribe error:', error);
            }
            const errorMessage = error instanceof Error ? error.message : String(error);

            let userMessage = t.error;
            if (error instanceof Error && error.name === 'AbortError') {
                userMessage = lang === 'zh-TW'
                    ? '請求超時，請稍後再試'
                    : 'Request timeout, please try again';
            } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
                userMessage = lang === 'zh-TW'
                    ? '網路連接失敗，請檢查網路連線或聯繫管理員'
                    : 'Network connection failed, please check your internet connection or contact administrator';
            } else if (errorMessage.includes('CORS')) {
                userMessage = lang === 'zh-TW'
                    ? '跨域請求失敗，請聯繫管理員檢查服務配置'
                    : 'CORS request failed, please contact administrator to check service configuration';
            }

            setMessage({ type: 'error', text: userMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                {t.title}
            </h3>
            <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.subtitle}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Email 輸入 */}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    required
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 text-xs rounded-lg border transition-colors ${
                        isDark
                            ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-500 focus:border-gray-500 focus:bg-gray-700/70'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:bg-gray-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                />

                {/* 提交按鈕 */}
                <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className={`w-full px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                        isDark
                            ? 'bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-700 disabled:text-gray-500'
                            : 'bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-300 disabled:text-gray-500'
                    } disabled:cursor-not-allowed`}
                >
                    {isSubmitting ? t.unsubscribing : t.unsubscribe}
                </button>

                {/* 訊息顯示 */}
                {message && (
                    <div className={`text-xs px-2 py-1.5 rounded ${
                        message.type === 'success'
                            ? isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-700'
                            : isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-700'
                    }`}>
                        {message.text}
                    </div>
                )}
            </form>
        </div>
    );
}