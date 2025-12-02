'use client'

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { BlogPost } from '@/types/blog';
import { Lang } from '@/types';
import { blogTranslations } from '@/lib/blog-translations';
import { ProfileCard } from '@/components/blog/ProfileCard';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogDynamicIsland } from '@/components/blog/BlogDynamicIsland';
import { BlogNavIsland } from '@/components/blog/BlogNavIsland';

interface BlogPageClientProps {
    posts: BlogPost[];
    tags: string[];
}

export default function BlogPageClient({ posts, tags }: BlogPageClientProps) {
    void tags;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [lang, setLang] = useState<Lang>('zh-TW');

    const t = blogTranslations[lang];

    // 偵測瀏覽器語言
    useEffect(() => {
        const browserLang = navigator.language;
        setLang(browserLang.includes('zh') ? 'zh-TW' : 'en');
    }, []);

    // 標籤匹配規則
    const getMatchingTags = (tag: string | null): string[] => {
        if (!tag) return [];
        
        const tagMap: Record<string, string[]> = {
            'Sun': ['Sun', 'sun', '日常', 'Daily'],
            'AI': ['AI', 'ai', '人工智能', 'Artificial Intelligence'],
            '區塊鏈': ['區塊鏈', 'Blockchain', 'blockchain', '區塊鏈技術'],
        };
        
        return tagMap[tag] || [tag];
    };

    // 根據搜尋和標籤過濾文章
    const filteredPosts = useMemo(() => {
        let filtered = posts;

        // 先根據標籤篩選
        if (selectedTag) {
            const matchingTags = getMatchingTags(selectedTag);
            filtered = filtered.filter((post) =>
                post.tags.some(tag => matchingTags.includes(tag))
            );
        }

        // 再根據搜尋關鍵字篩選
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((post) =>
                post.title.toLowerCase().includes(query) ||
                post.description.toLowerCase().includes(query) ||
                post.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        return filtered;
    }, [posts, searchQuery, selectedTag]);

    return (
        <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-hidden">
            {/* 左側導航動態島 */}
            <BlogNavIsland 
                lang={lang} 
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
            />
            
            {/* 右側動態島 - 搜尋和語言切換 */}
            <BlogDynamicIsland
                lang={lang}
                setLang={setLang}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <div className="flex h-full">
                {/* 左側個人資料卡片 */}
                <ProfileCard lang={lang} />

                {/* 右側主要內容區域 */}
                <main className="flex-1 overflow-y-auto h-full relative scrollbar-custom">
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
