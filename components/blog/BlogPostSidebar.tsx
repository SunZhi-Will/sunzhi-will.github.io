'use client'

import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/blog-utils';
import type { BlogPost } from '@/types/blog';
import { Lang } from '@/types';
import { blogTranslations } from '@/lib/blog-translations';

interface BlogPostSidebarProps {
    lang: Lang;
    setLang: (lang: Lang) => void;
    post: Omit<BlogPost, 'content'>;
    readingTime: number;
}

export function BlogPostSidebar({ lang, setLang, post, readingTime }: BlogPostSidebarProps) {
    const t = blogTranslations[lang];

    return (
        <aside className="w-56 lg:w-64 border-r border-slate-800/50 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/80 backdrop-blur-sm flex flex-col overflow-y-auto scrollbar-hide relative">
            {/* 背景裝飾 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col h-full">
                {/* 個人資訊區域 */}
                <div className="p-5 border-b border-slate-800/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm">
                    {/* 個人資訊 - 左右排列 */}
                    <div className="flex items-center gap-3 mb-4">
                        {/* 個人照片 */}
                        <div className="relative group flex-shrink-0">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/50 to-indigo-500/50 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <Image
                                src="/profile.jpg"
                                alt={lang === 'zh-TW' ? '謝上智' : 'Sun Zhi'}
                                width={52}
                                height={52}
                                className="relative rounded-full border-2 border-slate-700/50 shadow-lg group-hover:border-blue-500/50 transition-all duration-300 group-hover:scale-105"
                                priority
                            />
                        </div>

                        {/* 姓名和職稱 */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-sm font-semibold text-slate-100 mb-0.5 truncate bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                                {lang === 'zh-TW' ? '謝上智' : 'Sun Zhi'}
                            </h1>
                            <p className="text-xs text-slate-400 line-clamp-2 font-light">
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
                            className="group w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800/50 hover:bg-slate-700/70 text-slate-400 hover:text-slate-100 border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
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
                            className="group w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800/50 hover:bg-slate-700/70 text-slate-400 hover:text-slate-100 border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
                            aria-label="LinkedIn"
                        >
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                        <a
                            href="mailto:sun055676@gmail.com"
                            className="group w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800/50 hover:bg-slate-700/70 text-slate-400 hover:text-slate-100 border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
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
                            className="group w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800/50 hover:bg-slate-700/70 text-slate-400 hover:text-slate-100 border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
                            aria-label="Instagram"
                        >
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* 文章元資訊 */}
                <div className="p-5 border-b border-slate-800/50 bg-gradient-to-br from-slate-800/20 to-slate-900/20 backdrop-blur-sm">
                    {/* 全部文章按鈕 */}
                    <div className="mb-5">
                        <Link
                            href="/blog"
                            className="group block px-3 py-2 text-xs text-left transition-all duration-300 rounded-lg border 
                                     text-slate-100 font-medium bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 
                                     border-blue-500/30 hover:from-blue-500/30 hover:via-indigo-500/30 hover:to-purple-500/30
                                     hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02]"
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
                            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 font-medium">
                                {t.published}
                            </div>
                            <time className="text-slate-200 font-light">{formatDate(post.date)}</time>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 font-medium">
                                {t.readTime}
                            </div>
                            <div className="text-slate-200 font-light">
                                {readingTime} {lang === 'zh-TW' ? '分鐘' : 'min'}
                            </div>
                        </div>
                        {post.tags.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                                    {t.tags}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2.5 py-1 text-xs text-slate-300 bg-gradient-to-br from-slate-800/60 to-slate-700/60 
                                                     uppercase tracking-wider border border-slate-700/50 rounded-md
                                                     hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-indigo-500/20
                                                     transition-all duration-300 hover:scale-105"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 返回個人頁、語言切換和頁尾 */}
                <div className="mt-auto p-5 border-t border-slate-800/50 bg-gradient-to-br from-slate-800/20 to-slate-900/20 backdrop-blur-sm">
                    {/* 返回個人頁按鈕 */}
                    <Link
                        href="/"
                        className="group block w-full px-3 py-2 text-xs text-slate-400 hover:text-slate-100 
                                 bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/70
                                 transition-all duration-300 rounded-lg text-left mb-3 hover:scale-[1.02] hover:shadow-md"
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
                        className="group w-full px-3 py-2 text-xs text-slate-400 hover:text-slate-100 
                                 bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/70
                                 transition-all duration-300 rounded-lg text-left mb-4 hover:scale-[1.02] hover:shadow-md"
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                            {t.langSwitch}
                        </span>
                    </button>
                    <div className="text-xs text-slate-500 text-center font-light">
                        © {new Date().getFullYear()} Sun
                    </div>
                </div>
            </div>
        </aside>
    );
}
