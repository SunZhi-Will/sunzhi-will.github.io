'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lang } from '@/types';
import { useTheme } from '@/app/blog/ThemeProvider';

interface ProfileCardProps {
    lang: Lang;
}

export function ProfileCard({ lang }: ProfileCardProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const isDark = theme === 'dark';

    useEffect(() => {
        setMounted(true);
    }, []);

    // 在首次渲染時（服務器和客戶端 hydration）使用固定的 theme 值，避免 hydration 不匹配
    const safeIsDark = mounted ? isDark : true; // 預設使用 dark theme

    return (
        <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={mounted ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={mounted ? { duration: 0.5, delay: 0.2 } : { duration: 0 }}
            className="hidden md:block w-64 lg:w-72 flex-shrink-0"
            suppressHydrationWarning
        >
            <div className="px-6 pt-[5.5rem] md:pt-24 pb-6">
                {/* 個人資料卡片 */}
                <div
                    className={`relative backdrop-blur-xl rounded-2xl p-6 ${safeIsDark
                        ? 'bg-gray-800/80 border border-gray-700/60'
                        : 'bg-white/80 border border-gray-300/60'
                        }`}
                >
                    {/* 個人資訊 - 可點擊連結到首頁 */}
                    <Link
                        href="/"
                        className="block group/profile transition-all duration-300 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <div className="flex flex-col items-center text-center mb-6">
                            {/* 個人照片 */}
                            <div className="relative mb-4">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-400/50 to-gray-500/50 blur-md opacity-0 group-hover/profile:opacity-100 transition-opacity duration-300"></div>
                                <Image
                                    src="/profile.jpg"
                                    alt={lang === 'zh-TW' ? '謝上智' : 'Sun Zhi'}
                                    width={80}
                                    height={80}
                                    className="relative rounded-full border-2 border-gray-400/50 shadow-lg group-hover/profile:border-gray-500/70 transition-all duration-300 group-hover/profile:scale-105"
                                    priority
                                />
                            </div>

                            {/* 姓名和職稱 */}
                            <h1 className={`text-lg font-semibold mb-1.5 bg-clip-text text-transparent transition-all duration-300 ${safeIsDark
                                ? 'text-gray-200 bg-gradient-to-r from-gray-200 to-gray-400 group-hover/profile:from-gray-100 group-hover/profile:to-gray-300'
                                : 'text-gray-900 bg-gradient-to-r from-gray-800 to-gray-600 group-hover/profile:from-gray-700 group-hover/profile:to-gray-500'
                                }`}>
                                {lang === 'zh-TW' ? '謝上智' : 'Sun Zhi'}
                            </h1>
                            <p className={`text-sm font-light leading-relaxed transition-colors duration-300 ${safeIsDark
                                ? 'text-gray-400 group-hover/profile:text-gray-300'
                                : 'text-gray-600 group-hover/profile:text-gray-700'
                                }`}>
                                {lang === 'zh-TW' ? '軟體工程師 | AI 開發者' : 'Software Engineer | AI Developer'}
                            </p>
                        </div>
                    </Link>

                    {/* 社交媒體連結 */}
                    <div className="flex justify-center gap-3 mb-6">
                        <a
                            href="https://github.com/SunZhi-Will"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            className={`group w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer ${safeIsDark
                                ? 'bg-gray-700/70 hover:bg-gray-600/80 text-gray-300 hover:text-gray-200 border border-gray-600/60 hover:border-gray-500/70 hover:shadow-gray-600/30'
                                : 'bg-gray-200/70 hover:bg-gray-300/80 text-gray-700 hover:text-gray-900 border border-gray-300/60 hover:border-gray-400/70 hover:shadow-gray-400/30'
                                }`}
                            aria-label="GitHub"
                        >
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                        <a
                            href="https://www.linkedin.com/in/sunzhi-will"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            className={`group w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer ${safeIsDark
                                ? 'bg-gray-700/70 hover:bg-gray-600/80 text-gray-300 hover:text-gray-200 border border-gray-600/60 hover:border-gray-500/70 hover:shadow-gray-600/30'
                                : 'bg-gray-200/70 hover:bg-gray-300/80 text-gray-700 hover:text-gray-900 border border-gray-300/60 hover:border-gray-400/70 hover:shadow-gray-400/30'
                                }`}
                            aria-label="LinkedIn"
                        >
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                        <a
                            href="mailto:sun055676@gmail.com"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            className={`group w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer ${safeIsDark
                                ? 'bg-gray-700/70 hover:bg-gray-600/80 text-gray-300 hover:text-gray-200 border border-gray-600/60 hover:border-gray-500/70 hover:shadow-gray-600/30'
                                : 'bg-gray-200/70 hover:bg-gray-300/80 text-gray-700 hover:text-gray-900 border border-gray-300/60 hover:border-gray-400/70 hover:shadow-gray-400/30'
                                }`}
                            aria-label="Email"
                        >
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </a>
                        <a
                            href="https://www.instagram.com/bing_sunzhi"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            className={`group w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer ${safeIsDark
                                ? 'bg-gray-700/70 hover:bg-gray-600/80 text-gray-300 hover:text-gray-200 border border-gray-600/60 hover:border-gray-500/70 hover:shadow-gray-600/30'
                                : 'bg-gray-200/70 hover:bg-gray-300/80 text-gray-700 hover:text-gray-900 border border-gray-300/60 hover:border-gray-400/70 hover:shadow-gray-400/30'
                                }`}
                            aria-label="Instagram"
                        >
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                    </div>

                    {/* 分隔線 */}
                    <div className={`h-px bg-gradient-to-r from-transparent to-transparent mb-6 ${safeIsDark ? 'via-gray-600/50' : 'via-gray-400/50'
                        }`}></div>

                    {/* 頁尾 */}
                    <div className={`text-xs text-center font-light ${safeIsDark ? 'text-gray-500' : 'text-gray-600'
                        }`} suppressHydrationWarning>
                        © {new Date().getFullYear()} Sun
                    </div>
                </div>
            </div>
        </motion.aside>
    );
}
