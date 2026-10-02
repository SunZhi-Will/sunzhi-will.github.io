'use client'

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { MotionConfig, motion } from 'framer-motion';
import { Backdrop } from '@/components/home/Backdrop';
import { LogoIcon } from '@/components/LogoIcon';
import { EASE_OUT } from '@/components/motion/ease';
import type { Lang } from '@/types';

const isLang = (value: string | null): value is Lang => value === 'zh-TW' || value === 'en';

// 取消訂閱頁與驗證頁的語言：信件連結帶的 ?lang= 優先，其次是訪客在站內選過的語言，最後才看瀏覽器
export function useNewsletterLang(): Lang {
    const [lang, setLang] = useState<Lang>('zh-TW');

    useEffect(() => {
        const fromQuery = new URLSearchParams(window.location.search).get('lang');
        let saved: string | null = null;
        try {
            saved = localStorage.getItem('blog-lang') || localStorage.getItem('site-lang');
        } catch {
            // 無痕模式或停用儲存時略過
        }
        const next: Lang = isLang(fromQuery) ? fromQuery : isLang(saved) ? saved : navigator.language.startsWith('zh') ? 'zh-TW' : 'en';
        setLang(next);
    }, []);

    useEffect(() => {
        document.documentElement.lang = lang === 'zh-TW' ? 'zh-Hant-TW' : 'en';
    }, [lang]);

    return lang;
}

type Tone = 'success' | 'error' | 'neutral';

const toneClass: Record<Tone, string> = {
    success: 'bg-emerald-400/15 text-emerald-400',
    error: 'bg-red-400/15 text-red-400',
    neutral: 'bg-white/10 text-white',
};

// 狀態圖示：完成、失敗、提示
export function StatusMark({ tone }: { tone: Tone }) {
    return (
        <span aria-hidden="true" className={`flex h-12 w-12 items-center justify-center rounded-full ${toneClass[tone]}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                {tone === 'success' && <path d="M5 12.5l4.5 4.5L19 7.5" />}
                {tone === 'error' && <path d="M7 7l10 10M17 7L7 17" />}
                {tone === 'neutral' && <path d="M12 7.5v5.5M12 16.5v.01" />}
            </svg>
        </span>
    );
}

export const shellButton = {
    primary: 'inline-flex h-12 items-center justify-center gap-2 rounded-full bg-yellow-400 px-7 text-base font-semibold text-zinc-950 transition-colors duration-200 hover:bg-white',
    secondary: 'inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-7 text-base font-semibold text-white transition-colors duration-200 hover:border-white/60',
    link: 'text-sm font-medium text-zinc-200 underline decoration-white/40 underline-offset-4 transition-colors hover:text-yellow-400 hover:decoration-yellow-400',
};

// 卡片內容換狀態時的進場動畫。用 key 區分狀態，放在保有狀態的元件裡面，才不會把表單狀態一起重置
export function ShellReveal({ role, children }: { role: 'status' | 'alert'; children: ReactNode }) {
    return (
        <motion.div
            role={role}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
        >
            {children}
        </motion.div>
    );
}

interface NewsletterPageShellProps {
    lang: Lang;
    children: ReactNode;
}

// 取消訂閱頁與驗證頁共用的外框：沿用首頁那套寫死的深色版面，不跟隨系統偏好
export function NewsletterPageShell({ lang, children }: NewsletterPageShellProps) {
    useEffect(() => {
        document.documentElement.classList.add('site-dark');
        return () => document.documentElement.classList.remove('site-dark');
    }, []);

    return (
        <MotionConfig reducedMotion="user">
            <div className="site relative isolate flex min-h-screen flex-col antialiased [overflow-x:clip]">
                <Backdrop />
                <header className="flex items-center justify-between px-5 py-5 md:px-10 md:py-7">
                    <Link href="/" aria-label={lang === 'zh-TW' ? '回首頁' : 'Home'} className="inline-flex items-center gap-2.5 text-white transition-colors hover:text-yellow-400">
                        <LogoIcon className="h-8 w-8" />
                        <span className="text-lg font-semibold tracking-tight">Sun</span>
                    </Link>
                    <Link href="/blog" className={shellButton.link}>
                        {lang === 'zh-TW' ? '部落格' : 'Blog'}
                    </Link>
                </header>
                <main className="flex flex-1 items-center justify-center px-5 pb-28 pt-8">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: EASE_OUT }}
                        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111113] p-7 sm:p-9"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </MotionConfig>
    );
}
