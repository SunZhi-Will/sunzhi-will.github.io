'use client'

import type { BlogPost } from '@/types/blog';
import { Lang } from '@/types';
import { useTheme } from '@/app/blog/ThemeProvider';
import { BlogCard } from './BlogCard';

interface RelatedPostsProps {
    posts: BlogPost[];
    currentSlug: string;
    lang: Lang;
}

export function RelatedPosts({ posts, currentSlug, lang }: RelatedPostsProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    // 找到當前文章
    const currentPost = posts.find(post => post.slug === currentSlug);

    // 根據標籤相似度推薦文章
    const relatedPosts = posts
        .filter(post => post.slug !== currentSlug)
        .map(post => {
            // 計算標籤相似度
            const commonTags = currentPost?.tags.filter(tag => post.tags.includes(tag)).length || 0;
            return { post, score: commonTags };
        })
        .sort((a, b) => {
            // 先按標籤相似度排序，再按日期排序
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
        })
        .slice(0, 3)
        .map(item => item.post);

    if (relatedPosts.length === 0) {
        return null;
    }

    return (
        <section className="pt-6">
            <h2 className={`text-lg font-light mb-6 ${
                isDark ? 'text-white' : 'text-black font-semibold'
            }`}>
                {lang === 'zh-TW' ? '推薦閱讀' : 'Related Articles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((post, idx) => (
                    <BlogCard
                        key={post.slug}
                        post={post}
                        lang={lang}
                        index={idx}
                        layout="vertical"
                    />
                ))}
            </div>
        </section>
    );
}

