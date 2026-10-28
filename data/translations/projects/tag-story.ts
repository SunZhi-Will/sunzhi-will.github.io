export const tagStory = {
    'zh-TW': {
        title: "TAG Story App - 商業故事與決策學習 App",
        description: "為 TAG Story 接案開發的 iOS 與 Android App，是 tagstory.co 的行動版。會員用聽、看、讀三種方式走完一家公司的關鍵決策：每集都有 Podcast、影片、逐字稿、簡報，以及寫下自己決策的 Memo。視覺定位是一本會播放聲音與影片的高級商業雜誌。",
        category: "行動開發",
        achievements: [
            "背景播放、鎖定畫面控制、迷你播放器、章節、睡眠計時與跨裝置續播",
            "原生播放 HLS 與 MP4 影片，媒體網址一律經後端權限檢查後才取得",
            "iOS 原生 Apple 登入，Google 與 Android 的 Apple 登入走 PKCE 系統瀏覽器流程",
            "透過 RevenueCat 串接 App Store 與 Google Play 月訂、年訂，伺服器對帳後才解鎖",
            "App 內不放任何 Supabase 金鑰，所有請求經 API gateway，並以 CI 檢查守門",
            "黑、象牙白、古金三色設計系統，所有顏色集中在 Design Token"
        ],
        media: [
            { type: 'image' as const, src: "/projects/tag_story/app-screens.jpg", alt: "TAG Story App 首頁故事卡與會員中心畫面" },
        ],
        technologies: [
            "Flutter",
            "Dart",
            "Riverpod",
            "go_router",
            "just_audio",
            "RevenueCat",
            "Sign in with Apple",
        ],
        link: "https://tagstory.co"
    },
    'en': {
        title: "TAG Story App - Business Stories & Decision Learning",
        description: "An iOS and Android app built as client work for TAG Story, the mobile companion to tagstory.co. Members listen, watch, and read their way through a company's key decisions: each episode has a podcast, video, transcript, slides, and a Memo for writing down their own call. The visual direction is a premium business magazine that happens to play audio and video.",
        category: "Mobile Development",
        achievements: [
            "Background playback, lock-screen controls, mini player, chapters, sleep timer, and cross-device resume",
            "Native HLS and MP4 playback, with media URLs issued only after a server-side entitlement check",
            "Native Sign in with Apple on iOS; Google and Android Apple sign-in use a PKCE system-browser flow",
            "Monthly and yearly App Store and Google Play subscriptions via RevenueCat, unlocked only after server reconciliation",
            "No Supabase keys ship in the app: every request goes through an API gateway, enforced by a CI check",
            "Black, ivory, and antique-gold design system with every color defined as a design token"
        ],
        media: [
            { type: 'image' as const, src: "/projects/tag_story/app-screens.jpg", alt: "TAG Story App home story cards and member center screens" },
        ],
        technologies: [
            "Flutter",
            "Dart",
            "Riverpod",
            "go_router",
            "just_audio",
            "RevenueCat",
            "Sign in with Apple",
        ],
        link: "https://tagstory.co"
    }
};
