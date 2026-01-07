const fs = require('fs');
const path = require('path');
// @google/genai 為 ESM 套件，使用動態 import 取得類別
let genAIClientPromise = null;

// 確保目錄存在
const blogDir = path.join(process.cwd(), 'content/blog');
if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
}

// 取得今天的日期和時間戳
const today = new Date();
const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
const timeStr = today.toISOString().split('T')[1].split('.')[0].replace(/:/g, ''); // HHMMSS
const timestamp = `${dateStr}-${timeStr}`; // YYYY-MM-DD-HHMMSS（與現有資料夾格式一致）
const dateFormatted = new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
}).format(today);

// 使用時間戳作為資料夾名稱（符合資料結構：content/blog/[日期時間]/）
const slug = timestamp;
const postFolder = path.join(blogDir, slug);
const articlePathZh = path.join(postFolder, 'article.zh-TW.mdx');
const articlePathEn = path.join(postFolder, 'article.en.mdx');

// 檢查今天是否已經有生成過（依資料夾日期或檔名含今日日期）
function isTodayGenerated() {
    try {
        const entries = fs.readdirSync(blogDir, { withFileTypes: true });
        return entries.some((entry) => {
            if (entry.isDirectory()) {
                // 新結構：YYYY-MM-DD-HHMMSS 或 YYYYMMDD-HHMMSS
                return entry.name.startsWith(dateStr); // 以 YYYY-MM-DD 開頭
            }
            if (entry.isFile()) {
                // 舊結構：ai-daily-report-YYYY-MM-DD.mdx 或其他含今日日期的檔名
                return entry.name.includes(dateStr) && (entry.name.endsWith('.mdx') || entry.name.endsWith('.md'));
            }
            return false;
        });
    } catch {
        return false;
    }
}

if (isTodayGenerated()) {
    console.log(`Daily report for ${dateStr} already exists. Skipping...`);
    process.exit(0);
}

// 建立文章資料夾
if (!fs.existsSync(postFolder)) {
    fs.mkdirSync(postFolder, { recursive: true });
}

// 初始化 Google Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error('Error: GEMINI_API_KEY environment variable is not set');
    process.exit(1);
}

// 動態建立 Gen AI Client（處理 ESM 匯入）
async function getGenAIClient() {
    if (!genAIClientPromise) {
        genAIClientPromise = import('@google/genai').then((mod) => {
            // 優先使用 GoogleGenAI（新 SDK 主要入口）
            const ClientClass =
                mod.GoogleGenAI ||
                mod.GoogleAI ||
                mod.GoogleGenerativeAI ||
                mod.default?.GoogleGenAI ||
                mod.default?.GoogleAI ||
                mod.default?.GoogleGenerativeAI ||
                (typeof mod.default === 'function' ? mod.default : null);

            if (!ClientClass) {
                const availableKeys = Object.keys(mod || {}).concat(Object.keys(mod?.default || {}));
                throw new Error(
                    `Cannot find GoogleGenAI/GoogleAI/GoogleGenerativeAI in @google/genai. Export keys: ${availableKeys.join(', ')}`
                );
            }

            // 參考 trendpulse：不設定 apiVersion，使用預設（可能支援 tools）
            const client = new ClientClass({ apiKey });
            // 新版 SDK 以 ai.models.* 提供存取
            if (!client.models || typeof client.models.generateContent !== 'function') {
                const keys = Object.keys(client || {});
                throw new Error(`Loaded client does not expose models.generateContent. Client keys: ${keys.join(', ')}`);
            }
            return client;
        });
    }

    return genAIClientPromise;
}

// 模型列表按優先順序排列（參考 trendpulse：優先使用 gemini-2.5-flash）
// 注意：免費層 gemini-2.5-flash 限制 20 次/天
const modelNames = [
    'gemini-2.5-flash',          // 參考專案主要使用的模型（免費層：20次/天）
    'gemini-1.5-flash',          // 備用（如果可用）
    'gemini-1.5-pro',            // 備用（如果可用）
];

// 計算昨天的日期（用於搜尋過濾）
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayISO = yesterday.toISOString().split('T')[0]; // YYYY-MM-DD

