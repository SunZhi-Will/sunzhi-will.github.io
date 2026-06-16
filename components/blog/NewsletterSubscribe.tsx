'use client'

import { useState } from 'react';
import { useTheme } from '@/app/blog/ThemeProvider';

interface NewsletterSubscribeProps {
    lang: 'zh-TW' | 'en';
    /** 'inline' = compact row used in sidebar; 'section' = full-width editorial block */
    variant?: 'inline' | 'section';
}

const translations = {
    'zh-TW': {
        eyebrow: 'NEWSLETTER',
        title: '訂閱電子報',
        subtitle: '每週精選技術文章、AI 動態與開發日常，直送您的信箱。',
        emailPlaceholder: '輸入您的 Email 地址',
        subscribe: '訂閱',
        subscribing: '訂閱中...',
        success: '🎉 感謝訂閱！請至信箱確認驗證信。',
        error: '訂閱失敗，請稍後再試。',
        invalidEmail: '請輸入有效的 Email 地址。',
        unsubscribe: '取消訂閱',
        privacy: '不發送垃圾信件，隨時可退訂。',
    },
    'en': {
        eyebrow: 'NEWSLETTER',
        title: 'Stay in the Loop',
        subtitle: 'Curated articles on software engineering, AI, and dev life — delivered weekly.',
        emailPlaceholder: 'Enter your email address',
        subscribe: 'Subscribe',
        subscribing: 'Subscribing...',
        success: '🎉 You\'re in! Check your inbox to confirm.',
        error: 'Subscription failed. Please try again.',
        invalidEmail: 'Please enter a valid email address.',
        unsubscribe: 'Unsubscribe',
        privacy: 'No spam, ever. Unsubscribe anytime.',
    }
};

