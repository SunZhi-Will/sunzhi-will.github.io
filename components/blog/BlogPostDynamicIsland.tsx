'use client'

import { motion } from 'framer-motion';
import { Lang } from '@/types';
import { blogTranslations } from '@/lib/blog-translations';
import { useTheme } from '@/app/blog/ThemeProvider';

interface BlogPostDynamicIslandProps {
    lang: Lang;
    setLang: (lang: Lang) => void;
}

export function BlogPostDynamicIsland({
    lang,
    setLang,
}: BlogPostDynamicIslandProps) {
    const t = blogTranslations[lang];
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <motion.div
            className="fixed top-0 right-0 z-50 pointer-events-auto"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <motion.div
                className={`relative overflow-hidden mt-4 mr-4 rounded-3xl backdrop-blur-2xl shadow-2xl transition-colors duration-300 ${isDark
                    ? 'bg-[#1c1c1e]/95 border border-white/20'
                    : 'bg-[#f0ece4]/92 border border-stone-300/60'
                    }`}
                animate={{
                    width: 'auto',
                    height: '3rem',
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="flex items-center justify-center h-full px-3">
                    {/* 語言切換按鈕 */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 }}
                        onClick={() => setLang(lang === 'zh-TW' ? 'en' : 'zh-TW')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium
                        transition-all duration-200 whitespace-nowrap ${isDark
                                ? 'text-white/80 hover:text-yellow-400 hover:bg-white/5'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-black/5'
                            }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {t.langSwitch}
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}

