export const vibeWorkshop = {
    'zh-TW': {
        title: "VibeWorkshop - 課程管理平台",
        description: "為 AI Vibe Coding 工作坊設計的全端課程管理系統，前端採 Next.js App Router，後台管理系統具備儀表板、課程管理、學員追蹤、訂單管理、數據分析與報表功能，以 Framer Motion 實現流暢頁面轉場，並支援 PostgreSQL 資料層。",
        category: "全端開發",
        achievements: [
            "課程管理完整 CRUD（課程、成員、訂單、反饋）",
            "管理員儀表板：數據分析、報表、設定",
            "Framer Motion 頁面轉場動畫效果",
            "Prisma ORM + PostgreSQL 資料庫整合",
            "前後端分離架構（Workshop 前台 + Backend 管理後台）",
            "Tailwind CSS 4 + 自定義 UI 組件庫"
        ],
        media: [
            { type: 'image' as const, src: "/projects/vibe_workshop/home.png", alt: "VibeWorkshop 首頁" },
            { type: 'image' as const, src: "/projects/vibe_workshop/dashboard.png", alt: "管理儀表板" }
        ],
        technologies: [
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Framer Motion",
            "Prisma",
            "PostgreSQL",
            "React"
        ],
        link: "https://github.com/SunZhi-Will/vibe-workshop"
    },
    'en': {
        title: "VibeWorkshop - Course Management Platform",
        description: "A full-stack course management system designed for AI Vibe Coding workshops. The frontend uses Next.js App Router, while the backend admin system features a dashboard, course management, student tracking, order management, analytics, and reporting, with Framer Motion page transitions and PostgreSQL data layer.",
        category: "Full Stack Development",
        achievements: [
            "Full CRUD for courses, members, orders, and feedback",
            "Admin dashboard: analytics, reports, settings",
            "Framer Motion page transition animations",
            "Prisma ORM + PostgreSQL database integration",
            "Separated frontend/backend (Workshop UI + Admin Backend)",
            "Tailwind CSS 4 + custom UI component library"
        ],
        media: [
            { type: 'image' as const, src: "/projects/vibe_workshop/home.png", alt: "VibeWorkshop Home" },
            { type: 'image' as const, src: "/projects/vibe_workshop/dashboard.png", alt: "Admin Dashboard" }
        ],
        technologies: [
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Framer Motion",
            "Prisma",
            "PostgreSQL",
            "React"
        ],
        link: "https://github.com/SunZhi-Will/vibe-workshop"
    }
};
