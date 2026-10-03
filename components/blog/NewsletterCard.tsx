'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lang } from '@/types';
import { NewsletterSubscribe } from './NewsletterSubscribe';

interface NewsletterCardProps {
    lang: Lang;
}

export function NewsletterCard({ lang }: NewsletterCardProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
                <div className="relative backdrop-blur-xl rounded-2xl p-6 bg-surface/80 border border-line">
                    <NewsletterSubscribe lang={lang === 'zh-TW' || lang === 'en' ? lang : 'zh-TW'} variant="inline" />
                </div>
            </div>
        </motion.div>
    );
}
