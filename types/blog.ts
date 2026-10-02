import { Lang } from './index';

// 部落格文章介面定義
export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    description: string;
    descriptionHtml?: string; // description 的 HTML 版本（支援 markdown 格式）
    tags: string[];
    coverImage?: string;
    coverImageDisplay?: string; // 頁面上實際顯示用的封面（最佳化後的 WebP），社群預覽仍用 coverImage
    readingMinutes?: number; // 依實際字數估算的閱讀時間
    content?: string;
    lang?: Lang; // 文章語言
    availableLangs?: Lang[]; // 可用的語言版本
    isMdx?: boolean; // 是否為 MDX 格式文件
}

