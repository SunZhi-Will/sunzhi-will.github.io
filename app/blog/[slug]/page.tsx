import { getPostBySlug, getPostSlugs, markdownToHtml, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';
import type { Lang } from '@/types';
import type { BlogPost } from '@/types/blog';

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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    
    // 預先載入所有語言版本的文章數據
    const postsByLang: Record<Lang, { post: Omit<BlogPost, 'content'>; htmlContent: string } | null> = {
        'zh-TW': null,
        'en': null,
    };

    const allPostsByLang: Record<Lang, BlogPost[]> = {
        'zh-TW': [],
        'en': [],
    };

    // 載入所有語言版本的文章
    for (const lang of ['zh-TW', 'en'] as Lang[]) {
        const post = getPostBySlug(slug, lang);
        if (post) {
            const htmlContent = post.content ? await markdownToHtml(post.content) : '';
            postsByLang[lang] = {
                post: {
                    slug: post.slug,
                    title: post.title,
                    date: post.date,
                    description: post.description,
                    tags: post.tags,
                    coverImage: post.coverImage,
                    lang: post.lang,
                    availableLangs: post.availableLangs,
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
            defaultAllPosts={allPostsByLang[defaultLang]}
            postsByLang={postsByLang}
            allPostsByLang={allPostsByLang}
        />
    );
}
