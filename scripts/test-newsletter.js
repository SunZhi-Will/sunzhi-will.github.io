/**
 * 電子報測試腳本
 * 
 * 使用方式：
 * 1. 測試模式（不實際發送）：node scripts/test-newsletter.js --dry-run
 * 2. 測試特定文章：node scripts/test-newsletter.js --slug 2026-01-09-045335
 * 3. 測試最新文章：node scripts/test-newsletter.js --latest
 * 4. 測試發送給自己：node scripts/test-newsletter.js --test-email your-email@gmail.com
 * 5. 測試發送給特定 Email：node scripts/test-newsletter.js --to email@example.com
 */

const { sendNewsletter, getLatestArticle, generateNewsletterHtml } = require('./send-newsletter');
const fs = require('fs');
const path = require('path');
const { blogDir } = require('./config');

// 檢查是否安裝了 nodemailer
let nodemailer;
try {
    nodemailer = require('nodemailer');
} catch (error) {
    console.error('❌ Error: nodemailer is not installed.');
    console.error('   Please run: npm install nodemailer');
    process.exit(1);
}

// 檢查是否安裝了 googleapis（可選）
let google;
try {
    google = require('googleapis').google;
} catch (error) {
    google = null;
}

// 正規化 Email 地址
function normalizeEmail(email) {
    if (!email) return email;

    const trimmed = email.toLowerCase().trim();
    const parts = trimmed.split('@');

    if (parts.length !== 2) return trimmed;

    let [localPart, domain] = parts;

    if (domain === 'gmail.com' || domain === 'googlemail.com') {
        const plusIndex = localPart.indexOf('+');
        if (plusIndex !== -1) {
            localPart = localPart.substring(0, plusIndex);
        }
        localPart = localPart.replace(/\./g, '');
    }

    return localPart + '@' + domain;
}

// 從 Google Sheets 讀取訂閱列表（與 send-newsletter.js 相同）
async function getSubscriptionsFromGoogleSheets() {
    const credentialsJson = process.env.GOOGLE_SHEETS_CREDENTIALS;
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    if (credentialsJson && spreadsheetId && google) {
        try {
            const credentials = JSON.parse(credentialsJson);
            const auth = new google.auth.GoogleAuth({
                credentials,
                scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
            });

            const sheets = google.sheets({ version: 'v4', auth });
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: 'A2:G',
            });

            const rows = response.data.values || [];
            return rows
                .filter(row => row[0])
                .map(row => {
                    const email = normalizeEmail(row[0] || '');
                    return {
                        email: email,
                        types: row[1] ? row[1].split(',').map(t => t.trim()) : [],
                        lang: row[2] || 'zh-TW',
                        subscribedAt: row[3] || '',
                        verified: row[4] === 'TRUE' || row[4] === true || row[4] === 'true',
                    };
                });
        } catch (error) {
            console.error('Error reading from Google Sheets API:', error.message);
        }
    }

    console.warn('⚠️  No Google Sheets configuration found. Using empty subscription list.');
    return [];
}

// 獲取所有可用的文章 slug
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

// 測試模式：只顯示會發送給誰，不實際發送
async function testDryRun(slug) {
    console.log('\n🧪 === 測試模式（Dry Run）===');
    console.log(`📄 文章 Slug: ${slug}\n`);

    try {
        const article = getLatestArticle(slug);
        const articleTypes = getArticleTypes(article);

        console.log(`📋 文章類型: ${articleTypes.join(', ')}`);
        console.log(`📝 標題（中文）: ${article.zh?.meta?.title || 'N/A'}`);
        console.log(`📝 標題（英文）: ${article.en?.meta?.title || 'N/A'}\n`);

        const subscriptions = await getSubscriptionsFromGoogleSheets();
        console.log(`📊 總訂閱數: ${subscriptions.length}\n`);

        if (subscriptions.length === 0) {
            console.log('⚠️  沒有訂閱者，無法發送電子報。');
            return;
        }

        let wouldSendCount = 0;
        let skippedNotVerified = 0;
        let skippedTypeMismatch = 0;

        console.log('📧 會發送的訂閱者：\n');

        for (const subscription of subscriptions) {
            subscription.email = normalizeEmail(subscription.email);

            if (!subscription.verified) {
                skippedNotVerified++;
                continue;
            }

            const shouldSend = subscription.types.includes('all') ||
                subscription.types.some(type => articleTypes.includes(type));

            if (!shouldSend) {
                skippedTypeMismatch++;
                continue;
            }

            wouldSendCount++;
            const maskedEmail = subscription.email.substring(0, 3) + '***@' + subscription.email.split('@')[1];
            console.log(`   ✅ ${maskedEmail} (${subscription.lang}, types: ${subscription.types.join(', ')})`);
        }

        console.log(`\n📊 統計：`);
        console.log(`   ✅ 會發送: ${wouldSendCount}`);
        console.log(`   ⏭️  跳過（未驗證）: ${skippedNotVerified}`);
        console.log(`   ⏭️  跳過（類型不匹配）: ${skippedTypeMismatch}`);
        console.log(`\n💡 這是測試模式，沒有實際發送郵件。`);

    } catch (error) {
        console.error('❌ 錯誤:', error.message);
        process.exit(1);
    }
}

