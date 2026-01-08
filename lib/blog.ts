import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkBreaks from 'remark-breaks';
import rehypeSanitize from 'rehype-sanitize';
import { rehype } from 'rehype';
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
 * 現在支援資料夾結構：content/blog/[日期時間]/文章.md 或 article.mdx
 */
export function getPostSlugs(): string[] {
    ensurePostsDirectory();

    try {
        const entries = fs.readdirSync(postsDirectory, { withFileTypes: true });
        const slugs: string[] = [];

        for (const entry of entries) {
            if (entry.isDirectory()) {
                // 如果是資料夾，在資料夾內尋找 .md 或 .mdx 文件
                const folderPath = path.join(postsDirectory, entry.name);
                const files = fs.readdirSync(folderPath);
                const mdFile = files.find((file) => file.endsWith('.md') || file.endsWith('.mdx'));

                if (mdFile) {
                    // 使用資料夾名稱作為 slug
                    slugs.push(entry.name);
                }
            } else if ((entry.isFile() && entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) && entry.name !== 'README.md' && entry.name !== 'README.mdx') {
                // 向後兼容：如果直接有 .md 或 .mdx 文件，使用文件名作為 slug
                // 忽略 README.md 和 README.mdx 文件
                slugs.push(entry.name.replace(/\.(md|mdx)$/, ''));
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
        if (file.match(/\.(zh-TW|en)\.(md|mdx)$/)) {
            const lang = file.includes('.zh-TW.') ? 'zh-TW' : 'en';
            if (!availableLangs.includes(lang)) {
                availableLangs.push(lang);
            }
        } else if ((file.endsWith('.md') || file.endsWith('.mdx')) && !file.includes('.')) {
            // 如果只有 article.md 或 article.mdx（沒有語言後綴），認為是預設語言
            // 這裡我們假設是 zh-TW，但也可以根據內容判斷
            if (!availableLangs.includes('zh-TW')) {
                availableLangs.push('zh-TW');
            }
        }
    });

    return availableLangs.length > 0 ? availableLangs : ['zh-TW']; // 預設至少有一個語言
}

/**
 * 驗證 slug 格式，防止路徑遍歷攻擊
 */
function validateSlug(slug: string): boolean {
    // 只允許字母、數字、連字號、底線和點號（用於日期格式）
    // 禁止路徑遍歷字元
    return /^[a-zA-Z0-9\-_.]+$/.test(slug) &&
        !slug.includes('..') &&
        !path.isAbsolute(slug) &&
        slug.length > 0 &&
        slug.length <= 100; // 長度限制
}

/**
 * 根據 slug 和語言取得單篇文章資料
 * 現在支援資料夾結構：content/blog/[日期時間]/文章.[lang].md
 * 如果指定語言不存在，會嘗試回退到其他可用語言
 */
export function getPostBySlug(slug: string, lang?: Lang): BlogPost | null {
    ensurePostsDirectory();

    // 驗證 slug 格式，防止路徑遍歷攻擊
    if (!validateSlug(slug)) {
        console.warn(`Invalid slug format: ${slug}`);
        return null;
    }

    try {
        // 先嘗試在資料夾中尋找（新結構）
        const folderPath = path.join(postsDirectory, slug);

        // 額外驗證：確保解析後的路徑仍在 postsDirectory 內
        const resolvedPath = path.resolve(folderPath);
        const resolvedPostsDir = path.resolve(postsDirectory);
        if (!resolvedPath.startsWith(resolvedPostsDir)) {
            console.warn(`Path traversal detected: ${slug}`);
            return null;
        }
        if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
            const files = fs.readdirSync(folderPath);
            const availableLangs = getAvailableLangs(folderPath);

            // 決定要讀取的語言
            let targetLang: Lang | null = null;
            let mdFile: string | null = null;

            if (lang) {
                // 嘗試讀取指定語言的文件（優先 .mdx，然後 .md）
                const langFile = files.find((file) =>
                    file.endsWith(`.${lang}.mdx`) ||
                    file.endsWith(`.${lang}.md`) ||
                    (lang === 'zh-TW' && (file === 'article.mdx' || file === 'article.md') && !file.includes('.'))
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
                        file.endsWith(`.${availableLang}.mdx`) ||
                        file.endsWith(`.${availableLang}.md`) ||
                        (availableLang === 'zh-TW' && (file === 'article.mdx' || file === 'article.md') && !file.includes('.'))
                    );
                    if (langFile) {
                        targetLang = availableLang;
                        mdFile = langFile;
                        break;
                    }
                }
            }

            // 如果還是找不到，嘗試任何 .mdx 或 .md 文件（向後兼容，優先 .mdx）
            if (!mdFile) {
                mdFile = files.find((file) => file.endsWith('.mdx')) ||
                    files.find((file) => file.endsWith('.md')) || null;
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
                    isMdx: mdFile.endsWith('.mdx'), // 標記是否為 MDX 文件
                };
            }
        }

        // 向後兼容：嘗試直接讀取 .mdx 或 .md 文件（舊結構，優先 .mdx）
        const mdxFilePath = path.join(postsDirectory, `${slug}.mdx`);
        const mdFilePath = path.join(postsDirectory, `${slug}.md`);

        // 再次驗證路徑安全性（使用已聲明的 resolvedPostsDir）
        const resolvedMdxPath = path.resolve(mdxFilePath);
        const resolvedMdPath = path.resolve(mdFilePath);

        if (fs.existsSync(mdxFilePath) && resolvedMdxPath.startsWith(resolvedPostsDir)) {
            const fileContents = fs.readFileSync(mdxFilePath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                slug,
                title: data.title || 'Untitled',
                date: data.date || new Date().toISOString(),
                description: data.description || '',
                tags: data.tags || [],
                coverImage: data.coverImage || undefined,
                content,
                isMdx: true, // 標記為 MDX 文件
            };
        }

        if (fs.existsSync(mdFilePath) && resolvedMdPath.startsWith(resolvedPostsDir)) {
            const fileContents = fs.readFileSync(mdFilePath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                slug,
                title: data.title || 'Untitled',
                date: data.date || new Date().toISOString(),
                description: data.description || '',
                tags: data.tags || [],
                coverImage: data.coverImage || undefined,
                content,
                isMdx: false, // 標記為 MD 文件
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
 * 預處理 Markdown：修復中文引號內的粗體標記
 * 將 **「文字」** 轉換為 「**文字**」，確保 remark 能正確解析粗體
 * 因為 remark 在解析 **「文字」** 時會將引號內的內容提取，導致粗體標記失效
 */
function preprocessMarkdown(markdown: string): string {
    // 將 **「文字」** 轉換為 「**文字**」
    // 匹配模式：**「...」**（不包含換行符，避免匹配跨行的內容）
    return markdown.replace(/\*\*「([^」\n]+)」\*\*/g, '「**$1**」');
}

/**
 * 將 Markdown 內容轉換為 HTML
 * 支援換行和更好的段落間距
 * 使用 rehype-sanitize 防止 XSS 攻擊
 */
export async function markdownToHtml(markdown: string): Promise<string> {
    // 預處理：修復中文引號內的粗體標記
    let processedMarkdown = preprocessMarkdown(markdown);

    // 先將 Markdown 轉換為 HTML
    const htmlResult = await remark()
        .use(remarkBreaks) // 支援換行
        .use(html)
        .process(processedMarkdown);

    let htmlString = htmlResult.toString();

    // 後續修復：處理預處理後仍可能出現的錯誤格式（作為備用方案）
    // 由於我們已經在預處理階段將 **「文字」** 轉換為 「**文字**」，
    // 大部分情況應該已經解決，這裡只處理一些邊緣情況

    // 情況1: 如果還有殘留的 **「文字」** 格式（未經預處理的情況，作為備用）
    htmlString = htmlString.replace(/\*\*「([^」\n]+)」\*\*/g, '<strong>「$1」</strong>');

    // 情況2: 處理可能的錯誤格式 **「文字」<strong> 或 </strong>「文字」**
    htmlString = htmlString.replace(/\*\*「([^」\n]+)」<strong>/g, '<strong>「$1」</strong>');
    htmlString = htmlString.replace(/<\/strong>「([^」\n]+)」\*\*/g, '<strong>「$1」</strong>');

    // 情況3: 清理可能殘留的 ** 標記
    htmlString = htmlString.replace(/(<strong>「[^」]+」<\/strong>)\*\*/g, '$1');
    htmlString = htmlString.replace(/\*\*(<strong>「[^」]+」<\/strong>)/g, '$1');

    // 情況4: 處理嵌套或重複的 strong 標籤
    htmlString = htmlString.replace(/(<strong>「[^」]+」)<strong>/g, '$1');
    htmlString = htmlString.replace(/<\/strong>(「[^」]+」<\/strong>)/g, '$1');

    // 使用 rehype-sanitize 清理 HTML，防止 XSS 攻擊
    // rehype-sanitize 默認允許 strong, em, b, i 等標籤
    const sanitizedResult = await rehype()
        .data('settings', { fragment: true })
        .use(rehypeSanitize)
        .process(htmlString);

    return sanitizedResult.toString();
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


