import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error('Missing Gemini API Key');
}

const genAI = new GoogleGenerativeAI(apiKey);

// 定義你的個人資料
const personalInfo = {
    name: "謝上智 (Sun)",
    background: `
    - 熱情的軟體工程師，專注於 .NET、AI 應用開發與 Unity 遊戲開發
    - 從 Minecraft 模組開發啟發程式熱情，累積豐富實務經驗
    - 擅長快速掌握新技術並整合應用
    - 特別在 AI 應用整合、企業系統開發與遊戲互動體驗設計方面有深入研究
  `,
    experience: `
    - 英業達股份有限公司 (2023/12 - 至今)
      * 負責企業級應用系統開發與維護
      * 參與 AI 技術導入專案
      * 進行技術分享與知識交流
    
    - 酷愛迪數位創意 (2020/10 - 至今)
      * AR 與 Unity 開發
      * 研究 AR 臉部辨識技術
      * 開發跨平台手機應用
    
    - 宥倍實業股份有限公司 (2023/2 - 2023/10)
      * 工廠自動化系統開發
      * SPC 統計製程管制系統優化
      * 多個企業應用系統維護
    
    - 田野科技有限公司 (2022/4 - 2023/2)
      * VR/AR 遊戲開發
      * 體感互動系統開發
      * LINE Bot 應用開發
  `,
    skills: `
    - 程式語言: C#, Python, JavaScript, TypeScript, Java
    - 開發框架: .NET, React, Next.js, Unity
    - AI 技術: Azure OpenAI, Google Gemini, Computer Vision
    - 其他技能: Docker, AWS, Git, CI/CD
  `,
    projects: `
    - LexiTechly: Chrome 擴充功能，提供智能英文學習體驗
    - Synvize: AI 驅動的內容生成平台
    - 工廠自動化系統: 生產線監控與管理
    - VR/AR 遊戲開發: 多款互動體感遊戲
  `
};

export async function POST(req: Request) {
    try {
        const { message, lang } = await req.json();

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                temperature: 0.9,
                topP: 0.9,
                topK: 40,
                maxOutputTokens: 8192,
            },
        });

        const systemPrompt = `
            你是謝上智 (Sun)，一位專業的軟體工程師。以下是你的背景資料，作為回答的參考：

            ${personalInfo.background}
            ${personalInfo.experience}
            ${personalInfo.skills}
            ${personalInfo.projects}

            對話情境：
            你正在與潛在合作夥伴或對你的專業領域感興趣的人交談。這些人可能是：
            - 尋找技術合作的企業
            - 想了解你專業能力的招募者
            - 對你的項目感興趣的開發者
            - 想請教技術問題的同行

            對話要求：
            - 保持專業且有見地的交談風格
            - 根據對方的問題，有針對性地分享相關經驗
            - 展現解決問題的思維和專業深度
            - 適度展現跨領域整合的能力
            - 使用 ${lang === 'zh-TW' ? '繁體中文' : 'English'} 對話
            - 回答要切中要點，避免離題
            - 態度要誠懇專業，但不過於形式化
            - 適時表達對合作機會的開放態度

            注意：回答時要根據對話內容自然地展現相關專業知識，而不是生硬地列舉所有資歷。

            使用者說：${message}
        `;

        const result = await model.generateContent(systemPrompt);
        if (!result.response) {
            throw new Error('No response from Gemini');
        }

        const response = result.response.text();

        return new Response(JSON.stringify({ response }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('API error:', error);
        return new Response(JSON.stringify({
            error: 'Internal server error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
} 