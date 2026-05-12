export const threado = {
    'zh-TW': {
        title: "Threado - Threads AI 排程管理系統",
        description: "基於 Next.js 的全棧應用，整合 Threads 帳號實現文章管理、AI 自動撰寫與排程發布功能。透過 Google Gemini 根據主題自動生成文章內容，結合 BullMQ 任務排程實現全自動化社群經營流程。",
        category: "AI 開發",
        achievements: [
            "Threads OAuth 整合與帳號綁定",
            "AI 自動生成 Threads 文章內容",
            "BullMQ + Redis 任務排程系統",
            "文章排程發布與狀態管理",
            "支援 Google / GitHub / Email 多方式登入",
            "Next.js 15 全棧架構實作"
        ],
        media: [
            { type: 'image' as const, src: "/projects/threado/home.png", alt: "Threado 首頁" },
            { type: 'image' as const, src: "/projects/threado/dashboard.png", alt: "文章管理儀表板" }
        ],
        technologies: [
            "Next.js",
            "TypeScript",
            "Google Gemini",
            "Threads API",
            "BullMQ",
            "Redis",
            "PostgreSQL",
            "Prisma",
            "NextAuth.js"
        ],
        link: "https://github.com/sunzhi-will/threado"
    },
    'en': {
        title: "Threado - Threads AI Scheduling Manager",
        description: "A full-stack Next.js application integrating Threads accounts for post management, AI auto-writing, and scheduled publishing. Uses Google Gemini to automatically generate content based on topics, combined with BullMQ task scheduling for fully automated social media management.",
        category: "AI Development",
        achievements: [
            "Threads OAuth integration and account binding",
            "AI-powered automatic Threads post generation",
            "BullMQ + Redis task scheduling system",
            "Scheduled post publishing and status management",
            "Multi-auth support: Google, GitHub, Email",
            "Next.js 15 full-stack architecture"
        ],
        media: [
            { type: 'image' as const, src: "/projects/threado/home.png", alt: "Threado Home" },
            { type: 'image' as const, src: "/projects/threado/dashboard.png", alt: "Post Management Dashboard" }
        ],
        technologies: [
            "Next.js",
            "TypeScript",
            "Google Gemini",
            "Threads API",
            "BullMQ",
            "Redis",
            "PostgreSQL",
            "Prisma",
            "NextAuth.js"
        ],
        link: "https://github.com/sunzhi-will/threado"
    }
};