// Persona 風格（參考 trendpulse 的「AI 白話解讀專家」）
const personaStyle = `請扮演一位『科技白話文說書人』。你的目標受眾是**完全不懂程式碼**的普羅大眾（如行銷人員、業務、或是家中長輩）。

【最高指導原則：像朋友聊天一樣說故事】
1. **禁止行銷腔調**：不要用「引領未來」、「顛覆想像」、「全新篇章」這種空泛的詞。要說人話。
2. **強制使用「神比喻」**：遇到技術名詞（如 LLM, Agent, RAG），**必須**用生活場景來比喻。例如：「AI Agent 就像是你請了一個會自己跑腿買咖啡的實習生，而不只是會回答問題的字典」。
3. **資料引用鐵律**：內容細節（人名、數據、功能）必須嚴格基於搜尋結果，不能瞎掰。
4. **排版規定**：請使用標準的 Markdown 標題 (###) 和列表 (-)，**嚴禁**使用 『・』 或其他特殊全形符號作為列表開頭。

【文章結構與撰寫口吻】：

### 發生了什麼事？（像在講八卦）
(用最白話的方式，告訴我這則新聞的重點。例如：「大家都在傳 Google 又出包了...」或是「OpenAI 昨天半夜突然丟出一個震撼彈...」。)

### 簡單說，這到底是什麼？（神比喻時間）
(這是你的主場。請發揮創意，用一個**具體的生活比喻**來解釋這個技術或產品。讓讀者看完會發出「阿～原來是這樣！」的驚嘆。)

### 根據報導，細節是這樣的
(這裡列出搜尋到的具體數據或功能。例如：「根據官方消息，它處理速度快了 2 倍...」)

### 這對我們有什麼影響？
(跳過技術參數，直接講應用。這東西會讓我的工作變快嗎？會讓我失業嗎？還是會讓我追劇更爽？)

### 內行人的深度點評
(分析這件事背後的商業邏輯。這家公司在打什麼算盤？誰會因此倒大楣？誰會賺大錢？)

### 一句話總結
(用一句精闢、有力、甚至帶點幽默吐槽的話來收尾。)

篇幅目標：1000 - 1500 字。請保持語氣輕鬆幽默，但觀點要有深度。`;

// 生成 AI 日報的 Prompt（參考 trendpulse 的結構）
const articlePromptZh = `
【System: Strict Investigative Journalist Agent】
你是一位資深調查記者，擁有 Google Search 的即時查證能力。

【SECURITY PROTOCOL - STRICT MARKDOWN ONLY】
- **CRITICAL**: You are FORBIDDEN from using HTML tags.
- ❌ Incorrect: <h1>Title</h1>, <h4>Subtitle</h4>, <b>Bold</b>, <p>Text</p>
- ✅ Correct: # Title, ### Subtitle, **Bold**, Text
- Check your output before finishing: Did you use <h4>? If yes, replace it with ### immediately.
- Output **PURE MARKDOWN** only.

【基準時間】
今天是：${dateFormatted} (${dateStr})

【執行策略】
1. **搜尋**：
   【多關鍵字拆解邏輯】
   Input Topic: "AI 最新動態"
   1. **Analyze input**: 如果輸入包含多個概念，**絕對不要**把它們當成一個長字串搜尋。
   2. **Split & Search**: 你必須將其拆解為獨立的搜尋查詢。
      - Query A: Search "AI latest news" after:${yesterdayISO}
      - Query B: Search "artificial intelligence trends" after:${yesterdayISO}
      - Query C: Search "人工智慧 最新消息" after:${yesterdayISO}
      - Query D: Search for the combination/intersection of these topics.
   3. **English Translation**: 對於科技/金融議題，務必搜尋英文關鍵字 (e.g. "AI", "Machine Learning", "LLM") 以獲得高品質來源。
   (重要：針對國際或科技議題，請務必自主轉譯為英文關鍵字進行搜尋，以獲取最完整的國際資訊，不要只侷限於中文搜尋結果)
2. **過濾**：
   【時效性防火牆】
   - 你的搜尋指令必須包含 after:${yesterdayISO}。
   - 如果搜尋結果的日期早於 ${yesterdayISO}，請忽略它，不要寫入文章。
   - 只使用 ${dateStr}（今天）發布或發生的新聞和動態。
3. **篇幅**：約 1500 字以上。結構：1. 今日頭條快訊 (情境鋪陳) 2. 事件詳情與技術科普 3. 產業深度商機分析。

【關鍵：SOURCE OF TRUTH (事實來源)】
- 你**必須**使用工具 (Google Search) 找到的資訊作為文章的基礎
- 仔細閱讀搜尋回傳的摘要。具體的數字、人名、事件發生經過，必須從搜尋結果中提取
- 不要只寫空泛的理論，請寫出「搜尋到的具體細節」

【電子報視覺化排版指令 (Visual Formatting)】
1. **行內引用**：使用 [1], [2] 標記
2. **來源清單**：文章末尾 <<<SOURCES>>> 列出 URL
3. **重點強調**：使用 **粗體** 標示關鍵數據或人名
4. **引用區塊**：使用 > 引用區塊來展示金句或核心觀點
5. **內文真實配圖 (Real Source Images)**：
   - 請嘗試從搜尋到的來源內容中，提取**真實的新聞圖片網址 (URL)**
   - 如果你在來源中發現有效的圖片連結 (結尾通常是 .jpg, .png, .webp)，請直接插入文章中
   - 格式：\`![Source: 圖片來源名稱](https://真實圖片網址.jpg)\`
   - **嚴禁**在內文使用 generate_inline 指令
   - **嚴禁**捏造無法訪問的網址
   - 如果找不到真實圖片，該段落就不要放圖片

【撰寫設定】
- **角色**：科技白話文說書人
- **風格指令 (Persona Style)**：
  ${personaStyle}

【輸出格式】
<<<TITLE>>>
(標題：只輸出標題內容，不要包含「【AI日報】」前綴，系統會自動加上。標題要幽默有趣，不包含日期)
<<<SUMMARY>>>
(摘要：**必須完整且有意義**，約 150-200 字。請確保摘要是一個完整的段落，包含文章的核心要點，並且在句子結尾結束，不要在中間截斷。摘要應該涵蓋：主要事件、關鍵數據、重要影響。)
<<<SEARCH_QUERIES>>>
(搜尋關鍵字，用逗號分隔)
<<<IMAGE_PROMPT>>>
(封面圖片的 AI 繪圖指令：請設計一張「RPG 遊戲風格的資訊圖表」。
目標：透過 RPG 角色面板/任務清單的視覺化方式來呈現文章的核心邏輯。
限制：**嚴禁包含文字 (No Text)**。請用符號、圖標、幾何圖形來代替文字標籤，保持畫面非常乾淨、極簡，避免資訊過載。)
<<<CONTENT>>>
(正文，若有找到真實圖片連結請包含在內)
<<<SOURCES>>>
(來源列表，每行一個 URL)
`;

