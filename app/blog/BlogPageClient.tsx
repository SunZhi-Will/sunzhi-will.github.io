'use client'

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { BlogPost } from '@/types/blog';
import { Lang } from '@/types';
import { blogTranslations, filterTagsByLanguage, getTagVariants, translateTag } from '@/lib/blog-translations';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogDynamicIsland } from '@/components/blog/BlogDynamicIsland';
import { BlogNavIsland } from '@/components/blog/BlogNavIsland';
import { BlogMobileNav } from '@/components/blog/BlogMobileNav';
import { NewsletterSubscribe } from '@/components/blog/NewsletterSubscribe';
import { SplitText } from '@/components/motion/SplitText';
import { EASE_OUT } from '@/components/motion/ease';
import { useMediaQuery } from '@/lib/use-media-query';
import { useTheme } from './ThemeProvider';

// 區塊小標：等寬字體，與首頁的編號小標同一套語言
function SectionLabel({ children, isDark, color }: { children: React.ReactNode; isDark: boolean; color: 'amber' | 'neutral' }) {
    return (
        <div className={`font-geist-mono flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.12em]
            ${color === 'amber'
                ? isDark ? 'text-yellow-400' : 'text-amber-700'
                : isDark ? 'text-white/55' : 'text-stone-500'
            }
        `}>
            <span className={`h-px w-5 flex-shrink-0 ${color === 'amber'
                ? isDark ? 'bg-yellow-400/70' : 'bg-amber-600/70'
                : isDark ? 'bg-white/25' : 'bg-stone-300'
            }`} />
            {children}
        </div>
    );
}

interface BlogPageClientProps {
    posts: BlogPost[];
    tags: string[];
}

