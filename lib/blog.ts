import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkBreaks from 'remark-breaks';
import type { BlogPost } from '@/types/blog';
import type { Lang } from '@/types';

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
            } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') {
                // 向後兼容：如果直接有 .md 文件，使用文件名作為 slug
                // 忽略 README.md 文件
                slugs.push(entry.name.replace(/\.md$/, ''));
            }
        }
        
        return slugs;
    } catch {
        return [];
    }
}

/**
 * 取得文章可用的語言版本
 */
function getAvailableLangs(folderPath: string): Lang[] {
    const availableLangs: Lang[] = [];
    const files = fs.readdirSync(folderPath);
    
    // 檢查是否有語言特定的文件
    files.forEach((file) => {
        if (file.match(/\.(zh-TW|en)\.md$/)) {
            const lang = file.includes('.zh-TW.') ? 'zh-TW' : 'en';
            if (!availableLangs.includes(lang)) {
                availableLangs.push(lang);
            }
        } else if (file.endsWith('.md') && !file.includes('.')) {
            // 如果只有 article.md（沒有語言後綴），認為是預設語言
            // 這裡我們假設是 zh-TW，但也可以根據內容判斷
            if (!availableLangs.includes('zh-TW')) {
                availableLangs.push('zh-TW');
            }
        }
    });
    
    return availableLangs.length > 0 ? availableLangs : ['zh-TW']; // 預設至少有一個語言
}

/**
 * 根據 slug 和語言取得單篇文章資料
 * 現在支援資料夾結構：content/blog/[日期時間]/文章.[lang].md
 * 如果指定語言不存在，會嘗試回退到其他可用語言
 */
export function getPostBySlug(slug: string, lang?: Lang): BlogPost | null {
    ensurePostsDirectory();
    
    try {
        // 先嘗試在資料夾中尋找（新結構）
        const folderPath = path.join(postsDirectory, slug);
        if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
            const files = fs.readdirSync(folderPath);
            const availableLangs = getAvailableLangs(folderPath);
            
            // 決定要讀取的語言
            let targetLang: Lang | null = null;
            let mdFile: string | null = null;
            
            if (lang) {
                // 嘗試讀取指定語言的文件
                const langFile = files.find((file) => 
                    file.endsWith(`.${lang}.md`) || 
                    (lang === 'zh-TW' && file === 'article.md' && !file.includes('.'))
                );
                if (langFile) {
                    targetLang = lang;
                    mdFile = langFile;
                }
            }
            
            // 如果指定語言不存在，嘗試其他可用語言
            if (!mdFile) {
                for (const availableLang of availableLangs) {
                    const langFile = files.find((file) => 
                        file.endsWith(`.${availableLang}.md`) ||
                        (availableLang === 'zh-TW' && file === 'article.md' && !file.includes('.'))
                    );
                    if (langFile) {
                        targetLang = availableLang;
                        mdFile = langFile;
                        break;
                    }
                }
            }
            
            // 如果還是找不到，嘗試任何 .md 文件（向後兼容）
            if (!mdFile) {
                mdFile = files.find((file) => file.endsWith('.md')) || null;
                if (mdFile && !targetLang) {
                    targetLang = 'zh-TW'; // 預設語言
                }
            }
            
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
                    lang: targetLang || undefined,
                    availableLangs,
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
 * @param lang 可選，指定語言，如果指定則只返回該語言版本的文章
 */
export function getAllPosts(lang?: Lang): BlogPost[] {
    const slugs = getPostSlugs();
    const posts = slugs
        .map((slug) => getPostBySlug(slug, lang))
        .filter((post): post is BlogPost => post !== null)
        .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

    return posts;
}

/**
 * 將 Markdown 內容轉換為 HTML
 * 支援換行和更好的段落間距
 */
export async function markdownToHtml(markdown: string): Promise<string> {
    const result = await remark()
        .use(remarkBreaks) // 支援換行
        .use(html, { sanitize: false })
        .process(markdown);
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