// 英文翻譯 Prompt（基於中文文章）
function createEnglishTranslationPrompt(chineseContent, chineseTitle, chineseSummary, chineseImagePrompt, chineseSources) {
    return `
【System: Professional Translator & Content Adaptor】
You are a professional translator and content adaptor. Your task is to translate and adapt a Chinese AI daily report article into English while maintaining the same structure, tone, and depth.

【Source Article (Chinese)】
Title: ${chineseTitle}
Summary: ${chineseSummary}

Content:
${chineseContent}

【Translation Requirements】
1. **Maintain Structure**: Keep the exact same section structure as the Chinese version:
   - ### What Happened? (Like telling gossip)
   - ### Simply Put, What Is This? (Metaphor time)
   - ### According to Reports, Details Are as Follows
   - ### What Does This Mean for Us?
   - ### Insider's Deep Analysis
   - ### One-Liner Summary

2. **Preserve Tone**: Maintain the same friendly, conversational, humorous tone. Translate metaphors naturally, keeping the "brilliant metaphors" intact.

3. **Keep All Details**: Preserve all specific data, names, numbers, and facts from the Chinese version. Do not add or remove information.

4. **Natural English**: Translate naturally into fluent English, not word-for-word. Adapt cultural references appropriately for English readers.

5. **Maintain Formatting**: Keep the same Markdown formatting, bold text, lists, and structure.

6. **Sources**: Use the same sources as the Chinese version, but translate source titles if needed.

【Output Format】
<<<TITLE>>>
(Translate the title naturally. Only output the title content, do NOT include "【AI Daily】" prefix, the system will add it automatically. Title should be witty and interesting, no date)
<<<SUMMARY>>>
(Translate the summary naturally, **must be complete and meaningful**, ~150-200 words. Ensure the summary is a complete paragraph that includes the article's core points and ends at a sentence boundary, not mid-sentence. The summary should cover: main events, key data, important impacts.)
<<<SEARCH_QUERIES>>>
(Use the same search queries from Chinese version, or translate them to English)
<<<IMAGE_PROMPT>>>
(${chineseImagePrompt})
<<<CONTENT>>>
(Translate the entire content, maintaining all sections and structure)
<<<SOURCES>>>
(Use the same sources, translate titles if needed)
`;
}

/**
 * 使用新的 @google/genai SDK 調用 Google Gemini API（帶重試機制）
 * @param {string} modelName - 模型名稱
 * @param {string} prompt - 提示詞
 * @param {boolean} useSearch - 是否使用 Google Search 工具
 * @param {number} maxRetries - 最大重試次數
 * @returns {Promise<{text: string, sources?: any[]}>} 生成的內容和來源
 */
