export const openring = {
    'zh-TW': {
        title: "OpenRing - Android 輕量 RPA 工作流引擎",
        description: "基於 Android AccessibilityService 的輕量級 RPA 工作流引擎，完全在手機端執行，無需 PC 後端、無需 Root。整合 Gemini AI ReAct 代理、本地 GGUF 模型推論、語意 UI 解析，支援 Chat-Driven 對話式指令控制任意 Android App，並提供完整的視覺化腳本編輯與排程系統。",
        category: "行動開發",
        achievements: [
            "無 Root、無後端，完全在手機端執行 RPA 自動化",
            "Chat-Driven AI Agent：Gemini ReAct 工具調用（點擊/輸入/截圖/記憶）",
            "可選本地 GGUF 模型（Qwen / Phi / Gemma）離線推論",
            "AccessibilityService 語意 UI 樹解析與精準操作",
            "JSON 腳本編輯器 + WorkManager 任務排程系統",
            "QuickJS 沙盒技能插件系統（Skill Plugins）",
            "GitHub 19 ⭐ 公開開源專案"
        ],
        media: [
            { type: 'image' as const, src: "/projects/openring/home.png", alt: "OpenRing 介面" },
            { type: 'image' as const, src: "/projects/openring/agent.png", alt: "Chat-Driven AI Agent" }
        ],
        technologies: [
            "Kotlin",
            "Android",
            "AccessibilityService",
            "Google Gemini",
            "GGUF / llama.cpp",
            "WorkManager",
            "QuickJS"
        ],
        link: "https://github.com/SunZhi-Will/OpenRing"
    },
    'en': {
        title: "OpenRing - Android Lightweight RPA Workflow Engine",
        description: "A lightweight RPA workflow engine based on Android AccessibilityService that runs entirely on the phone—no PC backend, no Root required. Integrates Gemini AI ReAct agent, local GGUF model inference, semantic UI parsing, and Chat-Driven conversational command control for any Android app, with a full visual script editor and scheduling system.",
        category: "Mobile Development",
        achievements: [
            "No Root, no backend — full on-device Android RPA automation",
            "Chat-Driven AI Agent: Gemini ReAct tool calls (tap/input/screenshot/memory)",
            "Optional local GGUF models (Qwen/Phi/Gemma) for offline inference",
            "AccessibilityService semantic UI tree parsing and precise actions",
            "JSON script editor + WorkManager task scheduling system",
            "QuickJS sandboxed Skill Plugins system",
            "19 ⭐ GitHub public open source project"
        ],
        media: [
            { type: 'image' as const, src: "/projects/openring/home.png", alt: "OpenRing Interface" },
            { type: 'image' as const, src: "/projects/openring/agent.png", alt: "Chat-Driven AI Agent" }
        ],
        technologies: [
            "Kotlin",
            "Android",
            "AccessibilityService",
            "Google Gemini",
            "GGUF / llama.cpp",
            "WorkManager",
            "QuickJS"
        ],
        link: "https://github.com/SunZhi-Will/OpenRing"
    }
};
