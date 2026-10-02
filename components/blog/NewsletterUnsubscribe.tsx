'use client'

import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import { isValidEmail, postNewsletter, type NewsletterFailure } from '@/lib/newsletter-api';
import { ShellReveal, StatusMark, shellButton } from './NewsletterPageShell';

interface NewsletterUnsubscribeProps {
    lang: 'zh-TW' | 'en';
}

const translations = {
    'zh-TW': {
        eyebrow: '電子報',
        title: '取消訂閱',
        subtitle: '輸入訂閱時用的信箱，之後就不會再收到電子報。',
        emailLabel: '電子信箱',
        unsubscribe: '取消訂閱',
        unsubscribing: '處理中',
        keep: '不取消了，回部落格',
        doneTitle: '已取消訂閱',
        doneBody: (email: string) => `${email} 不會再收到電子報。謝謝你讀到這裡。`,
        inactiveTitle: '這個信箱目前沒有在收信',
        inactiveBody: (email: string) => `${email} 還沒完成驗證，或是之前已經取消訂閱，所以不會收到電子報。`,
        backToBlog: '回部落格',
        resubscribe: '按錯了？重新訂閱',
        errors: {
            invalid_email: '這個信箱格式不太對，再檢查一次。',
            not_configured: '取消訂閱服務暫時無法使用，請稍後再試。',
            rate_limited: '送出太頻繁了，請一分鐘後再試。',
            not_found: '找不到這個信箱的訂閱紀錄，確認一下是不是訂閱時用的那一個。',
            not_subscribed: '這個信箱目前沒有訂閱。',
            verification_not_sent: '取消訂閱失敗，請稍後再試。',
            timeout: '連線逾時，請再試一次。',
            network: '網路連線失敗，請檢查連線後再試。',
            unknown: '取消訂閱失敗，請稍後再試。',
        } satisfies Record<NewsletterFailure, string>,
    },
    'en': {
        eyebrow: 'Newsletter',
        title: 'Unsubscribe',
        subtitle: 'Enter the email address you subscribed with and the newsletter will stop.',
        emailLabel: 'Email address',
        unsubscribe: 'Unsubscribe',
        unsubscribing: 'Working',
        keep: 'Never mind, back to the blog',
        doneTitle: 'You are unsubscribed',
        doneBody: (email: string) => `${email} will not receive the newsletter anymore. Thanks for reading.`,
        inactiveTitle: 'This address is not receiving emails',
        inactiveBody: (email: string) => `${email} was never confirmed or has already been unsubscribed, so no newsletter is sent to it.`,
        backToBlog: 'Back to the blog',
        resubscribe: 'Changed your mind? Subscribe again',
        errors: {
            invalid_email: 'That email address does not look right. Please check it.',
            not_configured: 'Unsubscribing is unavailable right now. Please try again later.',
            rate_limited: 'Too many attempts. Please try again in a minute.',
            not_found: 'No subscription was found for this address. Check that it is the one you subscribed with.',
            not_subscribed: 'This address is not subscribed.',
            verification_not_sent: 'Unsubscribe failed. Please try again later.',
            timeout: 'The request timed out. Please try again.',
            network: 'Network error. Check your connection and try again.',
            unknown: 'Unsubscribe failed. Please try again later.',
        } satisfies Record<NewsletterFailure, string>,
    }
};

export function NewsletterUnsubscribe({ lang }: NewsletterUnsubscribeProps) {
    const t = translations[lang];
    const fieldId = useId();
    const errorId = `${fieldId}-error`;

    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<NewsletterFailure | null>(null);
    const [finished, setFinished] = useState<{ email: string; state: 'done' | 'inactive' } | null>(null);

    // 信件裡的取消訂閱連結會帶上收件信箱，省掉再打一次
    useEffect(() => {
        const fromQuery = new URLSearchParams(window.location.search).get('email');
        if (fromQuery && isValidEmail(fromQuery)) setEmail(fromQuery);
    }, []);

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
        const result = await postNewsletter({ email: value, action: 'unsubscribe', lang });
        setIsSubmitting(false);

        if (result.ok) {
            setFinished({ email: value, state: 'done' });
        } else if (result.reason === 'not_subscribed') {
            setFinished({ email: value, state: 'inactive' });
        } else {
            setError(result.reason);
        }
    };

    if (finished) {
        const done = finished.state === 'done';
        return (
            <ShellReveal role="status">
                <StatusMark tone={done ? 'success' : 'neutral'} />
                <h1 className="mt-6 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {done ? t.doneTitle : t.inactiveTitle}
                </h1>
                <p className="mt-3 break-words text-base leading-relaxed text-zinc-200">
                    {done ? t.doneBody(finished.email) : t.inactiveBody(finished.email)}
                </p>
                <div className="mt-8 flex flex-col items-start gap-5">
                    <Link href="/blog" className={shellButton.primary}>{t.backToBlog}</Link>
                    <Link href="/blog#newsletter" className={shellButton.link}>{t.resubscribe}</Link>
                </div>
            </ShellReveal>
        );
    }

    return (
        <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{t.title}</h1>
            <p className="mt-3 text-base leading-relaxed text-zinc-200">{t.subtitle}</p>

            <form onSubmit={handleSubmit} noValidate className="mt-7">
                <label htmlFor={fieldId} className="block text-sm font-medium text-white">
                    {t.emailLabel}
                </label>
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
                    className={`mt-2 h-12 w-full rounded-xl border bg-white/[0.04] px-4 text-base text-white outline-none transition-colors focus:border-yellow-400 focus:bg-white/[0.07] disabled:opacity-60 ${
                        error ? 'border-red-400' : 'border-white/20 hover:border-white/40'
                    }`}
                />
                {error && (
                    <p id={errorId} role="alert" className="mt-2.5 text-sm font-medium text-red-400">
                        {t.errors[error]}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-semibold text-zinc-950 transition-colors duration-200 hover:bg-yellow-400 disabled:cursor-wait"
                >
                    {isSubmitting && (
                        <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    )}
                    {isSubmitting ? t.unsubscribing : t.unsubscribe}
                </button>
            </form>

            <p className="mt-6 text-center">
                <Link href="/blog" className={shellButton.link}>{t.keep}</Link>
            </p>
        </div>
    );
}
