/**
 * 測試腳本：驗證所有模組的導入是否正確
 * 這個腳本不會實際調用 API，只檢查模組結構
 */

console.log('🧪 Testing module imports...\n');

const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✅ ${name}`);
        passed++;
    } catch (error) {
        console.error(`❌ ${name}: ${error.message}`);
        failed++;
    }
}

// 測試配置模組
test('Config module', () => {
    const config = require('./config');
    if (!config.blogDir) throw new Error('blogDir not exported');
    if (!config.modelNames) throw new Error('modelNames not exported');
    if (!config.imageModelCandidates) throw new Error('imageModelCandidates not exported');
    if (!config.personaStyle) throw new Error('personaStyle not exported');
});

// 測試工具模組
test('Date utils module', () => {
    const { getDateInfo } = require('./utils/dateUtils');
    const dateInfo = getDateInfo();
    if (!dateInfo.dateStr) throw new Error('dateStr not returned');
    if (!dateInfo.timestamp) throw new Error('timestamp not returned');
});

test('File utils module', () => {
    const { isTodayGenerated, ensureDirectoryExists } = require('./utils/fileUtils');
    if (typeof isTodayGenerated !== 'function') throw new Error('isTodayGenerated is not a function');
    if (typeof ensureDirectoryExists !== 'function') throw new Error('ensureDirectoryExists is not a function');
});

test('Text utils module', () => {
    const { cleanupHtmlTags, isHallucinated, cleanStr, removeDatePatterns, truncateSummary } = require('./utils/textUtils');
    if (typeof cleanupHtmlTags !== 'function') throw new Error('cleanupHtmlTags is not a function');
    if (typeof isHallucinated !== 'function') throw new Error('isHallucinated is not a function');
    if (typeof cleanStr !== 'function') throw new Error('cleanStr is not a function');
    if (typeof removeDatePatterns !== 'function') throw new Error('removeDatePatterns is not a function');
    if (typeof truncateSummary !== 'function') throw new Error('truncateSummary is not a function');
});

test('Post loader module', () => {
    const { getAllExistingPosts } = require('./utils/postLoader');
    if (typeof getAllExistingPosts !== 'function') throw new Error('getAllExistingPosts is not a function');
});

test('Output parser module', () => {
    const { parseStructuredOutput } = require('./utils/outputParser');
    if (typeof parseStructuredOutput !== 'function') throw new Error('parseStructuredOutput is not a function');
});

test('Source enricher module', () => {
    const { enrichSourceTitles } = require('./utils/sourceEnricher');
    if (typeof enrichSourceTitles !== 'function') throw new Error('enrichSourceTitles is not a function');
});

// 測試 API 模組
test('Gemini client module', () => {
    const { getGenAIClient } = require('./api/geminiClient');
    if (typeof getGenAIClient !== 'function') throw new Error('getGenAIClient is not a function');
});

test('Gemini API module', () => {
    const { callGeminiAPI } = require('./api/geminiAPI');
    if (typeof callGeminiAPI !== 'function') throw new Error('callGeminiAPI is not a function');
});

// 測試 Prompt 模組
test('Article prompts module', () => {
    const { createArticlePromptZh, createEnglishTranslationPrompt } = require('./prompts/articlePrompts');
    if (typeof createArticlePromptZh !== 'function') throw new Error('createArticlePromptZh is not a function');
    if (typeof createEnglishTranslationPrompt !== 'function') throw new Error('createEnglishTranslationPrompt is not a function');
});

// 測試 Agent 模組
test('Topic analyzer module', () => {
    const { analyzeTodayTopics } = require('./agents/topicAnalyzer');
    if (typeof analyzeTodayTopics !== 'function') throw new Error('analyzeTodayTopics is not a function');
});

test('Post matcher module', () => {
    const { findRelevantPosts } = require('./agents/postMatcher');
    if (typeof findRelevantPosts !== 'function') throw new Error('findRelevantPosts is not a function');
});

// 測試生成器模組
test('Image generator module', () => {
    const { generateImageWithGemini } = require('./generators/imageGenerator');
    if (typeof generateImageWithGemini !== 'function') throw new Error('generateImageWithGemini is not a function');
});

// 測試處理器模組
test('Content processor module', () => {
    const { processContent } = require('./processors/contentProcessor');
    if (typeof processContent !== 'function') throw new Error('processContent is not a function');
});

// 測試清理模組
test('Report cleanup module', () => {
    const { cleanupOldReports } = require('./cleanup/reportCleanup');
    if (typeof cleanupOldReports !== 'function') throw new Error('cleanupOldReports is not a function');
});

// 測試主程式模組導入
test('Main script module imports', () => {
    // 只檢查導入是否成功，不執行實際邏輯
    const path = require('path');
    const fs = require('fs');
    const mainScript = fs.readFileSync(path.join(__dirname, 'generate-ai-daily.js'), 'utf8');
    
    // 檢查關鍵導入
    const requiredImports = [
        './config',
        './utils/dateUtils',
        './utils/fileUtils',
        './utils/textUtils',
        './utils/postLoader',
        './utils/outputParser',
        './api/geminiAPI',
        './prompts/articlePrompts',
        './agents/topicAnalyzer',
        './agents/postMatcher',
        './generators/imageGenerator',
        './processors/contentProcessor',
        './cleanup/reportCleanup',
    ];
    
    requiredImports.forEach(importPath => {
        if (!mainScript.includes(importPath)) {
            throw new Error(`Missing import: ${importPath}`);
        }
    });
});

console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
    console.log('✅ All module imports are correct!');
    process.exit(0);
} else {
    console.error('❌ Some module imports failed!');
    process.exit(1);
}
