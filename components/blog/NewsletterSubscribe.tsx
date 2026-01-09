'use client'

import { useState } from 'react';
import { Lang } from '@/types';
import { useTheme } from '@/app/blog/ThemeProvider';

interface NewsletterSubscribeProps {
    lang: Lang;
}

type SubscriptionType = 'all' | 'ai-daily' | 'blockchain' | 'sun-written';

const subscriptionTypes = {
    'zh-TW': {
        all: '全部內容',
        'ai-daily': 'AI日報',
        blockchain: '區塊鏈日報',
        'sun-written': 'Sun撰寫'
    },
    'en': {
        all: 'All Content',
        'ai-daily': 'AI Daily',
        blockchain: 'Blockchain Daily',
        'sun-written': 'Sun Written'
    }
};

const translations = {
    'zh-TW': {
        title: '訂閱電子報',
        subtitle: '選擇您想接收的內容類型',
        emailPlaceholder: '輸入您的 Email',
        subscribe: '訂閱',
        subscribing: '訂閱中...',
        success: '訂閱成功！請檢查您的 Email 進行驗證。',
        error: '訂閱失敗，請稍後再試',
        invalidEmail: '請輸入有效的 Email 地址'
    },
    'en': {
        title: 'Subscribe Newsletter',
        subtitle: 'Choose the content types you want to receive',
        emailPlaceholder: 'Enter your Email',
        subscribe: 'Subscribe',
        subscribing: 'Subscribing...',
        success: 'Subscription successful! Please check your email to verify.',
        error: 'Subscription failed, please try again',
        invalidEmail: 'Please enter a valid Email address'
    }
};

export function NewsletterSubscribe({ lang }: NewsletterSubscribeProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const t = translations[lang];
    const types = subscriptionTypes[lang];

    const [email, setEmail] = useState('');
    const [selectedType, setSelectedType] = useState<SubscriptionType>('all');
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
            // 在 Next.js 靜態導出中，環境變數需要在建置時設置
            const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL;

            if (!scriptUrl) {
                // 只在開發環境記錄日誌（安全措施）
                if (process.env.NODE_ENV === 'development') {
                    console.error('NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL is not set');
                }
                setMessage({ 
                    type: 'error', 
                    text: lang === 'zh-TW' 
                        ? '訂閱服務未配置，請聯繫管理員' 
                        : 'Subscription service not configured, please contact administrator' 
                });
                setIsSubmitting(false);
                return;
            }

            // 驗證 URL 格式
            try {
                new URL(scriptUrl);
            } catch (urlError) {
                // 只在開發環境記錄日誌（安全措施）
                if (process.env.NODE_ENV === 'development') {
                    console.error('Invalid script URL:', scriptUrl, urlError);
                }
                setMessage({ 
                    type: 'error', 
                    text: lang === 'zh-TW' 
                        ? '訂閱服務配置錯誤，請聯繫管理員' 
                        : 'Subscription service configuration error, please contact administrator' 
                });
                setIsSubmitting(false);
                return;
            }

            // 只在開發環境記錄日誌（安全措施）
            if (process.env.NODE_ENV === 'development') {
                console.log('Submitting to:', scriptUrl);
                console.log('Payload:', { email: email.substring(0, 3) + '***', type: selectedType, lang });
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 秒超時

            // 使用表單提交方式避免 CORS 預檢請求
            const formData = new URLSearchParams();
            formData.append('email', email);
            formData.append('types', selectedType);
            formData.append('lang', lang);

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
                // 只在開發環境記錄日誌（安全措施）
                if (process.env.NODE_ENV === 'development') {
                    console.error('Response not OK:', response.status, response.statusText);
                    const errorText = await response.text().catch(() => 'Unknown error');
                    console.error('Error response:', errorText);
                } else {
                    // 生產環境：只讀取錯誤文本但不記錄
                    await response.text().catch(() => 'Unknown error');
                }
                setMessage({ 
                    type: 'error', 
                    text: lang === 'zh-TW' 
                        ? `訂閱失敗 (${response.status})，請稍後再試` 
                        : `Subscription failed (${response.status}), please try again` 
                });
                setIsSubmitting(false);
                return;
            }

            const responseText = await response.text();
            // 只在開發環境記錄日誌（安全措施）
            if (process.env.NODE_ENV === 'development') {
                console.log('Response text:', responseText);
            }
            
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                // 只在開發環境記錄日誌（安全措施）
                if (process.env.NODE_ENV === 'development') {
                    console.error('Failed to parse JSON response:', parseError);
                }
                // 如果無法解析 JSON，檢查響應文本
                if (responseText.toLowerCase().includes('success') || response.status === 200) {
                    setMessage({ 
                        type: 'success', 
                        text: lang === 'zh-TW' 
                            ? '訂閱請求已發送' 
                            : 'Subscription request sent' 
                    });
                    setEmail('');
                    setSelectedType('all');
                } else {
                    setMessage({ type: 'error', text: t.error });
                }
                setIsSubmitting(false);
                return;
            }

            if (data.success) {
                // 優先使用後端返回的訊息（可能包含驗證郵件發送狀態），否則使用前端翻譯
                const successMessage = data.message || t.success;
                setMessage({ type: 'success', text: successMessage });
                setEmail('');
                setSelectedType('all');
            } else {
                setMessage({ type: 'error', text: data.message || t.error });
            }
        } catch (error) {
            // 只在開發環境記錄日誌（安全措施）
            if (process.env.NODE_ENV === 'development') {
                console.error('Subscription error:', error);
            }
            const errorMessage = error instanceof Error ? error.message : String(error);
            
            // 提供更詳細的錯誤訊息
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
            <h3 className={`text-sm font-semibold mb-2 ${
                isDark ? 'text-gray-200' : 'text-gray-900'
            }`}>
                {t.title}
            </h3>
            <p className={`text-xs mb-3 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
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

                {/* 訂閱類型選擇 - 下拉選單 */}
                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as SubscriptionType)}
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 text-xs rounded-lg border transition-colors ${
                        isDark
                            ? 'bg-gray-700/50 border-gray-600 text-gray-200 focus:border-gray-500 focus:bg-gray-700/70'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-gray-400 focus:bg-gray-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {(['all', 'ai-daily', 'blockchain', 'sun-written'] as SubscriptionType[]).map((type) => (
                        <option key={type} value={type}>
                            {types[type]}
                        </option>
                    ))}
                </select>

                {/* 提交按鈕 */}
                <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className={`w-full px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                        isDark
                            ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-700 disabled:text-gray-500'
                            : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300 disabled:text-gray-500'
                    } disabled:cursor-not-allowed`}
                >
                    {isSubmitting ? t.subscribing : t.subscribe}
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
