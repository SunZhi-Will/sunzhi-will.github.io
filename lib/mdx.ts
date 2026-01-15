/**
 * MDX 預處理工具 - 現在使用 Next.js 內建的 MDX 支援
 * 這個文件主要用於預處理 MDX 內容中的特殊格式
 */

/**
 * 預處理 Markdown：修復中文引號內的粗體標記
 * 將 **「文字」** 轉換為 「**文字**」，確保 remark 能正確解析粗體
 */
export function preprocessMarkdown(markdown: string): string {
    // 將 **「文字」** 轉換為 「**文字**」
    // 匹配模式：**「...」**（不包含換行符，避免匹配跨行的內容）
    return markdown.replace(/\*\*「([^」\n]+)」\*\*/g, '「**$1**」');
}

/**
 * 簡單的 JSX 組件解析器 - 保持原始格式供 MDX 使用
 */
export function parseJSXComponents(markdown: string): string {
    // 匹配自閉合 JSX 組件 <Component prop="value" />
    const selfClosingRegex = /<([A-Z][a-zA-Z]*)\s*([^>]*)\/>/g;
    // 匹配普通 JSX 組件 <Component>content</Component>
    const normalRegex = /<([A-Z][a-zA-Z]*)\s*([^>]*)>([\s\S]*?)<\/\1>/g;

    return markdown
        // 處理自閉合組件 - 保持為自閉合格式
        .replace(selfClosingRegex, (match, tagName, attrs) => {
            const lowerTagName = tagName.toLowerCase();
            const parsedAttrs = parseJSXAttributes(attrs);
            const attrString = Object.entries(parsedAttrs)
                .map(([key, value]) => `${key}="${value}"`)
                .join(' ');
            return `<${lowerTagName}${attrString ? ' ' + attrString : ''} />`;
        })
        // 處理普通組件 - 保持原始格式
        .replace(normalRegex, (match, tagName, attrs, content) => {
            const lowerTagName = tagName.toLowerCase();
            const parsedAttrs = parseJSXAttributes(attrs);
            const attrString = Object.entries(parsedAttrs)
                .map(([key, value]) => `${key}="${value}"`)
                .join(' ');
            return `<${lowerTagName}${attrString ? ' ' + attrString : ''}>${content}</${lowerTagName}>`;
        });
}

function parseJSXAttributes(attrsString: string): Record<string, string> {
    const attrs: Record<string, string> = {};
    const attrRegex = /([a-zA-Z]+)="([^"]*)"/g;
    let match;
    while ((match = attrRegex.exec(attrsString)) !== null) {
        attrs[match[1]] = match[2];
    }
    return attrs;
}


