'use client'

import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/blog-utils';
import type { BlogPost } from '@/types/blog';
import { Lang } from '@/types';
import { blogTranslations, filterTagsByLanguage } from '@/lib/blog-translations';
import { useTheme } from '@/app/blog/ThemeProvider';

interface BlogPostSidebarProps {
    lang: Lang;
    setLang: (lang: Lang) => void;
    post: Omit<BlogPost, 'content'>;
    readingTime: number;
}

export function BlogPostSidebar({ lang, setLang, post, readingTime }: BlogPostSidebarProps) {
    const t = blogTranslations[lang];
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <aside className={`w-56 lg:w-64 border-r backdrop-blur-sm flex flex-col overflow-y-auto scrollbar-hide relative transition-colors duration-300 ${
            isDark
                ? 'border-gray-700/50 bg-gradient-to-b from-gray-800/80 via-gray-900/60 to-gray-800/80'
                : 'border-gray-300/50 bg-gradient-to-b from-white/80 via-gray-50/60 to-white/80'
        }`}>
            {/* 背景裝飾 */}
            <div className={`absolute inset-0 bg-gradient-to-br via-transparent pointer-events-none ${
                isDark
                    ? 'from-gray-600/5 to-gray-500/5'
                    : 'from-gray-300/5 to-gray-400/5'
            }`}></div>
            
            <div className="relative z-10 flex flex-col h-full">
                {/* 個人資訊區域 */}
                <div className={`p-5 border-b backdrop-blur-sm ${
                    isDark
                        ? 'border-gray-700/50 bg-gradient-to-br from-gray-800/30 to-gray-900/30'
                        : 'border-gray-300/50 bg-gradient-to-br from-gray-200/30 to-gray-100/30'
                }`}>
                    {/* 個人資訊 - 左右排列 */}
                    <div className="flex items-center gap-3 mb-4">
                        {/* 個人照片 */}
                        <div className="relative group flex-shrink-0">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-400/50 to-gray-500/50 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <Image
                                src="/profile.jpg"
                                alt={lang === 'zh-TW' ? '謝上智' : 'Sun Zhi'}
                                width={52}
                                height={52}
                                className="relative rounded-full border-2 border-gray-400/50 shadow-lg group-hover:border-gray-500/70 transition-all duration-300 group-hover:scale-105"
                                priority
                            />
                        </div>

                        {/* 姓名和職稱 */}
                        <div className="flex-1 min-w-0">
                            <h1 className={`text-sm font-semibold mb-0.5 truncate bg-clip-text text-transparent ${
                                isDark
                                    ? 'text-gray-200 bg-gradient-to-r from-gray-200 to-gray-400'
                                    : 'text-gray-900 bg-gradient-to-r from-gray-800 to-gray-600'
                            }`}>
                                {lang === 'zh-TW' ? '謝上智' : 'Sun Zhi'}
                            </h1>
                            <p className={`text-xs line-clamp-2 font-light ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                {lang === 'zh-TW' ? '軟體工程師 | AI 開發者' : 'Software Engineer | AI Developer'}
                            </p>
                        </div>
                    </div>

                    {/* 社交媒體連結 */}
                    <div className="flex gap-2">
                        <a
                            href="https://github.com/SunZhi-Will"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                                isDark
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
                            className={`group w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                                isDark
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
                            className={`group w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                                isDark
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
                            className={`group w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                                isDark
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
                </div>

                {/* 文章元資訊 */}
                <div className={`p-5 border-b backdrop-blur-sm ${
                    isDark
                        ? 'border-gray-700/50 bg-gradient-to-br from-gray-800/20 to-gray-900/20'
                        : 'border-gray-300/50 bg-gradient-to-br from-gray-200/20 to-gray-100/20'
                }`}>
                    {/* 全部文章按鈕 */}
                    <div className="mb-5">
                        <Link
                            href="/blog"
                            className={`group block px-3 py-2 text-xs text-left transition-all duration-300 rounded-lg border font-medium hover:scale-[1.02] hover:shadow-lg ${
                                isDark
                                    ? 'text-gray-200 bg-gradient-to-r from-gray-700/50 via-gray-600/50 to-gray-500/50 border-gray-600/60 hover:from-gray-600/60 hover:via-gray-500/60 hover:to-gray-400/60 hover:border-gray-500/70 hover:shadow-gray-600/20'
                                    : 'text-gray-900 bg-gradient-to-r from-gray-300/50 via-gray-400/50 to-gray-500/50 border-gray-400/60 hover:from-gray-400/60 hover:via-gray-500/60 hover:to-gray-600/60 hover:border-gray-500/70 hover:shadow-gray-400/20'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                {t.allPosts}
                            </span>
                        </Link>
                    </div>

                    <div className="flex flex-col gap-4 text-xs">
                        <div className="space-y-1">
                            <div className={`text-xs uppercase tracking-wider mb-1.5 font-medium ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                {t.published}
                            </div>
                            <time className={`font-light ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>{formatDate(post.date)}</time>
                        </div>
                        <div className="space-y-1">
                            <div className={`text-xs uppercase tracking-wider mb-1.5 font-medium ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                {t.readTime}
                            </div>
                            <div className={`font-light ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                                {readingTime} {lang === 'zh-TW' ? '分鐘' : 'min'}
                            </div>
                        </div>
                        {(() => {
                            const filteredTags = filterTagsByLanguage(post.tags, lang);
                            return filteredTags.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <div className="text-xs text-gray-600 uppercase tracking-wider font-medium">
                                        {t.tags}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {filteredTags.map((tag) => (
                                            <span
                                                key={tag}
                                                className={`px-2.5 py-1 text-xs uppercase tracking-wider border rounded-md
                                                         transition-all duration-300 hover:scale-105 ${
                                    isDark
                                        ? 'text-gray-300 bg-gradient-to-br from-gray-700/70 to-gray-600/70 border-gray-600/60 hover:border-gray-500/70 hover:bg-gradient-to-br hover:from-gray-600/80 hover:to-gray-500/80'
                                        : 'text-gray-800 bg-gradient-to-br from-gray-200/70 to-gray-300/70 border-gray-300/60 hover:border-gray-500/70 hover:bg-gradient-to-br hover:from-gray-300/80 hover:to-gray-400/80'
                                }`}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>

                {/* 返回個人頁、語言切換和頁尾 */}
                <div className={`mt-auto p-5 border-t backdrop-blur-sm ${
                    isDark
                        ? 'border-gray-700/50 bg-gradient-to-br from-gray-800/20 to-gray-900/20'
                        : 'border-gray-300/50 bg-gradient-to-br from-gray-200/20 to-gray-100/20'
                }`}>
                    {/* 返回個人頁按鈕 */}
                    <Link
                        href="/"
                        className={`group block w-full px-3 py-2 text-xs transition-all duration-300 rounded-lg text-left mb-3 hover:scale-[1.02] hover:shadow-md ${
                            isDark
                                ? 'text-gray-300 hover:text-gray-200 bg-gray-700/50 hover:bg-gray-600/70 border border-gray-600/60 hover:border-gray-500/70'
                                : 'text-gray-700 hover:text-gray-900 bg-gray-200/50 hover:bg-gray-300/70 border border-gray-300/60 hover:border-gray-400/70'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            {t.home}
                        </span>
                    </Link>
                    
                    <button
                        onClick={() => setLang(lang === 'zh-TW' ? 'en' : 'zh-TW')}
                        className={`group w-full px-3 py-2 text-xs transition-all duration-300 rounded-lg text-left mb-4 hover:scale-[1.02] hover:shadow-md ${
                            isDark
                                ? 'text-gray-300 hover:text-gray-200 bg-gray-700/50 hover:bg-gray-600/70 border border-gray-600/60 hover:border-gray-500/70'
                                : 'text-gray-700 hover:text-gray-900 bg-gray-200/50 hover:bg-gray-300/70 border border-gray-300/60 hover:border-gray-400/70'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                            {t.langSwitch}
                        </span>
                    </button>
                    <div className={`text-xs text-center font-light ${
                        isDark ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                        © {new Date().getFullYear()} Sun
                    </div>
                </div>
            </div>
        </aside>
    );
}
