'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/types/blog';
import { Lang } from '@/types';
import { blogTranslations, filterTagsByLanguage } from '@/lib/blog-translations';
import { BlogNavIsland } from '@/components/blog/BlogNavIsland';
import { BlogPostDynamicIsland } from '@/components/blog/BlogPostDynamicIsland';
import { BlogMobileNav } from '@/components/blog/BlogMobileNav';
import { formatDate } from '@/lib/blog-utils';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { CommentSection } from '@/components/blog/CommentSection';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { EnhancedArticleContent } from '@/components/blog/EnhancedArticleContent';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { ScrollReveal } from '@/components/blog/ScrollReveal';
import { useTheme } from '../ThemeProvider';

interface BlogPostClientProps {
    defaultPost: Omit<BlogPost, 'content'>;
    defaultHtmlContent: string;
    defaultAllPosts: BlogPost[];
    postsByLang: Record<Lang, { post: Omit<BlogPost, 'content'>; htmlContent: string } | null>;
    allPostsByLang: Record<Lang, BlogPost[]>;
    baseUrl: string;
}

export default function BlogPostClient({
    defaultPost,
    defaultHtmlContent,
    defaultAllPosts,
    postsByLang,
    allPostsByLang,
    baseUrl,
}: BlogPostClientProps) {
    const [lang, setLang] = useState<Lang>('zh-TW');
    const [currentPost, setCurrentPost] = useState<Omit<BlogPost, 'content'>>(defaultPost);
    const [currentHtmlContent, setCurrentHtmlContent] = useState<string>(defaultHtmlContent);
    const [currentAllPosts, setCurrentAllPosts] = useState<BlogPost[]>(defaultAllPosts);
    // 使用服務端傳來的 baseUrl 作為初始值，避免 hydration mismatch
    const [currentBaseUrl, setCurrentBaseUrl] = useState<string>(baseUrl);
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const t = blogTranslations[lang];

    // 在客戶端更新 baseUrl（僅在客戶端執行，不影響 SSR）
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentBaseUrl(window.location.origin);
        }
    }, []);

    // 估算閱讀時間
    const readingTime = Math.max(1, Math.ceil(currentHtmlContent.length / 1500));

    // 切換到指定語言版本的文章
    const switchToLang = (targetLang: Lang) => {
        const postData = postsByLang[targetLang];
        if (postData) {
            setCurrentPost(postData.post);
            setCurrentHtmlContent(postData.htmlContent);
        }
        // 更新推薦文章列表
        setCurrentAllPosts(allPostsByLang[targetLang]);
    };

    // 從 localStorage 讀取語言選擇，如果沒有則偵測瀏覽器語言
    useEffect(() => {
        const savedLang = localStorage.getItem('blog-lang') as Lang | null;
        if (savedLang && (savedLang === 'zh-TW' || savedLang === 'en')) {
            setLang(savedLang);
            // 如果保存的語言與預設語言不同，切換到該語言版本
            if (savedLang !== defaultPost.lang) {
                switchToLang(savedLang);
            }
        } else {
            const browserLang = navigator.language;
            const detectedLang = browserLang.includes('zh') ? 'zh-TW' : 'en';
            setLang(detectedLang);
            localStorage.setItem('blog-lang', detectedLang);
            // 如果偵測的語言與預設語言不同，切換到該語言版本
            if (detectedLang !== defaultPost.lang) {
                switchToLang(detectedLang);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 當語言改變時，保存到 localStorage 並切換到對應語言版本
    const handleLangChange = (newLang: Lang) => {
        if (newLang === lang) return; // 如果語言相同，不需要切換

        setLang(newLang);
        localStorage.setItem('blog-lang', newLang);
        switchToLang(newLang);
    };

    // 當語言或文章標題改變時，更新頁面標題
    useEffect(() => {
        if (currentPost.title) {
            document.title = `${currentPost.title} | Sun`;
        }
    }, [currentPost.title, lang]);

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
            />

            {/* 電腦版左側導航動態島 - 在文章詳情頁面會自動隱藏 */}
            <div className="hidden md:block">
                <BlogNavIsland lang={lang} />
            </div>

            {/* 電腦版右側動態島 - 語言切換 */}
            <div className="hidden md:block">
                <BlogPostDynamicIsland
                    lang={lang}
                    setLang={handleLangChange}
                />
            </div>

            {/* 閱讀進度條 */}
            <ReadingProgress />

            {/* 主要內容區域 - 全寬 */}
            <main className="overflow-y-auto h-full scrollbar-custom">
                <article className="relative">
                    {/* 文章內容 - 統一的內容區域 */}
                    <div className="max-w-3xl mx-auto px-4 py-12 md:px-8 md:py-16 lg:px-12 lg:py-20 pt-20 md:pt-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="space-y-8"
                        >
                            {/* 標題 - 直接放在內容開頭 */}
                            <header className="space-y-4">
                                <h1 className={`text-2xl md:text-3xl font-normal leading-tight tracking-tight ${isDark ? 'text-gray-200' : 'text-gray-900'
                                    }`}>
                                    {currentPost.title}
                                </h1>

                                {/* 元資訊 - 簡潔的單行顯示 */}
                                <div className={`flex flex-wrap items-center gap-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                    <time>
                                        {formatDate(currentPost.date, lang === 'zh-TW' ? 'zh-TW' : 'en-US')}
                                    </time>
                                    {readingTime && (
                                        <>
                                            <span>·</span>
                                            <span>{readingTime} {t.readTime}</span>
                                        </>
                                    )}
                                    {(() => {
                                        const filteredTags = filterTagsByLanguage(currentPost.tags, lang);
                                        return filteredTags.length > 0 && (
                                            <>
                                                <span>·</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {filteredTags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className={isDark ? 'text-gray-400' : 'text-gray-600'}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </header>

                            {/* 封面圖片 - 整合到內容流中 */}
                            {currentPost.coverImage && (
                                <div className={`relative w-full overflow-hidden rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-200/50'
                                    }`}>
                                    <Image
                                        src={currentPost.coverImage}
                                        alt={currentPost.title}
                                        width={1200}
                                        height={675}
                                        className="w-full h-auto"
                                        priority
                                    />
                                </div>
                            )}

                            {/* 文章描述 - 特殊樣式 */}
                            {currentPost.description && (
                                <div className={`relative my-8 py-6 px-6 rounded-lg border-l-4 ${
                                    isDark 
                                        ? 'bg-gray-800/50 border-blue-500/50 text-gray-200' 
                                        : 'bg-blue-50/50 border-blue-400 text-gray-800'
                                }`}>
                                    <p className={`text-lg md:text-xl leading-relaxed font-medium italic ${
                                        isDark ? 'text-gray-200' : 'text-gray-800'
                                    }`}>
                                        {currentPost.description}
                                    </p>
                                </div>
                            )}

                            {/* 增強的文章正文 - 包含互動功能 */}
                            <EnhancedArticleContent
                                htmlContent={currentHtmlContent}
                                postSlug={currentPost.slug}
                                lang={lang}
                            />
                        </motion.div>
                    </div>

                    {/* 文章底部 */}
                    <div className="max-w-3xl mx-auto px-6 md:px-8 lg:px-12 pb-16">
                        <div className="space-y-12 pt-8">
                            {/* 分享按鈕 */}
                            <ScrollReveal direction="fade" delay={0.2}>
                                <ShareButtons
                                    title={currentPost.title}
                                    url={`${currentBaseUrl}/blog/${currentPost.slug}`}
                                    lang={lang}
                                />
                            </ScrollReveal>

                            {/* 推薦文章 */}
                            <RelatedPosts
                                posts={currentAllPosts}
                                currentSlug={currentPost.slug}
                                lang={lang}
                            />

                            {/* 留言區 */}
                            <CommentSection
                                postSlug={currentPost.slug}
                                postTitle={currentPost.title}
                                lang={lang}
                                postUrl={`${currentBaseUrl}/blog/${currentPost.slug}`}
                            />
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
}
