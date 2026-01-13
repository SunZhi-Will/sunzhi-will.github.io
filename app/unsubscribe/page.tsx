'use client'

import { Suspense, useEffect, useState } from 'react';
import { NewsletterUnsubscribe } from '@/components/blog/NewsletterUnsubscribe';
import type { Lang } from '../../types';

function LoadingFallback({ lang }: { lang: Lang }) {
    const loadingText = lang === 'zh-TW' ? '載入中...' : 'Loading...';

    return (
        <div className="max-w-md w-full text-center card-modern p-8 rounded-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400 dark:border-slate-500 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
                {loadingText}
            </p>
        </div>
    );
}

function UnsubscribeContent({ lang }: { lang: Lang }) {
    return (
        <div className="max-w-md w-full">
            <NewsletterUnsubscribe lang={lang} />
        </div>
    );
}

function UnsubscribePageContent() {
    const [lang, setLang] = useState<Lang>('zh-TW');

    // 從 localStorage 讀取語言選擇，如果沒有則偵測瀏覽器語言
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const savedLang = localStorage.getItem('blog-lang') as Lang | null;
        const supportedLangs: Lang[] = ['zh-TW', 'en'];

        if (savedLang && supportedLangs.includes(savedLang)) {
            setLang(savedLang);
        } else {
            const browserLang = navigator.language;
            const detectedLang: Lang = browserLang.startsWith('zh') ? 'zh-TW' : 'en';

            setLang(detectedLang);
            localStorage.setItem('blog-lang', detectedLang);
        }
    }, []);

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 transition-colors duration-300"
            style={{
                backgroundColor: 'var(--background)',
                backgroundImage: 'radial-gradient(circle, rgba(148, 163, 184, 0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                color: 'var(--foreground)',
            } as React.CSSProperties}
        >
            <Suspense fallback={<LoadingFallback lang={lang} />}>
                <UnsubscribeContent lang={lang} />
            </Suspense>
        </div>
    );
}

export default function UnsubscribePage() {
    return <UnsubscribePageContent />;
}