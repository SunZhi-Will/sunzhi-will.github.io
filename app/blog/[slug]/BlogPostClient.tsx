'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/types/blog';
import { Lang } from '@/types';
import { blogTranslations } from '@/lib/blog-translations';
import { BlogNavIsland } from '@/components/blog/BlogNavIsland';
import { formatDate } from '@/lib/blog-utils';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { CommentSection } from '@/components/blog/CommentSection';

interface BlogPostClientProps {
    post: Omit<BlogPost, 'content'>;
    htmlContent: string;
    allPosts: BlogPost[];
}

export default function BlogPostClient({ post, htmlContent, allPosts }: BlogPostClientProps) {
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
        <div className="h-screen bg-slate-950 text-slate-100 overflow-hidden">
            {/* 左側導航動態島 - 在文章詳情頁面會自動隱藏 */}
            <BlogNavIsland lang={lang} />

            {/* 主要內容區域 - 全寬 */}
            <main className="overflow-y-auto h-full scrollbar-custom">
                <article className="relative">
                        {/* 文章內容 - 統一的內容區域 */}
                        <div className="max-w-3xl mx-auto px-6 md:px-8 lg:px-12 py-16 md:py-20" style={{ paddingTop: '5.5rem' }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="space-y-8"
                            >
                                {/* 標題 - 直接放在內容開頭 */}
                                <header className="space-y-4">
                                    <h1 className="text-2xl md:text-3xl font-normal text-slate-100 leading-tight tracking-tight">
                                        {post.title}
                                    </h1>

                                    {/* 元資訊 - 簡潔的單行顯示 */}
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                        <time>
                                            {formatDate(post.date, lang === 'zh-TW' ? 'zh-TW' : 'en-US')}
                                        </time>
                                        {readingTime && (
                                            <>
                                                <span>·</span>
                                                <span>{readingTime} {t.readTime}</span>
                                            </>
                                        )}
                                        {post.tags.length > 0 && (
                                            <>
                                                <span>·</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {post.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="text-slate-500"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </header>

                                {/* 封面圖片 - 整合到內容流中 */}
                                {post.coverImage && (
                                    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg bg-slate-900/50">
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                )}

                                {/* 文章描述 */}
                                {post.description && (
                                    <p className="text-base text-slate-400 leading-relaxed">
                                        {post.description}
                                    </p>
                                )}

                                {/* 文章正文 */}
                                <div className="prose prose-base prose-slate max-w-none prose-invert
                                    prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-slate-100
                                    prose-h1:text-2xl prose-h1:mt-12 prose-h1:mb-4 prose-h1:font-normal
                                    prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:font-normal
                                    prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 prose-h3:font-normal
                                    prose-h4:text-base prose-h4:mt-6 prose-h4:mb-2 prose-h4:font-normal
                                    prose-p:text-slate-300 prose-p:leading-relaxed prose-p:font-normal prose-p:text-[15px] prose-p:mb-5
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
                            </motion.div>
                        </div>

                        {/* 文章底部 */}
                        <div className="max-w-3xl mx-auto px-6 md:px-8 lg:px-12 pb-16">
                            <div className="space-y-12 pt-8">
                                {/* 推薦文章 */}
                                <RelatedPosts
                                    posts={allPosts}
                                    currentSlug={post.slug}
                                    lang={lang}
                                />

                                {/* 留言區 */}
                                <CommentSection
                                    postSlug={post.slug}
                                    postTitle={post.title}
                                    lang={lang}
                                />
                            </div>
                        </div>
                </article>
            </main>
        </div>
    );
}
