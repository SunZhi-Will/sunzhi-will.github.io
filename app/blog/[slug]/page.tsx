import { getPostBySlug, getPostSlugs, markdownToHtml, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';
import type { Lang } from '@/types';
import type { BlogPost } from '@/types/blog';
import type { Metadata } from 'next';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serializeMdx } from '@/lib/mdx';

// 強制靜態生成
export const dynamic = 'force-static';

// 預先生成所有文章的靜態路徑（包含所有語言版本）
export async function generateStaticParams() {
    const slugs = getPostSlugs();
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

    // 設定標題為「文章標題」，支援多語言
    return {
        title: defaultPost.title,
        description: defaultPost.description,
        alternates: {
            languages: titles,
        },
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
        htmlContent?: string;
        mdxSource?: MDXRemoteSerializeResult;
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

            // 臨時全部使用 HTML 渲染來避免 MDX 問題
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
                htmlContent,
            };
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

    return (
        <BlogPostClient
            defaultPost={defaultPostData.post}
            defaultHtmlContent={defaultPostData.htmlContent}
            defaultAllPosts={allPostsByLang[defaultLang] || []}
            postsByLang={postsByLang}
            allPostsByLang={allPostsByLang}
            baseUrl={baseUrl}
        />
    );
}
