import { getAllPosts, getAllTags } from '@/lib/blog';
import type { BlogPost } from '@/types/blog';
import BlogPageClient from './BlogPageClient';

// 強制靜態生成
export const dynamic = 'force-static';

export default function BlogPage() {
    // 在建置時取得所有文章（包含所有語言版本）和標籤
    // 客戶端會根據當前語言過濾顯示對應版本
    const postsZhTW: BlogPost[] = getAllPosts('zh-TW');
    const postsEn: BlogPost[] = getAllPosts('en');
    const allPosts: BlogPost[] = [...postsZhTW, ...postsEn];
    const tags: string[] = getAllTags();

    return <BlogPageClient posts={allPosts} tags={tags} />;
}
