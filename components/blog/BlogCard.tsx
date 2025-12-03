'use client'

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/blog-utils';
import type { BlogPost } from '@/types/blog';
import { Lang } from '@/types';
import { blogTranslations, filterTagsByLanguage } from '@/lib/blog-translations';
import { useTheme } from '@/app/blog/ThemeProvider';

interface BlogCardProps {
    post: BlogPost;
    lang: Lang;
    index: number;
}

export function BlogCard({ post, lang, index }: BlogCardProps) {
    const t = blogTranslations[lang];
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
            className="group h-full"
        >
            <Link href={`/blog/${post.slug}`} className="block">
                <div className={`relative overflow-hidden rounded-xl backdrop-blur-sm
                              transition-all duration-300 hover:-translate-y-0.5 ${
                    isDark
                        ? 'bg-gradient-to-br from-gray-800/90 via-gray-900/80 to-gray-800/90 border border-gray-700/60 hover:border-gray-600/70 hover:shadow-xl hover:shadow-gray-700/30'
                        : 'bg-gradient-to-br from-white/90 via-gray-50/80 to-white/90 border border-gray-300/60 hover:border-gray-400/70 hover:shadow-xl hover:shadow-gray-400/20'
                }`}>
                    {/* 背景光暈效果 */}
                    <div className={`absolute inset-0 transition-all duration-500 opacity-0 group-hover:opacity-100 ${
                        isDark
                            ? 'bg-gradient-to-r from-gray-600/0 via-gray-500/0 to-gray-600/0 group-hover:from-gray-600/15 group-hover:via-gray-500/15 group-hover:to-gray-600/15'
                            : 'bg-gradient-to-r from-gray-400/0 via-gray-500/0 to-gray-400/0 group-hover:from-gray-400/10 group-hover:via-gray-500/10 group-hover:to-gray-400/10'
                    }`} />

                    <div className="relative p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6">
                        {/* 封面圖片 - 保持 16:9 等比例 */}
                        <div className="relative w-full md:w-56 lg:w-64 flex-shrink-0">
                            <div className={`relative w-full aspect-[16/9] overflow-hidden rounded-lg border ${
                                isDark
                                    ? 'bg-gradient-to-br from-gray-700/80 via-gray-800/60 to-gray-700/80 border-gray-700/50'
                                    : 'bg-gradient-to-br from-gray-200/80 via-gray-300/60 to-gray-200/80 border-gray-300/50'
                            }`}>
                                {post.coverImage ? (
                                    <Image
                                        src={post.coverImage}
                                        alt={post.title}
                                        fill
                                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 160px, (max-width: 1024px) 224px, 256px"
                                    />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center ${
                                        isDark
                                            ? 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-700'
                                            : 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200'
                                    }`}>
                                        <svg className={`w-8 h-8 md:w-10 md:h-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                )}
                                {/* 圖片遮罩效果 */}
                                <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent 
                                              opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                                    isDark ? 'from-gray-600/30' : 'from-gray-400/20'
                                }`} />
                            </div>
                        </div>

                        {/* 內容區域 - 緊湊排列，無空白 */}
                        <div className="flex flex-col flex-1 min-w-0 space-y-3">
                            {/* 日期和標籤 */}
                            <div className={`flex items-center flex-wrap gap-2 text-xs ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                <time className="flex items-center gap-1 whitespace-nowrap">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {formatDate(post.date)}
                                </time>
                                {(() => {
                                    const filteredTags = filterTagsByLanguage(post.tags, lang);
                                    return filteredTags.length > 0 && (
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-gray-500' : 'bg-gray-500'}`}></span>
                                            {filteredTags.slice(0, 2).map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`px-2 py-0.5 rounded-full text-xs transition-colors duration-200 ${
                                                        isDark
                                                            ? 'bg-gray-700/70 text-gray-300 border border-gray-600/60 group-hover:bg-gray-600/70 group-hover:border-gray-500/60'
                                                            : 'bg-gray-200/70 text-gray-700 border border-gray-300/60 group-hover:bg-gray-300/70 group-hover:border-gray-400/60'
                                                    }`}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* 標題 */}
                            <h2 className={`text-lg md:text-xl font-bold leading-tight line-clamp-2 relative ${
                                isDark ? 'text-gray-200' : 'text-gray-900'
                            }`}>
                                <span className="block relative z-0">
                                    {post.title}
                                </span>
                                <span className={`absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-clip-text text-transparent bg-gradient-to-r ${
                                    isDark
                                        ? 'from-gray-300 via-gray-400 to-gray-300'
                                        : 'from-gray-700 via-gray-600 to-gray-700'
                                }`} style={{ willChange: 'opacity' }}>
                                    {post.title}
                                </span>
                            </h2>

                            {/* 描述 */}
                            <p className={`text-sm md:text-base leading-relaxed line-clamp-2 flex-1 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                {post.description}
                            </p>

                            {/* 閱讀更多 */}
                            <div className="flex items-center pt-1">
                                <span className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 ${
                                    isDark
                                        ? 'text-gray-400 group-hover:text-gray-300'
                                        : 'text-gray-600 group-hover:text-gray-800'
                                }`}>
                                    {t.readMore}
                                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}

