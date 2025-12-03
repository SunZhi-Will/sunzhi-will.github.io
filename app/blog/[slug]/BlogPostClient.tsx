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
import { useTheme } from '../ThemeProvider';

interface BlogPostClientProps {
    defaultPost: Omit<BlogPost, 'content'>;
    defaultHtmlContent: string;
    defaultAllPosts: BlogPost[];
    postsByLang: Record<Lang, { post: Omit<BlogPost, 'content'>; htmlContent: string } | null>;
    allPostsByLang: Record<Lang, BlogPost[]>;
}

export default function BlogPostClient({
    defaultPost,
    defaultHtmlContent,
    defaultAllPosts,
    postsByLang,
    allPostsByLang,
}: BlogPostClientProps) {
    const [lang, setLang] = useState<Lang>('zh-TW');
    const [currentPost, setCurrentPost] = useState<Omit<BlogPost, 'content'>>(defaultPost);
    const [currentHtmlContent, setCurrentHtmlContent] = useState<string>(defaultHtmlContent);
    const [currentAllPosts, setCurrentAllPosts] = useState<BlogPost[]>(defaultAllPosts);
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const t = blogTranslations[lang];

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
                                <h1 className={`text-2xl md:text-3xl font-normal leading-tight tracking-tight ${
                                    isDark ? 'text-gray-200' : 'text-gray-900'
                                }`}>
                                    {currentPost.title}
                                </h1>

                                {/* 元資訊 - 簡潔的單行顯示 */}
                                <div className={`flex flex-wrap items-center gap-3 text-sm ${
                                    isDark ? 'text-gray-400' : 'text-gray-600'
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
                                <div className={`relative w-full overflow-hidden rounded-lg ${
                                    isDark ? 'bg-gray-700/50' : 'bg-gray-200/50'
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

                            {/* 文章描述 */}
                            {currentPost.description && (
                                <p className={`text-base leading-relaxed ${
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    {currentPost.description}
                                </p>
                            )}

                            {/* 文章正文 */}
                            <div className={`prose prose-base max-w-none
                                    prose-h1:text-2xl prose-h1:mt-12 prose-h1:mb-4 prose-h1:font-normal
                                    prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:font-normal
                                    prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 prose-h3:font-normal
                                    prose-h4:text-base prose-h4:mt-6 prose-h4:mb-2 prose-h4:font-normal
                                    prose-p:leading-relaxed prose-p:font-normal prose-p:text-[15px] prose-p:mb-5
                                    prose-a:no-underline prose-a:border-b prose-a:transition-all prose-a:font-medium
                                    prose-strong:font-semibold
                                    prose-code:px-2 prose-code:py-1 prose-code:text-sm prose-code:font-mono prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-code:border
                                    prose-pre:rounded-xl prose-pre:shadow-xl prose-pre:backdrop-blur-sm prose-pre:overflow-x-auto
                                    prose-pre code:bg-transparent prose-pre code:px-0 prose-pre code:py-0 prose-pre code:border-0
                                    prose-blockquote:border-l-4 prose-blockquote:py-4 prose-blockquote:pl-6 prose-blockquote:pr-6 prose-blockquote:rounded-r-lg prose-blockquote:font-light prose-blockquote:not-italic prose-blockquote:my-8
                                    prose-ul:my-6 prose-ol:my-6
                                    prose-li:my-2 prose-li:leading-relaxed
                                    prose-img:rounded-xl prose-img:border prose-img:shadow-xl prose-img:my-8
                                    prose-hr:my-12
                                    prose-th:border prose-th:px-4 prose-th:py-2
                                    prose-td:border prose-td:px-4 prose-td:py-2
                                    ${isDark
                                        ? `prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-gray-200
                                        prose-p:text-gray-300
                                        prose-a:text-gray-400 prose-a:border-gray-600/50 hover:prose-a:border-gray-500 hover:prose-a:text-gray-300
                                        prose-strong:text-gray-200
                                        prose-code:text-gray-300 prose-code:bg-gray-700/80 prose-code:border-gray-600/50
                                        prose-pre:bg-gray-800/80 prose-pre:border prose-pre:border-gray-700/50
                                        prose-blockquote:border-gray-600/50 prose-blockquote:bg-gray-800/30 prose-blockquote:text-gray-300
                                        prose-ul:text-gray-300 prose-ol:text-gray-300
                                        prose-li:marker:text-gray-500
                                        prose-img:border-gray-700/50
                                        prose-hr:border-gray-700/50
                                        prose-table:text-gray-300 prose-th:border-gray-700/50 prose-th:bg-gray-800/30
                                        prose-td:border-gray-700/50`
                                        : `prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-gray-900
                                        prose-p:text-gray-700
                                        prose-a:text-gray-600 prose-a:border-gray-400/50 hover:prose-a:border-gray-600 hover:prose-a:text-gray-800
                                        prose-strong:text-gray-900
                                        prose-code:text-gray-800 prose-code:bg-gray-200/80 prose-code:border-gray-300/50
                                        prose-pre:bg-gray-100/80 prose-pre:border prose-pre:border-gray-300/50
                                        prose-blockquote:border-gray-400/50 prose-blockquote:bg-gray-200/30 prose-blockquote:text-gray-700
                                        prose-ul:text-gray-700 prose-ol:text-gray-700
                                        prose-li:marker:text-gray-600
                                        prose-img:border-gray-300/50
                                        prose-hr:border-gray-300/50
                                        prose-table:text-gray-700 prose-th:border-gray-300/50 prose-th:bg-gray-200/30
                                        prose-td:border-gray-300/50`
                                    }`}
                                dangerouslySetInnerHTML={{ __html: currentHtmlContent }}
                            />
                        </motion.div>
                    </div>

                    {/* 文章底部 */}
                    <div className="max-w-3xl mx-auto px-6 md:px-8 lg:px-12 pb-16">
                        <div className="space-y-12 pt-8">
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
                            />
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
}
