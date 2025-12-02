import { Lang } from './index';

// 部落格文章介面定義
export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    description: string;
    tags: string[];
    coverImage?: string;
    content?: string;
    lang?: Lang; // 文章語言
    availableLangs?: Lang[]; // 可用的語言版本
}