export default function BlogPageClient({ posts }: BlogPageClientProps) {
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [lang, setLang] = useState<Lang>('zh-TW');
    const [showAllTags, setShowAllTags] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const { theme } = useTheme();

    const t = blogTranslations[lang];

    // 標籤只取目前語言的文章，依文章數排序。文章不多時標籤很容易比文章還多，
    // 所以預設只顯示最常用的幾個，其餘收在「更多」裡
    const tagCounts = useMemo(() => {
        const counts = new Map<string, number>();
        // posts 同時包含各語言的清單，沒有翻譯的文章會重複出現，先依 slug 去重
        const unique = new Map(
            posts
                .filter((post) => post.lang === undefined || post.lang === lang)
                .map((post) => [post.slug, post]),
        );
        Array.from(unique.values())
            .forEach((post) => {
                const translated = new Set(filterTagsByLanguage(post.tags, lang).map((tag) => translateTag(tag, lang)).filter(Boolean));
                translated.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
            });
        return Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], lang));
    }, [posts, lang]);

    const VISIBLE_TAGS = 6;
    // 手機是單行橫向滑動，全部標籤都放進去；桌面空間夠但太多會變成一牆，才摺疊
    const collapsible = isDesktop && tagCounts.length > VISIBLE_TAGS;
    const visibleTags = !collapsible || showAllTags ? tagCounts : tagCounts.slice(0, VISIBLE_TAGS);
    // 已選的標籤如果被收起來了，仍然要顯示，不然看不出目前在篩選什麼
    const selectedHidden = selectedTag && !visibleTags.some(([tag]) => tag === selectedTag)
        ? tagCounts.find(([tag]) => tag === selectedTag)
        : undefined;
    const shownTags = selectedHidden ? [...visibleTags, selectedHidden] : visibleTags;

    // 從 localStorage 讀取語言選擇，如果沒有則偵測瀏覽器語言 (暫時停用，固定為中文)
    // useEffect(() => {
    //     const savedLang = localStorage.getItem('blog-lang') as Lang | null;
    //     if (savedLang && (savedLang === 'zh-TW' || savedLang === 'en')) {
    //         setLang(savedLang);
    //     } else {
    //         const browserLang = navigator.language;
    //         const detectedLang = browserLang.includes('zh') ? 'zh-TW' : 'en';
    //         setLang(detectedLang);
    //         localStorage.setItem('blog-lang', detectedLang);
    //     }
    // }, []);

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
            className="min-h-screen relative transition-colors duration-300"
            style={{
                backgroundColor: isDark ? '#0a0a0a' : '#faf9f7',
                backgroundImage: isDark
                    ? `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(250,204,21,0.04) 0%, transparent 60%), radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)`
                    : `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(251,191,36,0.06) 0%, transparent 60%), radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)`,
                backgroundSize: isDark ? '100% 100%, 48px 48px' : '100% 100%, 48px 48px',
                backgroundPosition: '0 0, 0 0',
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

            {/* 主要內容區域 */}
            <main className="relative">
                <div className="max-w-4xl mx-auto px-4 pb-20 md:px-6 pt-[5.5rem] md:pt-24">
                    {/* 頁面標題：讓第一次來的人知道這是誰的部落格、寫些什麼 */}
                    <header className="mb-10 md:mb-12">
                        <span className={`font-geist-mono text-xs font-medium uppercase tracking-[0.14em] ${isDark ? 'text-white/55' : 'text-stone-500'}`}>
                            {String(filteredPosts.length).padStart(2, '0')} {lang === 'zh-TW' ? '篇文章' : 'posts'}
                        </span>
                        <h1 key={lang} className={`mt-3 text-[2.5rem] font-semibold leading-[1.1] tracking-tight md:text-6xl ${isDark ? 'text-white' : 'text-stone-900'}`}>
                            <SplitText text={lang === 'zh-TW' ? 'Sun 的部落格' : "Sun's Blog"} immediate stagger={0.05} />
                        </h1>
                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.35 }}
                            className={`mt-4 max-w-xl text-base leading-relaxed md:text-lg ${isDark ? 'text-white/70' : 'text-stone-600'}`}
                        >
                            {lang === 'zh-TW'
                                ? '寫 AI、產品、創業和遊戲開發，都是自己動手做過之後的想法。'
                                : 'Notes on AI, product, startups and game development, written after building things myself.'}
                        </motion.p>
                    </header>

                    {/* 標籤篩選：選中的底色在標籤之間滑動 */}
                    {tagCounts.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.45 }}
                            className="mb-10"
                        >
                            <div className="-mx-4 overflow-x-auto px-4 scrollbar-hide md:mx-0 md:overflow-visible md:px-0">
                                <div className="flex w-max items-center gap-2 md:w-auto md:flex-wrap" role="group" aria-label={t.allPosts}>
                                    {[{ tag: null as string | null, label: t.allPosts, count: 0 }, ...shownTags.map(([tag, count]) => ({ tag: tag as string | null, label: tag, count }))].map((chip) => {
                                        const active = selectedTag === chip.tag;
                                        return (
                                            <button
                                                key={chip.label}
                                                type="button"
                                                onClick={() => setSelectedTag(chip.tag === null || active ? null : chip.tag)}
                                                aria-pressed={active}
                                                className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                                                    active
                                                        ? isDark ? 'text-zinc-950' : 'text-white'
                                                        : isDark ? 'text-white/70 hover:text-white' : 'text-stone-600 hover:text-stone-900'
                                                }`}
                                            >
                                                {active ? (
                                                    <motion.span
                                                        layoutId="blog-filter"
                                                        className={`absolute inset-0 rounded-full ${isDark ? 'bg-yellow-400' : 'bg-stone-900'}`}
                                                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                                                    />
                                                ) : (
                                                    <span className={`absolute inset-0 rounded-full border ${isDark ? 'border-white/12' : 'border-stone-300'}`} />
                                                )}
                                                <span className="relative">
                                                    {chip.label}
                                                    {chip.count > 1 && (
                                                        <span className={`font-geist-mono ml-1.5 text-[11px] ${active ? (isDark ? 'text-zinc-700' : 'text-white/60') : (isDark ? 'text-white/40' : 'text-stone-400')}`}>
                                                            {chip.count}
                                                        </span>
                                                    )}
                                                </span>
                                            </button>
                                        );
                                    })}
                                    {collapsible && (
                                        <button
                                            type="button"
                                            onClick={() => setShowAllTags((value) => !value)}
                                            aria-expanded={showAllTags}
                                            className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                                                isDark ? 'text-yellow-400 hover:text-yellow-300' : 'text-amber-700 hover:text-amber-800'
                                            }`}
                                        >
                                            {showAllTags
                                                ? (lang === 'zh-TW' ? '收起' : 'Less')
                                                : (lang === 'zh-TW' ? `更多（${tagCounts.length - VISIBLE_TAGS}）` : `More (${tagCounts.length - VISIBLE_TAGS})`)}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className={`mt-6 h-px w-full ${isDark ? 'bg-white/10' : 'bg-stone-200'}`} />
                        </motion.div>
                    )}

                    {/* 文章列表 */}
                    {filteredPosts.length > 0 ? (
                        <div className="space-y-8">
                            {selectedTag === null && !searchQuery.trim() ? (
                                <>
                                    {/* 精選文章 */}
                                    <div className="space-y-4">
                                        <SectionLabel isDark={isDark} color="amber">
                                            {t.featuredPost || '精選文章'}
                                        </SectionLabel>
                                        <BlogCard
                                            post={filteredPosts[0]}
                                            lang={lang}
                                            index={0}
                                            layout="horizontal"
                                            featured={true}
                                        />
                                    </div>

                                    {/* 其他文章 */}
                                    {filteredPosts.length > 1 && (
                                        <div className="space-y-4 pt-2">
                                            <SectionLabel isDark={isDark} color="neutral">
                                                {t.recentPosts || '最新文章'}
                                            </SectionLabel>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                {filteredPosts.slice(1).map((post, index) => (
                                                    <BlogCard
                                                        key={post.slug}
                                                        post={post}
                                                        lang={lang}
                                                        index={index + 1}
                                                        layout="vertical"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                // 搜尋或標籤過濾時，不顯示精選文章，全部以網格展示
                                <div className="space-y-4">
                                    <SectionLabel isDark={isDark} color="amber">
                                        {selectedTag 
                                            ? `${lang === 'zh-TW' ? '分類：' : 'Category: '}${selectedTag}` 
                                            : (lang === 'zh-TW' ? '搜尋結果' : 'Search Results')
                                        }
                                    </SectionLabel>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {filteredPosts.map((post, index) => (
                                            <BlogCard
                                                key={post.slug}
                                                post={post}
                                                lang={lang}
                                                index={index}
                                                layout="vertical"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : searchQuery ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-28 text-center"
                        >
                            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5
                                ${isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-stone-100 border border-stone-200/80'}
                            `}>
                                <MagnifyingGlassIcon className={`w-6 h-6 ${isDark ? 'text-white/30' : 'text-stone-400'}`} />
                            </div>
                            <p className={`text-base font-semibold mb-1.5 ${isDark ? 'text-white/80' : 'text-stone-700'}`}>{t.noResults}</p>
                            <p className={`text-sm ${isDark ? 'text-white/40' : 'text-stone-400'}`}>{t.noResultsDesc}</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-28 text-center"
                        >
                            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5
                                ${isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-stone-100 border border-stone-200/80'}
                            `}>
                                <svg className={`w-6 h-6 ${isDark ? 'text-white/30' : 'text-stone-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className={`text-base font-semibold mb-1.5 ${isDark ? 'text-white/80' : 'text-stone-700'}`}>{t.noPosts}</p>
                            <p className={`text-sm ${isDark ? 'text-white/40' : 'text-stone-400'}`}>{t.noPostsDesc}</p>
                        </motion.div>
                    )}

                    {/* 訂閱電子報與頁尾區 */}
                    <div className={`mt-16 pt-10 border-t ${isDark ? 'border-white/[0.06]' : 'border-stone-200/70'}`}>
                        <NewsletterSubscribe lang={lang} variant="section" />
                        <div className={`mt-10 text-center text-xs tracking-widest uppercase ${isDark ? 'text-white/20' : 'text-stone-300'}`}>
                            © {new Date().getFullYear()} Sun
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
