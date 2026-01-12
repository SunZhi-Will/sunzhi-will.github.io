const fs = require('fs');
const path = require('path');
const { getDateInfo } = require('./utils/dateUtils');
const { blogDir } = require('./config');
const { sendNewsletter } = require('./send-newsletter');

/**
 * 獲取所有可用的文章 slug
 */
function getAllArticleSlugs() {
    if (!fs.existsSync(blogDir)) {
        return [];
    }

    const folders = fs.readdirSync(blogDir)
        .filter(item => {
            const itemPath = path.join(blogDir, item);
            return fs.statSync(itemPath).isDirectory();
        })
        .sort()
        .reverse(); // 最新的在前

    return folders;
}

/**
 * 檢查文章是否成功生成（有成功標記文件）
 */
function isArticleSuccessfullyGenerated(slug) {
    const postFolder = path.join(blogDir, slug);
    const successMarkerPath = path.join(postFolder, '.generation-success');

    try {
        if (!fs.existsSync(successMarkerPath)) {
            return false;
        }

        // 讀取並驗證標記文件內容
        const markerContent = fs.readFileSync(successMarkerPath, 'utf8');
        const markerData = JSON.parse(markerContent);

        // 檢查標記文件是否有效
        return markerData.status === 'success' && markerData.slug === slug;
    } catch (error) {
        return false;
    }
}

/**
 * 獲取文章類型
 */
function getArticleType(slug) {
    const postFolder = path.join(blogDir, slug);
    const articlePathZh = path.join(postFolder, 'article.zh-TW.mdx');

    if (!fs.existsSync(articlePathZh)) {
        return 'unknown';
    }

    try {
        const content = fs.readFileSync(articlePathZh, 'utf8');
        const titleMatch = content.match(/^title:\s*"?(.*?)"?$/m);

        if (titleMatch) {
            const title = titleMatch[1].toLowerCase();
            if (title.includes('ai日報') || title.includes('ai daily')) {
                return 'ai-daily';
            } else if (title.includes('區塊鏈') || title.includes('blockchain')) {
                return 'blockchain';
            } else {
                return 'sun-written';
            }
        }
    } catch (error) {
        // 忽略錯誤
    }

    return 'unknown';
}

/**
 * 格式化日期顯示
 */
function formatDateFromSlug(slug) {
    // slug 格式: YYYY-MM-DD-HHMMSS
    const datePart = slug.split('-').slice(0, 3).join('-');
    return datePart;
}

/**
 * 查找指定日期的最新文章
 */
function findLatestArticleForDate(dateStr) {
    const allSlugs = getAllArticleSlugs();

    // 查找指定日期開頭的文章
    const dateArticles = allSlugs.filter(slug => slug.startsWith(dateStr));

    if (dateArticles.length === 0) {
        return null;
    }

    // 返回最新的（第一個，因為已經排序）
    return dateArticles[0];
}

/**
 * 讀取訂閱者列表（模擬）
 */
function getMockSubscriptions() {
    console.log('📋 Mock subscriber list (for testing):');
    console.log('   - test@example.com (verified, zh-TW, ai-daily)');
    console.log('   - another@example.com (verified, en, all)');
    console.log('   - unverified@example.com (not verified)');
    console.log('');
    return [
        { email: 'test@example.com', types: ['ai-daily'], lang: 'zh-TW', verified: true },
        { email: 'another@example.com', types: ['all'], lang: 'en', verified: true },
        { email: 'unverified@example.com', types: ['ai-daily'], lang: 'zh-TW', verified: false }
    ];
}

/**
 * Dry run 模式：顯示會發送給誰
 */
function dryRunNewsletter(slug) {
    console.log(`📧 Dry Run Mode - Newsletter for article: ${slug}`);
    console.log('');

    // 檢查文章
    const postFolder = path.join(blogDir, slug);
    if (!fs.existsSync(path.join(postFolder, 'article.zh-TW.mdx'))) {
        console.error(`❌ Article not found: ${slug}`);
        return;
    }

    console.log(`✅ Article found: ${slug}`);
    console.log(`📁 Location: ${postFolder}`);

    // 讀取文章標題
    try {
        const zhContent = fs.readFileSync(path.join(postFolder, 'article.zh-TW.mdx'), 'utf8');
        const titleMatch = zhContent.match(/^title:\s*"?(.*?)"?$/m);
        if (titleMatch) {
            console.log(`📝 Title: ${titleMatch[1]}`);
        }
    } catch (error) {
        console.log('📝 Title: Unable to read');
    }

    console.log('');

    // 模擬訂閱者列表
    const subscriptions = getMockSubscriptions();
    const articleType = getArticleType(slug);

    console.log(`📊 Would send to ${subscriptions.length} subscribers:`);
    let sendCount = 0;

    for (const subscription of subscriptions) {
        // 檢查是否已驗證
        if (!subscription.verified) {
            console.log(`   ❌ ${subscription.email} - Not verified`);
            continue;
        }

        // 檢查訂閱類型是否匹配
        const shouldSend = subscription.types.includes('all') ||
            subscription.types.some(type => type === articleType);

        if (shouldSend) {
            console.log(`   ✅ ${subscription.email} - ${subscription.lang} - ${articleType}`);
            sendCount++;
        } else {
            console.log(`   ⏭️  ${subscription.email} - Not subscribed to ${articleType}`);
        }
    }

    console.log('');
    console.log(`📈 Summary: Would send to ${sendCount} out of ${subscriptions.length} subscribers`);
}

