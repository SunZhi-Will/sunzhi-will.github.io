'use client'

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { NewsletterPageShell, ShellReveal, StatusMark, shellButton, useNewsletterLang } from '@/components/blog/NewsletterPageShell';
import type { Lang } from '@/types';

type Outcome = 'loading' | 'success' | 'already' | 'expired' | 'invalid' | 'missing' | 'failed';

const translations = {
    'zh-TW': {
        loading: '正在確認你的信箱',
        success: {
            title: '訂閱完成',
            body: '之後有新文章就會寄到你的信箱。先看看最近寫了什麼吧。',
        },
        already: {
            title: '這個信箱已經驗證過了',
            body: '不用再做任何事，之後有新文章就會寄給你。',
        },
        expired: {
            title: '驗證連結過期了',
            body: '連結的有效期限是 7 天。重新訂閱一次，就會再寄一封新的驗證信給你。',
        },
        invalid: {
            title: '這個連結無法使用',
            body: '連結可能不完整，或是已經用過了。如果你先前已經完成驗證，就不用再做任何事；還沒的話，請重新訂閱一次。',
        },
        missing: {
            title: '連結不完整',
            body: '請直接點信裡的按鈕，或是把整段網址完整貼到瀏覽器。',
        },
        failed: {
            title: '暫時無法驗證',
            body: '驗證服務沒有回應，你的連結還是有效的，請稍後再試一次。',
        },
        readPosts: '看最新文章',
        resubscribe: '重新訂閱',
        retry: '再試一次',
        home: '回首頁',
    },
    'en': {
        loading: 'Confirming your email',
        success: {
            title: 'You are subscribed',
            body: 'New posts will land in your inbox from now on. Meanwhile, see what has been published lately.',
        },
        already: {
            title: 'This email is already confirmed',
            body: 'Nothing more to do. New posts will be sent to you.',
        },
        expired: {
            title: 'This link has expired',
            body: 'Confirmation links are valid for 7 days. Subscribe again and a fresh one will be sent to you.',
        },
        invalid: {
            title: 'This link cannot be used',
            body: 'It may be incomplete or already used. If you have confirmed before, there is nothing more to do. Otherwise, please subscribe again.',
        },
        missing: {
            title: 'This link is incomplete',
            body: 'Click the button in the email, or paste the whole address into your browser.',
        },
        failed: {
            title: 'Unable to confirm right now',
            body: 'The service did not respond. Your link is still valid, so please try again in a moment.',
        },
        readPosts: 'Read the latest posts',
        resubscribe: 'Subscribe again',
        retry: 'Try again',
        home: 'Back to home',
    },
};

// 後端回傳的 message 只用來判斷原因，畫面文案一律用上面的翻譯，避免中英混雜
function outcomeFromResponse(data: { success?: boolean; code?: string; message?: string }): Outcome {
    if (data.code === 'already_verified') return 'already';
    if (data.success) return 'success';
    const message = (data.message || '').toLowerCase();
    if (message.startsWith('invalid') || message.startsWith('無效')) return 'invalid';
    if (message.includes('expired') || message.includes('過期')) return 'expired';
    if (message.includes('missing')) return 'missing';
    if (message.includes('server error')) return 'failed';
    return 'invalid';
}

export default function VerifyPage() {
    const detectedLang = useNewsletterLang();
    // 驗證成功後改用訂閱時選的語言
    const [subscriberLang, setSubscriberLang] = useState<Lang | null>(null);
    const [outcome, setOutcome] = useState<Outcome>('loading');
    const [attempt, setAttempt] = useState(0);
    // 驗證連結只能用一次，同一次嘗試不可以重複送出，否則第二次會被判定為無效連結
    const requested = useRef<number | null>(null);

    const lang = subscriberLang ?? detectedLang;
    const t = translations[lang];

    useEffect(() => {
        if (requested.current === attempt) return;
        requested.current = attempt;

        const params = new URLSearchParams(window.location.search);
        const email = params.get('email');
        const token = params.get('token');
        if (!email || !token) {
            setOutcome('missing');
            return;
        }

        const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL;
        if (!scriptUrl) {
            setOutcome('failed');
            return;
        }

        setOutcome('loading');
        const verifyUrl = `${scriptUrl}?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}&format=json`;

        fetch(verifyUrl, { method: 'GET', mode: 'cors' })
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                if (data.lang === 'zh-TW' || data.lang === 'en') setSubscriberLang(data.lang);
                setOutcome(outcomeFromResponse(data));
            })
            .catch((error) => {
                if (process.env.NODE_ENV === 'development') console.error('Verification error:', error);
                setOutcome('failed');
            });
    }, [attempt]);

    if (outcome === 'loading') {
        return (
            <NewsletterPageShell lang={lang}>
                <div role="status" className="flex flex-col items-center py-6 text-center">
                    <span aria-hidden="true" className="h-12 w-12 animate-spin rounded-full border-2 border-white/15 border-t-yellow-400" />
                    <p className="mt-6 text-lg font-medium text-white">{t.loading}</p>
                </div>
            </NewsletterPageShell>
        );
    }

    const ok = outcome === 'success' || outcome === 'already';
    const copy = t[outcome];

    return (
        <NewsletterPageShell lang={lang}>
            <ShellReveal key={outcome} role={ok ? 'status' : 'alert'}>
                <StatusMark tone={ok ? 'success' : outcome === 'failed' ? 'neutral' : 'error'} />
                <h1 className="mt-6 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{copy.title}</h1>
                <p className="mt-3 text-base leading-relaxed text-zinc-200">{copy.body}</p>
                <div className="mt-8 flex flex-col items-start gap-5">
                    {ok && (
                        <Link href="/blog" className={shellButton.primary}>{t.readPosts}</Link>
                    )}
                    {outcome === 'failed' && (
                        <button type="button" onClick={() => setAttempt((n) => n + 1)} className={shellButton.primary}>
                            {t.retry}
                        </button>
                    )}
                    {!ok && outcome !== 'failed' && (
                        <Link href="/blog#newsletter" className={shellButton.primary}>{t.resubscribe}</Link>
                    )}
                    <Link href="/" className={shellButton.link}>{t.home}</Link>
                </div>
            </ShellReveal>
        </NewsletterPageShell>
    );
}
