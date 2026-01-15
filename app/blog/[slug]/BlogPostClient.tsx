'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { BlogPost } from '@/types/blog';
import { Lang } from '@/types';
import { blogTranslations, filterTagsByLanguage } from '@/lib/blog-translations';
import dynamic from 'next/dynamic';
import { formatDate } from '@/lib/blog-utils';

// 動態導入使用 framer-motion 的組件，避免預渲染問題
const BlogNavIsland = dynamic(() => import('@/components/blog/BlogNavIsland').then(mod => ({ default: mod.BlogNavIsland })), { ssr: false });
const BlogPostDynamicIsland = dynamic(() => import('@/components/blog/BlogPostDynamicIsland').then(mod => ({ default: mod.BlogPostDynamicIsland })), { ssr: false });
const BlogMobileNav = dynamic(() => import('@/components/blog/BlogMobileNav').then(mod => ({ default: mod.BlogMobileNav })), { ssr: false });
const RelatedPosts = dynamic(() => import('@/components/blog/RelatedPosts').then(mod => ({ default: mod.RelatedPosts })), { ssr: false });
const CommentSection = dynamic(() => import('@/components/blog/CommentSection').then(mod => ({ default: mod.CommentSection })), { ssr: false });
const ReadingProgress = dynamic(() => import('@/components/blog/ReadingProgress').then(mod => ({ default: mod.ReadingProgress })), { ssr: false });
const EnhancedArticleContent = dynamic(() => import('@/components/blog/EnhancedArticleContent').then(mod => ({ default: mod.EnhancedArticleContent })), { ssr: false });
const ShareButtons = dynamic(() => import('@/components/blog/ShareButtons').then(mod => ({ default: mod.ShareButtons })), { ssr: false });
const TableOfContents = dynamic(() => import('@/components/blog/TableOfContents').then(mod => ({ default: mod.TableOfContents })), { ssr: false });
// import { ScrollReveal } from '@/components/blog/ScrollReveal';
import { useTheme } from '../ThemeProvider';
// import type { MDXRemoteSerializeResult } from 'next-mdx-remote'; // 臨時禁用MDX

interface BlogPostClientProps {
    defaultPost: Omit<BlogPost, 'content'>;
    defaultHtmlContent?: string;
    defaultMdxPath?: string; // MDX 文件路徑
    defaultAllPosts: BlogPost[];
    postsByLang: Partial<Record<Lang, {
        post: Omit<BlogPost, 'content'>;
        htmlContent?: string;
        mdxPath?: string; // MDX 文件路徑
    } | null>>;
    allPostsByLang: Partial<Record<Lang, BlogPost[]>>;
    baseUrl: string;
}