async function callGeminiAPI(modelName, prompt, useSearch = true, maxRetries = 3) {
    const ai = await getGenAIClient();

    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            // 參考 trendpulse：將所有參數放在一個物件中
            const params = {
                model: modelName,
                contents: prompt,
            };

            // 只有在需要搜尋時才加入 tools
            if (useSearch) {
                params.config = {
                    tools: [{ googleSearch: {} }],
                };
            }

            const result = await ai.models.generateContent(params);

            const text =
                result.text ||
                result.response?.candidates?.[0]?.content?.parts
                    ?.map((p) => p.text || '')
                    .join('')
                    .trim() ||
                '';

            // 檢查 Hallucination
            if (isHallucinated(text)) {
                console.warn(`Attempt ${i + 1}: Hallucination detected.`);
                if (i === maxRetries - 1) throw new Error('Hallucination detected in response');
                continue;
            }

            // 提取來源
            const sources = [];
            if (result.candidates?.[0]?.groundingMetadata?.groundingChunks) {
                result.candidates[0].groundingMetadata.groundingChunks.forEach((chunk) => {
                    if (chunk.web?.uri) {
                        sources.push({
                            title: chunk.web.title || 'Reference Source',
                            uri: chunk.web.uri,
                        });
                    }
                });
            }

            return { text, sources };
        } catch (error) {
            lastError = error;
            console.warn(`GenAI API Attempt ${i + 1} failed.`, error.message);
            if (i === maxRetries - 1) break;

            // 處理配額錯誤（429）：解析重試時間
            let delay = 2000 * Math.pow(2, i); // 預設指數退避
            if (error.status === 429 || error.code === 429) {
                let retrySeconds = null;

                // 方法1：從錯誤的 details 中提取 retryDelay（優先）
                if (error.details && Array.isArray(error.details)) {
                    for (const detail of error.details) {
                        if (detail['@type'] === 'type.googleapis.com/google.rpc.RetryInfo' && detail.retryDelay) {
                            // retryDelay 可能是字串 "58s" 或物件
                            const delayStr = typeof detail.retryDelay === 'string'
                                ? detail.retryDelay
                                : detail.retryDelay.seconds || detail.retryDelay;
                            const match = String(delayStr).match(/([\d.]+)s?/);
                            if (match) {
                                retrySeconds = parseFloat(match[1]);
                                break;
                            }
                        }
                    }
                }

                // 方法2：從錯誤訊息中提取（備用）
                if (retrySeconds === null) {
                    const errorMessage = error.message || JSON.stringify(error);
                    const retryMatch = errorMessage.match(/retry in ([\d.]+)s/i);
                    if (retryMatch) {
                        retrySeconds = parseFloat(retryMatch[1]);
                    }
                }

                if (retrySeconds !== null) {
                    delay = Math.ceil(retrySeconds * 1000) + 1000; // 轉換為毫秒，加1秒緩衝
                    console.log(`⏳ Quota exceeded, waiting ${retrySeconds.toFixed(1)}s before retry...`);
                } else {
                    // 如果無法解析，使用較長的等待時間
                    delay = 60000; // 1分鐘
                    console.log(`⏳ Quota exceeded, waiting 60s before retry...`);
                }
            }

            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    throw lastError || new Error('API call failed after retries');
}

/**
 * 清理 HTML 標籤，轉換為 Markdown
 */
function cleanupHtmlTags(text) {
    if (!text) return '';
    let cleaned = text;
    cleaned = cleaned.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1');
    cleaned = cleaned.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1');
    cleaned = cleaned.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1');
    cleaned = cleaned.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1');
    cleaned = cleaned.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    cleaned = cleaned.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    cleaned = cleaned.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    cleaned = cleaned.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
    cleaned = cleaned.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
    cleaned = cleaned.replace(/<ul[^>]*>/gi, '').replace(/<\/ul>/gi, '');
    cleaned = cleaned.replace(/<ol[^>]*>/gi, '').replace(/<\/ol>/gi, '');
    cleaned = cleaned.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1');
    cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
    return cleaned;
}

/**
 * 檢查是否產生 Hallucination（程式碼或 HTML）
 */
function isHallucinated(text) {
    if (!text) return false;
    const forbiddenPatterns = [
        '<!DOCTYPE html>',
        '<body',
        '<html',
        '<div id="root"',
        'export default function',
        'import React',
        'react-dom/client',
    ];
    return forbiddenPatterns.some((p) => text.includes(p));
}

/**
 * 清理字串（移除多餘空白和標記）- 參考 trendpulse 的實現
 */
function cleanStr(str) {
    if (!str) return '';
    // 參考 trendpulse：先移除 <<< 之後的內容，再 trim
    return str.split('<<<')[0].trim();
}

/**
 * 解析結構化輸出
 */
