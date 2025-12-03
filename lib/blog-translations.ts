export const blogTranslations = {
    'zh-TW': {
        title: '部落格',
        subtitle: '技術文章與開發心得',
        searchPlaceholder: '搜尋文章',
        allPosts: '全部',
        readMore: '閱讀全文',
        noResults: '找不到符合的文章',
        noResultsDesc: '試試其他關鍵字',
        noPosts: '尚無文章',
        noPostsDesc: '敬請期待',
        home: '首頁',
        blog: '部落格',
        langSwitch: 'EN',
        backToBlog: '返回文章列表',
        readTime: '分鐘',
        published: '發布於',
        tags: '標籤',
        share: '分享這篇文章',
        moreArticles: '更多文章',
    },
    'en': {
        title: 'Blog',
        subtitle: 'Articles & Development Notes',
        searchPlaceholder: 'Search',
        allPosts: 'All',
        readMore: 'Read more',
        noResults: 'No posts found',
        noResultsDesc: 'Try different keywords',
        noPosts: 'No posts yet',
        noPostsDesc: 'Stay tuned',
        home: 'Home',
        blog: 'Blog',
        langSwitch: '中文',
        backToBlog: 'Back to articles',
        readTime: 'min',
        published: 'Published',
        tags: 'Tags',
        share: 'Share this article',
        moreArticles: 'More articles',
    }
} as const;

/**
 * 標籤翻譯映射表
 * 用於將不同語言的標籤對應到統一的標籤組
 */
export const tagTranslations: Record<string, { 'zh-TW': string[]; 'en': string[] }> = {
    // Sun/Daily 相關
    'Sun': {
        'zh-TW': ['Sun', '日常'],
        'en': ['Sun', 'Daily']
    },
    'Daily': {
        'zh-TW': ['Sun', '日常'],
        'en': ['Sun', 'Daily']
    },
    '日常': {
        'zh-TW': ['Sun', '日常'],
        'en': ['Sun', 'Daily']
    },
    
    // AI 相關
    'AI': {
        'zh-TW': ['AI', '人工智能'],
        'en': ['AI', 'Artificial Intelligence']
    },
    '人工智能': {
        'zh-TW': ['AI', '人工智能'],
        'en': ['AI', 'Artificial Intelligence']
    },
    'Artificial Intelligence': {
        'zh-TW': ['AI', '人工智能'],
        'en': ['AI', 'Artificial Intelligence']
    },
    
    // Blockchain 相關
    '區塊鏈': {
        'zh-TW': ['區塊鏈', '區塊鏈技術'],
        'en': ['Blockchain']
    },
    'Blockchain': {
        'zh-TW': ['區塊鏈', '區塊鏈技術'],
        'en': ['Blockchain']
    },
    '區塊鏈技術': {
        'zh-TW': ['區塊鏈', '區塊鏈技術'],
        'en': ['Blockchain']
    },
    
    // About 相關
    '關於': {
        'zh-TW': ['關於'],
        'en': ['About']
    },
    'About': {
        'zh-TW': ['關於'],
        'en': ['About']
    },
    
    // Website Introduction 相關
    '網站介紹': {
        'zh-TW': ['網站介紹'],
        'en': ['Website Introduction']
    },
    'Website Introduction': {
        'zh-TW': ['網站介紹'],
        'en': ['Website Introduction']
    },
    
    // Personal 相關
    '個人': {
        'zh-TW': ['個人'],
        'en': ['Personal']
    },
    'Personal': {
        'zh-TW': ['個人'],
        'en': ['Personal']
    },
};

/**
 * 取得標籤的所有對應變體（用於匹配）
 */
export function getTagVariants(tag: string): string[] {
    const variants = new Set<string>();
    variants.add(tag);
    
    // 從映射表中取得所有相關標籤
    const translation = tagTranslations[tag];
    if (translation) {
        translation['zh-TW'].forEach(t => variants.add(t));
        translation['en'].forEach(t => variants.add(t));
    }
    
    // 反向查找：找到包含此標籤的所有映射
    Object.entries(tagTranslations).forEach(([key, value]) => {
        if (value['zh-TW'].includes(tag) || value['en'].includes(tag)) {
            variants.add(key);
            value['zh-TW'].forEach(t => variants.add(t));
            value['en'].forEach(t => variants.add(t));
        }
    });
    
    return Array.from(variants);
}

/**
 * 根據語言取得標籤的翻譯版本
 */
export function translateTag(tag: string, lang: 'zh-TW' | 'en'): string {
    const translation = tagTranslations[tag];
    if (translation && translation[lang].length > 0) {
        return translation[lang][0]; // 返回第一個翻譯
    }
    
    // 反向查找
    for (const [key, value] of Object.entries(tagTranslations)) {
        if (value['zh-TW'].includes(tag) || value['en'].includes(tag)) {
            if (value[lang].length > 0) {
                return value[lang][0];
            }
        }
    }
    
    return tag; // 如果找不到翻譯，返回原標籤
}

/**
 * 判斷標籤是否屬於指定語言
 */
function isTagInLanguage(tag: string, lang: 'zh-TW' | 'en'): boolean {
    // 先檢查標籤是否在映射表中
    const translation = tagTranslations[tag];
    if (translation) {
        // 如果標籤在映射表中，檢查它是否屬於該語言的標籤組
        return translation[lang].includes(tag);
    }
    
    // 反向查找：檢查標籤是否在映射表的該語言組中
    for (const [key, value] of Object.entries(tagTranslations)) {
        if (value[lang].includes(tag)) {
            return true;
        }
    }
    
    // 如果不在映射表中，根據字符判斷
    // 中文標籤通常包含中文字符
    if (lang === 'zh-TW') {
        // 檢查是否包含中文字符
        // 如果包含中文字符，則是中文標籤
        if (/[\u4e00-\u9fa5]/.test(tag)) {
            return true;
        }
        // 如果沒有中文字符，檢查是否為通用標籤（如 "Sun", "AI"）
        // 這些標籤在兩個語言中都存在
        const hasChineseVariant = Object.values(tagTranslations).some(
            value => value['zh-TW'].includes(tag)
        );
        const hasEnglishVariant = Object.values(tagTranslations).some(
            value => value['en'].includes(tag)
        );
        // 如果標籤在兩個語言組中都存在，則視為通用標籤，在中文版本中也顯示
        if (hasChineseVariant && hasEnglishVariant) {
            return true;
        }
        // 否則，沒有中文字符的標籤在中文版本中不顯示
        return false;
    } else {
        // 英文版本
        // 如果包含中文字符，則不是英文標籤
        if (/[\u4e00-\u9fa5]/.test(tag)) {
            return false;
        }
        // 英文標籤通常是英文單詞或常見的英文標籤
        // 也包含通用標籤（如 "Sun", "AI"）
        return /^[A-Za-z0-9\s]+$/.test(tag);
    }
}

/**
 * 過濾標籤，只返回屬於指定語言的標籤
 */
export function filterTagsByLanguage(tags: string[], lang: 'zh-TW' | 'en'): string[] {
    return tags.filter(tag => isTagInLanguage(tag, lang));
}




