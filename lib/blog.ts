import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import type { BlogPost } from '@/types/blog';

// 部落格文章存放目錄
const postsDirectory = path.join(process.cwd(), 'content/blog');

/**
 * 確保部落格目錄存在
 */
function ensurePostsDirectory() {
    if (!fs.existsSync(postsDirectory)) {
        fs.mkdirSync(postsDirectory, { recursive: true });
    }
}

/**
 * 取得所有部落格文章的 slug
 */
export function getPostSlugs(): string[] {
    ensurePostsDirectory();
    
    try {
        const files = fs.readdirSync(postsDirectory);
        return files
            .filter((file) => file.endsWith('.md'))
            .map((file) => file.replace(/\.md$/, ''));
    } catch {
        return [];
    }
}

/**
 * 根據 slug 取得單篇文章資料
 */
export function getPostBySlug(slug: string): BlogPost | null {
    ensurePostsDirectory();
    
    try {
        const fullPath = path.join(postsDirectory, `${slug}.md`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            title: data.title || 'Untitled',
            date: data.date || new Date().toISOString(),
            description: data.description || '',
            tags: data.tags || [],
            coverImage: data.coverImage || undefined,
            content,
        };
    } catch {
        return null;
    }
}

/**
 * 取得所有部落格文章（按日期排序）
 */
export function getAllPosts(): BlogPost[] {
    const slugs = getPostSlugs();
    const posts = slugs
        .map((slug) => getPostBySlug(slug))
        .filter((post): post is BlogPost => post !== null)
        .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

    return posts;
}

/**
 * 將 Markdown 內容轉換為 HTML
 */
export async function markdownToHtml(markdown: string): Promise<string> {
    const result = await remark().use(html).process(markdown);
    return result.toString();
}

/**
 * 取得所有標籤
 */
export function getAllTags(): string[] {
    const posts = getAllPosts();
    const tagSet = new Set<string>();
    
    posts.forEach((post) => {
        post.tags.forEach((tag) => tagSet.add(tag));
    });
    
    return Array.from(tagSet).sort();
}

/**
 * 根據標籤篩選文章
 */
export function getPostsByTag(tag: string): BlogPost[] {
    const posts = getAllPosts();
    return posts.filter((post) => post.tags.includes(tag));
}


