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
    },
    'ja': {
        title: 'ブログ',
        subtitle: '技術記事と開発ノート',
        searchPlaceholder: '記事検索',
        allPosts: 'すべて',
        readMore: '続きを読む',
        noResults: '該当記事が見つかりません',
        noResultsDesc: '他のキーワードをお試しください',
        noPosts: '記事がまだありません',
        noPostsDesc: 'お楽しみに',
        home: 'ホーム',
        blog: 'ブログ',
        langSwitch: 'EN',
        backToBlog: '記事一覧に戻る',
        readTime: '分',
        published: '公開日',
        tags: 'タグ',
        share: 'この記事をシェア',
        moreArticles: 'もっと記事を見る',
    },
    'ko': {
        title: '블로그',
        subtitle: '기술 기사와 개발 노트',
        searchPlaceholder: '기사 검색',
        allPosts: '전체',
        readMore: '더 읽기',
        noResults: '해당 기사를 찾을 수 없습니다',
        noResultsDesc: '다른 키워드를 시도해보세요',
        noPosts: '아직 기사가 없습니다',
        noPostsDesc: '기대해주세요',
        home: '홈',
        blog: '블로그',
        langSwitch: 'EN',
        backToBlog: '기사 목록으로 돌아가기',
        readTime: '분',
        published: '게시일',
        tags: '태그',
        share: '이 기사 공유하기',
        moreArticles: '더 많은 기사 보기',
    },
    'es': {
        title: 'Blog',
        subtitle: 'Artículos Técnicos y Notas de Desarrollo',
        searchPlaceholder: 'Buscar artículos',
        allPosts: 'Todos',
        readMore: 'Leer más',
        noResults: 'No se encontraron artículos',
        noResultsDesc: 'Prueba con otras palabras clave',
        noPosts: 'Aún no hay artículos',
        noPostsDesc: 'Mantente atento',
        home: 'Inicio',
        blog: 'Blog',
        langSwitch: 'EN',
        backToBlog: 'Volver a artículos',
        readTime: 'min',
        published: 'Publicado',
        tags: 'Etiquetas',
        share: 'Compartir este artículo',
        moreArticles: 'Más artículos',
    },
    'fr': {
        title: 'Blog',
        subtitle: 'Articles Techniques et Notes de Développement',
        searchPlaceholder: 'Rechercher des articles',
        allPosts: 'Tous',
        readMore: 'Lire la suite',
        noResults: 'Aucun article trouvé',
        noResultsDesc: 'Essayez d\'autres mots-clés',
        noPosts: 'Pas encore d\'articles',
        noPostsDesc: 'Restez à l\'écoute',
        home: 'Accueil',
        blog: 'Blog',
        langSwitch: 'EN',
        backToBlog: 'Retour aux articles',
        readTime: 'min',
        published: 'Publié',
        tags: 'Tags',
        share: 'Partager cet article',
        moreArticles: 'Plus d\'articles',
    },
    'de': {
        title: 'Blog',
        subtitle: 'Technische Artikel und Entwicklungsnotizen',
        searchPlaceholder: 'Artikel suchen',
        allPosts: 'Alle',
        readMore: 'Mehr lesen',
        noResults: 'Keine Artikel gefunden',
        noResultsDesc: 'Versuchen Sie andere Schlüsselwörter',
        noPosts: 'Noch keine Artikel',
        noPostsDesc: 'Bleiben Sie dran',
        home: 'Startseite',
        blog: 'Blog',
        langSwitch: 'EN',
        backToBlog: 'Zurück zu Artikeln',
        readTime: 'Min',
        published: 'Veröffentlicht',
        tags: 'Tags',
        share: 'Diesen Artikel teilen',
        moreArticles: 'Mehr Artikel',
    }
} as const;

/**
 * 標籤翻譯映射表
 * 用於將不同語言的標籤對應到統一的標籤組
 */
