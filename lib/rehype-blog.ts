import { getBlogImageInfo } from './blog-images';

// 只用到 hast 的一小部分，不另外裝型別套件
interface HastNode {
    type: string;
    tagName?: string;
    value?: string;
    properties?: Record<string, unknown>;
    children?: HastNode[];
}

const HEADING_TAGS = new Set(['h2', 'h3', 'h4', 'h5', 'h6']);

function textOf(node: HastNode): string {
    if (node.type === 'text') return node.value ?? '';
    return (node.children ?? []).map(textOf).join('');
}

/**
 * 由標題文字產生錨點 id。保留中文與英數，其餘符號拿掉，
 * 這樣「到底什麼叫「抄襲」？」會得到 #到底什麼叫抄襲，而不是 #heading-3。
 */
export function slugifyHeading(text: string): string {
    return text
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\p{L}\p{N}-]+/gu, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

function walk(node: HastNode, visit: (node: HastNode) => void) {
    visit(node);
    for (const child of node.children ?? []) walk(child, visit);
}

/**
 * 文章內文的 rehype 外掛：
 * 1. 圖片補上寬高與延遲載入，並換成最佳化後的 WebP
 * 2. 標題補上穩定的 id 與一個錨點連結
 */
export function rehypeBlog() {
    return (tree: HastNode) => {
        const used = new Map<string, number>();
        let imageIndex = 0;

        walk(tree, (node) => {
            if (node.type !== 'element' || !node.tagName) return;

            if (node.tagName === 'img') {
                const properties = (node.properties ??= {});
                const info = getBlogImageInfo(typeof properties.src === 'string' ? properties.src : undefined);
                if (info) {
                    properties.width = info.width;
                    properties.height = info.height;
                    if (info.webp) properties.src = info.webp;
                }
                // 第一張圖通常就在首屏，不延遲
                if (imageIndex > 0) properties.loading = 'lazy';
                properties.decoding = 'async';
                imageIndex++;
                return;
            }

            if (HEADING_TAGS.has(node.tagName)) {
                const properties = (node.properties ??= {});
                const base = slugifyHeading(textOf(node)) || 'section';
                const count = used.get(base) ?? 0;
                used.set(base, count + 1);
                const id = count === 0 ? base : `${base}-${count + 1}`;
                properties.id = id;

                // 連結本身沒有文字（# 由 CSS 產生），目錄讀標題文字時才不會多一個符號
                (node.children ??= []).push({
                    type: 'element',
                    tagName: 'a',
                    properties: { href: `#${id}`, className: ['heading-anchor'], ariaLabel: '這一節的連結' },
                    children: [],
                });
            }
        });
    };
}