function parseStructuredOutput(text) {
    let titlePart = '',
        summaryPart = '',
        searchQueriesPart = '',
        imagePromptPart = '',
        contentPart = '',
        sourcesPart = '';

    if (text.includes('<<<TITLE>>>')) titlePart = text.split('<<<TITLE>>>')[1]?.split('<<<')[0] || '';
    if (text.includes('<<<SUMMARY>>>')) summaryPart = text.split('<<<SUMMARY>>>')[1]?.split('<<<')[0] || '';
    if (text.includes('<<<SEARCH_QUERIES>>>')) searchQueriesPart = text.split('<<<SEARCH_QUERIES>>>')[1]?.split('<<<')[0] || '';
    if (text.includes('<<<IMAGE_PROMPT>>>')) imagePromptPart = text.split('<<<IMAGE_PROMPT>>>')[1]?.split('<<<')[0] || '';
    if (text.includes('<<<CONTENT>>>')) contentPart = text.split('<<<CONTENT>>>')[1]?.split('<<<')[0] || '';
    if (text.includes('<<<SOURCES>>>')) sourcesPart = text.split('<<<SOURCES>>>')[1] || '';

    // 如果沒有結構化輸出，使用整個文字作為內容
    if (!contentPart && !titlePart) {
        contentPart = text;
    }

    // 清理標題（移除 Markdown 標題符號和方括號）
    let rawTitle = cleanStr(titlePart) || '今日精選';
    rawTitle = rawTitle.replace(/^#+\s*/, '').trim();
    rawTitle = cleanupHtmlTags(rawTitle);

    // 移除所有可能的「【AI日報】」或「【AI Daily】」前綴（避免重複）
    rawTitle = rawTitle.replace(/^【AI日報】\s*/g, '');
    rawTitle = rawTitle.replace(/^【AI Daily】\s*/g, '');
    rawTitle = rawTitle.replace(/^AI日報\s*/g, '');
    rawTitle = rawTitle.replace(/^AI Daily\s*/g, '');
    rawTitle = rawTitle.trim();

    // 統一加上【AI日報】前綴
    if (!rawTitle) {
        rawTitle = '今日精選';
    }
    rawTitle = `【AI日報】${rawTitle}`;

    const summary = cleanupHtmlTags(cleanStr(summaryPart) || '本篇報導整合了多方來源的即時數據與分析...');
    const imagePrompt = cleanStr(imagePromptPart) || `AI daily report ${dateStr}, RPG game-style infographic, minimalist chart, no text`;
    let content = cleanStr(contentPart) || text;
    if (content.includes('<<<SOURCES>>>')) content = content.split('<<<SOURCES>>>')[0];
    content = cleanupHtmlTags(content);
    content = content.replace(/!\[(.*?)\]\(generate_inline\)/g, ''); // 移除 generate_inline

    // 解析搜尋關鍵字
    const rawQueries = cleanStr(searchQueriesPart);
    const searchQueries = rawQueries
        ? rawQueries.split(/,|、|\n/).map((q) => q.trim()).filter((q) => q.length > 0)
        : [];

    // 解析來源（從結構化輸出和 API 回傳的來源）
    const sources = [];
    // 從 sourcesPart 提取 URL
    if (sourcesPart) {
        const lines = sourcesPart.split('\n');
        lines.forEach((line) => {
            const urlMatch = line.match(/(https?:\/\/[^\s\)]+)/);
            if (urlMatch) {
                const uri = urlMatch[0];
                let title = line.replace(uri, '').replace(/^[0-9]+[\.\)]\s*/, '').replace(/^[\-\*•]\s*/, '').replace(/[\||：:]/g, '').trim();
                if (!title || title.length < 2) {
                    try {
                        title = new URL(uri).hostname;
                    } catch {
                        title = 'External Source';
                    }
                }
                if (!sources.find((s) => s.uri === uri)) {
                    sources.push({ title, uri });
                }
            }
        });
    }

    return {
        title: rawTitle,
        summary,
        content,
        imagePrompt,
        searchQueries,
        sources,
    };
}

/**
 * 使用 Gemini 生成圖片（參考 trendpulse 的實現）
 * 優先使用 Gemini 2.5 Flash Image 模型
 */
async function generateImageWithGemini(prompt) {
    const ai = await getGenAIClient();
    // 圖片生成模型列表（按優先順序）
    // 優先使用 Gemini 2.5 Flash Image（最新版本）
    const imageModelCandidates = [
        'gemini-2.5-flash-image',   // Gemini 2.5 Flash Image（優先使用）
        'gemini-2.0-flash-exp-image', // Gemini 2.0 Flash Experimental Image（備用）
    ];

    // 優化 Prompt：強制使用「RPG 遊戲風格資訊圖表」（參考 trendpulse）
    const enhancedPrompt = `${prompt}, RPG game-style infographic, data visualization style, isometric 3d chart, concept map, business intelligence, clean vector art, white background, high contrast, professional, 8k, no text, textless, without words, no letters, no watermark, clean design, simple geometric shapes`;

    for (const model of imageModelCandidates) {
        try {
            console.log(`Generating cover image with model: ${model}...`);
            // 參考 trendpulse 的格式：contents: { parts: [{ text: enhancedPrompt }] }
            const result = await ai.models.generateContent({
                model,
                contents: {
                    parts: [{ text: enhancedPrompt }],
                },
                config: {
                    imageConfig: { aspectRatio: '16:9' },
                },
            });

            // 檢查回傳的圖片資料
            for (const candidate of result.candidates || []) {
                for (const part of candidate.content?.parts || []) {
                    if (part.inlineData) {
                        const imageBuffer = Buffer.from(part.inlineData.data, 'base64');
                        const imageFileName = `cover-${timestamp}.png`;
                        const imagePath = path.join(postFolder, imageFileName);
                        fs.writeFileSync(imagePath, imageBuffer);
                        console.log(`✅ Cover image generated: ${imageFileName}`);
                        return imageFileName;
                    }
                }
            }

            // 嘗試其他可能的格式
            const img =
                result.data?.[0]?.b64Json ||
                result.data?.[0]?.bytesBase64Encoded ||
                result.data?.[0]?.image?.base64 ||
                result.data?.[0]?.imageBase64;

            if (img) {
                const imageBuffer = Buffer.from(img, 'base64');
                const imageFileName = `cover-${timestamp}.png`;
                const imagePath = path.join(postFolder, imageFileName);
                fs.writeFileSync(imagePath, imageBuffer);
                console.log(`✅ Cover image generated: ${imageFileName}`);
                return imageFileName;
            }
        } catch (error) {
            console.error(`⚠️  Image model ${model} failed:`, error.message);
            continue;
        }
    }

    console.log('⚠️  Could not generate cover image, continuing without it...');
    return null;
}