/**
 * 發送測試郵件
 */
async function sendTestEmail(slug, testEmail, lang) {
    console.log(`📧 Sending test email to: ${testEmail}`);
    console.log(`📄 Article: ${slug}`);
    if (lang) {
        console.log(`🌍 Language: ${lang}`);
    }
    console.log('');

    // 設置測試環境變數
    process.env.GMAIL_USER = process.env.GMAIL_USER || 'test@example.com';
    process.env.GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || 'test-password';
    process.env.BLOG_URL = process.env.BLOG_URL || 'https://sunzhi-will.github.io';

    try {
        // 創建臨時測試訂閱者列表，只包含測試郵件
        const originalGetSubscriptions = require('./send-newsletter').getSubscriptionsFromGoogleSheets;
        require('./send-newsletter').getSubscriptionsFromGoogleSheets = async () => {
            return [{
                email: testEmail,
                types: ['all'],
                lang: lang || 'zh-TW',
                verified: true,
                subscribedAt: new Date().toISOString()
            }];
        };

        await sendNewsletter(slug);

        // 恢復原始函數
        require('./send-newsletter').getSubscriptionsFromGoogleSheets = originalGetSubscriptions;

        console.log('');
        console.log(`✅ Test email sent successfully to ${testEmail}!`);
        console.log('📬 Please check your inbox.');

    } catch (error) {
        console.error('❌ Failed to send test email:', error.message);
        process.exit(1);
    }
}

/**
 * 主函數
 */
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    if (command === '--list') {
        // 列出所有可用文章
        console.log('=== 列出所有可用文章 ===\n');

        const allSlugs = getAllArticleSlugs();

        if (allSlugs.length === 0) {
            console.log('❌ 沒有找到任何文章');
            return;
        }

        console.log(`總共找到 ${allSlugs.length} 篇文章：\n`);

        let aiDailyCount = 0;
        let sendableCount = 0;

        for (const slug of allSlugs) {
            const isSuccess = isArticleSuccessfullyGenerated(slug);
            const articleType = getArticleType(slug);
            const date = formatDateFromSlug(slug);

            let status = '❌ 不可發送';
            let reason = '';

            if (articleType === 'ai-daily') {
                aiDailyCount++;
                if (isSuccess) {
                    status = '✅ 可發送';
                    sendableCount++;
                } else {
                    reason = '(缺少成功標記)';
                }
            } else {
                status = '⏭️  跳過';
                reason = '(非AI日報)';
            }

            console.log(`${date} | ${slug} | ${articleType} | ${status} ${reason}`);
        }

        console.log(`\n📊 統計信息:`);
        console.log(`   AI日報總數: ${aiDailyCount}`);
        console.log(`   可發送數量: ${sendableCount}`);
        console.log(`   不可發送數量: ${aiDailyCount - sendableCount}`);

        if (sendableCount > 0) {
            console.log(`\n✅ 有 ${sendableCount} 篇文章可以發送電子報`);
        } else {
            console.log(`\n❌ 沒有文章可以發送電子報`);
        }

    } else if (command === '--dry-run') {
        // Dry run 模式
        let slug = args.find(arg => arg.startsWith('--slug='))?.split('=')[1];

        if (args.includes('--latest') || !slug) {
            const dateInfo = getDateInfo();
            slug = findLatestArticleForDate(dateInfo.dateStr);
        }

        if (!slug) {
            console.error('❌ No article found for today');
            process.exit(1);
        }

        dryRunNewsletter(slug);

    } else if (command === '--test-email') {
        // 發送測試郵件
        const testEmail = args.find(arg => arg.startsWith('--test-email='))?.split('=')[1];
        const lang = args.find(arg => arg.startsWith('--lang='))?.split('=')[1];

        if (!testEmail) {
            console.error('❌ Test email address is required. Use --test-email=your@email.com');
            process.exit(1);
        }

        let slug = args.find(arg => arg.startsWith('--slug='))?.split('=')[1];

        if (args.includes('--latest') || !slug) {
            const dateInfo = getDateInfo();
            slug = findLatestArticleForDate(dateInfo.dateStr);
        }

        if (!slug) {
            console.error('❌ No article found for today');
            process.exit(1);
        }

        await sendTestEmail(slug, testEmail, lang);

    } else {
        console.log('Usage:');
        console.log('  node scripts/test-newsletter.js --list                    # List all articles');
        console.log('  node scripts/test-newsletter.js --dry-run [--latest] [--slug=SLUG]  # Dry run');
        console.log('  node scripts/test-newsletter.js --test-email=EMAIL [--lang=zh-TW|en] [--latest] [--slug=SLUG]  # Send test email');
        console.log('');
        console.log('Examples:');
        console.log('  node scripts/test-newsletter.js --list');
        console.log('  node scripts/test-newsletter.js --dry-run --latest');
        console.log('  node scripts/test-newsletter.js --test-email=test@example.com --lang=zh-TW');
        process.exit(1);
    }
}

// 如果直接執行此腳本
if (require.main === module) {
    main().catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    });
}