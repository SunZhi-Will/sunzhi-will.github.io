'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon, Bars3Icon, SunIcon, MoonIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Lang } from '@/types';
import { blogTranslations } from '@/lib/blog-translations';
import { useTheme } from '@/app/blog/ThemeProvider';
import { LogoIcon } from '@/components/LogoIcon';
import { NAV_PAGES } from '@/components/PageNav';
import { useHideOnScroll } from '@/lib/use-hide-on-scroll';

interface BlogMobileNavProps {
    lang: Lang;
    setLang: (lang: Lang) => void;
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
    hasTOC?: boolean;
    onTOCClick?: () => void;
}

export function BlogMobileNav({
    lang,
    setLang: _setLang, // eslint-disable-line @typescript-eslint/no-unused-vars
    searchQuery,
    setSearchQuery,
    hasTOC = false,
    onTOCClick,
}: BlogMobileNavProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const t = blogTranslations[lang];
    // 往下閱讀時收起；選單或搜尋開著的時候不收
    const hidden = useHideOnScroll() && !isMenuOpen && !isSearchOpen;

    // 判斷是否在文章詳情頁面
    const isPostPage = pathname?.startsWith('/blog/') && pathname !== '/blog';

    return (
        <>
            {/* 主要導覽列 */}
            <motion.div
                className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: hidden ? 100 : 0, opacity: hidden ? 0 : 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className={`mx-2 rounded-2xl backdrop-blur-2xl shadow-2xl transition-colors duration-300 ${
                    isDark
                        ? 'bg-[#1c1c1e]/95 border border-white/20'
                        : 'bg-[#f0ece4]/92 border border-stone-300/60'
                }`}>
                    {/* 第一行：LOGO 和主要操作 */}
                    <div className="flex items-center justify-between px-4 py-3 min-h-[3.5rem]">
                        {/* 文章頁：明確的返回，回到所有文章 */}
                        {isPostPage && (
                            <Link
                                href="/blog"
                                aria-label={lang === 'zh-TW' ? '返回所有文章' : 'Back to all posts'}
                                className={`-ml-1 mr-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                                    isDark ? 'text-zinc-200 hover:text-yellow-400' : 'text-gray-700 hover:text-gray-900'
                                }`}
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </Link>
                        )}

                        {/* LOGO */}
                        <Link
                            href="/"
                            className={`flex items-center gap-2 transition-colors flex-shrink-0 ${
                                isDark
                                    ? 'text-gray-200 hover:text-yellow-400'
                                    : 'text-gray-900 hover:text-gray-700'
                            }`}
                        >
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <LogoIcon className="w-6 h-6" />
                            </motion.div>
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
                                            ? 'text-zinc-200 hover:text-yellow-400 hover:bg-[#27272a]/70'
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/70'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <MagnifyingGlassIcon className="w-5 h-5" />
                                </motion.button>
                            )}

                            {/* 頁面選單：前往作品集、服務費用、個人連結 */}
                            {(
                                <motion.button
                                    onClick={() => {
                                        setIsMenuOpen(!isMenuOpen);
                                        setIsSearchOpen(false);
                                    }}
                                    className={`p-2 rounded-lg transition-all relative ${
                                        isDark
                                            ? 'text-zinc-200 hover:text-yellow-400 hover:bg-[#27272a]/70'
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/70'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-expanded={isMenuOpen}
                                    aria-label={lang === 'zh-TW' ? '頁面選單' : 'Pages menu'}
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

                            {/* 目錄按鈕 - 只在文章頁面且有目錄時顯示 */}
                            {isPostPage && hasTOC && onTOCClick && (
                                <motion.button
                                    onClick={onTOCClick}
                                    className={`p-2 rounded-lg transition-all ${
                                        isDark
                                            ? 'text-zinc-200 hover:text-yellow-400 hover:bg-[#27272a]/70'
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/70'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label={lang === 'zh-TW' ? '目錄' : 'Table of Contents'}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M4 6h16M4 10h10M4 14h16M4 18h10" />
                                    </svg>
                                </motion.button>
                            )}

                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 全屏導航選單覆蓋層 */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed top-0 left-0 right-0 bottom-[4.75rem] z-40 backdrop-blur-2xl md:hidden ${
                            isDark ? 'bg-gray-900/50' : 'bg-gray-900/30'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                                delay: 0.05,
                            }}
                            className="h-full flex flex-col pt-6 pb-4 px-4 overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-end">
                                {/* 頁面列表：目前所在的部落格有黃點標示 */}
                                <div className="space-y-2">
                                    {NAV_PAGES.map((page, index) => {
                                        const active = page.id === 'blog';
                                        return (
                                            <motion.div
                                                key={page.id}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ duration: 0.3, delay: 0.1 + index * 0.05, ease: [0.4, 0, 0.2, 1] }}
                                            >
                                                <Link
                                                    href={page.href}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    aria-current={active ? 'page' : undefined}
                                                    className={`flex w-full items-center justify-between rounded-xl px-4 py-4 text-base font-medium transition-colors duration-200 ${
                                                        active
                                                            ? isDark ? 'bg-[#27272a]/60 text-yellow-400' : 'bg-white text-gray-900 shadow-sm'
                                                            : isDark ? 'bg-[#18181b]/30 text-zinc-200 hover:text-yellow-400' : 'bg-white/70 text-gray-800 hover:text-gray-900'
                                                    }`}
                                                >
                                                    {lang === 'zh-TW' ? page.zh : page.en}
                                                    {active && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-yellow-400" />}
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                    <motion.a
                                        href="https://sunkoro.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ duration: 0.3, delay: 0.1 + NAV_PAGES.length * 0.05, ease: [0.4, 0, 0.2, 1] }}
                                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-4 text-base font-medium ${
                                            isDark ? 'border-white/10 text-amber-400' : 'border-gray-300 text-amber-700'
                                        }`}
                                    >
                                        Sunkoro <span aria-hidden="true">↗</span>
                                    </motion.a>
                                    <motion.button
                                        type="button"
                                        onClick={toggleTheme}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ duration: 0.3, delay: 0.1 + (NAV_PAGES.length + 1) * 0.05, ease: [0.4, 0, 0.2, 1] }}
                                        className={`flex w-full items-center justify-between rounded-xl px-4 py-4 text-base font-medium ${
                                            isDark ? 'text-zinc-200' : 'text-gray-800'
                                        }`}
                                    >
                                        {isDark ? (lang === 'zh-TW' ? '切換為淺色主題' : 'Switch to light theme') : (lang === 'zh-TW' ? '切換為深色主題' : 'Switch to dark theme')}
                                        {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                                    </motion.button>
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
                        className={`fixed top-0 left-0 right-0 bottom-[4.75rem] z-40 backdrop-blur-2xl md:hidden ${
                            isDark ? 'bg-black/50' : 'bg-black/20'
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
                                            ? 'bg-[#1c1c1e]/95 border border-white/20'
                                            : 'bg-[#f0ece4]/92 border border-stone-300/60'
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
                                            isDark ? 'text-zinc-200' : 'text-gray-600'
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
                                                ? 'text-white placeholder-white/40'
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
                                                        ? 'text-zinc-200 hover:text-yellow-400 hover:bg-white/10'
                                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
                                                ? 'text-zinc-200 hover:text-yellow-400 hover:bg-white/8'
                                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
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
