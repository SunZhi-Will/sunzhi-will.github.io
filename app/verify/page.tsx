'use client'

import { useEffect, useState, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { translations } from '../../data/translations';
import type { Lang } from '../../types';

function VerifyContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [lang, setLang] = useState<Lang>('zh-TW');

    // 提取 searchParams 的值，確保依賴項穩定
    const email = useMemo(() => searchParams.get('email'), [searchParams]);
    const token = useMemo(() => searchParams.get('token'), [searchParams]);

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
        }
    }, []);

    useEffect(() => {
        if (!email || !token) {
            setStatus('error');
            setMessage(translations[lang].verify.error.missingParams);
            return;
        }

        const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL;
        if (!scriptUrl) {
            setStatus('error');
            setMessage(translations[lang].verify.error.serviceNotConfigured);
            return;
        }

        // 調用 Google Apps Script API 進行驗證（使用 format=json 參數）
        const verifyUrl = `${scriptUrl}?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}&format=json`;

        fetch(verifyUrl, {
            method: 'GET',
            mode: 'cors',
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                const responseLang = (data.lang === 'zh-TW' || data.lang === 'en') ? data.lang : lang;
                if (data.success) {
                    setStatus('success');
                    setMessage(data.message || translations[responseLang].verify.success.message);
                    setLang(responseLang);
                } else {
                    setStatus('error');
                    setMessage(data.message || translations[responseLang].verify.error.title);
                    setLang(responseLang);
                }
            })
            .catch((error) => {
                console.error('Verification error:', error);
                setStatus('error');
                setMessage(translations[lang].verify.error.verificationError);
            });
    }, [email, token, lang]);

    return (
        <div className="max-w-md w-full text-center card-modern p-8 rounded-2xl">
            {status === 'loading' && (
                <>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400 dark:border-slate-500 mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-300 text-lg">
                        {translations[lang].verify.loading}
                    </p>
                </>
            )}

            {status === 'success' && (
                <>
                    <div className="text-emerald-500 dark:text-emerald-400 text-6xl mb-4">✓</div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                        {translations[lang].verify.success.title}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-200 mb-6">
                        {message || translations[lang].verify.success.message}
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-slate-600 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        {translations[lang].verify.actions.backToHome}
                    </Link>
                </>
            )}

            {status === 'error' && (
                <>
                    <div className="text-red-500 dark:text-red-400 text-6xl mb-4">✗</div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                        {translations[lang].verify.error.title}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-200 mb-6">
                        {message || translations[lang].verify.error.invalidLink}
                    </p>
                    <div className="space-y-3">
                        <Link
                            href="/"
                            className="inline-block bg-slate-600 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                        >
                            {translations[lang].verify.actions.backToHome}
                        </Link>
                        <div>
                            <Link
                                href="/blog"
                                className="text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 underline transition-colors"
                            >
                                {translations[lang].verify.actions.subscribeAgain}
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function LoadingFallback() {
    const [lang, setLang] = useState<Lang>('zh-TW');

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
        }
    }, []);

    return (
        <div className="max-w-md w-full text-center card-modern p-8 rounded-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400 dark:border-slate-500 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
                {translations[lang].verify.loading}
            </p>
        </div>
    );
}

export default function VerifyPage() {
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
                <VerifyContent />
            </Suspense>
        </div>
    );
}
