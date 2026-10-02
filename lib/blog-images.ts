import fs from 'fs';
import path from 'path';

export interface BlogImageInfo {
    width: number;
    height: number;
    /** 最佳化後的 WebP 路徑；GIF、原本就是 WebP 的圖不會有 */
    webp?: string;
}

// scripts/copy-blog-images.js 在 dev 與 build 前產生
const manifestPath = path.join(process.cwd(), 'public/blog/image-manifest.json');

let cache: Record<string, BlogImageInfo> | null = null;

function readManifest(): Record<string, BlogImageInfo> {
    if (cache && process.env.NODE_ENV === 'production') return cache;
    try {
        cache = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch {
        // 清單不存在時（例如沒跑過複製腳本）就照原圖顯示
        cache = {};
    }
    return cache ?? {};
}

/** 取得文章圖片的尺寸與 WebP 版本，只能在伺服器端（建置時）呼叫 */
export function getBlogImageInfo(src: string | undefined): BlogImageInfo | undefined {
    if (!src) return undefined;
    return readManifest()[src];
}

const cardsDirectory = path.join(process.cwd(), 'public/blog-cards');

/**
 * 文章的社群分享卡（1200x630），由 scripts/generate-brand-assets.js 產生。
 * 放在 public/ 而不是文章資料夾，因為 push content/blog 底下的任何檔案都會重寄電子報。
 * 沒有分享卡的文章回傳 undefined，呼叫端退回文章自己的 coverImage。
 */
export function getBlogShareCard(slug: string, lang: string | null | undefined): string | undefined {
    const file = `og.${lang || 'zh-TW'}.png`;
    return fs.existsSync(path.join(cardsDirectory, slug, file)) ? `/blog-cards/${slug}/${file}` : undefined;
}
