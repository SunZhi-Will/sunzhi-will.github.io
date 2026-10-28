export const vwonest = {
    'zh-TW': {
        title: "V窩 - 打開瀏覽器就能開台的 V 皮商店",
        description: "原創 2D 可動角色商店：角色會眨眼、轉頭、頭髮擺動，不用學建模、不用安裝軟體，在瀏覽器裡試玩、購買後就能直接開台。網站包含角色商店、個人 V 皮庫、直播頁與 OBS 串接，角色由 AI 輔助的美術流程與自建工具產出。",
        category: "全端開發",
        achievements: [
            "首頁即可互動試玩角色，切換平常、微笑、害羞、驚訝、眨眼等表情後再決定購買",
            "完整會員流程：註冊、Email 驗證、重設密碼、個人 V 皮庫與 .mavatar 角色匯入",
            "商店、免費角色領取、贈禮與後台管理，並附服務條款、授權條款與退費政策",
            "直播頁內建 20 種房間背景，搭配 OBS 使用",
            "自建美術管線，把角色原圖切成可動圖層並驗證表情，已產出 24 位原創角色",
            "以 MIT 授權的開源 mesh-avatar 執行時期為基礎，擴充成可販售的商品格式"
        ],
        media: [
            { type: 'image' as const, src: "/projects/vwonest/debut.jpg", alt: "V窩 角色咩2 的初配信主視覺" },
            { type: 'image' as const, src: "/projects/vwonest/character-sheet.jpg", alt: "V窩 角色設定集：三視圖與表情" },
            { type: 'image' as const, src: "/projects/vwonest/guide.jpg", alt: "V窩 新手教學頁" },
        ],
        technologies: [
            "Next.js",
            "React",
            "TypeScript",
            "Drizzle ORM",
            "Better Auth",
            "Tailwind CSS",
            "Python",
        ]
    },
    'en': {
        title: "V窩 (Vwonest) - A VTuber Avatar Shop That Streams From the Browser",
        description: "A shop for original 2D animated characters that blink, turn their heads, and sway their hair. No 3D modeling and no software to install: try a character in the browser, buy it, and start streaming. The site includes the character shop, a personal avatar library, a streaming page, and OBS integration, with characters produced through an AI-assisted art pipeline and in-house tools.",
        category: "Full Stack Development",
        achievements: [
            "Interactive try-on right on the homepage: switch between neutral, smile, shy, surprised, and blink before buying",
            "Full account flow: sign-up, email verification, password reset, a personal avatar library, and .mavatar import",
            "Shop, free character claims, gifting, and an admin panel, plus terms of service, license terms, and a refund policy",
            "Streaming page with 20 built-in room backgrounds for use with OBS",
            "In-house art pipeline that cuts character art into animatable layers and verifies expressions; 24 original characters so far",
            "Built on the MIT-licensed open-source mesh-avatar runtime and extended into a sellable product format"
        ],
        media: [
            { type: 'image' as const, src: "/projects/vwonest/debut.jpg", alt: "V窩 debut key visual for the character Mei2" },
            { type: 'image' as const, src: "/projects/vwonest/character-sheet.jpg", alt: "V窩 character sheet with turnarounds and expressions" },
            { type: 'image' as const, src: "/projects/vwonest/guide.jpg", alt: "V窩 getting-started guide page" },
        ],
        technologies: [
            "Next.js",
            "React",
            "TypeScript",
            "Drizzle ORM",
            "Better Auth",
            "Tailwind CSS",
            "Python",
        ]
    }
};
