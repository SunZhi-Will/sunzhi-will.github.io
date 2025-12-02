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
 * 現在支援資料夾結構：content/blog/[日期時間]/文章.md
 */
export function getPostSlugs(): string[] {
    ensurePostsDirectory();
    
    try {
        const entries = fs.readdirSync(postsDirectory, { withFileTypes: true });
        const slugs: string[] = [];
        
        for (const entry of entries) {
            if (entry.isDirectory()) {
                // 如果是資料夾，在資料夾內尋找 .md 文件
                const folderPath = path.join(postsDirectory, entry.name);
                const files = fs.readdirSync(folderPath);
                const mdFile = files.find((file) => file.endsWith('.md'));
                
                if (mdFile) {
                    // 使用資料夾名稱作為 slug
                    slugs.push(entry.name);
                }
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                // 向後兼容：如果直接有 .md 文件，使用文件名作為 slug
                slugs.push(entry.name.replace(/\.md$/, ''));
            }
        }
        
        return slugs;
    } catch {
        return [];
    }
}

/**
 * 根據 slug 取得單篇文章資料
 * 現在支援資料夾結構：content/blog/[日期時間]/文章.md
 */
export function getPostBySlug(slug: string): BlogPost | null {
    ensurePostsDirectory();
    
    try {
        // 先嘗試在資料夾中尋找（新結構）
        const folderPath = path.join(postsDirectory, slug);
        if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
            // 在資料夾內尋找 .md 文件
            const files = fs.readdirSync(folderPath);
            const mdFile = files.find((file) => file.endsWith('.md'));
            
            if (mdFile) {
                const fullPath = path.join(folderPath, mdFile);
                const fileContents = fs.readFileSync(fullPath, 'utf8');
                const { data, content } = matter(fileContents);

                // 處理封面圖路徑
                let coverImage = data.coverImage || undefined;
                if (coverImage) {
                    // 如果是相對路徑（不包含 / 開頭），認為圖片在文章資料夾中
                    if (!coverImage.startsWith('/')) {
                        const imagePath = path.join(folderPath, coverImage);
                        // 檢查圖片是否存在於文章資料夾中
                        if (fs.existsSync(imagePath)) {
                            // 轉換為可以訪問的路徑：/blog/[slug]/[filename]
                            coverImage = `/blog/${slug}/${coverImage}`;
                        } else {
                            coverImage = undefined;
                        }
                    }
                }

                return {
                    slug,
                    title: data.title || 'Untitled',
                    date: data.date || slug, // 如果沒有 date，使用資料夾名稱（日期時間）
                    description: data.description || '',
                    tags: data.tags || [],
                    coverImage,
                    content,
                };
            }
        }
        
        // 向後兼容：嘗試直接讀取 .md 文件（舊結構）
        const filePath = path.join(postsDirectory, `${slug}.md`);
        if (fs.existsSync(filePath)) {
            const fileContents = fs.readFileSync(filePath, 'utf8');
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
        }
        
        return null;
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


