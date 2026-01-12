'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lang } from '@/types';
import { useTheme } from '@/app/blog/ThemeProvider';
import { NewsletterSubscribe } from './NewsletterSubscribe';

interface NewsletterCardProps {
    lang: Lang;
}

export function NewsletterCard({ lang }: NewsletterCardProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const isDark = theme === 'dark';

    useEffect(() => {
        setMounted(true);
    }, []);

    // 在首次渲染時（服務器和客戶端 hydration）使用固定的 theme 值，避免 hydration 不匹配
    const safeIsDark = mounted ? isDark : true; // 預設使用 dark theme

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={mounted ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={mounted ? { duration: 0.5, delay: 0.4 } : { duration: 0 }}
            className="hidden md:block w-64 lg:w-72 flex-shrink-0"
            suppressHydrationWarning
        >
            <div className="px-6 pb-6">
                {/* 訂閱卡片 */}
                <div
                    className={`relative backdrop-blur-xl rounded-2xl p-6 ${safeIsDark
                        ? 'bg-gray-800/80 border border-gray-700/60'
                        : 'bg-white/80 border border-gray-300/60'
                        }`}
                >
                    <NewsletterSubscribe lang={lang === 'zh-TW' || lang === 'en' ? lang : 'zh-TW'} />
                </div>
            </div>
        </motion.div>
    );
}
