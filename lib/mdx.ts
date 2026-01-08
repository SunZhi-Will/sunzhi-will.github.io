import { serialize } from 'next-mdx-remote/serialize';
import remarkBreaks from 'remark-breaks';
import rehypeSanitize from 'rehype-sanitize';

/**
 * 預處理 Markdown：修復中文引號內的粗體標記
 * 將 **「文字」** 轉換為 「**文字**」，確保 remark 能正確解析粗體
 */
function preprocessMarkdown(markdown: string): string {
    // 將 **「文字」** 轉換為 「**文字**」
    // 匹配模式：**「...」**（不包含換行符，避免匹配跨行的內容）
    return markdown.replace(/\*\*「([^」\n]+)」\*\*/g, '「**$1**」');
}

/**
 * 將 MDX 內容序列化為可用的格式
 * 用於 next-mdx-remote 的 MDXContent 組件
 */
export async function serializeMdx(source: string) {
    // 預處理：修復中文引號內的粗體標記
    const processedSource = preprocessMarkdown(source);
    
    return await serialize(processedSource, {
        mdxOptions: {
            remarkPlugins: [remarkBreaks], // 支援換行
            rehypePlugins: [rehypeSanitize], // 防止 XSS 攻擊
        },
        parseFrontmatter: false, // 我們已經用 gray-matter 處理了 frontmatter
    });
}