/**
 * 生成文章內容（中英文）- 參考 trendpulse 的重試邏輯
 */
async function generateArticles() {
    let lastError = null;

    for (const modelName of modelNames) {
        // 參考 trendpulse：每個模型嘗試 2 次（處理 Hallucination）
        let attemptError;
        for (let attempt = 0; attempt < 2; attempt++) {
            try {
                console.log(`Trying model: ${modelName} (attempt ${attempt + 1})...`);

                // 生成中文文章
                const resultZh = await callGeminiAPI(modelName, articlePromptZh, true);

                // 檢查 Hallucination
                if (isHallucinated(resultZh.text)) {
                    console.warn(`Attempt ${attempt + 1}: Hallucination detected in Chinese content.`);
                    continue;
                }

                const parsedZh = parseStructuredOutput(resultZh.text);

                // 再次檢查內容是否 Hallucinated
                if (isHallucinated(parsedZh.content)) {
                    console.warn(`Attempt ${attempt + 1}: Content Hallucination detected.`);
                    continue;
                }

                // 合併 API 回傳的來源
                if (resultZh.sources && resultZh.sources.length > 0) {
                    parsedZh.sources = [...parsedZh.sources, ...resultZh.sources];
                }

                // 生成英文文章（基於中文文章翻譯）
                console.log(`Translating Chinese article to English...`);
                // 移除中文標題的前綴，只保留標題內容
                let zhTitleForTranslation = parsedZh.title.replace(/^【AI日報】\s*/g, '').trim();
                const translationPrompt = createEnglishTranslationPrompt(
                    parsedZh.content,
                    zhTitleForTranslation,
                    parsedZh.summary,
                    parsedZh.imagePrompt,
                    parsedZh.sources.map(s => s.uri).join('\n')
                );

                const resultEn = await callGeminiAPI(modelName, translationPrompt, false); // 翻譯不需要搜尋

                // 檢查 Hallucination
                if (isHallucinated(resultEn.text)) {
                    console.warn(`Attempt ${attempt + 1}: Hallucination detected in English translation.`);
                    continue;
                }

                const parsedEn = parseStructuredOutput(resultEn.text);

                // 再次檢查內容是否 Hallucinated
                if (isHallucinated(parsedEn.content)) {
                    console.warn(`Attempt ${attempt + 1}: Content Hallucination detected.`);
                    continue;
                }

                // 確保英文標題格式（移除重複前綴）
                let enTitle = parsedEn.title;
                // 移除所有可能的「【AI日報】」或「【AI Daily】」前綴（避免重複）
                enTitle = enTitle.replace(/^【AI日報】\s*/g, '');
                enTitle = enTitle.replace(/^【AI Daily】\s*/g, '');
                enTitle = enTitle.replace(/^AI日報\s*/g, '');
                enTitle = enTitle.replace(/^AI Daily\s*/g, '');
                enTitle = enTitle.trim();

                // 統一加上【AI Daily】前綴
                if (!enTitle) {
                    enTitle = "Today's Highlights";
                }
                parsedEn.title = `【AI Daily】${enTitle}`;

                // 使用中文文章的來源（因為英文是翻譯版本）
                parsedEn.sources = parsedZh.sources;

                // 生成封面圖片
                const coverImage = await generateImageWithGemini(parsedZh.imagePrompt || parsedEn.imagePrompt);

                // 處理內容並寫入檔案
                processContent(parsedZh, parsedEn, coverImage);

                // 清理超過十天的舊日報
                cleanupOldReports(10);

                return; // 成功退出

            } catch (error) {
                attemptError = error;
                console.error(`Attempt ${attempt + 1} Error:`, error.message);
            }
        }

        // 如果這個模型的所有嘗試都失敗，記錄錯誤並嘗試下一個模型
        if (attemptError) {
            lastError = attemptError;
            const isModelNotFound =
                attemptError.status === 404 ||
                attemptError.message?.includes('not found') ||
                attemptError.message?.includes('404') ||
                attemptError.message?.includes('Model') ||
                attemptError.code === 404;

            const isTemporaryError =
                attemptError.status === 503 ||
                attemptError.message?.includes('overloaded') ||
                attemptError.message?.includes('try again');

            const isQuotaError =
                attemptError.status === 429 ||
                attemptError.code === 429 ||
                attemptError.message?.includes('quota') ||
                attemptError.message?.includes('RESOURCE_EXHAUSTED');

            if (isModelNotFound) {
                console.log(`Model ${modelName} not available, trying next...`);
                continue;
            } else if (isQuotaError) {
                // 配額錯誤：如果是免費層配額用完，應該優雅地失敗
                const errorMessage = attemptError.message || JSON.stringify(attemptError);
                const isFreeTierQuota = errorMessage.includes('free_tier') || errorMessage.includes('FreeTier');

                if (isFreeTierQuota) {
                    console.log(`⚠️  Model ${modelName} free tier quota exceeded (20 requests/day limit).`);
                    // 如果是第一個模型（主要模型）且是免費層配額，嘗試下一個模型
                    if (modelName === modelNames[0]) {
                        console.log(`   Trying next model...`);
                        continue;
                    } else {
                        // 如果所有模型的免費配額都用完，優雅地失敗
                        console.error(`\n❌ All models have exceeded free tier quota.`);
                        console.error(`   Free tier limit: 20 requests/day per model`);
                        console.error(`   Please wait for quota reset or upgrade to paid plan.`);
                        throw new Error('All models exceeded free tier quota. Please wait for quota reset or upgrade plan.');
                    }
                } else {
                    // 付費層配額錯誤，等待後重試
                    console.log(`⚠️  Model ${modelName} quota exceeded. Trying next model...`);
                    continue;
                }
            } else if (isTemporaryError) {
                console.log(`Model ${modelName} temporarily unavailable, trying next...`);
                continue;
            } else {
                console.error(`Error with model ${modelName}:`, attemptError.message);
                // 繼續嘗試下一個模型
                continue;
            }
        }
    }

    throw lastError || new Error('AI 生成失敗 (Hallucination Limit)');
}

