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
