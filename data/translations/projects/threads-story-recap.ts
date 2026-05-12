export const threadsStoryRecap = {
    'zh-TW': {
        title: "Threads Story Recap - 年度動態回顧",
        description: "讓使用者透過 Meta Threads 帳號授權，抓取歷史貼文數據，以 Instagram 限時動態風格呈現年度互動回顧。支援手勢操作的多頁面動畫播放，展示發文量、活躍時段、熱門關鍵字等精彩數據統計。",
        category: "前端開發",
        achievements: [
            "Threads OAuth 授權與歷史貼文資料抓取",
            "Instagram Stories 風格多頁面動畫播放器",
            "Framer Motion 手勢操作（點擊/滑動）",
            "發文量、活躍時段、熱門關鍵字數據分析",
            "Mobile First 響應式設計",
            "Vercel 部署"
        ],
        media: [
            { type: 'image' as const, src: "/projects/threads_story_recap/home.png", alt: "Threads Story Recap 首頁" },
            { type: 'image' as const, src: "/projects/threads_story_recap/story.png", alt: "Story 播放器" }
        ],
        technologies: [
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Framer Motion",
            "Threads API"
        ],
        link: "https://github.com/sunzhi-will/ThreadsStoryRecap"
    },
    'en': {
        title: "Threads Story Recap - Annual Story Review",
        description: "A web app that lets users authorize with their Meta Threads account, fetch historical post data, and view their annual interaction recap in an Instagram Stories-style animated slideshow. Features gesture-controlled multi-page playback showcasing post volume, active hours, and trending keywords.",
        category: "Frontend Development",
        achievements: [
            "Threads OAuth authorization and historical post fetching",
            "Instagram Stories-style multi-page animated player",
            "Framer Motion gesture controls (tap/swipe)",
            "Post volume, active hours, and keyword analytics",
            "Mobile First responsive design",
            "Vercel deployment"
        ],
        media: [
            { type: 'image' as const, src: "/projects/threads_story_recap/home.png", alt: "Threads Story Recap Home" },
            { type: 'image' as const, src: "/projects/threads_story_recap/story.png", alt: "Story Player" }
        ],
        technologies: [
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Framer Motion",
            "Threads API"
        ],
        link: "https://github.com/sunzhi-will/ThreadsStoryRecap"
    }
};
