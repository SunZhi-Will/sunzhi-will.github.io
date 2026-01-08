import { serialize } from 'next-mdx-remote/serialize';
import remarkBreaks from 'remark-breaks';
import rehypeSanitize from 'rehype-sanitize';

/**
 * 將 MDX 內容序列化為可用的格式
 * 用於 next-mdx-remote 的 MDXContent 組件
 */
export async function serializeMdx(source: string) {
    return await serialize(source, {
        mdxOptions: {
            remarkPlugins: [remarkBreaks], // 支援換行
            rehypePlugins: [rehypeSanitize], // 防止 XSS 攻擊
        },
        parseFrontmatter: false, // 我們已經用 gray-matter 處理了 frontmatter
    });
}


