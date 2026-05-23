const path = require('path');
const fs = require('fs');

// 導入配置
const { blogDir, modelNames } = require('./config');
const { getDateInfo } = require('./utils/dateUtils');
const { isTodayGenerated, ensureDirectoryExists } = require('./utils/fileUtils');
const { isHallucinated } = require('./utils/textUtils');
const { getAllExistingPosts } = require('./utils/postLoader');
const { parseStructuredOutput } = require('./utils/outputParser');
const { callGeminiAPI } = require('./api/geminiAPI');
const { createArticlePromptZh, createEnglishTranslationPrompt } = require('./prompts/articlePrompts');
const { analyzeTodayTopics } = require('./agents/topicAnalyzer');
const { findRelevantPosts } = require('./agents/postMatcher');
const { GoogleNewsAgent } = require('./agents/googleNewsAgent');
const { NewsRanker } = require('./agents/newsRanker');
const { generateImageWithGemini } = require('./generators/imageGenerator');
const { processContent } = require('./processors/contentProcessor');
const { cleanupOldReports } = require('./cleanup/reportCleanup');

// 初始化 Google Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error('Error: GEMINI_API_KEY environment variable is not set');
    process.exit(1);
}

// 取得今天的日期和時間戳
const dateInfo = getDateInfo();
const { dateStr, timestamp, dateFormatted, yesterdayISO } = dateInfo;

// 輸出診斷資訊
console.log('=== AI Daily Report Generation ===');
console.log(`Date: ${dateStr}`);
console.log(`Timestamp: ${timestamp}`);
console.log(`Formatted Date: ${dateFormatted}`);
console.log(`Blog Directory: ${blogDir}`);
console.log(`Current UTC Time: ${new Date().toISOString()}`);

// 使用時間戳作為資料夾名稱（符合資料結構：content/blog/[日期時間]/）
const slug = timestamp;
const postFolder = path.join(blogDir, slug);
const articlePathZh = path.join(postFolder, 'article.zh-TW.mdx');
const articlePathEn = path.join(postFolder, 'article.en.mdx');

// 檢查今天是否已經有生成過
console.log(`\n🔍 Checking if report for ${dateStr} already exists...`);
const alreadyGenerated = isTodayGenerated(blogDir, dateStr);
console.log(`   Check result: ${alreadyGenerated}`);

if (alreadyGenerated) {
    console.log(`\n⚠️  Daily report for ${dateStr} already exists. Skipping...`);
    // 列出現有的文件以便診斷
    try {
        const entries = fs.readdirSync(blogDir, { withFileTypes: true });
        const todayEntries = entries.filter(entry =>
            entry.isDirectory() && entry.name.startsWith(dateStr)
        );
        if (todayEntries.length > 0) {
            console.log(`   Found existing folders for today:`);
            todayEntries.forEach(entry => {
                console.log(`     - ${entry.name}`);
            });
        }
    } catch (err) {
        console.log(`   Error listing existing files: ${err.message}`);
    }
    process.exit(0);
}

console.log(`\n✅ No existing report found. Starting generation...`);

