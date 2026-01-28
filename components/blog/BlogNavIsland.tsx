'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Lang } from '@/types';
import { useTheme } from '@/app/blog/ThemeProvider';
import { LogoIcon } from '@/components/LogoIcon';

interface BlogNavIslandProps {
    lang: Lang;
    selectedTag?: string | null;
    setSelectedTag?: (tag: string | null) => void;
}

export function BlogNavIsland({ lang, selectedTag, setSelectedTag }: BlogNavIslandProps) {
    const [isHovered, setIsHovered] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // 判斷是否在文章詳情頁面（路徑格式：/blog/[slug]）
    const isPostPage = pathname?.startsWith('/blog/') && pathname !== '/blog';

    // 在文章詳情頁面時，導覽列保持收縮狀態，但懸停時展開
    // 在列表頁面時，始終展開
    const shouldExpand = !isPostPage && !!setSelectedTag ? true : (isPostPage && isHovered);

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
        <motion.div
            className="fixed top-0 left-0 z-50 pointer-events-auto"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className={`relative overflow-hidden mt-4 ml-4 rounded-3xl backdrop-blur-2xl shadow-2xl transition-colors duration-300 ${
                    isDark
                        ? 'bg-gray-900/95 border border-gray-700/60'
                        : 'bg-white/90 border border-gray-300/60'
                }`}
                animate={{
                    borderRadius: shouldExpand ? '1.5rem' : '9999px',
                    width: shouldExpand ? 'auto' : '2.875rem',
                    height: shouldExpand ? 'auto' : '2.875rem',
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 40,
                    mass: 0.5
                }}
            >
                <div className={`flex items-center h-full ${shouldExpand ? 'gap-2 px-4 py-2.5' : 'px-2.5'}`}>
                    {/* LOGO + Sun - 一體的可點擊區域 */}
                    <Link
                        href="/blog"
                        className={`flex items-center ${shouldExpand ? 'gap-2' : 'gap-0'}
                        transition-all duration-200 group flex-shrink-0 ${
                            isDark
                                ? 'text-gray-200 hover:text-gray-300'
                                : 'text-gray-900 hover:text-gray-700'
                        }`}
                    >
                        {/* LOGO 圖標 */}
                        <div className="flex items-center justify-center
                        transition-all duration-200 flex-shrink-0">
                            <LogoIcon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                        </div>

                        {/* Sun 文字 - 展開時顯示 */}
                        {shouldExpand && (
                            <span className="text-sm font-semibold whitespace-nowrap">
                                Sun
                            </span>
                        )}
                    </Link>

                    {/* 分隔線和導航項目 - 只在展開時顯示 */}
                    {shouldExpand && (
                        <>
                            <div className={`w-px h-6 ${isDark ? 'bg-gray-600/50' : 'bg-gray-400/50'}`} />

                            {/* 導航項目 */}
                            <div className="flex items-center gap-2">
                                {/* 導航按鈕 */}
                                {navItems.map((item) => {
                                    const active = selectedTag === item.tag;
                                    const handleClick = () => {
                                        if (setSelectedTag) {
                                            setSelectedTag(item.tag);
                                        } else {
                                            // 在文章詳情頁面，點擊後跳轉到列表頁
                                            router.push('/blog');
                                        }
                                    };
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={handleClick}
                                            className={`
                                                relative px-3 py-1.5 rounded-xl text-xs font-medium
                                                transition-all duration-200 whitespace-nowrap
                                                ${active
                                                    ? isDark ? 'text-gray-200 font-semibold' : 'text-gray-900 font-semibold'
                                                    : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
                                                }
                                            `}
                                        >
                                            {active && (
                                                <motion.div
                                                    className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                                                        isDark ? 'bg-gray-400' : 'bg-gray-700'
                                                    }`}
                                                    layoutId="activeNavItem"
                                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                                />
                                            )}
                                            <span className="relative z-10">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}


