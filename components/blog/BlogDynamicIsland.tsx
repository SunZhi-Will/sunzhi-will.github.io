'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Lang } from '@/types';
import { blogTranslations } from '@/lib/blog-translations';

interface BlogDynamicIslandProps {
    lang: Lang;
    setLang: (lang: Lang) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export function BlogDynamicIsland({
    lang,
    setLang,
    searchQuery,
    setSearchQuery,
}: BlogDynamicIslandProps) {
    const [isFocused, setIsFocused] = useState(false);
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
                className="relative overflow-hidden mt-4 mr-4 rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-slate-400/40 shadow-2xl"
                animate={{
                    minWidth: isExpanded ? '400px' : '200px',
                    height: '3rem',
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="flex items-center gap-2 px-3 py-2.5 h-full">
                    {/* 搜尋框 */}
                    <div className="relative flex-1 min-w-0">
                        <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 z-10" />
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
                                    className="w-full pl-8 pr-7 py-1 text-xs bg-transparent border-0 
                                             focus:outline-none text-slate-100 placeholder-slate-500"
                                />
                            ) : (
                                <motion.button
                                    key="collapsed"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsFocused(true)}
                                    className="w-full pl-8 pr-4 py-1 text-xs text-slate-400 text-left hover:text-slate-300 transition-colors"
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
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100 transition-colors z-10"
                            >
                                <XMarkIcon className="w-3.5 h-3.5" />
                            </motion.button>
                        )}
                    </div>

                    {/* 分隔線 */}
                    <motion.div
                        className="w-px h-5 bg-slate-600/50"
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
                        className="px-2.5 py-1 rounded-lg text-xs font-medium
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

