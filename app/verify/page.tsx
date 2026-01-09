'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyPage() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [lang, setLang] = useState<'zh-TW' | 'en'>('zh-TW');

    useEffect(() => {
        const email = searchParams.get('email');
        const token = searchParams.get('token');

        if (!email || !token) {
            setStatus('error');
            setMessage('缺少必要的驗證參數');
            return;
        }

        const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL;
        if (!scriptUrl) {
            setStatus('error');
            setMessage('驗證服務未配置');
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
                if (data.success) {
                    setStatus('success');
                    setMessage(data.message || 'Email 驗證成功！');
                    setLang(data.lang || 'zh-TW');
                } else {
                    setStatus('error');
                    setMessage(data.message || '驗證失敗');
                    setLang(data.lang || 'zh-TW');
                }
            })
            .catch((error) => {
                console.error('Verification error:', error);
                setStatus('error');
                setMessage('驗證過程中發生錯誤，請稍後再試');
            });
    }, [searchParams]);

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
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
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
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
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
        </div>
    );
}
