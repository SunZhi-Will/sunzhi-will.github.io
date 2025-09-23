export const projects = {
    'zh-TW': [
        {
            title: "Threads Saver - 瀏覽器擴充工具",
            buttonText: "Chrome擴充功能",
            description: "一個強大的 Threads 瀏覽器擴充工具，提供多種實用功能來增強您的瀏覽體驗。Threads Saver 讓您輕鬆下載和保存 Threads 上的內容，包括文字、圖片、影片等，支援多種格式輸出和批次處理功能。",
            category: "前端開發",
            achievements: [
                "智能下載功能：一鍵下載 Threads 帖子的所有內容",
                "多格式支援：Markdown、JSON、HTML、純文字、CSV 格式",
                "批次處理：支援批量下載多個帖子",
                "進階設定：自定義下載品質等選項",
                "即時通知：操作結果即時反饋",
                "狀態記憶：下載狀態持久化保存",
                "視覺反饋：下載完成後圖標變色提示",
                "Threads風格介面：採用原生深色主題設計"
            ],
            technologies: [
                "Chrome Extension",
                "TypeScript",
                "JSZip",
                "Manifest V3",
                "CSS3",
                "Webpack",
                "Sharp"
            ],
            media: [
                { type: 'image' as const, src: "/projects/threads_saver/logo.png", alt: "Threads Saver Logo" },
                { type: 'image' as const, src: "/projects/threads_saver/image1.png", alt: "Threads Saver 主介面" },
                { type: 'image' as const, src: "/projects/threads_saver/image2.png", alt: "Threads Saver 下載功能" },
                { type: 'image' as const, src: "/projects/threads_saver/image3.png", alt: "Threads Saver 設定頁面" }
            ],
            link: "https://chromewebstore.google.com/detail/threads-saver/placeholder-id"
        },
        {
            title: "Postly - 反思分享社群平台",
            description: "專注於個人成長和反思分享的社群平台，讓使用者能夠記錄並分享他們的日常反思和見解。提供每日反思提示、社群互動、個人成就追蹤等功能，使用現代化的 Next.js 和 React 技術構建。",
            category: "全端開發",
            achievements: [
                "每日精選反思主題與深度思考引導",
                "完整的社群互動系統（按讚、評論、分享）",
                "個人成就追蹤與連續反思紀錄",
                "即時互動通知與參與度分析",
                "Google OAuth 認證與安全的使用者管理",
                "響應式設計與無障礙功能支援"
            ],
            technologies: [
                "Next.js 15",
                "React 19",
                "TypeScript",
                "Tailwind CSS 4",
                "NextAuth.js",
                "TanStack Query",
                "Headless UI"
            ],
            media: [
                { type: 'image' as const, src: "/projects/postly/logo.png", alt: "Postly Logo" },
                { type: 'video' as const, src: "/projects/postly/Postly.mp4", alt: "Postly 演示影片" }
            ],
            link: "https://github.com/SunZhi-Will/Postly",
            demo: "https://postly-gilt.vercel.app"
        },
        {
            title: "CoinHub - 加密貨幣交易與投資組合管理",
            description: "基於 Flutter 開發的綜合加密貨幣交易和投資組合管理應用程式，提供用戶完整的數位資產管理平台。透過 Web3 和 API 整合，支援多種區塊鏈網路和加密貨幣交易所。",
            category: "移動應用開發",
            achievements: [
                "實現即時加密貨幣價格追蹤",
                "建立完整的投資組合管理系統",
                "整合多個區塊鏈網路與交易所 API",
                "實現錢包連結與交易功能",
                "開發圖表視覺化與技術分析工具",
                "建立安全的資料儲存與加密機制"
            ],
            technologies: [
                "Flutter",
                "Dart",
                "web3dart",
                "WalletConnect",
                "fl_chart",
                "shared_preferences",
                "crypto",
                "WebSocket"
            ],
            media: [
                { type: 'image' as const, src: "/projects/coinhub/logo.png", alt: "CoinHub App Logo" }
            ]
        },
        {
            title: "Sun UI Design",
            description: "一個具有精美動畫效果的現代 React UI 組件庫，使用 React、TailwindCSS 和 TypeScript 構建。提供現代化且可自定義的組件，支持 Tree-shaking 導出。",
            category: "前端開發",
            achievements: [
                "設計並實現多個現代化 UI 組件",
                "支持獨立包或整體打包安裝",
                "完整的 TypeScript 類型支持",
                "TailwindCSS 整合優化",
                "Storybook 文檔與展示",
                "優化的打包與發佈流程"
            ],
            technologies: [
                "React",
                "TypeScript",
                "TailwindCSS",
                "Storybook",
                "Lerna",
                "npm"
            ],
            media: [
                { type: 'image' as const, src: "/projects/sunui/preview.png", alt: "Sun UI Design Logo" }
            ],
            link: "https://github.com/SunZhi-Will/sunui-design",
            demo: "https://sunui.vercel.app/"
        },
        {
            title: "Google Form AI 自動填寫工具",
            description: "使用 Google Gemini AI 來自動填寫 Google Form 的智能工具，只需提供表單網址和基本資訊，即可自動生成填寫用的網址",
            category: "AI 開發",
            achievements: [
                "使用 Gemini AI 智能生成答案",
                "自動解析 Google Form 結構",
                "支援多種題型：簡答題、詳答題、選擇題、下拉式選單等",
                "同時提供純前端應用與 Python 後端版本",
                "完整的使用說明與錯誤處理"
            ],
            technologies: [
                "HTML",
                "CSS",
                "JavaScript",
                "Python",
                "Google Gemini AI",
                "RESTful API"
            ],
            media: [
                { type: 'image' as const, src: "/projects/gform_ai/preview.png", alt: "Google Form AI 自動填寫工具" }
            ],
            link: "https://github.com/SunZhi-Will/AutoFormAI",
            demo: "https://auto-form-ai.vercel.app/"
        },
        {
            title: "LexiTechly - 智慧英文內容分析",
            buttonText: "Chrome擴充功能",
            description: "使用 Google Gemini AI 分析英文網頁內容，提供 CEFR 等級評估、單字解析、AI 互動對話與語音發音功能，提升您的英文閱讀與學習體驗！",
            category: "AI 開發",
            achievements: [
                "網頁英文內容的 CEFR 等級分析",
                "全方位的詞彙、語法和主題難度評估",
                "互動式 AI 對話功能",
                "單字列表與 AI 詞彙分析",
                "支援單字和例句的語音播放",
                "無限制的本地儲存空間"
            ],
            technologies: [
                "Chrome Extension",
                "HTML",
                "CSS",
                "JavaScript",
                "Google Gemini AI",
                "Speechify API",
                "IndexedDB"
            ],
            media: [
                { type: 'image' as const, src: "/projects/lexitechly/unnamed.png", alt: "LexiTechly 主介面" },
                { type: 'image' as const, src: "/projects/lexitechly/analysis.png", alt: "內容分析" },
                { type: 'image' as const, src: "/projects/lexitechly/vocabulary.png", alt: "詞彙分析" },
                { type: 'image' as const, src: "/projects/lexitechly/chat.png", alt: "AI 對話" }
            ],
            link: "https://chromewebstore.google.com/detail/lexitechly-%E6%99%BA%E6%85%A7%E8%8B%B1%E6%96%87%E5%85%A7%E5%AE%B9%E5%88%86%E6%9E%90/lnfheajgimgpheflgjgknhnppanfenmk"
        },
        {
            title: "DeepCrawlAI",
            description: "一個結合網頁爬蟲和 AI 分析的智能爬蟲工具，能夠深度爬取網頁內容並使用 Gemini AI 進行智能分析。",
            category: "AI 開發",
            achievements: [
                "智能網頁爬蟲，支援多層次深度爬取",
                "使用 Google Gemini AI 進行內容分析",
                "支援動態網頁爬取（Selenium）和靜態網頁爬取",
                "自動提取相關連結並遞迴爬取",
                "將網頁內容轉換為結構化的 Markdown 格式",
                "防止重複爬取相同網頁"
            ],
            technologies: [
                "Python",
                "Google Gemini AI",
                "BeautifulSoup",
                "Selenium",
                "Cloudscraper"
            ],
            media: [
                { type: 'image' as const, src: "https://opengraph.githubassets.com/1/SunZhi-Will/DeepCrawlAI", alt: "DeepCrawlAI Screenshot" }
            ],
            link: "https://github.com/SunZhi-Will/DeepCrawlAI"
        },
        {
            title: "Synvize",
            description: "AI 驅動的內容生成平台，能夠自動整合網站、YouTube、新聞和文本等多元資料來源，透過 AI 分析並生成結構化文章。使用者可以編輯生成的內容，並與社群分享。平台內建 AI 助手，協助讀者快速理解文章重點。",
            category: "AI 開發",
            achievements: [
                "多源數據自動蒐集與整合",
                "AI 智能分析與文章生成",
                "社群內容分享與互動功能",
                "內建 AI 助手即時解答",
                "自動新聞追蹤與更新",
                "文章編輯與發布系統"
            ],
            media: [
                { type: 'image' as const, src: "/projects/synvize/home.png", alt: "Synvize 首頁" },
                { type: 'image' as const, src: "/projects/synvize/edit.png", alt: "編輯介面" }
            ],
            technologies: [
                "Next.js",
                "Python",
                "Google Gemini",
                "PostgreSQL",
                "Web Scraping",
            ],
            link: "https://synvize.com/"
        },
        {
            title: "Snapraze",
            description: "提供圖片雲端儲存、編輯標記以及原圖比對功能的平台。使用者可以上傳、管理、編輯和比較圖片，支援多種圖片格式，並提供完整的圖片管理系統。",
            category: "全端開發",
            achievements: [
                "雲端圖片儲存與管理系統",
                "圖片編輯與標記工具",
                "原圖與編輯圖即時比對",
                "支援多種圖片格式",
                "完整的修改記錄追蹤",
                "使用者權限管理"
            ],
            media: [
                { type: 'image' as const, src: "/projects/snapraze/logo.png", alt: "Snapraze Logo" },
                { type: 'image' as const, src: "/projects/snapraze/page1.png", alt: "Snapraze 主頁面" },
                { type: 'image' as const, src: "/projects/snapraze/page2.png", alt: "Snapraze 圖片編輯" },
                { type: 'image' as const, src: "/projects/snapraze/page3.png", alt: "Snapraze 圖片比對" }
            ],
            technologies: [
                "Next.js",
                "TypeScript",
                "Tailwind CSS",
                "Shadcn/ui",
                "Cloudinary",
                "PostgreSQL",
                "Prisma",
                "Fabric.js"
            ],
            link: "https://github.com/SunZhi-Will/snapraze"
        },
        {
            title: "MemoryLane",
            description: "優雅的 LINE 聊天記錄回顧網站，讓您以全新方式重溫珍貴對話與回憶。支援上傳 LINE 聊天紀錄並以時間軸方式呈現，提供彈幕特效與完全本地處理機制保護隱私。",
            category: "前端開發",
            achievements: [
                "簡易上傳 LINE 匯出的聊天記錄檔案",
                "精美的按月份時間軸顯示",
                "瀏覽特定月份時顯示隨機對話彈幕特效",
                "所有處理皆在本地完成，保護隱私",
                "響應式設計，支援多裝置體驗",
                "簡潔直觀的用戶界面"
            ],
            technologies: [
                "Next.js 15.2",
                "React 19",
                "TypeScript 5",
                "Tailwind CSS 4",
                "Framer Motion",
                "date-fns 4",
                "localStorage"
            ],
            media: [
                { type: 'image' as const, src: "/projects/memory_lane/preview.png", alt: "MemoryLane Logo" },
                { type: 'image' as const, src: "/projects/memory_lane/home.png", alt: "MemoryLane Home" },
                { type: 'youtube' as const, src: "CPTTjLaydVU", alt: "MemoryLane 演示" }
            ],
            link: "https://github.com/SunZhi-Will/memory-lane",
            demo: "https://memorylane-nine.vercel.app/"
        },
        {
            title: "汽車工廠供料防呆系統",
            description: "使用 .NET 開發的汽車工廠供料監控網站，整合工料機制進行防呆檢測。當供料與工單不對應時，系統會即時顯示錯誤並提供錯誤編號，確保生產線正常運作。這是舊系統的全面翻新專案，由我獨自負責開發與工廠端對接。",
            category: "後端開發",
            achievements: [
                "設計並實現供料與工單對應檢核機制",
                "建立即時錯誤監控與通報系統",
                "開發錯誤編號管理與追蹤功能",
                "完成舊系統架構全面翻新",
                "建立與工廠設備的串接介面",
                "優化防呆檢測算法提升準確度"
            ],
            technologies: [
                ".NET Framework",
                "ASP.NET MVC",
                "SQL Server",
                "C#",
                "JavaScript",
                "Bootstrap",
                "AJAX"
            ],
            media: [
                { type: 'image' as const, src: "/projects/factory/screenshot.jpg", alt: "汽車工廠供料防呆系統監控介面" }
            ]
        },
        {
            title: "AR 垃圾車體感遊戲",
            description: "結合 AR 與影像辨識技術的垃圾車主題體感遊戲，包含「垃圾車等等我」追逐模式和「打擊垃圾車」戰鬥模式。運用身體動作控制遊戲角色，完成追趕垃圾車和攻擊垃圾車的任務挑戰。",
            category: "遊戲開發",
            achievements: [
                "開發雙模式體感遊戲系統",
                "整合 AR 影像辨識與人體姿態追蹤",
                "實現身體動作控制機制",
                "設計垃圾車追逐與戰鬥玩法",
                "建立 3D 城市場景與垃圾車模型",
                "優化手機端 AR 效能與體驗"
            ],
            technologies: [
                "Unity",
                "AR Foundation",
                "MediaPipe",
                "Computer Vision",
                "C#",
                "3D Modeling",
                "Mobile Development"
            ],
            media: [
                { type: 'image' as const, src: "/projects/games/garbage.png", alt: "AR 垃圾車體感遊戲介紹" }
            ]
        },
        {
            title: "VR 恐龍射擊",
            description: "VR 射擊遊戲，整合不同專案架構，實現流暢的 VR 射擊體驗",
            category: "遊戲開發",
            achievements: [
                "整合多個專案架構",
                "優化 VR 互動體驗",
                "設計怪物生成系統",
                "實現多樣化武器系統"
            ],
            media: [
                { type: 'image' as const, src: "/projects/games/hqdefault.jpg", alt: "VR 恐龍射擊遊戲畫面" },
                { type: 'youtube' as const, src: "tvRp9Dz0hQA", alt: "VR 恐龍射擊遊戲畫面" }
            ],
            technologies: ["Unity", "SteamVR", "VR 開發"]
        },
        {
            title: "LINE BOT 人事管理系統",
            description: "基於 LINE BOT 開發的企業人力資源管理系統，整合員工日常工作流程，提供便捷的行動化辦公體驗。透過 LINE 介面實現打卡、請假、簽核、發票上傳等核心人事功能，大幅提升企業內部作業效率。",
            category: "後端開發",
            achievements: [
                "設計並實現 LINE BOT 對話流程",
                "建立員工打卡與考勤管理系統",
                "開發請假申請與審核流程",
                "實現多層級簽核機制",
                "整合發票上傳與報帳功能",
                "建立人事資料管理與權限控制"
            ],
            technologies: [
                "LINE Bot SDK",
                "JavaScript",
                "Webhook",
            ],
            media: [
                { type: 'image' as const, src: "/projects/linebot/hr-bot.jpg", alt: "LINE BOT 人事管理系統介面" }
            ]
        }
    ],
    'en': [
        {
            title: "Threads Saver - Browser Extension",
            buttonText: "Chrome Extension",
            description: "A powerful Threads browser extension that provides various useful features to enhance your browsing experience. Threads Saver allows you to easily download and save content from Threads, including text, images, videos, and more, with support for multiple output formats and batch processing capabilities.",
            category: "Frontend Development",
            achievements: [
                "Smart download functionality: One-click download of all Threads post content",
                "Multiple format support: Markdown, JSON, HTML, plain text, CSV formats",
                "Batch processing: Support for bulk downloading multiple posts",
                "Advanced settings: Customizable download quality and other options",
                "Real-time notifications: Instant feedback on operation results",
                "State persistence: Download status saved persistently",
                "Visual feedback: Icon color changes after download completion",
                "Threads-style interface: Native dark theme design"
            ],
            technologies: [
                "Chrome Extension",
                "TypeScript",
                "JSZip",
                "Manifest V3",
                "CSS3",
                "Webpack",
                "Sharp"
            ],
            media: [
                { type: 'image' as const, src: "/projects/threads_saver/logo.png", alt: "Threads Saver Logo" },
                { type: 'image' as const, src: "/projects/threads_saver/image1.png", alt: "Threads Saver Main Interface" },
                { type: 'image' as const, src: "/projects/threads_saver/image2.png", alt: "Threads Saver Download Feature" },
                { type: 'image' as const, src: "/projects/threads_saver/image3.png", alt: "Threads Saver Settings Page" }
            ],
            link: "https://chromewebstore.google.com/detail/threads-saver/placeholder-id"
        },
        {
            title: "Postly - Reflection Sharing Community Platform",
            description: "A community platform focused on personal growth and reflection sharing, allowing users to record and share their daily reflections and insights. Features daily reflection prompts, community interaction, personal achievements tracking, built with modern Next.js and React technologies.",
            category: "Full Stack Development",
            achievements: [
                "Daily curated reflection topics with deep thinking guidance",
                "Complete community interaction system (likes, comments, sharing)",
                "Personal achievement tracking and reflection streak records",
                "Real-time engagement notifications and analytics",
                "Google OAuth authentication and secure user management",
                "Responsive design with accessibility features"
            ],
            technologies: [
                "Next.js 15",
                "React 19",
                "TypeScript",
                "Tailwind CSS 4",
                "NextAuth.js",
                "TanStack Query",
                "Headless UI"
            ],
            media: [
                { type: 'image' as const, src: "/projects/postly/logo.png", alt: "Postly Logo" },
                { type: 'video' as const, src: "/projects/postly/Postly.mp4", alt: "Postly Demo Video" }
            ],
            link: "https://github.com/SunZhi-Will/Postly",
            demo: "https://postly-gilt.vercel.app"
        },
        {
            title: "CoinHub - Cryptocurrency Trading and Portfolio Management",
            description: "A comprehensive Flutter-based cryptocurrency trading and portfolio management application that provides users with a complete platform for managing their digital assets. Integrates with various blockchain networks and cryptocurrency exchanges through Web3 and API integrations.",
            category: "Mobile App Development",
            achievements: [
                "Real-time cryptocurrency price tracking",
                "Complete portfolio management system",
                "Integration with multiple blockchain networks and exchange APIs",
                "Wallet connectivity and trading functionality",
                "Chart visualization and technical analysis tools",
                "Secure data storage and encryption mechanisms"
            ],
            technologies: [
                "Flutter",
                "Dart",
                "web3dart",
                "WalletConnect",
                "fl_chart",
                "shared_preferences",
                "crypto",
                "WebSocket"
            ],
            media: [
                { type: 'image' as const, src: "/projects/coinhub/logo.png", alt: "CoinHub App Logo" }
            ]
        },
        {
            title: "Sun UI Design",
            description: "A modern React UI component library with beautiful animation effects, built with React, TailwindCSS and TypeScript. Offers modern, customizable components with tree-shaking support.",
            category: "Frontend Development",
            achievements: [
                "Designed and implemented multiple modern UI components",
                "Support for independent packages or all-in-one installation",
                "Complete TypeScript type support",
                "TailwindCSS integration and optimization",
                "Storybook documentation and showcase",
                "Optimized packaging and publishing workflow"
            ],
            technologies: [
                "React",
                "TypeScript",
                "TailwindCSS",
                "Storybook",
                "Lerna",
                "npm"
            ],
            media: [
                { type: 'image' as const, src: "/projects/sunui/preview.png", alt: "Sun UI Design Logo" }
            ],
            link: "https://github.com/SunZhi-Will/sunui-design",
            demo: "https://sunui.vercel.app/"
        },
        {
            title: "Google Form AI Auto-Filler",
            description: "An intelligent tool using Google Gemini AI to automatically fill in Google Forms. Simply provide the form URL and basic information to generate a pre-filled form URL",
            category: "AI Development",
            achievements: [
                "Smart answer generation with Gemini AI",
                "Automatic Google Form structure parsing",
                "Support for multiple question types: short, paragraph, multiple choice, dropdown, etc.",
                "Both pure frontend and Python backend versions available",
                "Comprehensive documentation and error handling"
            ],
            technologies: [
                "HTML",
                "CSS",
                "JavaScript",
                "Python",
                "Google Gemini AI",
                "RESTful API"
            ],
            media: [
                { type: 'image' as const, src: "/projects/gform_ai/preview.png", alt: "Google Form AI Auto-Filler" }
            ],
            link: "https://github.com/SunZhi-Will/AutoFormAI",
            demo: "https://auto-form-ai.vercel.app/"
        },
        {
            title: "LexiTechly - Smart English Content Analysis",
            buttonText: "Chrome Extension",
            description: "Analyze English web content using Google Gemini AI, providing CEFR level assessment, vocabulary analysis, AI interactive dialogue, and pronunciation features to enhance your English reading and learning experience!",
            category: "AI Development",
            achievements: [
                "CEFR level analysis of web English content",
                "Comprehensive vocabulary, grammar, and topic difficulty assessment",
                "Interactive AI dialogue feature",
                "Vocabulary list and AI lexical analysis",
                "Word and sentence pronunciation support",
                "Unlimited local storage"
            ],
            technologies: [
                "Chrome Extension",
                "HTML",
                "CSS",
                "JavaScript",
                "Google Gemini AI",
                "Speechify API",
                "IndexedDB"
            ],
            media: [
                { type: 'image' as const, src: "/projects/lexitechly/unnamed.png", alt: "LexiTechly Main Interface" },
                { type: 'image' as const, src: "/projects/lexitechly/analysis.png", alt: "Content Analysis" },
                { type: 'image' as const, src: "/projects/lexitechly/vocabulary.png", alt: "Vocabulary Analysis" },
                { type: 'image' as const, src: "/projects/lexitechly/chat.png", alt: "AI Chat" }
            ],
            link: "https://chromewebstore.google.com/detail/lexitechly-%E6%99%BA%E6%85%A7%E8%8B%B1%E6%96%87%E5%85%A7%E5%AE%B9%E5%88%86%E6%9E%90/lnfheajgimgpheflgjgknhnppanfenmk"
        },
        {
            title: "DeepCrawlAI",
            description: "An intelligent crawler tool that combines web scraping and AI analysis, capable of deep crawling web content and performing intelligent analysis using Gemini AI.",
            category: "AI Development",
            achievements: [
                "Intelligent web crawler supporting multi-level deep crawling",
                "Content analysis using Google Gemini AI",
                "Support for dynamic (Selenium) and static web scraping",
                "Automatic extraction of related links and recursive crawling",
                "Conversion of web content to structured Markdown format",
                "Prevention of duplicate page crawling"
            ],
            technologies: [
                "Python",
                "Google Gemini AI",
                "BeautifulSoup",
                "Selenium",
                "Cloudscraper"
            ],
            media: [
                { type: 'image' as const, src: "https://opengraph.githubassets.com/1/SunZhi-Will/DeepCrawlAI", alt: "DeepCrawlAI Screenshot" }
            ],
            link: "https://github.com/SunZhi-Will/DeepCrawlAI"
        },
        {
            title: "Synvize",
            description: "AI-powered content generation platform that automatically integrates data from websites, YouTube, news, and text sources. The AI analyzes and generates structured articles. Users can edit generated content and share with the community. Built-in AI assistant helps readers quickly understand article key points.",
            category: "AI Development",
            achievements: [
                "Multi-source data collection and integration",
                "AI-powered analysis and article generation",
                "Community content sharing and interaction",
                "Built-in AI assistant for instant answers",
                "Automated news tracking and updates",
                "Article editing and publishing system"
            ],
            media: [
                { type: 'image' as const, src: "/projects/synvize/home.png", alt: "Synvize Homepage" },
                { type: 'image' as const, src: "/projects/synvize/edit.png", alt: "Edit Interface" }
            ],
            technologies: [
                "Next.js",
                "Python",
                "Google Gemini",
                "PostgreSQL",
                "Web Scraping",
            ],
            link: "https://synvize.com/"
        },
        {
            title: "Snapraze",
            description: "A platform providing cloud image storage, editing, annotation, and original image comparison features. Users can upload, manage, edit, and compare images, supporting multiple image formats with a comprehensive image management system.",
            category: "Full Stack Development",
            achievements: [
                "Cloud image storage and management system",
                "Image editing and annotation tools",
                "Real-time comparison between original and edited images",
                "Support for multiple image formats",
                "Complete modification history tracking",
                "User permission management"
            ],
            media: [
                { type: 'image' as const, src: "/projects/snapraze/logo.png", alt: "Snapraze Logo" },
                { type: 'image' as const, src: "/projects/snapraze/page1.png", alt: "Snapraze Main Page" },
                { type: 'image' as const, src: "/projects/snapraze/page2.png", alt: "Snapraze Image Editor" },
                { type: 'image' as const, src: "/projects/snapraze/page3.png", alt: "Snapraze Image Comparison" }
            ],
            technologies: [
                "Next.js",
                "TypeScript",
                "Tailwind CSS",
                "Shadcn/ui",
                "Cloudinary",
                "PostgreSQL",
                "Prisma",
                "Fabric.js"
            ],
            link: "https://github.com/SunZhi-Will/snapraze"
        },
        {
            title: "MemoryLane",
            description: "An elegant LINE chat history review website that lets you relive precious conversations and memories in a brand new way. Upload your LINE chat exports and view them on a beautiful timeline with danmaku effect, all while processing data locally to protect your privacy.",
            category: "Frontend Development",
            achievements: [
                "Easy upload of LINE chat history export files",
                "Beautiful timeline display organized by month",
                "Dynamic danmaku effect showing random conversations",
                "Complete local processing for privacy protection",
                "Responsive design for optimal experience on any device",
                "Clean and intuitive user interface"
            ],
            technologies: [
                "Next.js 15.2",
                "React 19",
                "TypeScript 5",
                "Tailwind CSS 4",
                "Framer Motion",
                "date-fns 4",
                "localStorage"
            ],
            media: [
                { type: 'image' as const, src: "/projects/memory_lane/preview.png", alt: "MemoryLane Logo" },
                { type: 'image' as const, src: "/projects/memory_lane/home.png", alt: "MemoryLane Home" },
                { type: 'youtube' as const, src: "CPTTjLaydVU", alt: "MemoryLane Demo" }
            ],
            link: "https://github.com/SunZhi-Will/memory-lane",
            demo: "https://memorylane-nine.vercel.app/"
        },
        {
            title: "Automotive Factory Material Anti-Error System",
            description: "A .NET-based automotive factory material monitoring website that integrates with manufacturing equipment for error prevention. The system displays real-time errors and error codes when material supply doesn't match work orders, ensuring smooth production line operations. This was a complete legacy system renovation project that I handled independently, including factory equipment integration.",
            category: "Backend Development",
            achievements: [
                "Designed and implemented material-to-work-order validation mechanism",
                "Built real-time error monitoring and notification system",
                "Developed error code management and tracking functionality",
                "Completed comprehensive legacy system architecture renovation",
                "Established integration interfaces with factory equipment",
                "Optimized error detection algorithms for improved accuracy"
            ],
            technologies: [
                ".NET Framework",
                "ASP.NET MVC",
                "SQL Server",
                "C#",
                "JavaScript",
                "Bootstrap",
                "AJAX"
            ],
            media: [
                { type: 'image' as const, src: "/projects/factory/screenshot.jpg", alt: "Automotive Factory Material Anti-Error System Dashboard" }
            ]
        },
        {
            title: "AR Garbage Truck Motion Game",
            description: "An AR motion-sensing game with garbage truck theme, featuring 'Chase the Garbage Truck' pursuit mode and 'Attack the Garbage Truck' combat mode. Players use body movements to control game characters and complete missions of chasing and attacking garbage trucks.",
            category: "Game Development",
            achievements: [
                "Developed dual-mode motion-sensing game system",
                "Integrated AR computer vision with human pose tracking",
                "Implemented body movement control mechanisms",
                "Designed garbage truck chase and combat gameplay",
                "Built 3D city scenes and garbage truck models",
                "Optimized mobile AR performance and experience"
            ],
            technologies: [
                "Unity",
                "AR Foundation",
                "MediaPipe",
                "Computer Vision",
                "C#",
                "3D Modeling",
                "Mobile Development"
            ],
            media: [
                { type: 'image' as const, src: "/projects/games/garbage.png", alt: "AR Garbage Truck Motion Game Introduction" }
            ]
        },
        {
            title: "VR Dinosaur Shooter",
            description: "VR shooting game that integrates different project architectures for a smooth VR shooting experience",
            category: "Game Development",
            achievements: [
                "Integrate multiple project architectures",
                "Optimize VR interaction experience",
                "Design monster spawning system",
                "Implement diverse weapon systems"
            ],
            media: [
                { type: 'image' as const, src: "/projects/games/hqdefault.jpg", alt: "VR Game Screenshot" },
                { type: 'youtube' as const, src: "tvRp9Dz0hQA", alt: "VR Game Footage" }
            ],
            technologies: ["Unity", "SteamVR", "VR Development"]
        },
        {
            title: "LINE BOT HR Management System",
            description: "An enterprise human resource management system built on LINE BOT platform, integrating daily employee workflows to provide convenient mobile office experience. Implements core HR functions including clock-in/out, leave requests, approval workflows, and expense receipt uploads through LINE interface, significantly improving internal operational efficiency.",
            category: "Backend Development",
            achievements: [
                "Designed and implemented LINE BOT conversation flows",
                "Built employee attendance and time tracking system",
                "Developed leave application and approval processes",
                "Implemented multi-level approval mechanisms",
                "Integrated receipt upload and expense reporting features",
                "Established HR data management with access control"
            ],
            technologies: [
                "LINE Bot SDK",
                "JavaScript",
                "Webhook",
            ],
            media: [
                { type: 'image' as const, src: "/projects/linebot/hr-bot.jpg", alt: "LINE BOT HR Management System Interface" }
            ]
        }
    ]
};
