'use client'

import { useEffect, useState, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [lang, setLang] = useState<'zh-TW' | 'en'>('zh-TW');

    // 提取 searchParams 的值，確保依賴項穩定
    const email = useMemo(() => searchParams.get('email'), [searchParams]);
    const token = useMemo(() => searchParams.get('token'), [searchParams]);

    // 從 localStorage 讀取語言選擇，如果沒有則偵測瀏覽器語言
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const savedLang = localStorage.getItem('blog-lang') as 'zh-TW' | 'en' | null;
        if (savedLang && (savedLang === 'zh-TW' || savedLang === 'en')) {
            setLang(savedLang);
        } else {
            const browserLang = navigator.language;
            const detectedLang = browserLang.includes('zh') ? 'zh-TW' : 'en';
            setLang(detectedLang);
        }
    }, []);

    useEffect(() => {
        if (!email || !token) {
            setStatus('error');
            setMessage(lang === 'zh-TW' ? '缺少必要的驗證參數' : 'Missing required verification parameters');
            return;
        }

        const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL;
        if (!scriptUrl) {
            setStatus('error');
            setMessage(lang === 'zh-TW' ? '驗證服務未配置' : 'Verification service not configured');
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
                const responseLang = data.lang || lang;
                if (data.success) {
                    setStatus('success');
                    setMessage(data.message || (responseLang === 'zh-TW' ? 'Email 驗證成功！' : 'Email verified successfully!'));
                    setLang(responseLang);
                } else {
                    setStatus('error');
                    setMessage(data.message || (responseLang === 'zh-TW' ? '驗證失敗' : 'Verification failed'));
                    setLang(responseLang);
                }
            })
            .catch((error) => {
                console.error('Verification error:', error);
                setStatus('error');
                setMessage(lang === 'zh-TW' ? '驗證過程中發生錯誤，請稍後再試' : 'An error occurred during verification. Please try again later.');
            });
    }, [email, token, lang]);

    return (
        <div className="max-w-md w-full text-center card-modern p-8 rounded-2xl">
            {status === 'loading' && (
                <>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400 dark:border-slate-500 mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-300 text-lg">
                        {lang === 'zh-TW' ? '正在驗證您的 Email...' : 'Verifying your email...'}
                    </p>
                </>
            )}

            {status === 'success' && (
                <>
                    <div className="text-emerald-500 dark:text-emerald-400 text-6xl mb-4">✓</div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                        {lang === 'zh-TW' ? 'Email 驗證成功！' : 'Email Verified Successfully!'}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                        {message || (lang === 'zh-TW' 
                            ? '感謝您驗證您的 Email 地址。您現在將開始收到我們的電子報。'
                            : 'Thank you for verifying your email address. You will now receive our newsletter.')}
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-slate-600 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        {lang === 'zh-TW' ? '返回首頁' : 'Back to Home'}
                    </Link>
                </>
            )}

            {status === 'error' && (
                <>
                    <div className="text-red-500 dark:text-red-400 text-6xl mb-4">✗</div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                        {lang === 'zh-TW' ? '驗證失敗' : 'Verification Failed'}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                        {message || (lang === 'zh-TW' 
                            ? '無效的驗證連結或連結已過期。'
                            : 'Invalid verification link or link has expired.')}
                    </p>
                    <div className="space-y-3">
                        <Link
                            href="/"
                            className="inline-block bg-slate-600 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                        >
                            {lang === 'zh-TW' ? '返回首頁' : 'Back to Home'}
                        </Link>
                        <div>
                            <Link
                                href="/blog"
                                className="text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 underline transition-colors"
                            >
                                {lang === 'zh-TW' ? '重新訂閱' : 'Subscribe Again'}
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function LoadingFallback() {
    const [lang, setLang] = useState<'zh-TW' | 'en'>('zh-TW');

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const savedLang = localStorage.getItem('blog-lang') as 'zh-TW' | 'en' | null;
        if (savedLang && (savedLang === 'zh-TW' || savedLang === 'en')) {
            setLang(savedLang);
        } else {
            const browserLang = navigator.language;
            const detectedLang = browserLang.includes('zh') ? 'zh-TW' : 'en';
            setLang(detectedLang);
        }
    }, []);

    return (
        <div className="max-w-md w-full text-center card-modern p-8 rounded-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400 dark:border-slate-500 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
                {lang === 'zh-TW' ? '載入中...' : 'Loading...'}
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
