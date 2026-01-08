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
    content?: string;
    lang?: Lang; // 文章語言
    availableLangs?: Lang[]; // 可用的語言版本
    isMdx?: boolean; // 是否為 MDX 格式文件
}

