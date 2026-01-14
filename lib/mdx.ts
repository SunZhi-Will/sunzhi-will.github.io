import { serialize } from 'next-mdx-remote/serialize';
import remarkBreaks from 'remark-breaks';

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
            // 移除 rehypeSanitize，因為它會過濾掉我們的 JSX 組件
            // 我們的內容來自可信任的 AI 生成，所以相對安全
            jsx: true,
            format: 'mdx',
        },
        parseFrontmatter: false, // 我們已經用 gray-matter 處理了 frontmatter
    });
}


