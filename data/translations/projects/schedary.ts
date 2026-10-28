export const schedary = {
    'zh-TW': {
        title: "Schedary - 智慧排班與人力調度 SaaS",
        description: "給門市與連鎖店的排班 SaaS：主管在 Web 上一鍵排出公平的班表，有人臨時請假時只重排必要的那一格，每一格都說得出為什麼排這個人。排班交給 Google OR-Tools CP-SAT 限制式最佳化，不使用生成式 AI。由展示用原型 SmartShift AI 分支，改造成可商用的多租戶架構。",
        category: "全端開發",
        achievements: [
            "以 OR-Tools CP-SAT 求解排班，同時滿足人力需求、可上班時段、每週班數上限與員工偏好",
            "最小擾動重排：臨時請假時只調動受影響的班，其餘維持原樣",
            "多租戶架構：每張業務資料表以 organization_id 隔離，跨租戶存取一律回 404",
            "負責人、店長、員工三層權限，店長只能管理自己負責的門市",
            "班表版本管理：草稿與已發布分開，已發布版本不改寫，修改一律建立新版本",
            "整月排班、技能需求、報班收集、找代班、請假假別與操作紀錄已完成"
        ],
        media: [
            { type: 'image' as const, src: "/projects/schedary/home.jpg", alt: "Schedary 首頁與本週班表示範" },
            { type: 'image' as const, src: "/projects/schedary/reschedule.jpg", alt: "Schedary 臨時請假時的最小擾動重排" },
        ],
        technologies: [
            "Next.js",
            "TypeScript",
            "FastAPI",
            "Python",
            "OR-Tools CP-SAT",
            "PostgreSQL",
            "SQLAlchemy",
        ]
    },
    'en': {
        title: "Schedary - Smart Shift Scheduling SaaS",
        description: "A shift scheduling SaaS for stores and chains. Managers generate a fair schedule in one click on the web; when someone calls in sick, only the affected slot is reshuffled, and every assignment comes with a reason. Scheduling is solved with Google OR-Tools CP-SAT constraint optimization rather than generative AI. Forked from the SmartShift AI demo prototype and rebuilt as a commercial multi-tenant product.",
        category: "Full Stack Development",
        achievements: [
            "Solves schedules with OR-Tools CP-SAT, balancing staffing needs, availability, weekly shift caps, and employee preferences",
            "Minimal-disruption rescheduling: a last-minute leave only moves the affected shifts",
            "Multi-tenant design: every business table is scoped by organization_id, and cross-tenant access returns 404",
            "Three permission tiers (owner, store manager, employee); managers only see the stores they run",
            "Schedule versioning: drafts and published versions are separate, and published versions are never overwritten",
            "Monthly scheduling, skill requirements, availability collection, shift swaps, leave types, and audit logs are in place"
        ],
        media: [
            { type: 'image' as const, src: "/projects/schedary/home.jpg", alt: "Schedary homepage with a weekly schedule demo" },
            { type: 'image' as const, src: "/projects/schedary/reschedule.jpg", alt: "Schedary minimal-disruption rescheduling after a leave request" },
        ],
        technologies: [
            "Next.js",
            "TypeScript",
            "FastAPI",
            "Python",
            "OR-Tools CP-SAT",
            "PostgreSQL",
            "SQLAlchemy",
        ]
    }
};
