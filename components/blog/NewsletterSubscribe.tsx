'use client'

import { useId, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/app/blog/ThemeProvider';
import { isValidEmail, postNewsletter, type NewsletterFailure } from '@/lib/newsletter-api';

interface NewsletterSubscribeProps {
    lang: 'zh-TW' | 'en';
    /** 'inline' = compact block used in sidebars; 'section' = full-width block under the post list and articles */
    variant?: 'inline' | 'section';
}

const translations = {
    'zh-TW': {
        eyebrow: '電子報',
        title: '新文章寄到你的信箱',
        subtitle: 'AI 應用、軟體開發，還有做產品的第一手觀察。有新文章才寄，不會塞滿你的收件匣。',
        emailLabel: '電子信箱',
        subscribe: '訂閱',
        subscribing: '送出中',
        privacy: '不寄垃圾信，隨時可以',
        unsubscribe: '取消訂閱',
        successTitle: '去收信，完成最後一步',
        successBody: (email: string) => `驗證信已經寄到 ${email}，點信裡的按鈕就完成訂閱。沒看到的話，找找垃圾信件匣。`,
        useAnother: '換一個信箱',
        errors: {
            invalid_email: '這個信箱格式不太對，再檢查一次。',
            not_configured: '訂閱服務暫時無法使用，請稍後再試。',
            rate_limited: '送出太頻繁了，請一分鐘後再試。',
            verification_not_sent: '驗證信沒有寄出去，請稍後再試一次。',
            timeout: '連線逾時，請再試一次。',
            network: '網路連線失敗，請檢查連線後再試。',
            not_found: '訂閱失敗，請稍後再試。',
            not_subscribed: '訂閱失敗，請稍後再試。',
            unknown: '訂閱失敗，請稍後再試。',
        } satisfies Record<NewsletterFailure, string>,
    },
    'en': {
        eyebrow: 'Newsletter',
        title: 'New posts, straight to your inbox',
        subtitle: 'Notes on applied AI, software engineering and building products. Sent only when there is something new.',
        emailLabel: 'Email address',
        subscribe: 'Subscribe',
        subscribing: 'Sending',
        privacy: 'No spam. You can',
        unsubscribe: 'unsubscribe',
        successTitle: 'One last step: check your inbox',
        successBody: (email: string) => `A confirmation link is on its way to ${email}. Click it to finish subscribing. If it is not there, check your spam folder.`,
        useAnother: 'Use a different email',
        errors: {
            invalid_email: 'That email address does not look right. Please check it.',
            not_configured: 'Subscriptions are unavailable right now. Please try again later.',
            rate_limited: 'Too many attempts. Please try again in a minute.',
            verification_not_sent: 'The confirmation email could not be sent. Please try again later.',
            timeout: 'The request timed out. Please try again.',
            network: 'Network error. Check your connection and try again.',
            not_found: 'Subscription failed. Please try again later.',
            not_subscribed: 'Subscription failed. Please try again later.',
            unknown: 'Subscription failed. Please try again later.',
        } satisfies Record<NewsletterFailure, string>,
    }
};

export function NewsletterSubscribe({ lang, variant = 'section' }: NewsletterSubscribeProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const t = translations[lang];
    const isSection = variant === 'section';

    const fieldId = useId();
    const errorId = `${fieldId}-error`;
    const titleId = `${fieldId}-title`;

    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<NewsletterFailure | null>(null);
    // 送出成功後記住寄到哪個信箱，畫面改成「去收信」的下一步提示
    const [sentTo, setSentTo] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        const value = email.trim();
        if (!isValidEmail(value)) {
            setError('invalid_email');
            return;
        }

        setError(null);
        setIsSubmitting(true);
        const result = await postNewsletter({ email: value, types: 'all', lang });
        setIsSubmitting(false);

        if (result.ok) {
            setSentTo(value);
            setEmail('');
        } else {
            setError(result.reason);
        }
    };

    const tone = {
        title: isDark ? 'text-white' : 'text-stone-900',
        body: isDark ? 'text-zinc-200' : 'text-stone-600',
        link: isDark
            ? 'underline decoration-white/40 underline-offset-4 hover:text-yellow-400 hover:decoration-yellow-400'
            : 'underline decoration-stone-400 underline-offset-4 hover:text-amber-700 hover:decoration-amber-700',
        ring: isDark
            ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111113]'
            : 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
    };

    const success = sentTo && (
        <motion.div
            key="success"
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={isSection ? 'mt-6 flex max-w-xl gap-4' : 'mt-4 flex gap-3'}
        >
            <span
                aria-hidden="true"
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
                    isDark ? 'bg-emerald-400/15 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                }`}
            >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M4 10.5l4 4 8-9" />
                </svg>
            </span>
            <div className="min-w-0">
                <p className={`${isSection ? 'text-base' : 'text-sm'} font-semibold ${tone.title}`}>{t.successTitle}</p>
                <p className={`mt-1 break-words ${isSection ? 'text-sm leading-relaxed' : 'text-xs leading-relaxed'} ${tone.body}`}>
                    {t.successBody(sentTo)}
                </p>
                <button
                    type="button"
                    onClick={() => setSentTo(null)}
                    className={`mt-3 rounded-sm ${isSection ? 'text-sm' : 'text-xs'} font-medium ${tone.body} ${tone.link} ${tone.ring}`}
                >
                    {t.useAnother}
                </button>
            </div>
        </motion.div>
    );

    const form = (
        <form onSubmit={handleSubmit} noValidate className={isSection ? 'mt-6 max-w-xl' : 'mt-4'}>
            <label htmlFor={fieldId} className={`block font-medium ${isSection ? 'text-sm' : 'text-xs'} ${tone.title}`}>
                {t.emailLabel}
            </label>
            <div className={`mt-2 flex gap-2.5 ${isSection ? 'flex-col sm:flex-row' : 'flex-col'}`}>
                <input
                    id={fieldId}
                    type="email"
                    name="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="off"
                    spellCheck={false}
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                    }}
                    disabled={isSubmitting}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    className={`w-full min-w-0 flex-shrink-0 rounded-xl border px-4 outline-none transition-colors disabled:opacity-60 ${
                        isSection ? 'h-12 text-base sm:w-auto sm:flex-1' : 'h-10 text-sm'
                    } ${
                        isDark
                            ? 'bg-white/[0.04] text-white focus:border-yellow-400 focus:bg-white/[0.07]'
                            : 'bg-white text-stone-900 focus:border-stone-900'
                    } ${
                        error
                            ? isDark ? 'border-red-400' : 'border-red-600'
                            : isDark ? 'border-white/20 hover:border-white/40' : 'border-stone-300 hover:border-stone-500'
                    }`}
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    className={`inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:cursor-wait ${
                        isSection ? 'h-12 px-7 text-base' : 'h-10 px-5 text-sm'
                    } ${
                        isDark
                            ? 'bg-yellow-400 text-zinc-950 hover:bg-yellow-300'
                            : 'bg-stone-900 text-white hover:bg-stone-700'
                    } ${tone.ring}`}
                >
                    {isSubmitting && (
                        <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    )}
                    {isSubmitting ? t.subscribing : t.subscribe}
                </button>
            </div>
            {error && (
                <p id={errorId} role="alert" className={`mt-2.5 ${isSection ? 'text-sm' : 'text-xs'} font-medium ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                    {t.errors[error]}
                </p>
            )}
            <p className={`${isSection ? 'mt-4 text-sm' : 'mt-3 text-xs'} ${tone.body}`}>
                {t.privacy}
                {lang === 'en' ? ' ' : ''}
                <Link href="/unsubscribe" className={`rounded-sm ${tone.link} ${tone.ring}`}>
                    {t.unsubscribe}
                </Link>
                {lang === 'zh-TW' ? '。' : ' at any time.'}
            </p>
        </form>
    );

    /* ─── INLINE VARIANT (compact, e.g. sidebar) ─── */
    if (!isSection) {
        return (
            <div>
                <p className={`text-sm font-semibold ${tone.title}`}>{t.title}</p>
                <p className={`mt-1 text-xs leading-relaxed ${tone.body}`}>{t.subtitle}</p>
                {success || form}
            </div>
        );
    }

    /* ─── SECTION VARIANT (full-width editorial block) ─── */
    return (
        <section
            id="newsletter"
            aria-labelledby={titleId}
            className={`scroll-mt-24 rounded-2xl border p-6 transition-colors sm:p-8 md:p-10 ${
                isDark ? 'border-white/10 bg-[#111113]' : 'border-stone-200 bg-white'
            }`}
        >
            <p className={`font-geist-mono flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] ${isDark ? 'text-zinc-200' : 'text-stone-600'}`}>
                <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${isDark ? 'bg-yellow-400' : 'bg-amber-600'}`} />
                {t.eyebrow}
            </p>
            <h2 id={titleId} className={`mt-3 text-2xl font-semibold leading-tight tracking-tight md:text-3xl ${tone.title}`}>
                {t.title}
            </h2>
            <p className={`mt-3 max-w-xl text-base leading-relaxed [text-wrap:pretty] ${tone.body}`}>
                {t.subtitle}
            </p>
            {success || form}
        </section>
    );
}