export default function BlogPostClient({
    defaultPost,
    defaultHtmlContent,
    defaultMdxPath,
    defaultAllPosts,
    postsByLang,
    allPostsByLang,
    baseUrl,
}: BlogPostClientProps) {
    const [lang, setLang] = useState<Lang>('zh-TW');
    const [currentPost, setCurrentPost] = useState<Omit<BlogPost, 'content'>>(defaultPost);
    const [currentHtmlContent, setCurrentHtmlContent] = useState<string | undefined>(defaultHtmlContent);
    const [currentMdxPath, setCurrentMdxPath] = useState<string | undefined>(defaultMdxPath);
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

    // 估算閱讀時間（根據內容類型）
    const contentLength = (currentHtmlContent?.length || 0) + (currentMdxPath ? 2000 : 0); // MDX 文件估計較長
    const readingTime = Math.max(1, Math.ceil(contentLength / 1500));

    // 切換到指定語言版本的文章
    const switchToLang = (targetLang: Lang) => {
        const postData = postsByLang[targetLang];
        if (postData) {
            setCurrentPost(postData.post);
            setCurrentHtmlContent(postData.htmlContent);
            setCurrentMdxPath(postData.mdxPath);
        }
        // 更新推薦文章列表
        setCurrentAllPosts(allPostsByLang[targetLang] || []);
    };

    // 從 localStorage 讀取語言選擇，如果沒有則偵測瀏覽器語言
    useEffect(() => {
        // 確保在客戶端執行
        if (typeof window === 'undefined') return;
        
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
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
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

            {/* 目錄 - 左側固定 */}
            <TableOfContents lang={lang} />

            {/* 主要內容區域 - 全寬 */}
            <main className="overflow-y-auto h-full scrollbar-custom">
                <article className="relative">
                    {/* 文章內容 - 統一的內容區域 */}
                    <div className="max-w-3xl mx-auto px-4 pt-20 pb-6 md:px-8 md:pt-24 md:pb-8 lg:px-12 lg:pb-10">
                        <div className="space-y-10">
                            {/* 標題 - 直接放在內容開頭 */}
                            <header className="space-y-5 pb-8 border-b" style={{
                                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                            }}>
                                <h1 className={`text-3xl md:text-4xl font-light leading-tight tracking-tight ${isDark ? 'text-gray-100' : 'text-gray-900'
                                    }`}>
                                    {currentPost.title}
                                </h1>

                                {/* 元資訊 - 簡潔的單行顯示 */}
                                <div className={`flex flex-wrap items-center gap-2.5 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'
                                    }`}>
                                    <time>
                                        {formatDate(currentPost.date, lang === 'zh-TW' ? 'zh-TW' : 'en-US')}
                                    </time>
                                    {readingTime && (
                                        <>
                                            <span className="text-gray-400">·</span>
                                            <span>{readingTime} {t.readTime}</span>
                                        </>
                                    )}
                                    {(() => {
                                        const filteredTags = filterTagsByLanguage(currentPost.tags, lang);
                                        return filteredTags.length > 0 && (
                                            <>
                                                <span className="text-gray-400">·</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {filteredTags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className={`px-2 py-0.5 text-xs rounded ${
                                                                isDark 
                                                                    ? 'text-gray-400 bg-gray-800/50 border border-gray-700/50' 
                                                                    : 'text-gray-600 bg-gray-100/50 border border-gray-300/50'
                                                            }`}
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
                                <div className="relative w-full overflow-hidden rounded-lg border" style={{
                                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                }}>
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

                            {/* 文章描述 - 特殊樣式，支援 markdown 格式 */}
                            {currentPost.description && (
                                <div className={`relative my-8 py-5 px-5 rounded-md border-l-2 ${
                                    isDark 
                                        ? 'bg-gray-800/30 border-gray-600/50' 
                                        : 'bg-gray-50/80 border-gray-300/50'
                                }`}>
                                    <div 
                                        className={`text-base leading-relaxed font-light prose prose-sm max-w-none ${
                                            isDark ? 'text-gray-300 prose-strong:text-gray-100' : 'text-gray-700 prose-strong:text-gray-900'
                                        } prose-strong:font-semibold`}
                                        dangerouslySetInnerHTML={{ 
                                            __html: currentPost.descriptionHtml || currentPost.description 
                                        }}
                                    />
                                </div>
                            )}

                            {/* 內容開始分界線 */}
                            <div className="pt-4 border-t" style={{
                                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'
                            }} />

                            {/* 增強的文章正文 - 包含互動功能 */}
                            <EnhancedArticleContent
                                htmlContent={currentHtmlContent}
                                mdxPath={currentMdxPath}
                                postSlug={currentPost.slug}
                                lang={lang}
                            />
                        </div>
                    </div>

                    {/* 文章底部 */}
                    <div className="max-w-3xl mx-auto px-4 md:px-8 lg:px-12 pb-20">
                        {/* 內容結束分界線 */}
                        <div className="pt-6 border-t" style={{
                            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                        }} />
                        <div className="space-y-8 pt-4">
                            {/* 分享按鈕 */}
                            <ShareButtons
                                title={currentPost.title}
                                url={`${currentBaseUrl}/blog/${currentPost.slug}`}
                                lang={lang}
                            />

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
