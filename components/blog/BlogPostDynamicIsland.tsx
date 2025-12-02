'use client'

import { motion } from 'framer-motion';
import { Lang } from '@/types';
import { blogTranslations } from '@/lib/blog-translations';

interface BlogPostDynamicIslandProps {
    lang: Lang;
    setLang: (lang: Lang) => void;
}

export function BlogPostDynamicIsland({
    lang,
    setLang,
}: BlogPostDynamicIslandProps) {
    const t = blogTranslations[lang];

    return (
        <motion.div
            className="fixed top-0 right-0 z-50 pointer-events-auto"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <motion.div
                className="relative overflow-hidden mt-4 mr-4 rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-slate-400/40 shadow-2xl"
            >
                <div className="flex items-center gap-2 px-4 py-2.5">
                    {/* 語言切換按鈕 */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 }}
                        onClick={() => setLang(lang === 'zh-TW' ? 'en' : 'zh-TW')}
                        className="px-3 py-1.5 rounded-xl text-sm font-medium
                        text-slate-300 hover:text-white hover:bg-slate-800/50
                        transition-all duration-200 whitespace-nowrap flex-shrink-0"
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {t.langSwitch}
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}