// 根據文章標籤判斷文章類型
function getArticleTypes(article) {
    const types = [];
    const tags = article.zh?.meta?.tags || article.en?.meta?.tags || [];
    const title = (article.zh?.meta?.title || article.en?.meta?.title || '').toLowerCase();
    const content = (article.zh?.body || article.en?.body || '').toLowerCase();

    if (title.includes('ai日報') || title.includes('ai daily') || tags.includes('AI') || tags.includes('每日日報') || tags.includes('Daily Report')) {
        types.push('ai-daily');
    }

    if (title.includes('區塊鏈') || title.includes('blockchain') || tags.includes('區塊鏈') || tags.includes('Blockchain') || content.includes('blockchain')) {
        types.push('blockchain');
    }

    if (!title.includes('ai日報') && !title.includes('ai daily') && !tags.includes('每日日報') && !tags.includes('Daily Report')) {
        types.push('sun-written');
    }

    if (types.length === 0) {
        types.push('all');
    }

    return types;
}

// 測試發送給特定 Email
async function testSendToEmail(slug, testEmail) {
    console.log('\n🧪 === 測試發送給特定 Email ===');
    console.log(`📄 文章 Slug: ${slug}`);
    console.log(`📧 測試 Email: ${testEmail}\n`);

    const gmailUser = process.env.GMAIL_USER;
    const gmailPassword = process.env.GMAIL_APP_PASSWORD;
    const blogUrl = process.env.BLOG_URL || 'https://sunzhi-will.github.io';

    if (!gmailUser || !gmailPassword) {
        console.error('❌ Gmail credentials not configured.');
        console.error('   請設置環境變數: GMAIL_USER 和 GMAIL_APP_PASSWORD');
        process.exit(1);
    }

    try {
        const article = getLatestArticle(slug);
        const articleTypes = getArticleTypes(article);

        console.log(`📋 文章類型: ${articleTypes.join(', ')}`);
        console.log(`📝 標題（中文）: ${article.zh?.meta?.title || 'N/A'}`);
        console.log(`📝 標題（英文）: ${article.en?.meta?.title || 'N/A'}\n`);

        // 創建郵件傳輸器
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmailUser,
                pass: gmailPassword
            }
        });

        // 測試發送給兩種語言
        for (const lang of ['zh-TW', 'en']) {
            const htmlContent = generateNewsletterHtml(article, slug, lang, blogUrl);
            const data = lang === 'zh-TW' ? article.zh : article.en;
            const meta = data.meta;

            // 根據文章類型獲取寄件者名稱
            const getSenderName = (lang, articleTypes) => {
                const senderNames = {
                    'zh-TW': {
                        'ai-daily': 'AI 日報',
                        'blockchain': '區塊鏈日報',
                        'sun-written': 'Sun 的電子報'
                    },
                    'en': {
                        'ai-daily': 'AI Daily',
                        'blockchain': 'Blockchain Daily',
                        'sun-written': "Sun's Newsletter"
                    }
                };

                let primaryType = null;
                if (articleTypes.includes('ai-daily')) {
                    primaryType = 'ai-daily';
                } else if (articleTypes.includes('blockchain')) {
                    primaryType = 'blockchain';
                } else if (articleTypes.includes('sun-written')) {
                    primaryType = 'sun-written';
                }

                if (primaryType && senderNames[lang]?.[primaryType]) {
                    return senderNames[lang][primaryType];
                }

                return lang === 'zh-TW' ? '電子報' : 'Newsletter';
            };

            const senderName = getSenderName(lang, articleTypes);

            const mailOptions = {
                from: `"${senderName}" <${gmailUser}>`,
                to: testEmail,
                subject: `[測試] ${meta.title || (lang === 'zh-TW' ? '【AI日報】每日精選' : '【AI Daily】Daily Highlights')}`,
                html: htmlContent,
                text: meta.description || ''
            };

            console.log(`📤 發送 ${lang} 版本到 ${testEmail}...`);
            await transporter.sendMail(mailOptions);
            console.log(`   ✅ 已發送 ${lang} 版本\n`);
        }

        console.log('✅ 測試郵件發送完成！');
        console.log(`📬 請檢查 ${testEmail} 的收件匣`);

    } catch (error) {
        console.error('❌ 錯誤:', error.message);
        process.exit(1);
    }
}

