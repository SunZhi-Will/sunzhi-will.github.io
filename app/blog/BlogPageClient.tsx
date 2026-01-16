'use client'

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { BlogPost } from '@/types/blog';
import { Lang } from '@/types';
import { blogTranslations, getTagVariants } from '@/lib/blog-translations';
import { ProfileCard } from '@/components/blog/ProfileCard';
import { NewsletterCard } from '@/components/blog/NewsletterCard';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogDynamicIsland } from '@/components/blog/BlogDynamicIsland';
import { BlogNavIsland } from '@/components/blog/BlogNavIsland';
import { BlogMobileNav } from '@/components/blog/BlogMobileNav';
import { useTheme } from './ThemeProvider';

interface BlogPageClientProps {
    posts: BlogPost[];
    tags: string[];
}

export default function BlogPageClient({ posts, tags }: BlogPageClientProps) {
    void tags;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [lang, setLang] = useState<Lang>('zh-TW');
    const { theme } = useTheme();

    const t = blogTranslations[lang];

    // 從 localStorage 讀取語言選擇，如果沒有則偵測瀏覽器語言
    useEffect(() => {
        const savedLang = localStorage.getItem('blog-lang') as Lang | null;
        if (savedLang && (savedLang === 'zh-TW' || savedLang === 'en')) {
            setLang(savedLang);
        } else {
            const browserLang = navigator.language;
            const detectedLang = browserLang.includes('zh') ? 'zh-TW' : 'en';
            setLang(detectedLang);
            localStorage.setItem('blog-lang', detectedLang);
        }
    }, []);

    // 當語言改變時，保存到 localStorage
    const handleLangChange = (newLang: Lang) => {
        setLang(newLang);
        localStorage.setItem('blog-lang', newLang);
    };

    // 標籤匹配規則
    const getMatchingTags = (tag: string | null): string[] => {
        if (!tag) return [];

        // 使用統一的標籤變體查找
        return getTagVariants(tag);
    };

    // 根據語言、搜尋和標籤過濾文章
    const filteredPosts = useMemo(() => {
        // 先根據語言過濾：對於每個 slug，優先顯示當前語言版本
        const postsBySlug = new Map<string, BlogPost>();

        posts.forEach((post) => {
            const existing = postsBySlug.get(post.slug);

            // 如果這個 slug 還沒有文章，或者當前文章是目標語言，則使用當前文章
            if (!existing || post.lang === lang) {
                postsBySlug.set(post.slug, post);
            }
            // 如果已有文章但不是目標語言，且當前文章是目標語言，則替換
            else if (existing.lang !== lang && post.lang === lang) {
                postsBySlug.set(post.slug, post);
            }
        });

        let filtered = Array.from(postsBySlug.values());

        // 過濾：只保留當前語言版本或沒有語言信息的文章（向後兼容）
        filtered = filtered.filter((post) => {
            return post.lang === undefined || post.lang === lang;
        });

        // 再根據標籤篩選
        if (selectedTag) {
            const matchingTags = getMatchingTags(selectedTag);
            filtered = filtered.filter((post) =>
                post.tags.some(tag => matchingTags.includes(tag))
            );
        }

        // 最後根據搜尋關鍵字篩選
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((post) =>
                post.title.toLowerCase().includes(query) ||
                post.description.toLowerCase().includes(query) ||
                post.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // 按日期降序排列（最新的在前面）
        // 使用自定義的時間戳提取函數來正確排序
        const getTimestampFromSlug = (slug: string): number => {
            // 如果 slug 是日期時間戳格式（如 2026-01-16-025506），使用它進行排序
            const match = slug.match(/^(\d{4}-\d{2}-\d{2}-\d{6})$/);
            if (match) {
                const dateStr = match[1].replace(/(\d{4}-\d{2}-\d{2})-(\d{2})(\d{2})(\d{2})/, '$1T$2:$3:$4');
                return new Date(dateStr).getTime();
            }

            // 如果 slug 是日期格式（如 2026-01-16），使用它
            const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})/);
            if (dateMatch) {
                return new Date(dateMatch[1]).getTime();
            }

            // 備用：嘗試解析為日期
            const date = new Date(slug);
            if (!isNaN(date.getTime())) {
                return date.getTime();
            }

            // 最後備用：返回當前時間
            return Date.now();
        };

        filtered.sort((a, b) => getTimestampFromSlug(b.slug) - getTimestampFromSlug(a.slug));

        return filtered;
    }, [posts, lang, searchQuery, selectedTag]);

    const isDark = theme === 'dark';

    return (
        <div
            className="h-screen overflow-hidden relative transition-colors duration-300"
            style={{
                backgroundColor: isDark ? '#111827' : '#f9fafb',
                backgroundImage: isDark
                    ? `radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom right, #111827, #1f2937, #111827)`
                    : `radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom right, #f9fafb, #f3f4f6, #f9fafb)`,
                backgroundSize: '20px 20px, 100% 100%',
                backgroundPosition: '0 0, 0 0',
                color: isDark ? '#e5e7eb' : '#111827',
            } as React.CSSProperties}
        >
            {/* 手機版單一導覽列 */}
            <BlogMobileNav
                lang={lang}
                setLang={handleLangChange}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
            />

            {/* 電腦版左側導航動態島 */}
            <div className="hidden md:block">
                <BlogNavIsland
                    lang={lang}
                    selectedTag={selectedTag}
                    setSelectedTag={setSelectedTag}
                />
            </div>

            {/* 電腦版右側動態島 - 搜尋和語言切換 */}
            <div className="hidden md:block">
                <BlogDynamicIsland
                    lang={lang}
                    setLang={handleLangChange}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
            </div>

            <div className="flex h-full gap-4">
                {/* 左側側邊欄 */}
                <div className="flex flex-col flex-shrink-0">
                    {/* 個人資料卡片 */}
                    <ProfileCard lang={lang} />
                    
                    {/* 訂閱電子報卡片 */}
                    <NewsletterCard lang={lang} />
                </div>

                {/* 主要內容區域 */}
                <main className="flex-1 overflow-y-auto h-full relative scrollbar-custom">
                    <div className="max-w-6xl mx-auto px-4 pb-4 md:px-6 md:pb-6 lg:pb-8 pt-[5.5rem] md:pt-24">
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
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full backdrop-blur-sm border mb-4 ${isDark
                                    ? 'bg-gray-800/80 border-gray-700/50'
                                    : 'bg-gray-200/80 border-gray-300/50'
                                    }`}>
                                    <MagnifyingGlassIcon className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                </div>
                                <p className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t.noResults}</p>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.noResultsDesc}</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-24 text-center"
                            >
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full backdrop-blur-sm border mb-4 ${isDark
                                    ? 'bg-gray-800/80 border-gray-700/50'
                                    : 'bg-gray-200/80 border-gray-300/50'
                                    }`}>
                                    <svg className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t.noPosts}</p>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.noPostsDesc}</p>
                            </motion.div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
