// 更新專案類型
type MediaContent = {
    type: 'image' | 'youtube';
    src: string;
    alt?: string;
};

// 更新專案類型
type Project = {
    title: string;
    description: string;
    category: string;
    achievements?: string[];
    media?: MediaContent[];  // 使用 media 替換 images
    technologies?: string[];
    link?: string;
    links?: {
        ios?: string;
        android?: string;
    };
    buttonText?: string;  // 添加可選的按鈕文字屬性
};