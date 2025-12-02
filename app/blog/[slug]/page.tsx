import { getPostBySlug, getPostSlugs, markdownToHtml, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';

// 強制靜態生成
export const dynamic = 'force-static';

// 預先生成所有文章的靜態路徑
export async function generateStaticParams() {
    const slugs = getPostSlugs();
    return slugs.map((slug) => ({
        slug: slug,
    }));
}

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    // 將 Markdown 轉換為 HTML
    const htmlContent = post.content ? await markdownToHtml(post.content) : '';

    // 取得所有文章（用於推薦）
    const allPosts = getAllPosts();

    // 移除 content 欄位，只傳遞需要的資料
    const postData = {
        slug: post.slug,
        title: post.title,
        date: post.date,
        description: post.description,
        tags: post.tags,
        coverImage: post.coverImage,
    };

    return <BlogPostClient post={postData} htmlContent={htmlContent} allPosts={allPosts} />;
}
