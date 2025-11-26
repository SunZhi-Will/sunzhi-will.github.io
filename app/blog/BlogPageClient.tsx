'use client'

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { BlogPost } from '@/types/blog';
import { Lang } from '@/types';
import { blogTranslations } from '@/lib/blog-translations';
import { BlogSidebar } from '@/components/blog/BlogSidebar';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogSearchIsland } from '@/components/blog/BlogSearchIsland';

interface BlogPageClientProps {
    posts: BlogPost[];
    tags: string[];
}

export default function BlogPageClient({ posts, tags: _tags }: BlogPageClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [lang, setLang] = useState<Lang>('zh-TW');

    const t = blogTranslations[lang];

    // 偵測瀏覽器語言
    useEffect(() => {
        const browserLang = navigator.language;
        setLang(browserLang.includes('zh') ? 'zh-TW' : 'en');
    }, []);

    // 根據搜尋過濾文章
    const filteredPosts = useMemo(() => {
        if (!searchQuery.trim()) {
            return posts;
        }

        const query = searchQuery.toLowerCase();
        return posts.filter((post) =>
            post.title.toLowerCase().includes(query) ||
            post.description.toLowerCase().includes(query) ||
            post.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }, [posts, searchQuery]);

    return (
        <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-hidden">
            <div className="flex h-full">
                {/* 左側邊欄 */}
                <BlogSidebar lang={lang} />

                {/* 右側主要內容區域 */}
                <main className="flex-1 overflow-y-auto h-screen relative">
                    {/* 動態懸浮島 - 搜尋和語言切換 */}
                    <BlogSearchIsland
                        lang={lang}
                        setLang={setLang}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />

                    <div className="max-w-5xl mx-auto px-6 py-6 lg:py-8" style={{ paddingTop: '5.5rem' }}>
                        {/* 文章列表 */}
                        {filteredPosts.length > 0 ? (
                            <div className="space-y-4">
                                {filteredPosts.map((post, index) => (
                                    <BlogCard key={post.slug} post={post} lang={lang} index={index} />
                                ))}
                            </div>
                        ) : searchQuery ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-24 text-center"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-4">
                                    <MagnifyingGlassIcon className="w-8 h-8 text-slate-400" />
                                </div>
                                <p className="text-slate-300 text-lg font-medium mb-2">{t.noResults}</p>
                                <p className="text-sm text-slate-500">{t.noResultsDesc}</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-24 text-center"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-4">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-slate-300 text-lg font-medium mb-2">{t.noPosts}</p>
                                <p className="text-sm text-slate-500">{t.noPostsDesc}</p>
                            </motion.div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
