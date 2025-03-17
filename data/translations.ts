import { Translations } from '../types';

export const translations: Translations = {
    'zh-TW': {
        nav: {
            home: '首頁',
            about: '關於我',
            skills: '技術能力',
            projects: '專案作品'
        },
        categories: {
            all: '全部',
            programming: '程式語言',
            framework: '開發框架',
            game: '遊戲開發',
            ai: 'AI 技術'
        },
        hero: {
            title: '你好，我是謝上智(Sun)',
            subtitle: '軟體工程師 | AI 應用開發 | Unity 遊戲開發',
            scrollDown: '向下滾動'
        },
        about: {
            title: '關於我',
            services: {
                title: '專業服務項目',
                available: '可接受委託',
                description: '提供專業的技術開發與顧問服務，從需求分析到系統實現，為您打造完整的解決方案。'
            },
            teaching: {
                title: '教學課程',
                description: '在各大專院校和企業分享實務經驗，提供客製化課程內容，從基礎概念到進階應用，協助學員快速掌握技術要點。',
                courses: [
                    'Unity 遊戲開發實務課程',
                    'Unity 結合 MediaPipe 影像辨識應用',
                    'LINE BOT 開發與應用實作',
                    'AI 應用開發實務分享',
                    '指導學生專案開發'
                ]
            }
        },
        skills: {
            title: '技術能力'
        },
        projects: {
            title: '主要專案',
            viewProject: '查看專案',
            mainAchievements: '主要成果：',
            video: '影片',
            items: [
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
                        { type: 'image', src: "/projects/lexitechly/unnamed.png", alt: "LexiTechly 主介面" },
                        { type: 'image', src: "/projects/lexitechly/analysis.png", alt: "內容分析" },
                        { type: 'image', src: "/projects/lexitechly/vocabulary.png", alt: "詞彙分析" },
                        { type: 'image', src: "/projects/lexitechly/chat.png", alt: "AI 對話" }
                    ],
                    link: "https://chromewebstore.google.com/detail/lexitechly-%E6%99%BA%E6%85%A7%E8%8B%B1%E6%96%87%E5%85%A7%E5%AE%B9%E5%88%86%E6%9E%90/lnfheajgimgpheflgjgknhnppanfenmk"
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
                        { type: 'image', src: "/projects/synvize/home.png", alt: "Synvize 首頁" },
                        { type: 'image', src: "/projects/synvize/edit.png", alt: "編輯介面" }
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
                        { type: 'image', src: "/projects/snapraze/logo.png", alt: "Snapraze Logo" },
                        { type: 'image', src: "/projects/snapraze/page1.png", alt: "Snapraze 主頁面" },
                        { type: 'image', src: "/projects/snapraze/page2.png", alt: "Snapraze 圖片編輯" },
                        { type: 'image', src: "/projects/snapraze/page3.png", alt: "Snapraze 圖片比對" }
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
                    title: "TED × AI創新應用講座",
                    description: "受邀擔任 TED 講座講師，分享 AI 技術的創新應用與未來展望",
                    category: "演講分享",
                    achievements: [
                        "分享 AI 技術在各領域的實際應用案例",
                        "探討 AI 發展趨勢與未來機會",
                        "與聽眾互動討論 AI 創新想法"
                    ],
                    media: [
                        { type: 'image', src: "/projects/ted/594732_0.jpg", alt: "演講" },
                        { type: 'image', src: "/projects/ted/594733_0.jpg", alt: "演講" }
                    ],
                    technologies: ["AI 應用", "ChatGPT", "NotebookLM"]
                },
                {
                    title: "Unity 影像辨識課程",
                    description: "在屏東科技大學碩士班擔任 Unity 結合 MediaPipe 影像辨識課程講師，分享實務經驗與技術整合",
                    category: "教學分享",
                    achievements: [
                        "教授 Unity 與 MediaPipe 整合技術",
                        "人體姿態估測在遊戲中的應用",
                        "手部追蹤與手勢識別實作",
                        "指導學生專案開發",
                        "分享業界實務經驗"
                    ],
                    technologies: ["Unity", "MediaPipe", "Computer Vision", "影像辨識", "人體姿態估測"],
                    media: [
                        { type: 'image', src: "/projects/teaching/unity-cv.png", alt: "Unity 影像辨識課程" }
                    ]
                },
                {
                    title: "工廠自動化系統",
                    description: "開發工廠生產線監控與管理系統",
                    category: "企業應用",
                    achievements: [
                        "生產數據即時監控",
                        "自動化報表生成",
                        "供料防呆系統"
                    ],
                    media: [
                        { type: 'image', src: "/projects/factory/594729.jpg", alt: "供料防呆系統" }
                    ],
                    technologies: [".NET", "SQL Server", "PHP"]
                },
                {
                    title: "LINE BOT 應用系列",
                    description: "開發多款實用的 LINE BOT 應用，整合企業需求與使用者體驗，打造便利的自動化服務系統。",
                    category: "企業應用",
                    achievements: [
                        "人事管理系統：上下班打卡、請假申請與簽核、發票上傳分類存檔",
                        "揪團系統：創辦活動、活動參與、即時通知",
                        "虛擬貨幣追蹤：即時匯率查看、價格波動通知",
                        "AI 末日文字遊戲：互動式文字冒險遊戲，結合 AI 生成內容"
                    ],
                    technologies: [
                        "LINE Messaging API",
                        "Node.js",
                        "Python",
                        "Azure OpenAI",
                        "MongoDB",
                        "Docker"
                    ],
                    media: [
                        { type: 'image', src: "/projects/linebot/hr-bot.jpg", alt: "人事管理 LINE BOT" }
                    ]
                },
                {
                    title: "打擊垃圾⾞",
                    description: "體感格鬥遊戲，透過體感偵測玩家的揮拳與踢擊動作，實現真實的格鬥體驗",
                    category: "遊戲開發",
                    achievements: [
                        "實現精準的體感動作偵測系統",
                        "開發部位打擊判定機制",
                        "設計可切換角色系統",
                        "優化遊戲流程與操作體驗",
                        "成功上架 iOS 和 Android 平台"
                    ],
                    media: [
                        { type: 'image', src: '/projects/games/unnamed.webp', alt: "打擊垃圾車遊戲畫面" }
                    ],
                    technologies: ["Unity", "Computer Vision", "動作識別", "跨平台開發"],
                    links: {
                        ios: "https://apps.apple.com/tw/app/%E6%89%93%E6%93%8A%E5%9E%83%E5%9C%BE%E8%BB%8A/id6444556663",
                        android: "https://play.google.com/store/apps/details?id=com.FTL.BlowGame"
                    }
                },
                {
                    title: "垃圾車等等我",
                    description: "結合體感技術的互動遊戲，參加 DIGI 展覽，完整負責程式開發。現已上架 App Store 和 Play Store",
                    category: "遊戲開發",
                    achievements: [
                        "開發人體掃描系統",
                        "設計動作行為判定邏輯",
                        "實現完整遊戲流程",
                        "優化展覽場域的互動體驗",
                        "成功上架 iOS 和 Android 平台"
                    ],
                    media: [
                        { type: 'image', src: "/projects/games/garbage.png", alt: "垃圾車等等我遊戲畫面" },
                        { type: 'youtube', src: 'H3ZRj114cQ4', alt: "遊戲展示影片 1" },
                        { type: 'youtube', src: 'ILhiUjDvkEw', alt: "遊戲展示影片 2" }
                    ],
                    technologies: ["Unity", "人體識別", "互動設計", "跨平台開發"],
                    links: {
                        ios: "https://apps.apple.com/tw/app/%E5%9E%83%E5%9C%BE%E8%BB%8A%E7%AD%89%E7%AD%89%E6%88%91/id6444548706",
                        android: "https://play.google.com/store/apps/details?id=com.FTL.GarbageTruckWaitForMe"
                    }
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
                        { type: 'image', src: "/projects/games/hqdefault.jpg", alt: "VR 恐龍射擊遊戲畫面" },
                        { type: 'youtube', src: "tvRp9Dz0hQA", alt: "VR 恐龍射擊遊戲畫面" }
                    ],
                    technologies: ["Unity", "SteamVR", "VR 開發"]
                },

            ]
        },
        footer: {
            portfolio: '謝上智 作品集',
            oldWebsite: '舊版網站'
        },
        techCategories: {
            programming: '程式語言',
            framework: '開發框架',
            game: '遊戲開發',
            ai: 'AI 技術',
            other: '其他技能'
        },
        aboutContent: {
            intro: `我是一名充滿熱情的軟體工程師，專注於 .NET、AI 應用開發與 Unity 遊戲開發。
                    從 Minecraft 模組開發啟發了我的程式熱情，到現在已累積豐富的實務經驗。
                    
                    擅長快速掌握新技術並整合應用，將複雜的技術需求轉化為實用的解決方案。
                    特別在 AI 應用整合、企業系統開發與遊戲互動體驗設計方面有深入研究。
                    
                    目前專注於企業應用系統開發與 AI 技術整合，同時持續在 AR/VR 遊戲開發領域探索創新。
                    期待能為產業帶來更多創新應用，同時也能協助更多人學習與成長。`,
            experiences: [
                {
                    title: "英業達股份有限公司 - 軟體工程師",
                    period: "2023/12 - 至今",
                    description: "負責企業級應用系統開發與維護，主要使用 .NET MVC、Low Code 技術，並參與 AI 技術導入專案。",
                    achievements: [
                        "開發與維護企業內部系統",
                        "參與 AI 技術導入專案",
                        "進行技術分享與知識交流",
                        "優化系統架構與效能",
                        "建立開發文件與規範"
                    ]
                },
                {
                    title: "酷愛迪數位創意 - 外包軟體工程師",
                    period: "2020/10 - 至今",
                    description: "以接案方式合作，專注於 AR 與 Unity 開發，負責多項創新互動專案的開發與實現。",
                    achievements: [
                        "研究 AR 臉部辨識，開發人臉位置判斷功能",
                        "使用 Unity 開發跨平台手機 APP 介面",
                        "開發互動式遊戲，與企劃密切溝通",
                        "確保 UI 在不同裝置上的一致性",
                        "優化應用程式效能與使用者體驗"
                    ]
                },
                {
                    title: "宥倍實業股份有限公司 - 軟體工程師",
                    period: "2023/2 - 2023/10",
                    description: "負責多個企業應用系統的開發與維護，主要使用 .NET MVC、WinForm 技術。",
                    achievements: [
                        "同時管理五個專案的開發與維護",
                        "快速理解並解決程式問題",
                        "提升專案開發效率",
                        "建立完整的專案文件",
                        "優化開發流程與架構"
                    ]
                },
                {
                    title: "田野科技有限公司 - 遊戲工程師",
                    period: "2022/4 - 2023/2",
                    description: "負責開發多項影像辨識與 AR/VR 遊戲，同時管理 LINE BOT 人事系統。",
                    achievements: [
                        "開發多款體感互動遊戲",
                        "實現 AR/VR 技術整合",
                        "設計影像辨識演算法",
                        "開發 LINE BOT 人事系統",
                        "優化使用者體驗與效能"
                    ]
                }
            ]
        },
        services: {
            items: [
                {
                    title: '全端開發',
                    description: '網站系統開發與維護'
                },
                {
                    title: 'VR/AR 開發',
                    description: '互動體驗設計與開發 (須提供設備)'
                },
                {
                    title: '遊戲開發',
                    description: '互動遊戲開發與設計'
                },
                {
                    title: 'AI 應用開發',
                    description: 'AI 應用程式開發與整合'
                },
                {
                    title: 'APP 開發',
                    description: '行動應用程式開發與優化'
                }
            ]
        },
        teaching: {
            description: '在各大專院校和企業分享實務經驗，提供客製化課程內容，從基礎概念到進階應用，協助學員快速掌握技術要點。',
            courses: [
                'Unity 遊戲開發實務課程',
                'Unity 結合 MediaPipe 影像辨識應用',
                'LINE BOT 開發與應用實作',
                'AI 應用開發實務分享',
                '指導學生專案開發'
            ]
        }
    },
    'en': {
        nav: {
            home: 'Home',
            about: 'About',
            skills: 'Skills',
            projects: 'Projects'
        },
        categories: {
            all: 'All',
            programming: 'Programming',
            framework: 'Frameworks',
            game: 'Game Dev',
            ai: 'AI Tech'
        },
        hero: {
            title: 'Hi, I\'m Sun',
            subtitle: 'Software Engineer | AI Developer | Unity Expert',
            scrollDown: 'Scroll Down'
        },
        about: {
            title: 'About Me',
            services: {
                title: 'Professional Services',
                available: 'Available for hire',
                description: 'Providing professional technical development and consulting services, from requirements analysis to system implementation.'
            },
            teaching: {
                title: 'Teaching',
                description: 'Share practical experience in universities and enterprises, providing customized course content, from basic concepts to advanced applications, helping students quickly grasp technical points.',
                courses: [
                    'Unity Game Development Practical Course',
                    'Unity with MediaPipe Computer Vision Applications',
                    'LINE BOT Development and Implementation',
                    'AI Application Development Sharing',
                    'Student Project Guidance'
                ]
            }
        },
        skills: {
            title: 'Skills'
        },
        projects: {
            title: 'Projects',
            viewProject: 'View Project',
            mainAchievements: 'Main Achievements:',
            video: 'Video',
            items: [
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
                        { type: 'image', src: "/projects/lexitechly/unnamed.png", alt: "LexiTechly Main Interface" },
                        { type: 'image', src: "/projects/lexitechly/analysis.png", alt: "Content Analysis" },
                        { type: 'image', src: "/projects/lexitechly/vocabulary.png", alt: "Vocabulary Analysis" },
                        { type: 'image', src: "/projects/lexitechly/chat.png", alt: "AI Chat" }
                    ],
                    link: "https://chromewebstore.google.com/detail/lexitechly-%E6%99%BA%E6%85%A7%E8%8B%B1%E6%96%87%E5%85%A7%E5%AE%B9%E5%88%86%E6%9E%90/lnfheajgimgpheflgjgknhnppanfenmk"
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
                        { type: 'image', src: "/projects/synvize/home.png", alt: "Synvize Homepage" },
                        { type: 'image', src: "/projects/synvize/edit.png", alt: "Edit Interface" }
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
                        { type: 'image', src: "/projects/snapraze/logo.png", alt: "Snapraze Logo" },
                        { type: 'image', src: "/projects/snapraze/page1.png", alt: "Snapraze Main Page" },
                        { type: 'image', src: "/projects/snapraze/page2.png", alt: "Snapraze Image Editor" },
                        { type: 'image', src: "/projects/snapraze/page3.png", alt: "Snapraze Image Comparison" }
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
                    title: "TED × AI Innovation Applications",
                    description: "Invited as a TED speaker to share innovative AI applications and future prospects",
                    category: "Speaking",
                    achievements: [
                        "Share real-world AI application cases across various fields",
                        "Discuss AI development trends and future opportunities",
                        "Interactive discussions on AI innovation ideas"
                    ],
                    media: [
                        { type: 'image', src: "/projects/ted/594732_0.jpg", alt: "Speaking" },
                        { type: 'image', src: "/projects/ted/594733_0.jpg", alt: "Speaking" }
                    ],
                    technologies: ["AI Applications", "ChatGPT", "NotebookLM"]
                },
                {
                    title: "Unity Computer Vision Course",
                    description: "Served as instructor for Unity with MediaPipe computer vision course at NPUST graduate school, sharing practical experience and technical integration",
                    category: "Teaching",
                    achievements: [
                        "Teach Unity and MediaPipe integration",
                        "Human pose estimation in games",
                        "Hand tracking and gesture recognition",
                        "Guide student projects",
                        "Share industry experience"
                    ],
                    technologies: ["Unity", "MediaPipe", "Computer Vision", "Image Recognition", "Pose Estimation"],
                    media: [
                        { type: 'image', src: "/projects/teaching/unity-cv.png", alt: "Unity CV Course" }
                    ]
                },
                {
                    title: "Factory Automation System",
                    description: "Develop factory production line monitoring and management system",
                    category: "Enterprise Solutions",
                    achievements: [
                        "Real-time production data monitoring",
                        "Automated report generation",
                        "Material feeding error prevention system"
                    ],
                    media: [
                        { type: 'image', src: "/projects/factory/594729.jpg", alt: "Error Prevention System" }
                    ],
                    technologies: [".NET", "SQL Server", "PHP"]
                },
                {
                    title: "LINE BOT Applications",
                    description: "Develop multiple practical LINE BOT applications, integrating enterprise requirements and user experience to create convenient automated service systems.",
                    category: "Enterprise Solutions",
                    achievements: [
                        "HR Management: Clock in/out, leave applications, invoice management",
                        "Event System: Create events, participation, real-time notifications",
                        "Crypto Tracking: Real-time exchange rates, price fluctuation alerts",
                        "AI Apocalypse Text Game: Interactive text adventure with AI-generated content"
                    ],
                    technologies: [
                        "LINE Messaging API",
                        "Node.js",
                        "Python",
                        "Azure OpenAI",
                        "MongoDB",
                        "Docker"
                    ],
                    media: [
                        { type: 'image', src: "/projects/linebot/hr-bot.jpg", alt: "HR Management LINE BOT" }
                    ]
                },
                {
                    title: "Garbage Truck Fighter",
                    description: "Motion-sensing fighting game that detects player's punches and kicks for a realistic combat experience",
                    category: "Game Development",
                    achievements: [
                        "Implement precise motion detection system",
                        "Develop hit detection mechanics",
                        "Design character switching system",
                        "Optimize gameplay and controls",
                        "Successfully launched on iOS and Android"
                    ],
                    media: [
                        { type: 'image', src: '/projects/games/unnamed.webp', alt: "Game Screenshot" }
                    ],
                    technologies: ["Unity", "Computer Vision", "Motion Detection", "Cross-platform Development"],
                    links: {
                        ios: "https://apps.apple.com/tw/app/%E6%89%93%E6%93%8A%E5%9E%83%E5%9C%BE%E8%BB%8A/id6444556663",
                        android: "https://play.google.com/store/apps/details?id=com.FTL.BlowGame"
                    }
                },
                {
                    title: "Wait For Me, Garbage Truck",
                    description: "Interactive motion-sensing game showcased at DIGI exhibition, fully responsible for development. Now available on App Store and Play Store",
                    category: "Game Development",
                    achievements: [
                        "Develop body scanning system",
                        "Design motion behavior detection logic",
                        "Implement complete game flow",
                        "Optimize exhibition venue interaction",
                        "Successfully launched on iOS and Android"
                    ],
                    media: [
                        { type: 'image', src: "/projects/games/garbage.png", alt: "Game Screenshot" },
                        { type: 'youtube', src: 'H3ZRj114cQ4', alt: "Game Demo 1" },
                        { type: 'youtube', src: 'ILhiUjDvkEw', alt: "Game Demo 2" }
                    ],
                    technologies: ["Unity", "Body Detection", "Interactive Design", "Cross-platform Development"],
                    links: {
                        ios: "https://apps.apple.com/tw/app/%E5%9E%83%E5%9C%BE%E8%BB%8A%E7%AD%89%E7%AD%89%E6%88%91/id6444548706",
                        android: "https://play.google.com/store/apps/details?id=com.FTL.GarbageTruckWaitForMe"
                    }
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
                        { type: 'image', src: "/projects/games/hqdefault.jpg", alt: "VR Game Screenshot" },
                        { type: 'youtube', src: "tvRp9Dz0hQA", alt: "VR Game Footage" }
                    ],
                    technologies: ["Unity", "SteamVR", "VR Development"]
                },

            ]
        },
        footer: {
            portfolio: 'Sun\'s Portfolio',
            oldWebsite: 'Old Website'
        },
        techCategories: {
            programming: 'Programming Languages',
            framework: 'Frameworks',
            game: 'Game Development',
            ai: 'AI Technology',
            other: 'Other Skills'
        },
        aboutContent: {
            intro: `I am a passionate software engineer specializing in .NET development, AI applications, and Unity game development.
                   My journey in programming began with Minecraft mod development, which has evolved into extensive professional experience.
                   
                   I excel at rapidly adopting new technologies and integrating them into practical solutions.
                   My expertise lies in AI integration, enterprise system development, and interactive game design.
                   
                   Currently focused on enterprise application development and AI technology integration,
                   while continuing to innovate in AR/VR game development. I am dedicated to bringing
                   cutting-edge solutions to the industry while mentoring others in their technical growth.`,
            experiences: [
                {
                    title: "Inventec Corporation - Software Engineer",
                    period: "Dec 2023 - Present",
                    description: "Lead enterprise application development and maintenance using .NET MVC and Low Code technologies, while driving AI technology integration initiatives.",
                    achievements: [
                        "Develop and maintain mission-critical internal systems",
                        "Spearhead AI technology integration projects",
                        "Conduct technical knowledge sharing sessions",
                        "Optimize system architecture and performance",
                        "Establish development documentation and standards"
                    ]
                },
                {
                    title: "Coolidi Digital Creative - Freelance Software Engineer",
                    period: "Oct 2020 - Present",
                    description: "Collaborate on innovative AR and Unity development projects, focusing on creating immersive interactive experiences.",
                    achievements: [
                        "Research and implement AR facial recognition algorithms",
                        "Develop cross-platform mobile applications using Unity",
                        "Create engaging interactive games with close stakeholder collaboration",
                        "Ensure consistent UI/UX across multiple devices",
                        "Optimize application performance and user experience"
                    ]
                },
                {
                    title: "Yubay Industrial - Software Engineer",
                    period: "2023/2 - 2023/10",
                    description: "Responsible for multiple enterprise application systems development and maintenance, mainly using .NET MVC and WinForm technologies.",
                    achievements: [
                        "Manage development and maintenance of five projects simultaneously",
                        "Quickly understand and resolve programming issues",
                        "Improve project development efficiency",
                        "Establish comprehensive project documentation",
                        "Optimize development processes and architecture"
                    ]
                },
                {
                    title: "Field Technology - Game Engineer",
                    period: "2022/4 - 2023/2",
                    description: "Responsible for developing various computer vision and AR/VR games, while managing LINE BOT HR system.",
                    achievements: [
                        "Develop multiple motion-sensing interactive games",
                        "Implement AR/VR technology integration",
                        "Design computer vision algorithms",
                        "Develop LINE BOT HR system",
                        "Optimize user experience and performance"
                    ]
                }
            ]
        },
        services: {
            items: [
                {
                    title: 'Full Stack Development',
                    description: 'Website system development and maintenance'
                },
                {
                    title: 'VR/AR Development',
                    description: 'Interactive experience design and development (equipment required)'
                },
                {
                    title: 'Game Development',
                    description: 'Interactive game development and design'
                },
                {
                    title: 'AI Application',
                    description: 'AI application development and integration'
                },
                {
                    title: 'APP Development',
                    description: 'Mobile application development and optimization'
                }
            ]
        },
        teaching: {
            description: 'Share practical experience in universities and enterprises, providing customized course content, from basic concepts to advanced applications, helping students quickly grasp technical points.',
            courses: [
                'Unity Game Development Practical Course',
                'Unity with MediaPipe Computer Vision Applications',
                'LINE BOT Development and Implementation',
                'AI Application Development Sharing',
                'Student Project Guidance'
            ]
        }
    }
}; 