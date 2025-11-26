'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/types/blog';
import { Lang } from '@/types';
import { blogTranslations } from '@/lib/blog-translations';
import { BlogSidebar } from '@/components/blog/BlogSidebar';

interface BlogPostClientProps {
    post: Omit<BlogPost, 'content'>;
    htmlContent: string;
}

export default function BlogPostClient({ post, htmlContent }: BlogPostClientProps) {
    const [lang, setLang] = useState<Lang>('zh-TW');
    const t = blogTranslations[lang];

    // 估算閱讀時間
    const readingTime = Math.max(1, Math.ceil(htmlContent.length / 1500));

    // 偵測瀏覽器語言
    useEffect(() => {
        const browserLang = navigator.language;
        setLang(browserLang.includes('zh') ? 'zh-TW' : 'en');
    }, []);

    return (
        <div className="h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 relative overflow-hidden">
            {/* 背景裝飾效果 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 -right-4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/3 rounded-full blur-3xl"></div>
            </div>

            <div className="flex h-full relative z-10">
                {/* 左側邊欄 */}
                <BlogSidebar
                    lang={lang}
                    setLang={setLang}
                    post={post}
                    readingTime={readingTime}
                />

                {/* 右側主要內容區域 */}
                <main className="flex-1 overflow-y-auto scrollbar-hide">
                    <article className="relative">
                        {/* 文章頭部 */}
                        <header className="relative border-b border-slate-800/50 backdrop-blur-sm bg-gradient-to-b from-slate-900/80 to-transparent">
                            <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 lg:py-24">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                >
                                    {/* 標題 */}
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-100 mb-6 leading-tight tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 bg-clip-text text-transparent">
                                        {post.title}
                                    </h1>

                                    {/* 描述 */}
                                    {post.description && (
                                        <p className="text-lg md:text-xl lg:text-2xl text-slate-400 font-light leading-relaxed max-w-3xl">
                                            {post.description}
                                        </p>
                                    )}
                                </motion.div>
                            </div>
                        </header>

                        {/* 封面圖片 */}
                        {post.coverImage && (
                            <div className="relative border-b border-slate-800/50 overflow-hidden">
                                <div className="max-w-5xl mx-auto">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 1.05 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="aspect-[21/9] overflow-hidden relative group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent z-10"></div>
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            priority
                                        />
                                    </motion.div>
                                </div>
                            </div>
                        )}

                        {/* 文章內容 */}
                        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                                className="prose prose-lg prose-slate max-w-none prose-invert
                                    prose-headings:font-light prose-headings:tracking-tight prose-headings:text-slate-100
                                    prose-h1:text-4xl prose-h1:mt-16 prose-h1:mb-6 prose-h1:font-light
                                    prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-slate-800/50 prose-h2:font-light
                                    prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4 prose-h3:font-light
                                    prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-3 prose-h4:font-light
                                    prose-p:text-slate-300 prose-p:leading-relaxed prose-p:font-light prose-p:text-base prose-p:mb-6
                                    prose-a:text-blue-400 prose-a:no-underline prose-a:border-b prose-a:border-blue-500/50 hover:prose-a:border-blue-400 hover:prose-a:text-blue-300 prose-a:transition-all prose-a:font-medium
                                    prose-strong:text-slate-100 prose-strong:font-semibold
                                    prose-code:text-blue-300 prose-code:bg-slate-800/80 prose-code:px-2 prose-code:py-1 prose-code:text-sm prose-code:font-mono prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-code:border prose-code:border-slate-700/50
                                    prose-pre:bg-slate-900/80 prose-pre:border prose-pre:border-slate-800/50 prose-pre:rounded-xl prose-pre:shadow-xl prose-pre:backdrop-blur-sm prose-pre:overflow-x-auto
                                    prose-pre code:bg-transparent prose-pre code:px-0 prose-pre code:py-0 prose-pre code:border-0
                                    prose-blockquote:border-l-4 prose-blockquote:border-blue-500/50 prose-blockquote:bg-slate-800/30 prose-blockquote:py-4 prose-blockquote:pl-6 prose-blockquote:pr-6 prose-blockquote:rounded-r-lg prose-blockquote:text-slate-300 prose-blockquote:font-light prose-blockquote:not-italic prose-blockquote:my-8
                                    prose-ul:text-slate-300 prose-ol:text-slate-300 prose-ul:my-6 prose-ol:my-6
                                    prose-li:marker:text-slate-500 prose-li:my-2 prose-li:leading-relaxed
                                    prose-img:rounded-xl prose-img:border prose-img:border-slate-800/50 prose-img:shadow-xl prose-img:my-8
                                    prose-hr:border-slate-800/50 prose-hr:my-12
                                    prose-table:text-slate-300 prose-th:border prose-th:border-slate-800/50 prose-th:bg-slate-800/30 prose-th:px-4 prose-th:py-2
                                    prose-td:border prose-td:border-slate-800/50 prose-td:px-4 prose-td:py-2"
                                dangerouslySetInnerHTML={{ __html: htmlContent }}
                            />
                        </div>

                        {/* 文章底部 */}
                        <footer className="border-t border-slate-800/50 backdrop-blur-sm bg-gradient-to-b from-transparent to-slate-900/50">
                            <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                >
                                    {/* 返回連結 */}
                                    <Link
                                        href="/blog"
                                        className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-slate-100 
                                                 bg-gradient-to-r from-slate-800/50 to-slate-700/50 hover:from-slate-700/70 hover:to-slate-600/70
                                                 border border-slate-700/50 hover:border-slate-600/70 rounded-lg
                                                 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10
                                                 backdrop-blur-sm"
                                    >
                                        <svg
                                            className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                        </svg>
                                        <span>{t.moreArticles}</span>
                                    </Link>
                                </motion.div>
                            </div>
                        </footer>
                    </article>
                </main>
            </div>
        </div>
    );
}