export const tagTranslations: Record<string, { 'zh-TW': string[]; 'en': string[]; 'ja': string[]; 'ko': string[]; 'es': string[]; 'fr': string[]; 'de': string[] }> = {
    // Sun/Daily 相關
    'Sun': {
        'zh-TW': ['Sun', '日常'],
        'en': ['Sun', 'Daily'],
        'ja': ['Sun', '日常'],
        'ko': ['Sun', '일상'],
        'es': ['Sun', 'Diario'],
        'fr': ['Sun', 'Quotidien'],
        'de': ['Sun', 'Täglich']
    },
    'Daily': {
        'zh-TW': ['Sun', '日常'],
        'en': ['Sun', 'Daily'],
        'ja': ['Sun', '日常'],
        'ko': ['Sun', '일상'],
        'es': ['Sun', 'Diario'],
        'fr': ['Sun', 'Quotidien'],
        'de': ['Sun', 'Täglich']
    },
    '日常': {
        'zh-TW': ['Sun', '日常'],
        'en': ['Sun', 'Daily'],
        'ja': ['Sun', '日常'],
        'ko': ['Sun', '일상'],
        'es': ['Sun', 'Diario'],
        'fr': ['Sun', 'Quotidien'],
        'de': ['Sun', 'Täglich']
    },
    
    // AI 相關
    'AI': {
        'zh-TW': ['AI', '人工智能'],
        'en': ['AI', 'Artificial Intelligence'],
        'ja': ['AI', '人工知能'],
        'ko': ['AI', '인공지능'],
        'es': ['AI', 'Inteligencia Artificial'],
        'fr': ['AI', 'Intelligence Artificielle'],
        'de': ['AI', 'Künstliche Intelligenz']
    },
    '人工智能': {
        'zh-TW': ['AI', '人工智能'],
        'en': ['AI', 'Artificial Intelligence'],
        'ja': ['AI', '人工知能'],
        'ko': ['AI', '인공지능'],
        'es': ['AI', 'Inteligencia Artificial'],
        'fr': ['AI', 'Intelligence Artificielle'],
        'de': ['AI', 'Künstliche Intelligenz']
    },
    'Artificial Intelligence': {
        'zh-TW': ['AI', '人工智能'],
        'en': ['AI', 'Artificial Intelligence'],
        'ja': ['AI', '人工知能'],
        'ko': ['AI', '인공지능'],
        'es': ['AI', 'Inteligencia Artificial'],
        'fr': ['AI', 'Intelligence Artificielle'],
        'de': ['AI', 'Künstliche Intelligenz']
    },
    
    // Blockchain 相關
    '區塊鏈': {
        'zh-TW': ['區塊鏈', '區塊鏈技術'],
        'en': ['Blockchain'],
        'ja': ['ブロックチェーン'],
        'ko': ['블록체인'],
        'es': ['Blockchain'],
        'fr': ['Blockchain'],
        'de': ['Blockchain']
    },
    'Blockchain': {
        'zh-TW': ['區塊鏈', '區塊鏈技術'],
        'en': ['Blockchain'],
        'ja': ['ブロックチェーン'],
        'ko': ['블록체인'],
        'es': ['Blockchain'],
        'fr': ['Blockchain'],
        'de': ['Blockchain']
    },
    '區塊鏈技術': {
        'zh-TW': ['區塊鏈', '區塊鏈技術'],
        'en': ['Blockchain'],
        'ja': ['ブロックチェーン'],
        'ko': ['블록체인'],
        'es': ['Blockchain'],
        'fr': ['Blockchain'],
        'de': ['Blockchain']
    },
    
    // About 相關
    '關於': {
        'zh-TW': ['關於'],
        'en': ['About'],
        'ja': ['について'],
        'ko': ['소개'],
        'es': ['Acerca de'],
        'fr': ['À propos'],
        'de': ['Über']
    },
    'About': {
        'zh-TW': ['關於'],
        'en': ['About'],
        'ja': ['について'],
        'ko': ['소개'],
        'es': ['Acerca de'],
        'fr': ['À propos'],
        'de': ['Über']
    },
    
    // Website Introduction 相關
    '網站介紹': {
        'zh-TW': ['網站介紹'],
        'en': ['Website Introduction'],
        'ja': ['ウェブサイト紹介'],
        'ko': ['웹사이트 소개'],
        'es': ['Introducción del Sitio Web'],
        'fr': ['Introduction du Site Web'],
        'de': ['Website-Einführung']
    },
    'Website Introduction': {
        'zh-TW': ['網站介紹'],
        'en': ['Website Introduction'],
        'ja': ['ウェブサイト紹介'],
        'ko': ['웹사이트 소개'],
        'es': ['Introducción del Sitio Web'],
        'fr': ['Introduction du Site Web'],
        'de': ['Website-Einführung']
    },
    
    // Personal 相關
    '個人': {
        'zh-TW': ['個人'],
        'en': ['Personal'],
        'ja': ['個人'],
        'ko': ['개인'],
        'es': ['Personal'],
        'fr': ['Personnel'],
        'de': ['Persönlich']
    },
    'Personal': {
        'zh-TW': ['個人'],
        'en': ['Personal'],
        'ja': ['個人'],
        'ko': ['개인'],
        'es': ['Personal'],
        'fr': ['Personnel'],
        'de': ['Persönlich']
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
        Object.values(translation).forEach(langTags => {
            langTags.forEach(t => variants.add(t));
        });
    }
    
    // 反向查找：找到包含此標籤的所有映射
    Object.entries(tagTranslations).forEach(([key, value]) => {
        const allLangTags = Object.values(value).flat();
        if (allLangTags.includes(tag)) {
            variants.add(key);
            allLangTags.forEach(t => variants.add(t));
        }
    });
    
    return Array.from(variants);
}