/**
 * 處理內容並寫入檔案
 */
function processContent(parsedZh, parsedEn, coverImage) {
    // 使用完整的 summary，不進行截斷
    const descriptionZh = (parsedZh.summary || '').trim();
    const descriptionEn = (parsedEn.summary || '').trim();

    // 生成中文 frontmatter
    const frontmatterZh = `---
title: "${parsedZh.title}"
date: "${dateStr}"
description: "${descriptionZh.replace(/"/g, '\\"')}"
tags: ["AI", "每日日報", "技術趨勢"]
${coverImage ? `coverImage: "${coverImage}"` : ''}
---

`;

    // 生成英文 frontmatter
    const frontmatterEn = `---
title: "${parsedEn.title}"
date: "${dateStr}"
description: "${descriptionEn.replace(/"/g, '\\"')}"
tags: ["AI", "Daily Report", "Tech Trends"]
${coverImage ? `coverImage: "${coverImage}"` : ''}
---

`;

    // 組合完整內容（包含來源）
    let contentZh = parsedZh.content;
    // 確保來源區塊一定會顯示
    contentZh += '\n\n---\n\n## 參考來源\n\n';
    if (parsedZh.sources && parsedZh.sources.length > 0) {
        // 去重來源（根據 URI）
        const uniqueSources = [];
        const seenUris = new Set();
        parsedZh.sources.forEach((source) => {
            if (source.uri && !seenUris.has(source.uri)) {
                seenUris.add(source.uri);
                uniqueSources.push(source);
            }
        });

        uniqueSources.forEach((source, index) => {
            contentZh += `${index + 1}. [${source.title || '來源'}](${source.uri})\n`;
        });
    } else {
        contentZh += '本文資訊來源於 Google Search 即時查詢結果。\n';
    }

    let contentEn = parsedEn.content;
    // 確保來源區塊一定會顯示
    contentEn += '\n\n---\n\n## References\n\n';
    if (parsedEn.sources && parsedEn.sources.length > 0) {
        // 去重來源（根據 URI）
        const uniqueSources = [];
        const seenUris = new Set();
        parsedEn.sources.forEach((source) => {
            if (source.uri && !seenUris.has(source.uri)) {
                seenUris.add(source.uri);
                uniqueSources.push(source);
            }
        });

        uniqueSources.forEach((source, index) => {
            contentEn += `${index + 1}. [${source.title || 'Source'}](${source.uri})\n`;
        });
    } else {
        contentEn += 'Information sources from Google Search real-time queries.\n';
    }

    // 寫入檔案
    fs.writeFileSync(articlePathZh, frontmatterZh + contentZh, 'utf8');
    fs.writeFileSync(articlePathEn, frontmatterEn + contentEn, 'utf8');

    console.log(`✅ Daily report generated successfully!`);
    console.log(`📁 Folder: ${slug}/`);
    console.log(`📝 File: article.zh-TW.mdx`);
    console.log(`📝 File: article.en.mdx`);
    if (coverImage) {
        console.log(`🖼️  Cover image: ${coverImage}`);
    }
}

/**
 * 檢查是否為 AI 日報資料夾
 * @param {string} folderPath - 資料夾路徑
 * @param {string} folderName - 資料夾名稱
 * @returns {boolean} 是否為 AI 日報
 */
