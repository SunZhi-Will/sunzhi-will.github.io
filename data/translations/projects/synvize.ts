export const synvize = {
    'zh-TW': {
        title: "Synvize 新維境",
        description: "由 Sun 獨立創立與經營的 AI 原生產品公司，獨立打造 AI 創作工具、學習平台與互動敘事體驗。官網（Next.js 16 + Tailwind CSS v4，繁中／英雙語）以「公司事實與網站階段」為單一資料源，旗下 6 項產品已公開，每項都清楚標示目前狀態、可用範圍與下一步，未通過驗證的內容一律不上架。",
        category: "AI 開發",
        achievements: [
            "獨立設計、開發並維運公司官網，繁中／英雙語內容同步一致",
            "旗下 6 項產品上線：4 項已開放使用、2 項測試中",
            "以資料驅動公司階段（籌備中／已成立）與內容公開門檻，未附證據的作品不得上架",
            "Lighthouse CI、Playwright E2E、無障礙（jsx-a11y）與降低動態偏好測試齊備",
            "WebSite／Person 結構化資料、SEO 與 OG 圖自動產生",
            "Server Action 聯絡表單，內建限流與 Email 備援機制"
        ],
        media: [
            { type: 'image' as const, src: "/projects/synvize/home.png", alt: "Synvize 新維境品牌識別圖" },
        ],
        technologies: [
            "Next.js 16",
            "React 19",
            "TypeScript",
            "Tailwind CSS v4",
            "Zod",
            "Playwright",
        ],
    },
    'en': {
        title: "Synvize",
        description: "An AI-native product company independently founded and run by Sun, building AI creative tools, learning platforms, and interactive narrative experiences. The bilingual site (Next.js 16 + Tailwind CSS v4) treats company facts and site stage as a single source of truth — 6 products are public, each with a clearly stated status, scope, and next step, and nothing ships without evidence.",
        category: "AI Development",
        achievements: [
            "Independently designed, built, and operate the company site with synchronized bilingual (zh-TW/en) content",
            "6 products shipped under the brand: 4 available, 2 in testing",
            "Data-driven company stage (preparing / established) and a content publication gate that blocks unverified claims",
            "Full Lighthouse CI, Playwright E2E, accessibility (jsx-a11y), and reduced-motion test coverage",
            "Auto-generated WebSite/Person structured data, SEO metadata, and OG images",
            "Server Action contact form with rate limiting and an email fallback"
        ],
        media: [
            { type: 'image' as const, src: "/projects/synvize/home.png", alt: "Synvize brand image" },
        ],
        technologies: [
            "Next.js 16",
            "React 19",
            "TypeScript",
            "Tailwind CSS v4",
            "Zod",
            "Playwright",
        ],
    }
};
