'use client'

import { Suspense } from 'react';
import { NewsletterUnsubscribe } from '@/components/blog/NewsletterUnsubscribe';

function LoadingFallback() {
    return (
        <div className="max-w-md w-full text-center card-modern p-8 rounded-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400 dark:border-slate-500 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
                載入中...
            </p>
        </div>
    );
}

function UnsubscribeContent() {
    return (
        <div className="max-w-md w-full">
            <NewsletterUnsubscribe lang="zh-TW" />
        </div>
    );
}

export default function UnsubscribePage() {
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
            <Suspense fallback={<LoadingFallback />}>
                <UnsubscribeContent />
            </Suspense>
        </div>
    );
}