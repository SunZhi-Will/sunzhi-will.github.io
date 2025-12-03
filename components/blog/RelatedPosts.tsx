'use client'

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/blog-utils';
import type { BlogPost } from '@/types/blog';
import { Lang } from '@/types';
import { filterTagsByLanguage } from '@/lib/blog-translations';
import { useTheme } from '@/app/blog/ThemeProvider';

interface RelatedPostsProps {
    posts: BlogPost[];
    currentSlug: string;
    lang: Lang;
}

export function RelatedPosts({ posts, currentSlug, lang }: RelatedPostsProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
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
            <h2 className={`text-lg font-normal mb-6 ${
                isDark ? 'text-gray-200' : 'text-gray-900'
            }`}>
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
                            <div className={`relative overflow-hidden rounded-lg transition-all duration-300 flex flex-col h-full border ${
                                isDark
                                    ? 'bg-gray-800/80 hover:bg-gray-800/90 border-gray-700/60'
                                    : 'bg-white/80 hover:bg-white/90 border-gray-300/60'
                            }`}>
                                {/* 封面圖片 */}
                                <div className={`relative w-full aspect-[16/9] overflow-hidden flex-shrink-0 ${
                                    isDark ? 'bg-gray-700/50' : 'bg-gray-200/50'
                                }`}>
                                    {post.coverImage ? (
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    ) : (
                                        <div className={`w-full h-full flex items-center justify-center ${
                                            isDark
                                                ? 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-700'
                                                : 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200'
                                        }`}>
                                            <svg className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* 內容 */}
                                <div className="p-4 flex flex-col flex-1">
                                    {/* 日期 */}
                                    <time className={`text-xs mb-2 block flex-shrink-0 ${
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                        {formatDate(post.date, lang === 'zh-TW' ? 'zh-TW' : 'en-US')}
                                    </time>

                                    {/* 標題 */}
                                    <h3 className={`text-base font-normal mb-2 line-clamp-2 transition-colors flex-shrink-0 ${
                                        isDark
                                            ? 'text-gray-200 group-hover:text-gray-300'
                                            : 'text-gray-900 group-hover:text-gray-700'
                                    }`}>
                                        {post.title}
                                    </h3>

                                    {/* 描述 */}
                                    <p className={`text-sm line-clamp-2 leading-relaxed flex-1 ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        {post.description}
                                    </p>

                                    {/* 標籤 */}
                                    {(() => {
                                        const filteredTags = filterTagsByLanguage(post.tags, lang);
                                        return filteredTags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-3 flex-shrink-0">
                                                {filteredTags.slice(0, 2).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className={`px-2 py-0.5 text-xs rounded ${
                                                            isDark
                                                                ? 'text-gray-300 bg-gray-700/70 border border-gray-600/60'
                                                                : 'text-gray-700 bg-gray-200/70 border border-gray-300/60'
                                                        }`}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </Link>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}