// 建立文章資料夾
ensureDirectoryExists(postFolder);

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

                // Agent Step 1: 分析今天的主題和關鍵字
                const { topics, keywords, summary } = await analyzeTodayTopics(apiKey, modelName, dateStr);

                // Agent Step 1.5: 獲取Google News AI新聞
                console.log('📰 Agent Step 1.5: Fetching Google News...');
                const googleNewsAgent = new GoogleNewsAgent();
                const aiNews = await googleNewsAgent.getAINewsWithContent(keywords, postFolder);

                // 使用AI評分新聞重要性（如果有API金鑰，否則使用備用方法）
                const newsRanker = new NewsRanker();
                let rankedNews;
                try {
                    rankedNews = await newsRanker.rankNewsWithAI(aiNews, apiKey, modelName);
                    console.log('🧠 AI news ranking completed');
                } catch (error) {
                    console.log('⚠️ AI ranking failed, using fallback method:', error.message);
                    rankedNews = newsRanker.fallbackRanking(aiNews);
                }
                const topNews = newsRanker.selectTopNews(rankedNews, 5);

                // 生成新聞摘要
                const newsSummary = googleNewsAgent.generateNewsSummary(topNews);
                console.log('📰 Generated news summary:', newsSummary.substring(0, 200) + '...');

                // 讀取所有現有文章
                console.log('📚 Loading existing posts...');
                const allPosts = await getAllExistingPosts(blogDir, slug, dateStr);
                console.log(`📚 Loaded ${allPosts.length} existing posts`);

                // Agent Step 2: 根據主題和關鍵字匹配相關文章
                const relevantPosts = findRelevantPosts(allPosts, topics, keywords);

                // 生成中文文章（只傳入相關文章）
                const articlePromptZhWithContext = createArticlePromptZh(
                    relevantPosts,
                    topics,
                    keywords,
                    summary,
                    dateFormatted,
                    dateStr,
                    yesterdayISO,
                    newsSummary
                );
                const resultZh = await callGeminiAPI(apiKey, modelName, articlePromptZhWithContext, true);

                // 檢查 Hallucination
                if (isHallucinated(resultZh.text)) {
                    console.warn(`Attempt ${attempt + 1}: Hallucination detected in Chinese content.`);
                    continue;
                }

                const parsedZh = parseStructuredOutput(resultZh.text, dateStr);

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
                    parsedZh.bulletSummary,
                    parsedZh.imagePrompt,
                    parsedZh.sources.map(s => s.uri).join('\n')
                );

                const resultEn = await callGeminiAPI(apiKey, modelName, translationPrompt, false); // 翻譯不需要搜尋

                // 檢查 Hallucination
                if (isHallucinated(resultEn.text)) {
                    console.warn(`Attempt ${attempt + 1}: Hallucination detected in English translation.`);
                    continue;
                }

                const parsedEn = parseStructuredOutput(resultEn.text, dateStr);

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
                const coverImage = await generateImageWithGemini(
                    apiKey,
                    parsedZh.imagePrompt || parsedEn.imagePrompt,
                    timestamp,
                    postFolder
                );

                // 處理內容並寫入檔案
                console.log(`\n💾 Writing files to disk...`);
                await processContent(
                    parsedZh,
                    parsedEn,
                    coverImage,
                    dateStr,
                    slug,
                    articlePathZh,
                    articlePathEn
                );

                // 驗證文件是否成功寫入
                console.log(`\n✅ Verifying files were created...`);
                const zhExists = fs.existsSync(articlePathZh);
                const enExists = fs.existsSync(articlePathEn);
                console.log(`   Chinese article: ${zhExists ? '✅' : '❌'} ${articlePathZh}`);
                console.log(`   English article: ${enExists ? '✅' : '❌'} ${articlePathEn}`);

                if (!zhExists || !enExists) {
                    throw new Error(`Failed to create article files. zh: ${zhExists}, en: ${enExists}`);
                }

                // 創建成功標記文件，表示AI日報成功生成
                const successMarkerPath = path.join(postFolder, '.generation-success');
                const successData = {
                    timestamp: new Date().toISOString(),
                    date: dateStr,
                    slug: slug,
                    status: 'success'
                };
                fs.writeFileSync(successMarkerPath, JSON.stringify(successData, null, 2));
                console.log(`   ✅ Created success marker: ${successMarkerPath}`);

                // 清理超過十天的舊日報
                console.log(`\n🧹 Cleaning up old reports...`);
                cleanupOldReports(blogDir, 10);

                console.log(`\n🎉 Successfully generated daily report for ${dateStr}!`);
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

// 執行生成
generateArticles()
    .then(() => {
        console.log('\n✅ Script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Error generating daily report:');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }

        if (error.status === 404 || error.message?.includes('not found') || error.message?.includes('404')) {
            console.error('\n💡 Tip: None of the tried models are available.');
            console.error('   Tried models:', modelNames.join(', '));
            console.error('\nYou can check available models or update the modelNames array in the script.');
        }

        if (error.status) {
            console.error('HTTP Status:', error.status);
        }
        if (error.code) {
            console.error('Error Code:', error.code);
        }

        // 檢查是否有部分生成的文件
        console.log('\n🔍 Checking for partially generated files...');
        if (fs.existsSync(postFolder)) {
            const files = fs.readdirSync(postFolder);
            if (files.length > 0) {
                console.log(`   Found ${files.length} files in ${postFolder}:`);
                files.forEach(file => console.log(`     - ${file}`));
            } else {
                console.log(`   Folder ${postFolder} exists but is empty`);
                // 清理空資料夾，避免下次被誤判為已生成
                try {
                    fs.rmdirSync(postFolder);
                    console.log(`   🧹 Removed empty folder: ${postFolder}`);
                } catch (rmErr) {
                    console.warn(`   ⚠️  Failed to remove empty folder: ${rmErr.message}`);
                }
            }
        } else {
            console.log(`   No folder created at ${postFolder}`);
        }

        process.exit(1);
    });
