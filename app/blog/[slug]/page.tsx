import { getPostBySlug, getPostSlugs, markdownToHtml, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';
import type { Lang } from '@/types';
import type { BlogPost } from '@/types/blog';
import type { Metadata } from 'next';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import remarkGfm from 'remark-gfm';
// MDX 組件現在由 Next.js 內建處理

// 強制靜態生成
export const dynamic = 'force-static';

// 預先生成所有文章的靜態路徑（包含所有語言版本）
export async function generateStaticParams() {
    const slugs = getPostSlugs();

    // 如果沒有任何文章，返回一個 placeholder slug，避免靜態導出出錯
    if (slugs.length === 0) {
        return [{ slug: 'placeholder' }];
    }

    const params: { slug: string; lang?: string }[] = [];

    // 為每個文章生成所有可用語言的路徑
    for (const slug of slugs) {
        const post = getPostBySlug(slug);
        if (post && post.availableLangs) {
            post.availableLangs.forEach((lang) => {
                params.push({ slug, lang });
            });
        } else {
            params.push({ slug });
        }
    }

    return params;
}

interface BlogPostPageProps {
    params: Promise<{ slug: string; lang?: string }>;
}

// 導入必要的組件
import { serialize } from 'next-mdx-remote/serialize';

// 生成頁面 metadata（標題）
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;

    // 取得所有語言版本的文章
    const postZhTW = getPostBySlug(slug, 'zh-TW');
    const postEn = getPostBySlug(slug, 'en');

    // 預設使用中文版本，如果沒有則使用英文版本
    const defaultPost = postZhTW || postEn;

    if (!defaultPost) {
        return {
            title: '文章',
        };
    }

    // 構建多語言標題
    const titles: Record<string, string> = {};
    if (postZhTW) {
        titles['zh-TW'] = postZhTW.title;
    }
    if (postEn) {
        titles['en'] = postEn.title;
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunzhi-will.github.io';
    const imageUrl = defaultPost.coverImage
        ? (defaultPost.coverImage.startsWith('http') ? defaultPost.coverImage : `${baseUrl}${defaultPost.coverImage}`)
        : undefined;

    // 設定標題為「文章標題」，支援多語言
    return {
        title: defaultPost.title,
        description: defaultPost.description,
        alternates: {
            canonical: `${baseUrl}/blog/${slug}`,
            languages: {
                ...(postZhTW ? { 'zh-TW': `${baseUrl}/blog/${slug}` } : {}),
                ...(postEn ? { 'en': `${baseUrl}/blog/${slug}` } : {}),
            },
            types: {
                'application/rss+xml': `${baseUrl}/feed.xml`,
                'application/atom+xml': `${baseUrl}/feed.atom`,
            },
        },
        openGraph: {
            title: defaultPost.title,
            description: defaultPost.description,
            type: 'article',
            publishedTime: defaultPost.date,
            modifiedTime: defaultPost.date,
            authors: [`${baseUrl}/#person`],
            url: `${baseUrl}/blog/${slug}`,
            images: imageUrl ? [{ url: imageUrl, alt: defaultPost.title, width: 1200, height: 630 }] : [],
            tags: defaultPost.tags || [],
            locale: defaultPost.lang === 'zh-TW' ? 'zh_TW' : 'en_US',
            siteName: 'Sun',
        },
        twitter: {
            card: 'summary_large_image',
            title: defaultPost.title,
            description: defaultPost.description,
            images: imageUrl ? [imageUrl] : [],
        },
        robots: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
        },
        verification: {},
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;

    // 獲取正確的 base URL（用於分享連結）
    // 對於靜態生成，使用環境變數或預設值
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunzhi-will.github.io';

    // 預先載入所有語言版本的文章數據
    const postsByLang: Partial<Record<Lang, {
        post: Omit<BlogPost, 'content'>;
        contentLength?: number;
        htmlContent?: string;
        mdxSource?: MDXRemoteSerializeResult; // 序列化的 MDX 內容
    } | null>> = {
        'zh-TW': null,
        'en': null,
    };

    const allPostsByLang: Partial<Record<Lang, BlogPost[]>> = {
        'zh-TW': [],
        'en': [],
    };

    // 載入所有語言版本的文章
    for (const lang of ['zh-TW', 'en'] as Lang[]) {
        const post = getPostBySlug(slug, lang);
        if (post) {
            // 將 description 轉換為 HTML（支援 markdown 格式）
            const descriptionHtml = post.description ? await markdownToHtml(post.description) : '';

            // 根據文件類型決定處理方式
            if (post.isMdx) {
                // MDX 文件：在服務器端讀取並序列化
                try {
                    const fs = await import('fs');
                    const path = await import('path');
                    const mdxFilePath = path.join(process.cwd(), 'content/blog', post.slug, `article.${lang}.mdx`);

                    if (fs.existsSync(mdxFilePath)) {
                        const mdxContent = fs.readFileSync(mdxFilePath, 'utf8');
                        // 使用 gray-matter 解析 frontmatter
                        const matter = await import('gray-matter');
                        const { content } = matter.default(mdxContent);

                        // 序列化 MDX 內容
                        const mdxSource = await serialize(content, {
                            mdxOptions: {
                                remarkPlugins: [remarkGfm],
                                rehypePlugins: [],
                            },
                        });

                        postsByLang[lang] = {
                            post: {
                                slug: post.slug,
                                title: post.title,
                                date: post.date,
                                description: post.description,
                                descriptionHtml,
                                tags: post.tags,
                                coverImage: post.coverImage,
                                lang: post.lang,
                                availableLangs: post.availableLangs,
                                isMdx: post.isMdx,
                            },
                            contentLength: content.length,
                            mdxSource,
                        };
                    }
                } catch (error) {
                    console.error('Error processing MDX file:', error);
                    postsByLang[lang] = {
                        post: {
                            slug: post.slug,
                            title: post.title,
                            date: post.date,
                            description: post.description,
                            descriptionHtml,
                            tags: post.tags,
                            coverImage: post.coverImage,
                            lang: post.lang,
                            availableLangs: post.availableLangs,
                            isMdx: post.isMdx,
                        },
                        contentLength: post.content?.length,
                        htmlContent: '<p>無法載入內容</p>',
                    };
                }
            } else {
                // 普通 Markdown 文件：轉換為 HTML
                const htmlContent = post.content ? await markdownToHtml(post.content) : '';
                postsByLang[lang] = {
                    post: {
                        slug: post.slug,
                        title: post.title,
                        date: post.date,
                        description: post.description,
                        descriptionHtml,
                        tags: post.tags,
                        coverImage: post.coverImage,
                        lang: post.lang,
                        availableLangs: post.availableLangs,
                        isMdx: post.isMdx,
                    },
                    contentLength: post.content?.length,
                    htmlContent,
                };
            }
        }
        allPostsByLang[lang] = getAllPosts(lang).map(p => ({
            slug: p.slug,
            title: p.title,
            date: p.date,
            description: p.description,
            tags: p.tags,
            coverImage: p.coverImage,
            lang: p.lang,
            availableLangs: p.availableLangs,
        }));
    }

    // 如果沒有任何語言版本，返回 404
    if (!postsByLang['zh-TW'] && !postsByLang['en']) {
        notFound();
    }

    // 預設使用 zh-TW，如果沒有則使用 en
    const defaultLang: Lang = postsByLang['zh-TW'] ? 'zh-TW' : 'en';
    const defaultPostData = postsByLang[defaultLang]!;

    const defaultPost = defaultPostData.post;
    const imageUrl = defaultPost.coverImage
        ? (defaultPost.coverImage.startsWith('http') ? defaultPost.coverImage : `${baseUrl}${defaultPost.coverImage}`)
        : undefined;

    const blogPostingJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${baseUrl}/blog/${slug}#article`,
        url: `${baseUrl}/blog/${slug}`,
        headline: defaultPost.title,
        description: defaultPost.description,
        datePublished: defaultPost.date,
        dateModified: defaultPost.date,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${baseUrl}/blog/${slug}`,
        },
        author: {
            '@type': 'Person',
            '@id': `${baseUrl}/#person`,
            name: 'Sun (謝上智)',
            url: baseUrl,
        },
        publisher: {
            '@type': 'Person',
            '@id': `${baseUrl}/#person`,
            name: 'Sun (謝上智)',
        },
        ...(imageUrl ? { image: { '@type': 'ImageObject', url: imageUrl, width: 1200, height: 630 } } : {}),
        ...(defaultPost.tags && defaultPost.tags.length > 0 ? { keywords: defaultPost.tags.join(', ') } : {}),
        inLanguage: defaultPost.lang === 'zh-TW' ? 'zh-TW' : 'en',
        wordCount: defaultPostData.contentLength || undefined,
    };

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}/blog/${slug}#breadcrumb`,
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Blog',
                item: `${baseUrl}/blog`,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: defaultPost.title,
                item: `${baseUrl}/blog/${slug}`,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <BlogPostClient
                defaultPost={defaultPost}
                defaultContentLength={defaultPostData.contentLength}
                defaultHtmlContent={defaultPostData.htmlContent}
                defaultMdxSource={defaultPostData.mdxSource}
                defaultAllPosts={allPostsByLang[defaultLang] || []}
                postsByLang={postsByLang}
                allPostsByLang={allPostsByLang}
                baseUrl={baseUrl}
            />
        </>
    );
}
