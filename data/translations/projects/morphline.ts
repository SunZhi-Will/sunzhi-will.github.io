export const morphline = {
    'zh-TW': {
        title: "Morphline 變臉滑桿 - 把迷因做成 AI 產品廣告",
        description: "一個純屬好玩的趣味作品：拉一下滑桿，換一張臉。整個頁面照著 AI 產品發表會的樣子包裝，徽章寫「AI 生成」，滑桿節點是「輕量、標準、精緻、極致」四個檔位，只是圖片換成小丑上妝、腦袋升級、NPC 到西格瑪這些迷因，標題配上「讓妝容，更進一步」。也可以放自己的照片，在瀏覽器裡自動找臉、對齊、去背，再輸出成 MP4 影片。",
        category: "趣味作品",
        achievements: [
            "內建 11 組迷因範例，每組都是一支一本正經的 AI 廣告",
            "瀏覽器內 MediaPipe 臉部偵測，自動對齊每張臉的眼睛與下巴",
            "瀏覽器內 AI 去背，圖片不會上傳到任何地方",
            "同一份設定同時產生互動頁面與 MP4 影片（Playwright 逐格截圖 + ffmpeg）",
            "用 Swin2SR 在本機把糊掉的迷因圖放大 4 倍"
        ],
        media: [
            { type: 'image' as const, src: "/projects/morphline/home.jpg", alt: "Morphline 首頁，周圍是會跟著滑桿變的迷因臉" },
            { type: 'image' as const, src: "/projects/morphline/examples.jpg", alt: "Morphline 範例一覽" }
        ],
        technologies: [
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "MediaPipe",
            "Transformers.js",
            "Playwright",
            "ffmpeg"
        ],
        link: "https://github.com/SunZhi-Will/Morphline"
    },
    'en': {
        title: "Morphline - Memes Dressed Up as AI Product Ads",
        description: "A just-for-fun project: drag the slider, swap the face. The whole page is styled like an AI product launch, with an \"AI Generated\" badge and slider stops labeled Light, Standard, Refined and Ultimate, except the images are memes like Clown Applying Makeup, Expanding Brain and NPC to Gigachad, paired with taglines like \"Take your makeup further.\" You can also drop in your own photos: faces are detected, aligned and cut out right in the browser, then exported as an MP4.",
        category: "Just for Fun",
        achievements: [
            "11 built-in meme examples, each played as a dead-serious AI ad",
            "In-browser MediaPipe face detection aligns every face by eyes and chin",
            "In-browser AI background removal; images never leave the device",
            "One config drives both the interactive page and MP4 export (Playwright frame capture + ffmpeg)",
            "Local 4x upscaling of blurry meme templates with Swin2SR"
        ],
        media: [
            { type: 'image' as const, src: "/projects/morphline/home.jpg", alt: "Morphline homepage surrounded by meme faces that change with the slider" },
            { type: 'image' as const, src: "/projects/morphline/examples.jpg", alt: "Morphline example gallery" }
        ],
        technologies: [
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "MediaPipe",
            "Transformers.js",
            "Playwright",
            "ffmpeg"
        ],
        link: "https://github.com/SunZhi-Will/Morphline"
    }
};
