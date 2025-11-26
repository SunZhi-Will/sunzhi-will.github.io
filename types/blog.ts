// 部落格文章介面定義
export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    description: string;
    tags: string[];
    coverImage?: string;
    content?: string;
}

