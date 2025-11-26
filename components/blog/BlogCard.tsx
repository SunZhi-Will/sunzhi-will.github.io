'use client'

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/blog-utils';
import type { BlogPost } from '@/types/blog';
import { Lang } from '@/types';
import { blogTranslations } from '@/lib/blog-translations';

interface BlogCardProps {
    post: BlogPost;
    lang: Lang;
    index: number;
}

export function BlogCard({ post, lang, index }: BlogCardProps) {
    const t = blogTranslations[lang];

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
            className="group h-full"
        >
            <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 
                              border border-slate-700/50 backdrop-blur-sm
                              hover:border-slate-600/70 hover:shadow-xl hover:shadow-blue-500/10
                              transition-all duration-300 hover:-translate-y-0.5">
                    {/* 背景光暈效果 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-indigo-500/0 to-purple-500/0 
                                  group-hover:from-blue-500/5 group-hover:via-indigo-500/5 group-hover:to-purple-500/5
                                  transition-all duration-500 opacity-0 group-hover:opacity-100" />

                    <div className="relative p-4 md:p-6 flex flex-row gap-4 md:gap-6 items-center">
                        {/* 封面圖片 - 總是顯示 */}
                        <div className="relative w-32 md:w-48 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-slate-800/80 via-slate-700/60 to-slate-800/80 border border-slate-700/30 self-center">
                            <div className="aspect-[16/9] relative overflow-hidden">
                                {post.coverImage ? (
                                    <Image
                                        src={post.coverImage}
                                        alt={post.title}
                                        fill
                                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 128px, 192px"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800">
                                        <svg className="w-8 h-8 md:w-10 md:h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                )}
                                {/* 圖片遮罩效果 */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent 
                                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </div>

                        {/* 內容區域 */}
                        <div className="flex flex-col flex-1 min-w-0 space-y-3">
                            {/* 日期和標籤 */}
                            <div className="flex items-center flex-wrap gap-2 text-xs text-slate-400 flex-shrink-0">
                                <time className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {formatDate(post.date)}
                                </time>
                                {post.tags.length > 0 && (
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                                        {post.tags.slice(0, 2).map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-0.5 rounded-full bg-slate-800/50 text-slate-300 
                                                         border border-slate-700/50 text-xs
                                                         group-hover:bg-slate-700/50 group-hover:border-slate-600/50
                                                         transition-colors duration-200"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 標題 */}
                            <h2 className="text-xl md:text-2xl font-bold text-slate-100 
                                         group-hover:text-transparent group-hover:bg-clip-text 
                                         group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-indigo-400 group-hover:to-purple-400
                                         transition-all duration-300 leading-tight line-clamp-2 flex-shrink-0">
                                {post.title}
                            </h2>

                            {/* 描述 */}
                            <p className="text-slate-300 text-base leading-relaxed line-clamp-2 flex-1">
                                {post.description}
                            </p>

                            {/* 閱讀更多 */}
                            <div className="flex items-center pt-1 flex-shrink-0">
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium 
                                              text-blue-400 group-hover:text-blue-300 
                                              transition-colors duration-200">
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