// 主函數
async function main() {
    const args = process.argv.slice(2);

    // 解析參數
    const dryRun = args.includes('--dry-run');
    const testEmail = args.find(arg => arg.startsWith('--test-email='))?.split('=')[1] ||
        args.find(arg => arg.startsWith('--to='))?.split('=')[1];
    const slugArg = args.find(arg => arg.startsWith('--slug='))?.split('=')[1];
    const latest = args.includes('--latest');
    const list = args.includes('--list');

    // 列出所有文章
    if (list) {
        console.log('\n📚 === 所有可用文章 ===\n');
        const slugs = getAllArticleSlugs();
        if (slugs.length === 0) {
            console.log('⚠️  沒有找到任何文章。');
        } else {
            slugs.forEach((slug, index) => {
                console.log(`   ${index + 1}. ${slug}`);
            });
            console.log(`\n   共 ${slugs.length} 篇文章`);
        }
        return;
    }

    // 確定要使用的 slug
    let slug;
    if (slugArg) {
        slug = slugArg;
    } else if (latest) {
        const slugs = getAllArticleSlugs();
        if (slugs.length === 0) {
            console.error('❌ 沒有找到任何文章。');
            process.exit(1);
        }
        slug = slugs[0];
        console.log(`📄 使用最新文章: ${slug}\n`);
    } else {
        // 預設使用今天的日期
        const { getDateInfo } = require('./utils/dateUtils');
        const dateInfo = getDateInfo();
        slug = dateInfo.timestamp;
        console.log(`📄 使用今天的日期: ${slug}\n`);
    }

    // 檢查文章是否存在
    const articlePath = path.join(blogDir, slug);
    if (!fs.existsSync(articlePath)) {
        console.error(`❌ 文章不存在: ${slug}`);
        console.error(`   路徑: ${articlePath}`);
        console.error(`\n💡 使用 --list 查看所有可用文章`);
        process.exit(1);
    }

    // 執行測試
    if (testEmail) {
        await testSendToEmail(slug, testEmail);
    } else if (dryRun) {
        await testDryRun(slug);
    } else {
        console.log('❌ 請指定測試模式：');
        console.log('   --dry-run                    : 測試模式（不實際發送）');
        console.log('   --test-email=email@example.com : 發送測試郵件到指定 Email');
        console.log('   --to=email@example.com       : 同上');
        console.log('   --slug=2026-01-09-045335     : 指定文章 slug');
        console.log('   --latest                     : 使用最新文章');
        console.log('   --list                       : 列出所有可用文章');
        console.log('\n範例：');
        console.log('   node scripts/test-newsletter.js --dry-run --latest');
        console.log('   node scripts/test-newsletter.js --test-email=your-email@gmail.com --slug=2026-01-09-045335');
    }
}

// 執行
if (require.main === module) {
    main().catch((error) => {
        console.error('❌ 錯誤:', error);
        process.exit(1);
    });
}

module.exports = {
    testDryRun,
    testSendToEmail,
    getAllArticleSlugs
};
