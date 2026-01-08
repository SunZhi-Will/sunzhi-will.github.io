const { personaStyle } = require('../config');

/**
 * 生成 AI 日報的 Prompt（參考 trendpulse 的結構）
 * @param {Array} existingPosts - 相關文章列表（Agent 已篩選）
 * @param {Array} topics - 主題列表
 * @param {Array} keywords - 關鍵字列表
 * @param {string} summary - 摘要
 * @param {string} dateFormatted - 格式化日期
 * @param {string} dateStr - 日期字串
 * @param {string} yesterdayISO - 昨天的日期字串
 * @returns {string} 中文文章 Prompt
 */
function createArticlePromptZh(existingPosts = [], topics = [], keywords = [], summary = '', dateFormatted, dateStr, yesterdayISO) {
    // 格式化現有文章資訊（Agent 已篩選出相關文章）
    let existingPostsInfo = '';
    if (existingPosts.length > 0) {
        existingPostsInfo = `
【相關文章資料庫】（已根據今天的主題智能篩選）
以下文章與今天的主題相關，請檢查並在適當位置加入連結：
${existingPosts.map((post, index) => {
            // 簡化摘要（最多 60 字）
            const shortDesc = post.description
                ? (post.description.length > 60 ? post.description.substring(0, 60) + '...' : post.description)
                : '無摘要';
            // 簡化標籤（最多顯示 2 個）
            const tagsStr = post.tags && post.tags.length > 0
                ? post.tags.slice(0, 2).join(', ') + (post.tags.length > 2 ? '...' : '')
                : '';
            return `${index + 1}. **${post.title}** | ${post.date} | ${post.url}${tagsStr ? ` | ${tagsStr}` : ''} | ${shortDesc}`;
        }).join('\n')}

【規則】
- 避免重複已寫過的內容，改為連結：\`[標題](/blog/[slug])\`
- 可基於以前文章延伸，但要有新角度或新資訊
- 連結需自然融入內容
`;
    }

    // 加入今天的主題分析（如果有的話）
    let topicsInfo = '';
    if (topics.length > 0 || keywords.length > 0) {
        topicsInfo = `
【今天的主題分析】
${summary ? `摘要：${summary}\n` : ''}
${topics.length > 0 ? `主要主題：${topics.join('、')}\n` : ''}
${keywords.length > 0 ? `關鍵字：${keywords.slice(0, 10).join('、')}${keywords.length > 10 ? '...' : ''}` : ''}
`;
    }

    return `
【System: Strict Investigative Journalist Agent】
你是一位資深調查記者，擁有 Google Search 的即時查證能力。

${topicsInfo}

${existingPostsInfo}

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

【智慧撰寫策略 - 避免重複與建立連結】
${existingPostsInfo}

【撰寫設定】
- **角色**：科技白話文說書人
- **風格指令 (Persona Style)**：
  ${personaStyle}

【輸出格式】
<<<TITLE>>>
(標題：只輸出標題內容，不要包含「【AI日報】」前綴，系統會自動加上。標題要幽默有趣，不包含日期)
<<<SUMMARY>>>
(摘要：**必須簡短精要**，約 50-80 字。請確保摘要是一個完整的句子，包含文章的核心要點，並且在句子結尾結束。摘要應該涵蓋：主要事件、關鍵數據、重要影響。**重要：絕對不要包含日期、時間等時間資訊**，只描述事件本身。)
<<<SEARCH_QUERIES>>>
(搜尋關鍵字，用逗號分隔)
<<<IMAGE_PROMPT>>>
(封面圖片的 AI 繪圖指令：請設計一張「RPG 遊戲風格的資訊圖表」。
目標：透過 RPG 角色面板/任務清單的視覺化方式來呈現文章的核心邏輯。
限制：**嚴禁包含文字 (No Text)**。請用符號、圖標、幾何圖形來代替文字標籤，保持畫面非常乾淨、極簡，避免資訊過載。)
<<<BULLET_SUMMARY>>>
(條列式重點摘要：請提供 5-7 個核心重點，每個重點約 15-20 字，使用 Markdown 列表格式 (-)。這些重點應該涵蓋文章的主要事件、關鍵數據、重要影響等核心內容。格式範例：
- 重點一：簡潔描述
- 重點二：簡潔描述
- 重點三：簡潔描述
...)
<<<CONTENT>>>
(正文，開頭必須包含「### 📋 快速重點摘要」區塊，然後才是其他章節。若有找到真實圖片連結請包含在內。

**重要：相關文章連結**
- 如果內容與上述「現有相關文章資料庫」中的任何文章相關，請在適當位置加入 Markdown 超連結
- 連結格式：\`[文章標題](/blog/[slug])\`
- 連結應該自然融入文章內容，例如：「正如我們之前在[AI Agent 正式進入職場](/blog/2026-01-04-012521)中提到的...」
- 如果今天的新聞是之前某個主題的延續，請明確指出並連結到相關文章
- **避免重複**：如果某個主題已經在之前的文章中詳細討論過，請簡要提及並連結，不要重複相同的內容)
<<<SOURCES>>>
(來源列表，每行一個 URL)
`;
}

