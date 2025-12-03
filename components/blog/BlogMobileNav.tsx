'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { Lang } from '@/types';
import { blogTranslations } from '@/lib/blog-translations';

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
            label: lang === 'zh-TW' ? 'Sun日常' : 'Sun Daily',
        },
        {
            id: 'ai',
            tag: 'AI',
            label: lang === 'zh-TW' ? 'AI科技報' : 'AI Tech Report',
        },
        {
            id: 'blockchain',
            tag: '區塊鏈',
            label: lang === 'zh-TW' ? '區塊鏈報' : 'Blockchain Report',
        },
    ];

    return (
        <>
            {/* 主要導覽列 */}
            <motion.div
                className="fixed top-0 left-0 right-0 z-50 pointer-events-auto sm:hidden"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="mx-2 mt-2 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-slate-400/40 shadow-2xl overflow-hidden">
                    {/* 第一行：LOGO 和主要操作 */}
                    <div className="flex items-center justify-between px-4 py-3 min-h-[3.5rem]">
                        {/* LOGO */}
                        <Link
                            href="/blog"
                            className="flex items-center gap-2 text-slate-100 hover:text-white transition-colors flex-shrink-0"
                        >
                            <svg
                                className="w-6 h-6 transition-transform duration-300 hover:scale-110"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <span className="text-sm font-semibold">Sun</span>
                        </Link>

                        {/* 右側操作按鈕 */}
                        <div className="flex items-center gap-2">
                            {/* 搜尋按鈕 - 只在列表頁面顯示 */}
                            {setSearchQuery && !isPostPage && (
                                <button
                                    onClick={() => {
                                        setIsSearchOpen(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all"
                                >
                                    <MagnifyingGlassIcon className="w-5 h-5" />
                                </button>
                            )}

                            {/* 導航選單按鈕 - 只在列表頁面顯示 */}
                            {!isPostPage && setSelectedTag && (
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(!isMenuOpen);
                                        setIsSearchOpen(false);
                                    }}
                                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all"
                                >
                                    <Bars3Icon className="w-5 h-5" />
                                </button>
                            )}

                            {/* 語言切換 */}
                            <button
                                onClick={() => setLang(lang === 'zh-TW' ? 'en' : 'zh-TW')}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium
                                text-slate-300 hover:text-white hover:bg-slate-800/50
                                transition-all duration-200 whitespace-nowrap"
                            >
                                {t.langSwitch}
                            </button>
                        </div>
                    </div>

                    {/* 第二行：導航標籤 - 只在列表頁面且選單打開時顯示 */}
                    {!isPostPage && setSelectedTag && (
                        <div className="border-t border-slate-700/50 overflow-hidden">
                            <AnimatePresence>
                                {isMenuOpen && (
                                    <motion.div
                                        key="nav-menu"
                                        initial={{
                                            opacity: 0,
                                            y: -10,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -10,
                                        }}
                                        transition={{
                                            duration: 0.2,
                                            ease: [0.4, 0, 0.2, 1]
                                        }}
                                    >
                                        <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
                                            {navItems.map((item, index) => {
                                                const active = selectedTag === item.tag;
                                                return (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => {
                                                            setSelectedTag(item.tag);
                                                            setIsMenuOpen(false);
                                                        }}
                                                        className={`
                                                            relative px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0
                                                            transition-all duration-200
                                                            ${active
                                                                ? 'text-white bg-slate-700/70 shadow-lg'
                                                                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                                                            }
                                                        `}
                                                    >
                                                        {active && (
                                                            <motion.div
                                                                className="absolute inset-0 rounded-lg bg-gradient-to-r from-slate-500/50 to-gray-500/50"
                                                                layoutId="activeMobileNavItem"
                                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                                            />
                                                        )}
                                                        <span className="relative z-10">{item.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* 全屏搜尋覆蓋層 */}
            <AnimatePresence>
                {isSearchOpen && setSearchQuery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-xl sm:hidden"
                        onClick={() => setIsSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ delay: 0.1 }}
                            className="pt-20 px-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative max-w-2xl mx-auto">
                                <div className="relative flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50">
                                    <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                    <input
                                        type="text"
                                        placeholder={t.searchPlaceholder}
                                        value={searchQuery ?? ''}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                        className="flex-1 bg-transparent border-0 text-slate-100 placeholder-slate-500
                                                 focus:outline-none text-base"
                                    />
                                    {searchQuery && searchQuery.length > 0 && (
                                        <button
                                            onClick={() => {
                                                setSearchQuery('');
                                                setIsSearchOpen(false);
                                            }}
                                            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-all"
                                        >
                                            <XMarkIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setIsSearchOpen(false)}
                                        className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all"
                                    >
                                        {lang === 'zh-TW' ? '取消' : 'Cancel'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
