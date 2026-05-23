const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

/**
 * 從 git 歷史中找出所有被刪除的文章，並檢查哪些可能是技術文章（非 AI 日報）
 */
function findDeletedArticles() {
    try {
        console.log('🔍 正在搜尋 git 歷史中被刪除的文章...\n');
        
        // 獲取所有刪除文件的 commit
        const result = spawnSync('git', [
            'log', '--all', '--full-history', '--diff-filter=D',
            '--name-only', '--pretty=format:%H|%ad|%s', '--date=short',
            '--', 'content/blog'
        ], { encoding: 'utf8' });
        if (result.error) throw result.error;
        const output = result.stdout;
        
        const deletedArticles = new Map(); // 使用 Map 避免重複
        
        let currentCommit = null;
        let currentDate = null;
        let currentMessage = null;
        
        const lines = output.split('\n');
        for (const line of lines) {
            // 檢查是否為 commit 行
            if (line.match(/^[a-f0-9]{40}\|/)) {
                const [hash, date, ...messageParts] = line.split('|');
                currentCommit = hash;
                currentDate = date;
                currentMessage = messageParts.join('|');
            } 
            // 檢查是否為被刪除的文章文件
            else if (line.startsWith('content/blog/') && (line.endsWith('.md') || line.endsWith('.mdx'))) {
                const folderMatch = line.match(/content\/blog\/([^\/]+)\//);
                if (folderMatch) {
                    const folderName = folderMatch[1];
                    if (!deletedArticles.has(folderName)) {
                        deletedArticles.set(folderName, {
                            folderName,
                            commit: currentCommit,
                            date: currentDate,
                            message: currentMessage,
                            files: []
                        });
                    }
                    deletedArticles.get(folderName).files.push(line);
                }
            }
        }
        
        console.log(`📋 找到 ${deletedArticles.size} 個被刪除的文章資料夾\n`);
        
        // 檢查每個文章是否為 AI 日報
        const nonAIDailyArticles = [];
        const aiDailyArticles = [];
        
        for (const [folderName, info] of deletedArticles) {
            // 檢查命名格式
            const aiReportPattern = /^\d{4}-\d{2}-\d{2}-\d{6}$/;
            const isAIPattern = aiReportPattern.test(folderName);
            
            // 嘗試從 git 歷史中讀取文章內容
            let isAIDaily = false;
            let articleTitle = '';
            
            try {
                // 找到 zh-TW 版本的文章
                const zhTWFile = info.files.find(f => f.includes('article.zh-TW'));
                if (zhTWFile && info.commit) {
                    // 獲取刪除前的版本（commit^ 表示刪除前的 commit）
                    try {
                        const showResult = spawnSync('git', ['show', `${info.commit}^:${zhTWFile}`], { encoding: 'utf8' });
                        if (showResult.error) throw showResult.error;
                        const articleContent = showResult.stdout;
                        
                        // 檢查 frontmatter
                        const frontmatterMatch = articleContent.match(/^---\s*\n([\s\S]*?)\n---/);
                        if (frontmatterMatch) {
                            const frontmatter = frontmatterMatch[1];
                            const titleMatch = frontmatter.match(/title:\s*["'](.+?)["']/);
                            if (titleMatch) {
                                articleTitle = titleMatch[1];
                            }
                            
                            // 檢查是否為 AI 日報
                            const hasAITitle = /【AI日報】|【AI Daily】/i.test(frontmatter);
                            const hasDailyTag = /tags:.*["\[]每日日報|Daily Report/i.test(frontmatter);
                            isAIDaily = hasAITitle || hasDailyTag;
                        }
                    } catch (error) {
                        // 如果無法讀取，可能是因為文件在該 commit 中不存在
                        console.warn(`⚠️  無法讀取 ${folderName} 的內容`);
                    }
                }
            } catch (error) {
                console.warn(`⚠️  檢查 ${folderName} 時發生錯誤: ${error.message}`);
            }
            
            const articleInfo = {
                folderName,
                date: info.date,
                commit: info.commit,
                message: info.message,
                title: articleTitle,
                isAIPattern,
                isAIDaily
            };
            
            if (isAIDaily) {
                aiDailyArticles.push(articleInfo);
            } else {
                nonAIDailyArticles.push(articleInfo);
            }
        }
        
        // 輸出結果
        console.log('='.repeat(80));
        console.log('📊 分析結果\n');
        
        console.log(`✅ AI 日報文章: ${aiDailyArticles.length} 篇`);
        if (aiDailyArticles.length > 0) {
            console.log('\nAI 日報列表:');
            aiDailyArticles.forEach(article => {
                console.log(`  - ${article.folderName} (${article.date})`);
                if (article.title) {
                    console.log(`    標題: ${article.title}`);
                }
            });
        }
        
        console.log(`\n⚠️  可能是技術文章（非 AI 日報）: ${nonAIDailyArticles.length} 篇`);
        if (nonAIDailyArticles.length > 0) {
            console.log('\n可能的技術文章列表:');
            nonAIDailyArticles.forEach(article => {
                console.log(`  - ${article.folderName} (${article.date})`);
                if (article.title) {
                    console.log(`    標題: ${article.title}`);
                }
                console.log(`    Commit: ${article.commit}`);
                console.log(`    訊息: ${article.message}`);
            });
        }
        
        console.log('\n' + '='.repeat(80));
        
        // 如果有非 AI 日報的文章，提供恢復建議
        if (nonAIDailyArticles.length > 0) {
            console.log('\n💡 恢復建議:');
            console.log('如果您想恢復這些文章，可以使用以下命令:');
            nonAIDailyArticles.forEach(article => {
                console.log(`\n  # 恢復 ${article.folderName}:`);
                console.log(`  git checkout ${article.commit}^ -- content/blog/${article.folderName}/`);
            });
        }
        
        return {
            aiDailyArticles,
            nonAIDailyArticles
        };
        
    } catch (error) {
        console.error('❌ 發生錯誤:', error.message);
        return null;
    }
}

// 如果直接執行此腳本
if (require.main === module) {
    findDeletedArticles();
}

module.exports = {
    findDeletedArticles
};
