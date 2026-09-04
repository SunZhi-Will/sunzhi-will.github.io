export const kapzoom = {
    'zh-TW': {
        title: "KapZoom - AI 智慧螢幕錄製與剪輯工具",
        description: "本機優先的桌面螢幕錄製與剪輯工具（前身為 AutoLens），錄一次就能自動聚焦操作、以離線 Whisper 生成字幕，並在完整時間軸精修，也可用自然語言請 AI 直接動手剪。採自研 DXGI 擷取引擎，Windows 與 Mac 皆可用，買斷制、不訂閱；獨家 MCP 橋接可透過 Claude Code 驅動錄製到匯出的完整流程。Synvize 新維境旗下產品。",
        category: "桌面應用",
        achievements: [
            "自動偵測操作重點並以阻尼彈簧物理平滑相機縮放，事後仍可在時間軸逐段調整",
            "自研 DXGI + 硬體編碼擷取引擎，畫面無系統游標烙印、高幀率低負載",
            "離線 Whisper 本地字幕生成，自然語言指令即可請 AI 直接剪輯（刪停頓、放大、配字幕）",
            "系統聲音 + 麥克風混音錄製，Windows 與 macOS（Apple Silicon）皆支援",
            "獨家 MCP 橋接：可用 Claude Code 以自然語言驅動「錄製 → 編輯 → 匯出」全流程",
            "買斷制取代訂閱，支援 MP4（最高 4K）與 GIF 匯出"
        ],
        media: [
            { type: 'image' as const, src: "/projects/kapzoom/home.jpg", alt: "KapZoom 官網首頁" }
        ],
        technologies: [
            "Electron",
            "React",
            "TypeScript",
            "DXGI Capture",
            "Whisper（本地 AI 字幕）",
            "MCP",
        ],
    },
    'en': {
        title: "KapZoom - AI Screen Recording & Editing Tool",
        description: "A local-first desktop screen recording and editing tool (formerly AutoLens). Record once and KapZoom auto-focuses on the action, generates offline captions via Whisper, and lets you fine-tune everything on a full timeline — or hand editing off to AI with natural-language commands. Built on a custom DXGI capture engine, available on both Windows and Mac, one-time purchase with no subscription; an exclusive MCP bridge lets Claude Code drive the full record-to-export workflow. A Synvize product.",
        category: "Desktop Application",
        achievements: [
            "Auto-detects the action and smooths camera zoom with damped-spring physics; every zoom segment stays adjustable on the timeline afterward",
            "Custom DXGI + hardware-encoded capture engine — clean footage with no system cursor burn-in, high frame rate, low overhead",
            "Offline local Whisper captioning; natural-language commands let AI edit directly (cut pauses, zoom in, add captions)",
            "System audio + microphone mixed recording on both Windows and macOS (Apple Silicon)",
            "Exclusive MCP bridge: drive the full record → edit → export workflow with Claude Code via natural language",
            "One-time purchase instead of a subscription, with MP4 (up to 4K) and GIF export"
        ],
        media: [
            { type: 'image' as const, src: "/projects/kapzoom/home.jpg", alt: "KapZoom homepage" }
        ],
        technologies: [
            "Electron",
            "React",
            "TypeScript",
            "DXGI Capture",
            "Whisper (Local AI Captions)",
            "MCP",
        ],
    }
};