/**
 * 英文翻譯 Prompt（基於中文文章）
 * @param {string} chineseContent - 中文內容
 * @param {string} chineseTitle - 中文標題
 * @param {string} chineseSummary - 中文摘要
 * @param {string} chineseBulletSummary - 中文條列式摘要
 * @param {string} chineseImagePrompt - 中文圖片提示
 * @param {string} chineseSources - 中文來源
 * @returns {string} 英文翻譯 Prompt
 */
function createEnglishTranslationPrompt(chineseContent, chineseTitle, chineseSummary, chineseBulletSummary, chineseImagePrompt, chineseSources) {
    return `
【System: Professional Translator & Content Adaptor】
You are a professional translator and content adaptor. Your task is to translate and adapt a Chinese AI daily report article into English while maintaining the same structure, tone, and depth.

【Source Article (Chinese)】
Title: ${chineseTitle}
Summary: ${chineseSummary}
Bullet Summary: ${chineseBulletSummary || 'N/A'}

Content:
${chineseContent}

【Translation Requirements】
1. **Maintain Structure**: Keep the exact same section structure as the Chinese version:
   - ### 📋 Quick Highlights (or ### Quick Highlights if emoji not supported)
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

6. **Bullet Summary**: If the Chinese version has a bullet summary section (### 📋 快速重點摘要), translate it to "### 📋 Quick Highlights" (or "### Quick Highlights" if emoji not supported). Each bullet point should be concise (15-20 words) and capture the core points.

7. **Sources**: Use the same sources as the Chinese version, but translate source titles if needed.

【Output Format】
<<<TITLE>>>
(Translate the title naturally. Only output the title content, do NOT include "【AI Daily】" prefix, the system will add it automatically. Title should be witty and interesting, no date)
<<<SUMMARY>>>
(Translate the summary naturally, **must be concise and meaningful**, ~50-80 words. Ensure the summary is a complete sentence that includes the article's core points and ends at a sentence boundary, not mid-sentence. The summary should cover: main events, key data, important impacts. **Important: Do NOT include dates, times, or any temporal information**, only describe the events themselves.)
<<<BULLET_SUMMARY>>>
(If the Chinese version has a bullet summary, translate it here. Format: 5-7 bullet points, each ~15-20 words. Use Markdown list format (-). If no bullet summary exists in Chinese version, extract key points from the content and create one.)
<<<SEARCH_QUERIES>>>
(Use the same search queries from Chinese version, or translate them to English)
<<<IMAGE_PROMPT>>>
(${chineseImagePrompt})
<<<CONTENT>>>
(Translate the entire content, maintaining all sections and structure. Make sure the bullet summary section (### 📋 Quick Highlights) is at the beginning if it exists.

**Important: Related Article Links**
- Preserve all Markdown links to related articles from the Chinese version
- Link format: \`[Article Title](/blog/[slug])\`
- Links should be naturally integrated into the content
- If the Chinese version has links to related articles, keep them in the English translation)
<<<SOURCES>>>
(Use the same sources, translate titles if needed)
`;
}

module.exports = {
    createArticlePromptZh,
    createEnglishTranslationPrompt,
};

