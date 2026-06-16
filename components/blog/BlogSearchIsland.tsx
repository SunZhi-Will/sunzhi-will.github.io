'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Lang } from '@/types';
import { blogTranslations } from '@/lib/blog-translations';
import { useTheme } from '@/app/blog/ThemeProvider';

interface BlogSearchIslandProps {
    lang: Lang;
    setLang: (lang: Lang) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export function BlogSearchIsland({
    lang,
    setLang,
    searchQuery,
    setSearchQuery,
}: BlogSearchIslandProps) {
    const [isFocused, setIsFocused] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const t = blogTranslations[lang];

    const isExpanded = isFocused || searchQuery.length > 0;

    return (
        <motion.div
            className="fixed top-0 right-0 z-50 pointer-events-auto"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <motion.div
                className={`relative overflow-hidden mt-4 mr-4 md:mr-6 rounded-3xl backdrop-blur-2xl shadow-2xl transition-colors duration-300 ${
                    isDark
                        ? 'bg-[#1c1c1e]/95 border border-white/20'
                        : 'bg-[#f0ece4]/92 border border-stone-300/60'
                }`}
                animate={{
                    minWidth: isExpanded ? '320px' : '180px',
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="flex items-center gap-2 px-4 py-2.5">
                    {/* 搜尋框 */}
                    <div className="relative flex-1 min-w-0">
                        <MagnifyingGlassIcon className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 ${
                            isDark ? 'text-white/60' : 'text-black/50'
                        }`} />
                        <AnimatePresence mode="wait">
                            {isExpanded ? (
                                <motion.input
                                    key="expanded"
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: '100%', opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    type="text"
                                    placeholder={t.searchPlaceholder}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => {
                                        if (!searchQuery) {
                                            setIsFocused(false);
                                        }
                                    }}
                                    autoFocus
                                    className={`w-full pl-9 pr-8 py-1.5 text-sm bg-transparent border-0 
                                             focus:outline-none ${
                                                isDark
                                                    ? 'text-white placeholder-white/35'
                                                    : 'text-black placeholder-black/40'
                                            }`}
                                />
                            ) : (
                                <motion.button
                                    key="collapsed"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsFocused(true)}
                                    className={`w-full pl-9 pr-4 py-1.5 text-sm text-left transition-colors ${
                                        isDark
                                            ? 'text-white/50 hover:text-white'
                                            : 'text-black/50 hover:text-black'
                                    }`}
                                >
                                    {t.searchPlaceholder}
                                </motion.button>
                            )}
                        </AnimatePresence>
                        {searchQuery && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => {
                                    setSearchQuery('');
                                    setIsFocused(false);
                                }}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 transition-colors z-10 ${
                                    isDark
                                        ? 'text-white/50 hover:text-white'
                                        : 'text-black/50 hover:text-black'
                                }`}
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </motion.button>
                        )}
                    </div>

                    {/* 分隔線 */}
                    <motion.div
                        className={`w-px h-6 ${isDark ? 'bg-white/15' : 'bg-black/15'}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    />

                    {/* 語言切換按鈕 */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 }}
                        onClick={() => setLang(lang === 'zh-TW' ? 'en' : 'zh-TW')}
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                            isDark
                                ? 'text-white/80 hover:text-yellow-400 hover:bg-white/8'
                                : 'text-black/70 hover:text-black hover:bg-black/8'
                        }`}
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

