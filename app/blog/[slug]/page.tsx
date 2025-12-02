import { getPostBySlug, getPostSlugs, markdownToHtml, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';
import type { Lang } from '@/types';

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
    const { slug, lang } = await params;
    const targetLang = (lang as Lang) || 'zh-TW';
    
    const post = getPostBySlug(slug, targetLang);

    if (!post) {
        notFound();
    }

    // 將 Markdown 轉換為 HTML
    const htmlContent = post.content ? await markdownToHtml(post.content) : '';

    // 取得所有文章（用於推薦，使用相同語言）
    const allPosts = getAllPosts(targetLang);

    // 移除 content 欄位，只傳遞需要的資料
    const postData = {
        slug: post.slug,
        title: post.title,
        date: post.date,
        description: post.description,
        tags: post.tags,
        coverImage: post.coverImage,
        lang: post.lang,
        availableLangs: post.availableLangs,
    };

    return <BlogPostClient post={postData} htmlContent={htmlContent} allPosts={allPosts} />;
}