function isAIDailyReport(folderPath, folderName) {
    // 1. 嚴格匹配 AI 日報命名格式：YYYY-MM-DD-HHMMSS（必須有連字號和 6 位數時間戳）
    const aiReportPattern = /^\d{4}-\d{2}-\d{2}-\d{6}$/;
    if (!aiReportPattern.test(folderName)) {
        return false;
    }

    // 2. 檢查是否有 article.zh-TW.mdx 或 article.zh-TW.md 文件（AI 日報的特徵文件）
    const articleZhPathMdx = path.join(folderPath, 'article.zh-TW.mdx');
    const articleZhPathMd = path.join(folderPath, 'article.zh-TW.md');
    if (!fs.existsSync(articleZhPathMdx) && !fs.existsSync(articleZhPathMd)) {
        return false;
    }

    // 3. 可選：檢查 frontmatter 中的標題或標籤（額外安全檢查）
    try {
        const articleContent = fs.readFileSync(articleZhPath, 'utf8');
        const frontmatterMatch = articleContent.match(/^---\s*\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
            const frontmatter = frontmatterMatch[1];
            // 檢查標題是否包含 AI 日報標記，或 tags 是否包含每日日報
            const hasAITitle = /【AI日報】|【AI Daily】/i.test(frontmatter);
            const hasDailyTag = /tags:.*["\[]每日日報|Daily Report/i.test(frontmatter);
            if (!hasAITitle && !hasDailyTag) {
                // 如果不符合 AI 日報特徵，不刪除
                return false;
            }
        }
    } catch (error) {
        // 如果讀取失敗，只依賴命名格式和文件存在性檢查
        console.warn(`⚠️  Could not read frontmatter for ${folderName}:`, error.message);
    }

    return true;
}

/**
 * 清理超過指定天數的舊日報
 * @param {number} keepDays - 保留的天數（預設 10 天）
 */
function cleanupOldReports(keepDays = 10) {
    try {
        const publicBlogDir = path.join(process.cwd(), 'public/blog');
        const entries = fs.readdirSync(blogDir, { withFileTypes: true });
        const now = new Date();
        let deletedCount = 0;

        entries.forEach((entry) => {
            if (!entry.isDirectory()) return;

            const folderName = entry.name;
            const folderPath = path.join(blogDir, folderName);

            // 嚴格檢查是否為 AI 日報（避免誤刪其他文章）
            if (!isAIDailyReport(folderPath, folderName)) {
                return; // 跳過非 AI 日報的資料夾
            }

            // 解析日期格式：YYYY-MM-DD-HHMMSS
            const dateMatch = folderName.match(/^(\d{4})-(\d{2})-(\d{2})-(\d{6})$/);
            if (!dateMatch) return;

            const year = parseInt(dateMatch[1], 10);
            const month = parseInt(dateMatch[2], 10) - 1; // JavaScript 月份從 0 開始
            const day = parseInt(dateMatch[3], 10);

            // 將日期標準化到當天的開始時間（00:00:00）來計算天數差異
            const reportDate = new Date(year, month, day);
            reportDate.setHours(0, 0, 0, 0);
            const todayStart = new Date(now);
            todayStart.setHours(0, 0, 0, 0);
            const daysDiff = Math.floor((todayStart - reportDate) / (1000 * 60 * 60 * 24));

            if (daysDiff > keepDays) {
                // 刪除 content/blog 中的資料夾
                try {
                    fs.rmSync(folderPath, { recursive: true, force: true });
                    console.log(`🗑️  Deleted old AI daily report: ${folderName} (${daysDiff} days old)`);
                    deletedCount++;

                    // 刪除 public/blog 中對應的圖片資料夾
                    const publicFolderPath = path.join(publicBlogDir, folderName);
                    if (fs.existsSync(publicFolderPath)) {
                        fs.rmSync(publicFolderPath, { recursive: true, force: true });
                        console.log(`🗑️  Deleted public images: ${folderName}`);
                    }
                } catch (error) {
                    console.error(`⚠️  Failed to delete ${folderName}:`, error.message);
                }
            }
        });

        if (deletedCount > 0) {
            console.log(`✅ Cleaned up ${deletedCount} old report(s) (keeping last ${keepDays} days)`);
        } else {
            console.log(`ℹ️  No old reports to clean (keeping last ${keepDays} days)`);
        }
    } catch (error) {
        console.error('⚠️  Error cleaning up old reports:', error.message);
    }
}

// 執行生成
generateArticles().catch((error) => {
    console.error('Error generating daily report:', error);

    if (error.status === 404 || error.message?.includes('not found') || error.message?.includes('404')) {
        console.error('\n💡 Tip: None of the tried models are available.');
        console.error('   Tried models:', modelNames.join(', '));
        console.error('\nYou can check available models or update the modelNames array in the script.');
    }

    if (error.message) {
        console.error('\nError details:', error.message);
    }

    process.exit(1);
});