/**
 * 根據語言取得標籤的翻譯版本
 */
export function translateTag(tag: string, lang: 'zh-TW' | 'en' | 'ja' | 'ko' | 'es' | 'fr' | 'de'): string {
    const translation = tagTranslations[tag];
    if (translation && translation[lang].length > 0) {
        return translation[lang][0]; // 返回第一個翻譯
    }
    
    // 反向查找
    for (const [, value] of Object.entries(tagTranslations)) {
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
function isTagInLanguage(tag: string, lang: 'zh-TW' | 'en' | 'ja' | 'ko' | 'es' | 'fr' | 'de'): boolean {
    // 先檢查標籤是否在映射表中
    const translation = tagTranslations[tag];
    if (translation) {
        // 如果標籤在映射表中，檢查它是否屬於該語言的標籤組
        return translation[lang].includes(tag);
    }

    // 反向查找：檢查標籤是否在映射表的該語言組中
    for (const [, value] of Object.entries(tagTranslations)) {
        if (value[lang].includes(tag)) {
            return true;
        }
    }

    // 如果不在映射表中，根據語言和字符判斷
    switch (lang) {
        case 'zh-TW':
            // 中文標籤通常包含中文字符
            if (/[\u4e00-\u9fa5]/.test(tag)) {
                return true;
            }
            // 檢查是否為通用標籤
            const hasChineseVariant = Object.values(tagTranslations).some(
                value => value['zh-TW'].includes(tag)
            );
            return hasChineseVariant;

        case 'ja':
            // 日文標籤通常包含日文字符（平假名、片假名、漢字）
            if (/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(tag)) {
                return true;
            }
            // 檢查是否為通用標籤
            const hasJapaneseVariant = Object.values(tagTranslations).some(
                value => value['ja'].includes(tag)
            );
            return hasJapaneseVariant;

        case 'ko':
            // 韓文標籤通常包含韓文字符
            if (/[\uac00-\ud7af\u1100-\u11ff]/.test(tag)) {
                return true;
            }
            // 檢查是否為通用標籤
            const hasKoreanVariant = Object.values(tagTranslations).some(
                value => value['ko'].includes(tag)
            );
            return hasKoreanVariant;

        case 'es':
            // 西班牙文標籤通常是英文或西班牙文單詞
            if (/^[A-Za-z0-9\sáéíóúüñÁÉÍÓÚÜÑ]+$/.test(tag)) {
                return true;
            }
            // 檢查是否為通用標籤
            const hasSpanishVariant = Object.values(tagTranslations).some(
                value => value['es'].includes(tag)
            );
            return hasSpanishVariant;

        case 'fr':
            // 法文標籤通常是英文或法文單詞
            if (/^[A-Za-z0-9\sàâäéèêëïîôöùûüÿçÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]+$/.test(tag)) {
                return true;
            }
            // 檢查是否為通用標籤
            const hasFrenchVariant = Object.values(tagTranslations).some(
                value => value['fr'].includes(tag)
            );
            return hasFrenchVariant;

        case 'de':
            // 德文標籤通常是英文或德文單詞
            if (/^[A-Za-z0-9\säöüßÄÖÜẞ]+$/.test(tag)) {
                return true;
            }
            // 檢查是否為通用標籤
            const hasGermanVariant = Object.values(tagTranslations).some(
                value => value['de'].includes(tag)
            );
            return hasGermanVariant;

        case 'en':
        default:
            // 英文標籤通常是英文單詞或常見的英文標籤
            if (/^[A-Za-z0-9\s]+$/.test(tag)) {
                return true;
            }
            // 檢查是否為通用標籤
            const hasEnglishVariant = Object.values(tagTranslations).some(
                value => value['en'].includes(tag)
            );
            return hasEnglishVariant;
    }
}

/**
 * 過濾標籤，只返回屬於指定語言的標籤
 */
export function filterTagsByLanguage(tags: string[], lang: 'zh-TW' | 'en' | 'ja' | 'ko' | 'es' | 'fr' | 'de'): string[] {
    return tags.filter(tag => isTagInLanguage(tag, lang));
}




