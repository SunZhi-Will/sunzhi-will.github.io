'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lang } from '@/types';
import { useTheme } from '@/app/blog/ThemeProvider';
import { LogoIcon } from '@/components/LogoIcon';


interface BlogNavIslandProps {
    lang: Lang;
    selectedTag?: string | null;
    setSelectedTag?: (tag: string | null) => void;
}

export function BlogNavIsland({ lang }: BlogNavIslandProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // 始終展開，與 /blog 列表頁保持一致
    const shouldExpand = true;

    return (
        <motion.div
            className="fixed top-0 left-0 z-50 pointer-events-auto"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <motion.div
                className={`relative overflow-hidden mt-4 ml-4 rounded-3xl backdrop-blur-2xl shadow-2xl transition-colors duration-300 ${
                    isDark
                        ? 'bg-[#1c1c1e]/95 border border-white/20'
                        : 'bg-[#f0ece4]/92 border border-stone-300/60'
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
                        <div className="flex items-center justify-center transition-all duration-200 flex-shrink-0">
                            <LogoIcon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        {shouldExpand && (
                            <span className="text-sm font-semibold whitespace-nowrap">
                                Sun
                            </span>
                        )}
                    </Link>

                    {/* 展開後顯示三個連結 */}
                    {shouldExpand && (
                        <>
                            <div className={`w-px h-6 ${isDark ? 'bg-white/10' : 'bg-gray-300'}`} />

                            <div className="flex items-center gap-1">
                                {/* 作品集 */}
                                <Link
                                    href="/"
                                    className={`
                                        flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium
                                        transition-all duration-200 whitespace-nowrap group
                                        ${isDark
                                            ? 'text-white/60 hover:text-white hover:bg-white/5'
                                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/60'
                                        }
                                    `}
                                >
                                    <svg className="w-3.5 h-3.5 flex-shrink-0 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span>{lang === 'zh-TW' ? '作品集' : 'Portfolio'}</span>
                                </Link>

                                {/* 所有連結 */}
                                <Link
                                    href="/links"
                                    className={`
                                        flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium
                                        transition-all duration-200 whitespace-nowrap group
                                        ${isDark
                                            ? 'text-white/60 hover:text-white hover:bg-white/5'
                                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/60'
                                        }
                                    `}
                                >
                                    <svg className="w-3.5 h-3.5 flex-shrink-0 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    <span>{lang === 'zh-TW' ? '所有連結' : 'Links'}</span>
                                </Link>

                                {/* Sunkoro 課程 - 琥珀色強調 */}
                                <a
                                    href="https://sunkoro.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`
                                        flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium
                                        transition-all duration-200 whitespace-nowrap group
                                        ${isDark
                                            ? 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-400/10'
                                            : 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                                        }
                                    `}
                                >
                                    <svg className="w-3.5 h-3.5 flex-shrink-0 opacity-80 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <span>Sunkoro</span>
                                </a>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
