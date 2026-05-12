export const nexusos = {
    'zh-TW': {
        title: "NexusOS - AI 個人知識庫 SaaS",
        description: "自架多租戶 AI 個人知識庫 SaaS，以 Docker Compose 一鍵部署。將所有資料（文件、網頁、Google Drive、社群媒體、音訊影片）統一向量化後，透過 Hybrid Search + AI 多模型對話引用來源回答。類比 NotebookLM + Notion + 個人 AI 助理三合一，採全 MIT / Apache 可商用開源技術棧。",
        category: "AI 開發",
        achievements: [
            "全格式資料統一向量化（PDF / 音訊 / 影片 / URL / Google Drive）",
            "Qdrant 向量資料庫 Hybrid Search，AI 對話附帶引用來源",
            "Vercel AI SDK 直連多 Provider（OpenAI / Anthropic / Google / Groq）",
            "BlockNote（Notion 式）文件編輯器內建於知識庫",
            "Better Auth 多租戶系統，每 org 獨立知識庫",
            "faster-whisper 本地音訊轉錄 + Crawl4AI JS SPA 爬取",
            "5 容器 Docker 精簡架構（Caddy + Next.js + Worker + PostgreSQL + Qdrant）"
        ],
        media: [
            { type: 'image' as const, src: "/projects/nexusos/home.png", alt: "NexusOS 首頁" },
            ],
        technologies: [
            "Next.js",
            "TypeScript",
            "Python",
            "Qdrant",
            "PostgreSQL",
            "BullMQ",
            "Redis",
            "Docker",
            "Vercel AI SDK",
            "Caddy"
        ],
        link: "https://github.com/SunZhi-Will/NexusOS"
    },
    'en': {
        title: "NexusOS - AI Personal Knowledge Base SaaS",
        description: "A self-hosted multi-tenant AI personal knowledge base SaaS deployed with Docker Compose. Unifies all data (documents, web pages, Google Drive, social media, audio/video) into vector embeddings, then answers via Hybrid Search + AI multi-model conversation with source citations. Think NotebookLM + Notion + Personal AI Assistant in one, using fully MIT/Apache commercially-usable stack.",
        category: "AI Development",
        achievements: [
            "All-format data vectorization (PDF / audio / video / URL / Google Drive)",
            "Qdrant Hybrid Search with AI conversation citing sources",
            "Vercel AI SDK direct multi-provider (OpenAI / Anthropic / Google / Groq)",
            "BlockNote (Notion-style) document editor built into knowledge base",
            "Better Auth multi-tenant system with isolated org knowledge bases",
            "Local audio transcription (faster-whisper) + Crawl4AI JS SPA scraping",
            "5-container Docker lean architecture (Caddy + Next.js + Worker + PostgreSQL + Qdrant)"
        ],
        media: [
            { type: 'image' as const, src: "/projects/nexusos/home.png", alt: "NexusOS Home" },
            ],
        technologies: [
            "Next.js",
            "TypeScript",
            "Python",
            "Qdrant",
            "PostgreSQL",
            "BullMQ",
            "Redis",
            "Docker",
            "Vercel AI SDK",
            "Caddy"
        ],
        link: "https://github.com/SunZhi-Will/NexusOS"
    }
};