export function NewsletterSubscribe({ lang, variant = 'section' }: NewsletterSubscribeProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const t = translations[lang];

    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!email || !validateEmail(email)) {
            setMessage({ type: 'error', text: t.invalidEmail });
            return;
        }

        setIsSubmitting(true);

        try {
            const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL;

            if (!scriptUrl) {
                if (process.env.NODE_ENV === 'development') {
                    console.error('NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL is not set');
                }
                setMessage({
                    type: 'error',
                    text: lang === 'zh-TW'
                        ? '訂閱服務未配置，請聯繫管理員'
                        : 'Subscription service not configured',
                });
                return;
            }

            try { new URL(scriptUrl); } catch {
                setMessage({
                    type: 'error',
                    text: lang === 'zh-TW' ? '訂閱服務配置錯誤' : 'Service configuration error',
                });
                return;
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const formData = new URLSearchParams();
            formData.append('email', email);
            formData.append('types', 'all');
            formData.append('lang', lang);

            const response = await fetch(scriptUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString(),
                signal: controller.signal,
                mode: 'cors',
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                await response.text().catch(() => '');
                setMessage({
                    type: 'error',
                    text: lang === 'zh-TW'
                        ? `訂閱失敗 (${response.status})，請稍後再試`
                        : `Subscription failed (${response.status}), please try again`,
                });
                return;
            }

            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch {
                if (responseText.toLowerCase().includes('success') || response.status === 200) {
                    setMessage({ type: 'success', text: t.success });
                    setEmail('');
                } else {
                    setMessage({ type: 'error', text: t.error });
                }
                return;
            }

            if (data.success) {
                setMessage({ type: 'success', text: data.message || t.success });
                setEmail('');
            } else {
                setMessage({ type: 'error', text: data.message || t.error });
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error('Newsletter error:', error);
            const msg = error instanceof Error ? error.message : '';
            if (error instanceof Error && error.name === 'AbortError') {
                setMessage({ type: 'error', text: lang === 'zh-TW' ? '請求超時，請稍後再試' : 'Request timed out.' });
            } else if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
                setMessage({ type: 'error', text: lang === 'zh-TW' ? '網路連接失敗' : 'Network error. Check your connection.' });
            } else {
                setMessage({ type: 'error', text: t.error });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ─── INLINE VARIANT (compact, e.g. sidebar) ─── */
    if (variant === 'inline') {
        return (
            <div>
                <p className={`text-[11px] font-bold tracking-widest uppercase mb-3 ${isDark ? 'text-white/40' : 'text-black/35'}`}>
                    {t.eyebrow}
                </p>
                <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t.title}
                </p>
                <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-white/50' : 'text-gray-600'}`}>
                    {t.subtitle}
                </p>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.emailPlaceholder}
                        disabled={isSubmitting}
                        className={`w-full px-3 py-2 text-xs rounded-lg border outline-none transition-all ${
                            isDark
                                ? 'bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-yellow-400/60 focus:bg-white/8'
                                : 'bg-white border-black/10 text-black placeholder-black/40 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
                        } disabled:opacity-40`}
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !email}
                        className={`w-full py-2 text-xs font-semibold rounded-lg transition-all ${
                            isDark
                                ? 'bg-yellow-400 hover:bg-yellow-300 text-black disabled:bg-white/10 disabled:text-white/20'
                                : 'bg-yellow-400 hover:bg-yellow-300 text-black disabled:bg-black/5 disabled:text-black/30'
                        } disabled:cursor-not-allowed`}
                    >
                        {isSubmitting ? t.subscribing : t.subscribe}
                    </button>
                    {message && (
                        <p className={`text-[11px] ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {message.text}
                        </p>
                    )}
                </form>
                <div className="mt-3 flex items-center justify-between">
                    <span className={`text-[10px] ${isDark ? 'text-white/25' : 'text-black/45'}`}>{t.privacy}</span>
                    <a href="/unsubscribe" className={`text-[10px] transition-colors ${isDark ? 'text-white/30 hover:text-yellow-400' : 'text-black/40 hover:text-yellow-600'}`}>
                        {t.unsubscribe}
                    </a>
                </div>
            </div>
        );
    }

    /* ─── SECTION VARIANT (full-width editorial block) ─── */
    return (
        <div
            className={`relative overflow-hidden rounded-2xl px-8 py-14 md:px-16 md:py-18 transition-colors ${
                isDark
                    ? 'bg-[#0d0d0d]'
                    : 'bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/50'
            }`}
            style={{
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(202,138,4,0.15)',
            }}
        >
            {/* Decorative blobs */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full"
                style={{
                    background: isDark
                        ? 'radial-gradient(circle, rgba(250,204,21,0.12) 0%, transparent 65%)'
                        : 'radial-gradient(circle, rgba(253,211,77,0.35) 0%, transparent 65%)',
                }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full"
                style={{
                    background: isDark
                        ? 'radial-gradient(circle, rgba(250,204,21,0.08) 0%, transparent 65%)'
                        : 'radial-gradient(circle, rgba(253,211,77,0.25) 0%, transparent 65%)',
                }}
            />

            <div className="relative z-10 max-w-xl mx-auto text-center">
                {/* Icon badge */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-5 ${
                    isDark ? 'bg-yellow-400/10 text-yellow-400' : 'bg-yellow-400/20 text-yellow-600'
                }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                    </svg>
                </div>

                {/* Eyebrow */}
                <p className={`text-[11px] font-bold tracking-[0.25em] uppercase mb-3 ${isDark ? 'text-yellow-400/70' : 'text-yellow-700'}`}>
                    {t.eyebrow}
                </p>

                {/* Title */}
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                    {t.title}
                </h2>

                {/* Subtitle */}
                <p className={`text-sm md:text-base leading-relaxed mb-8 ${isDark ? 'text-white/55' : 'text-black/60'}`}>
                    {t.subtitle}
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <div
                        className={`relative flex-1 rounded-xl overflow-hidden transition-all ${
                            isFocused
                                ? isDark
                                    ? 'ring-2 ring-yellow-400/50'
                                    : 'ring-2 ring-yellow-500/40'
                                : ''
                        }`}
                        style={{
                            border: isDark
                                ? `1px solid ${isFocused ? 'rgba(250,204,21,0.4)' : 'rgba(255,255,255,0.1)'}`
                                : `1px solid ${isFocused ? 'rgba(161,98,7,0.35)' : 'rgba(0,0,0,0.12)'}`,
                        }}
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder={t.emailPlaceholder}
                            disabled={isSubmitting}
                            className={`w-full h-12 px-4 text-sm outline-none bg-transparent transition-colors ${
                                isDark
                                    ? 'text-white placeholder-white/30'
                                    : 'text-black placeholder-black/40'
                            } disabled:opacity-40`}
                            style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !email}
                        className={`h-12 px-7 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                            isDark
                                ? 'bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black shadow-lg shadow-yellow-400/20 disabled:bg-white/10 disabled:text-white/20 disabled:shadow-none'
                                : 'bg-yellow-500 hover:bg-yellow-400 active:scale-95 text-black shadow-lg shadow-yellow-500/30 disabled:bg-black/5 disabled:text-black/30 disabled:shadow-none'
                        } disabled:cursor-not-allowed`}
                    >
                        {isSubmitting ? t.subscribing : t.subscribe}
                    </button>
                </form>

                {/* Feedback message */}
                {message && (
                    <div
                        className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium ${
                            message.type === 'success'
                                ? isDark ? 'bg-green-900/40 text-green-400 border border-green-700/30' : 'bg-green-50 text-green-700 border border-green-300'
                                : isDark ? 'bg-red-900/40 text-red-400 border border-red-700/30' : 'bg-red-50 text-red-700 border border-red-300'
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Privacy note + unsubscribe */}
                <div className={`mt-6 flex items-center justify-center gap-4 text-[11px] ${isDark ? 'text-white/25' : 'text-black/45'}`}>
                    <span>{t.privacy}</span>
                    <span aria-hidden="true">·</span>
                    <a
                        href="/unsubscribe"
                        className={`underline underline-offset-2 transition-colors ${isDark ? 'hover:text-yellow-400' : 'hover:text-yellow-700'}`}
                    >
                        {t.unsubscribe}
                    </a>
                </div>
            </div>
        </div>
    );
}
