export const usermeld = {
    'zh-TW': {
        title: "Usermeld - 跨產品用戶身分統一",
        description: "讓一個人經營的多個產品，知道哪些用戶其實是同一個人：看得到誰用了哪些產品、誰在哪裡付過錢，用戶要求刪除時一個指令傳到所有產品，全部確認後才抹除並產出刪除證明。目前作為內部工具，已接上 Sunkoro、山河未歸、方界、Vozmira 等自有產品。",
        category: "全端開發",
        achievements: [
            "身分合併規則：同一個 Google 帳號或同一個已驗證 email 才自動合併，有疑慮的情況交給人判斷",
            "所有合併都可以拆回去，不會因為誤判而永久混在一起",
            "一次刪除：刪除請求傳到所有產品，全部回報確認後才抹除，並產出刪除證明",
            "零依賴 SDK，提供 Auth.js（v4 與 v5）與 Better Auth 轉接器，新專案幾行就能接入",
            "以 Zod 定義 API 契約並自動產生 OpenAPI，非 Next.js 專案也能照規格接入",
            "唯讀回填工具，直接從各產品資料產出跨產品重疊報表"
        ],
        media: [
            { type: 'image' as const, src: "/projects/usermeld/home.jpg", alt: "Usermeld 首頁與全部用戶清單示範" },
            { type: 'image' as const, src: "/projects/usermeld/features.jpg", alt: "Usermeld 功能介紹：認出同一個人" },
        ],
        technologies: [
            "Next.js",
            "TypeScript",
            "Prisma",
            "PostgreSQL",
            "Zod",
            "OpenAPI",
            "pnpm Workspaces",
        ]
    },
    'en': {
        title: "Usermeld - Cross-Product User Identity",
        description: "Helps a solo maker running several products see which users are actually the same person: who uses which products, who has paid where, and, when someone asks to be deleted, one command fans out to every product and only erases data once all of them confirm, producing a deletion receipt. Currently used internally and connected to my own products, including Sunkoro, Where the Mountains Await, Fangjie, and Vozmira.",
        category: "Full Stack Development",
        achievements: [
            "Merge rules: accounts merge automatically only on the same Google account or the same verified email; ambiguous cases go to a human",
            "Every merge can be split back, so a wrong match never becomes permanent",
            "One-shot deletion: a request reaches every product and data is erased only after all confirm, with a deletion receipt",
            "Zero-dependency SDK with adapters for Auth.js (v4 and v5) and Better Auth; a new project connects in a few lines",
            "API contracts defined in Zod with generated OpenAPI, so non-Next.js projects can integrate from the spec",
            "Read-only backfill tooling that produces cross-product overlap reports from existing data"
        ],
        media: [
            { type: 'image' as const, src: "/projects/usermeld/home.jpg", alt: "Usermeld homepage with the all-users list demo" },
            { type: 'image' as const, src: "/projects/usermeld/features.jpg", alt: "Usermeld features: recognizing the same person" },
        ],
        technologies: [
            "Next.js",
            "TypeScript",
            "Prisma",
            "PostgreSQL",
            "Zod",
            "OpenAPI",
            "pnpm Workspaces",
        ]
    }
};
