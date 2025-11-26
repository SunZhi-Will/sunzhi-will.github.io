import { getAllPosts, getAllTags } from '@/lib/blog';
import type { BlogPost } from '@/types/blog';
import BlogPageClient from './BlogPageClient';

// 強制靜態生成
export const dynamic = 'force-static';

export default function BlogPage() {
    // 在建置時取得所有文章和標籤
    const posts: BlogPost[] = getAllPosts();
    const tags: string[] = getAllTags();

    return <BlogPageClient posts={posts} tags={tags} />;
}
