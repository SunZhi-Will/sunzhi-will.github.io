'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { Lang } from '@/types';
import { blogTranslations } from '@/lib/blog-translations';
import { useTheme } from '@/app/blog/ThemeProvider';

interface BlogMobileNavProps {
    lang: Lang;
    setLang: (lang: Lang) => void;
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
    selectedTag?: string | null;
    setSelectedTag?: (tag: string | null) => void;
}

export function BlogMobileNav({
    lang,
    setLang,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
}: BlogMobileNavProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const t = blogTranslations[lang];

    // 判斷是否在文章詳情頁面
    const isPostPage = pathname?.startsWith('/blog/') && pathname !== '/blog';

    const navItems = [
        {
            id: 'all',
            tag: null,
            label: lang === 'zh-TW' ? '全部' : 'All',
        },
        {
            id: 'sun',
            tag: 'Sun',
            label: lang === 'zh-TW' ? '日常' : 'Daily',
        },
        {
            id: 'ai',
            tag: 'AI',
            label: lang === 'zh-TW' ? 'AI' : 'AI',
        },
        {
            id: 'blockchain',
            tag: '區塊鏈',
            label: lang === 'zh-TW' ? '區塊鏈' : 'Blockchain',
        },
    ];

    return (
        <>
            {/* 主要導覽列 */}
            <motion.div
                className="fixed top-0 left-0 right-0 z-50 pointer-events-auto md:hidden"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className={`mx-2 mt-2 rounded-2xl backdrop-blur-2xl shadow-2xl transition-colors duration-300 ${
                    isDark
                        ? 'bg-gray-800/95 border border-gray-700/60'
                        : 'bg-white/90 border border-gray-300/60'
                }`}>
                    {/* 第一行：LOGO 和主要操作 */}
                    <div className="flex items-center justify-between px-4 py-3 min-h-[3.5rem]">
                        {/* LOGO */}
                        <Link
                            href="/blog"
                            className={`flex items-center gap-2 transition-colors flex-shrink-0 ${
                                isDark
                                    ? 'text-gray-200 hover:text-gray-300'
                                    : 'text-gray-900 hover:text-gray-700'
                            }`}
                        >
                            <motion.svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </motion.svg>
                            <span className="text-sm font-semibold">Sun</span>
                        </Link>

                        {/* 右側操作按鈕 */}
                        <div className="flex items-center gap-2">
                            {/* 搜尋按鈕 - 只在列表頁面顯示 */}
                            {setSearchQuery && !isPostPage && (
                                <motion.button
                                    onClick={() => {
                                        setIsSearchOpen(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`p-2 rounded-lg transition-all ${
                                        isDark
                                            ? 'text-gray-300 hover:text-gray-200 hover:bg-gray-700/70'
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/70'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <MagnifyingGlassIcon className="w-5 h-5" />
                                </motion.button>
                            )}

                            {/* 導航選單按鈕 - 只在列表頁面顯示 */}
                            {!isPostPage && setSelectedTag && (
                                <motion.button
                                    onClick={() => {
                                        setIsMenuOpen(!isMenuOpen);
                                        setIsSearchOpen(false);
                                    }}
                                    className={`p-2 rounded-lg transition-all relative ${
                                        isDark
                                            ? 'text-gray-300 hover:text-gray-200 hover:bg-gray-700/70'
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/70'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <AnimatePresence mode="wait">
                                        {isMenuOpen ? (
                                            <motion.div
                                                key="close"
                                                initial={{ rotate: -90, opacity: 0 }}
                                                animate={{ rotate: 0, opacity: 1 }}
                                                exit={{ rotate: 90, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <XMarkIcon className="w-5 h-5" />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="menu"
                                                initial={{ rotate: 90, opacity: 0 }}
                                                animate={{ rotate: 0, opacity: 1 }}
                                                exit={{ rotate: -90, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Bars3Icon className="w-5 h-5" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            )}

                            {/* 語言切換 */}
                            <motion.button
                                onClick={() => setLang(lang === 'zh-TW' ? 'en' : 'zh-TW')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium
                                transition-all duration-200 whitespace-nowrap ${
                                    isDark
                                        ? 'text-gray-300 hover:text-gray-200 hover:bg-gray-700/70'
                                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/70'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {t.langSwitch}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 全屏導航選單覆蓋層 */}
            <AnimatePresence>
                {isMenuOpen && !isPostPage && setSelectedTag && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed top-[5.5rem] left-0 right-0 bottom-0 z-40 backdrop-blur-2xl md:hidden ${
                            isDark ? 'bg-gray-900/50' : 'bg-gray-900/30'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                                delay: 0.05,
                            }}
                            className="h-full flex flex-col pt-6 pb-8 px-4 overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
                                {/* 導航選項列表 */}
                                <div className="flex-1 space-y-2">
                                    {navItems.map((item, index) => {
                                        const active = selectedTag === item.tag;
                                        return (
                                            <motion.button
                                                key={item.id}
                                                onClick={() => {
                                                    setSelectedTag(item.tag);
                                                    setIsMenuOpen(false);
                                                }}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{
                                                    duration: 0.3,
                                                    delay: 0.1 + index * 0.05,
                                                    ease: [0.4, 0, 0.2, 1],
                                                }}
                                                whileHover={{ x: 4 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`
                                                    w-full text-left px-4 py-4 rounded-xl
                                                    transition-all duration-200 relative
                                                    ${active
                                                        ? isDark ? 'text-gray-200 font-semibold' : 'text-gray-900 font-semibold'
                                                        : isDark ? 'text-gray-400 bg-gray-800/30 hover:text-gray-300 hover:bg-gray-700/50' : 'text-gray-600 bg-gray-50/30 hover:text-gray-800 hover:bg-gray-100/50'
                                                    }
                                                `}
                                            >
                                                {active && (
                                                    <motion.div
                                                        className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                                                            isDark ? 'bg-gray-400' : 'bg-gray-700'
                                                        }`}
                                                        layoutId="activeMobileNavIndicator"
                                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                                    />
                                                )}
                                                <span className="relative z-10 text-base font-medium">
                                                    {item.label}
                                                </span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 全屏搜尋覆蓋層 */}
            <AnimatePresence>
                {isSearchOpen && setSearchQuery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`fixed top-[5.5rem] left-0 right-0 bottom-0 z-40 backdrop-blur-2xl md:hidden ${
                            isDark ? 'bg-gray-900/50' : 'bg-gray-900/30'
                        }`}
                        onClick={() => setIsSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ y: -30, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -30, opacity: 0, scale: 0.95 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 28,
                                mass: 0.8,
                                delay: 0.05,
                            }}
                            style={{
                                willChange: 'transform, opacity',
                            }}
                            className="pt-6 px-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative max-w-2xl mx-auto">
                                <motion.div
                                    layout
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25,
                                        delay: 0.1,
                                    }}
                                    className={`relative flex items-center gap-3 px-4 py-4 rounded-2xl backdrop-blur-xl shadow-2xl ${
                                        isDark
                                            ? 'bg-gray-800/90 border border-gray-700/60'
                                            : 'bg-white/90 border border-gray-300/60'
                                    }`}
                                >
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 25,
                                            delay: 0.15,
                                        }}
                                    >
                                        <MagnifyingGlassIcon className={`w-5 h-5 flex-shrink-0 ${
                                            isDark ? 'text-gray-400' : 'text-gray-500'
                                        }`} />
                                    </motion.div>
                                    <input
                                        type="text"
                                        placeholder={t.searchPlaceholder}
                                        value={searchQuery ?? ''}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                        className={`flex-1 bg-transparent border-0 focus:outline-none text-base ${
                                            isDark
                                                ? 'text-gray-200 placeholder-gray-500'
                                                : 'text-gray-900 placeholder-gray-400'
                                        }`}
                                    />
                                    <AnimatePresence>
                                        {searchQuery && searchQuery.length > 0 && (
                                            <motion.button
                                                initial={{ opacity: 0, scale: 0.8, x: -4 }}
                                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.8, x: -4 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 25,
                                                }}
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setIsSearchOpen(false);
                                                }}
                                                className={`p-1.5 rounded-lg transition-all ${
                                                    isDark
                                                        ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/70'
                                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/70'
                                                }`}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <XMarkIcon className="w-5 h-5" />
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                    <motion.button
                                        onClick={() => setIsSearchOpen(false)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            isDark
                                                ? 'text-gray-300 hover:text-gray-200 hover:bg-gray-700/70'
                                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/70'
                                        }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {lang === 'zh-TW' ? '取消' : 'Cancel'}
                                    </motion.button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
