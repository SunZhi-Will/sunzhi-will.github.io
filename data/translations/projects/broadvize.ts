export const broadvize = {
    'zh-TW': {
        title: "Broadvize - AI 多平台內容分發系統",
        description: "智能內容分發平台，將單一內容一鍵轉換為多平台優化的社群貼文。支援 LINE、Threads、X (Twitter)、Facebook、LinkedIn 等平台，透過 Google Gemini 自動適配各平台語調與格式，大幅提升內容行銷效率。",
        category: "AI 開發",
        achievements: [
            "單一內容自動生成多平台適配貼文",
            "支援 LINE、Threads、X、Facebook、LinkedIn、Instagram",
            "URL 文章自動擷取與摘要（免 API）",
            "Word 文件（.docx）直接上傳解析",
            "RSS 訂閱源整合，自動拉取最新內容",
            "可重複使用的品牌語調模板系統",
            "直接串接 LINE / Facebook / Instagram 發布功能"
        ],
        media: [
            { type: 'image' as const, src: "/projects/broadvize/home.png", alt: "Broadvize 首頁" },
            { type: 'image' as const, src: "/projects/broadvize/editor.png", alt: "內容編輯器" }
        ],
        technologies: [
            "Next.js",
            "React",
            "TypeScript",
            "Google Gemini",
            "Tailwind CSS",
            "PostgreSQL",
            "Prisma",
            "NextAuth.js"
        ],
        link: "https://github.com/sunzhi-will/broadvize"
    },
    'en': {
        title: "Broadvize - AI Multi-Platform Content Distribution",
        description: "An intelligent content distribution platform that transforms a single piece of content into platform-optimized social media posts with one click. Supports LINE, Threads, X (Twitter), Facebook, and LinkedIn, using Google Gemini to automatically adapt tone and format for each platform.",
        category: "AI Development",
        achievements: [
            "Auto-generate platform-specific posts from single input",
            "Support for LINE, Threads, X, Facebook, LinkedIn, Instagram",
            "URL article extraction and summarization (no API required)",
            "Direct Word (.docx) document upload and parsing",
            "RSS feed integration for automatic content fetching",
            "Reusable brand tone template system",
            "Direct publishing to LINE, Facebook and Instagram"
        ],
        media: [
            { type: 'image' as const, src: "/projects/broadvize/home.png", alt: "Broadvize Home" },
            { type: 'image' as const, src: "/projects/broadvize/editor.png", alt: "Content Editor" }
        ],
        technologies: [
            "Next.js",
            "React",
            "TypeScript",
            "Google Gemini",
            "Tailwind CSS",
            "PostgreSQL",
            "Prisma",
            "NextAuth.js"
        ],
        link: "https://github.com/sunzhi-will/broadvize"
    }
};
