'use client'

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/blog-utils';
import type { BlogPost } from '@/types/blog';
import { Lang } from '@/types';

interface RelatedPostsProps {
    posts: BlogPost[];
    currentSlug: string;
    lang: Lang;
}

export function RelatedPosts({ posts, currentSlug, lang }: RelatedPostsProps) {
    // 找到當前文章
    const currentPost = posts.find(post => post.slug === currentSlug);

    // 根據標籤相似度推薦文章
    const relatedPosts = posts
        .filter(post => post.slug !== currentSlug)
        .map(post => {
            // 計算標籤相似度
            const commonTags = currentPost?.tags.filter(tag => post.tags.includes(tag)).length || 0;
            return { post, score: commonTags };
        })
        .sort((a, b) => {
            // 先按標籤相似度排序，再按日期排序
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
        })
        .slice(0, 3)
        .map(item => item.post);

    if (relatedPosts.length === 0) {
        return null;
    }

    return (
        <section>
            <h2 className="text-lg font-normal text-slate-100 mb-6">
                {lang === 'zh-TW' ? '推薦閱讀' : 'Related Articles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((post, index) => (
                    <motion.article
                        key={post.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                        className="group flex flex-col"
                    >
                        <Link href={`/blog/${post.slug}`} className="flex-1 flex flex-col">
                            <div className="relative overflow-hidden rounded-lg bg-slate-900/30 
                                          hover:bg-slate-900/50 transition-all duration-300 flex flex-col h-full">
                                {/* 封面圖片 */}
                                <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-800/50 flex-shrink-0">
                                    {post.coverImage ? (
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800">
                                            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* 內容 */}
                                <div className="p-4 flex flex-col flex-1">
                                    {/* 日期 */}
                                    <time className="text-xs text-slate-400 mb-2 block flex-shrink-0">
                                        {formatDate(post.date, lang === 'zh-TW' ? 'zh-TW' : 'en-US')}
                                    </time>

                                    {/* 標題 */}
                                    <h3 className="text-base font-normal text-slate-100 mb-2 line-clamp-2 
                                                 group-hover:text-blue-400 transition-colors flex-shrink-0">
                                        {post.title}
                                    </h3>

                                    {/* 描述 */}
                                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed flex-1">
                                        {post.description}
                                    </p>

                                    {/* 標籤 */}
                                    {post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-3 flex-shrink-0">
                                            {post.tags.slice(0, 2).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-0.5 text-xs text-slate-500 bg-slate-800/50 border border-slate-700/50 rounded"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}

