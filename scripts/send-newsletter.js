const fs = require('fs');
const path = require('path');
const { getDateInfo } = require('./utils/dateUtils');
const { blogDir } = require('./config');

// 正規化 Email 地址（處理 Gmail 的 + 別名和 . 符號）
function normalizeEmail(email) {
    if (!email) return email;
    
    const trimmed = email.toLowerCase().trim();
    const parts = trimmed.split('@');
    
    if (parts.length !== 2) return trimmed; // 無效的 Email 格式
    
    let [localPart, domain] = parts;
    
    // 如果是 Gmail 或 Google 郵件服務，進行正規化
    if (domain === 'gmail.com' || domain === 'googlemail.com') {
        // 移除 + 後面的部分（Gmail 別名）
        const plusIndex = localPart.indexOf('+');
        if (plusIndex !== -1) {
            localPart = localPart.substring(0, plusIndex);
        }
        
        // 移除 . 符號（Gmail 忽略點號）
        localPart = localPart.replace(/\./g, '');
    }
    
    return localPart + '@' + domain;
}

// 檢查是否安裝了 nodemailer
let nodemailer;
try {
    nodemailer = require('nodemailer');
} catch (error) {
    console.error('❌ Error: nodemailer is not installed.');
    console.error('   Please run: npm install nodemailer');
    process.exit(1);
}

// 檢查是否安裝了 googleapis（可選，如果使用 Google Sheets API）
let google;
try {
    google = require('googleapis').google;
} catch (error) {
    // googleapis 是可選的，如果只使用 Google Apps Script 則不需要
    google = null;
}

/**
 * 從 Google Sheets 讀取訂閱列表
 * @returns {Promise<Array>} 訂閱列表
 */
async function getSubscriptionsFromGoogleSheets() {
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (scriptUrl) {
        // 方法 1: 使用 Google Apps Script 的 doGet 函數
        // 注意：由於安全原因，doGet 現在只處理驗證請求
        // 如果需要從 Google Apps Script 獲取訂閱列表，需要添加一個帶認證的端點
        // 目前建議使用方法 2（Google Sheets API）
        console.log('⚠️  Google Apps Script doGet is restricted for security. Using Google Sheets API instead.');
    }

    // 方法 2: 使用 Google Sheets API（需要服務帳號憑證）
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
                range: 'A2:G', // 跳過標題行，包含所有欄位（Email, Types, Lang, SubscribedAt, Verified, VerifyToken, TokenExpiry）
            });

            const rows = response.data.values || [];
            return rows
                .filter(row => row[0]) // 過濾空行
                .map(row => {
                    // 正規化 Email（處理 Gmail 的 + 別名）
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

/**
 * 根據文章標籤判斷文章類型
 * @param {Object} article - 文章內容
 * @returns {Array<string>} 文章類型列表
 */
function getArticleTypes(article) {
    const types = [];
    const tags = article.zh?.meta?.tags || article.en?.meta?.tags || [];
    const title = (article.zh?.meta?.title || article.en?.meta?.title || '').toLowerCase();
    const content = (article.zh?.body || article.en?.body || '').toLowerCase();

    // 檢查是否為 AI 日報
    if (title.includes('ai日報') || title.includes('ai daily') || tags.includes('AI') || tags.includes('每日日報') || tags.includes('Daily Report')) {
        types.push('ai-daily');
    }

    // 檢查是否為區塊鏈日報
    if (title.includes('區塊鏈') || title.includes('blockchain') || tags.includes('區塊鏈') || tags.includes('Blockchain') || content.includes('blockchain')) {
        types.push('blockchain');
    }

    // 檢查是否為 Sun 撰寫（非 AI 日報）
    if (!title.includes('ai日報') && !title.includes('ai daily') && !tags.includes('每日日報') && !tags.includes('Daily Report')) {
        types.push('sun-written');
    }

    // 如果沒有特定類型，默認為全部
    if (types.length === 0) {
        types.push('all');
    }

    return types;
}

/**
 * 讀取最新生成的文章內容
 * @param {string} slug - 文章 slug (日期時間戳)
 * @returns {Object} 包含中英文文章內容
 */
function getLatestArticle(slug) {
    const postFolder = path.join(blogDir, slug);
    const articlePathZh = path.join(postFolder, 'article.zh-TW.mdx');
    const articlePathEn = path.join(postFolder, 'article.en.mdx');

    if (!fs.existsSync(articlePathZh) || !fs.existsSync(articlePathEn)) {
        throw new Error(`Article files not found for slug: ${slug}`);
    }

    const contentZh = fs.readFileSync(articlePathZh, 'utf8');
    const contentEn = fs.readFileSync(articlePathEn, 'utf8');

    // 解析 frontmatter
    const frontmatterZh = contentZh.match(/^---\n([\s\S]*?)\n---/);
    const frontmatterEn = contentEn.match(/^---\n([\s\S]*?)\n---/);

    const parseFrontmatter = (fm) => {
        if (!fm) return {};
        const obj = {};
        fm[1].split('\n').forEach(line => {
            const match = line.match(/^(\w+):\s*"?(.*?)"?$/);
            if (match) {
                let value = match[2].replace(/^"|"$/g, '');
                // 處理 tags 陣列
                if (match[1] === 'tags') {
                    try {
                        value = JSON.parse(value);
                    } catch {
                        value = value.split(',').map(t => t.trim().replace(/^\[|\]$/g, ''));
                    }
                }
                obj[match[1]] = value;
            }
        });
        return obj;
    };

    const metaZh = parseFrontmatter(frontmatterZh);
    const metaEn = parseFrontmatter(frontmatterEn);
    const bodyZh = contentZh.replace(/^---\n[\s\S]*?\n---\n\n/, '');
    const bodyEn = contentEn.replace(/^---\n[\s\S]*?\n---\n\n/, '');

    return {
        zh: {
            meta: metaZh,
            body: bodyZh
        },
        en: {
            meta: metaEn,
            body: bodyEn
        }
    };
}

/**
 * 將 Markdown 轉換為 HTML（簡單版本）
 */
function markdownToHtml(markdown) {
    let html = markdown;

    // 標題
    html = html.replace(/^### (.*$)/gim, '<h3 style="font-size: 18px; font-weight: 600; margin: 20px 0 10px 0;">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 style="font-size: 20px; font-weight: 600; margin: 24px 0 12px 0;">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 style="font-size: 24px; font-weight: 700; margin: 28px 0 14px 0;">$1</h1>');

    // 粗體
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 連結
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #2563eb; text-decoration: underline;">$1</a>');

    // 列表
    html = html.replace(/^- (.*$)/gim, '<li style="margin: 5px 0;">$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul style="margin: 10px 0; padding-left: 20px;">$1</ul>');

    // 段落
    html = html.split('\n\n').map(p => {
        p = p.trim();
        if (p && !p.startsWith('<')) {
            return `<p style="margin: 10px 0; line-height: 1.6;">${p}</p>`;
        }
        return p;
    }).join('\n');

    return html;
}

/**
 * 生成電子報 HTML
 */
function generateNewsletterHtml(article, slug, lang, blogUrl) {
    const isZh = lang === 'zh-TW';
    const data = isZh ? article.zh : article.en;
    const meta = data.meta;
    const body = data.body;

    const title = meta.title || '';
    const description = meta.description || '';
    const date = meta.date || '';

    // 生成文章 URL
    const articleUrl = `${blogUrl}/blog/${slug}`;

    // 轉換 Markdown 為 HTML
    const htmlBody = markdownToHtml(body);

    // 限制內容長度（只顯示前 500 字，然後提供連結）
    const previewLength = isZh ? 500 : 800;
    let previewBody = htmlBody;
    if (htmlBody.length > previewLength) {
        previewBody = htmlBody.substring(0, previewLength) + '...';
    }

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #1a1a1a; margin-top: 0; font-size: 24px;">${title}</h1>
        <p style="color: #666; font-size: 14px; margin: 10px 0;">${date}</p>
        <p style="color: #555; font-size: 16px; margin: 20px 0;">${description}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <div style="color: #333; font-size: 15px;">
            ${previewBody}
        </div>
        <div style="margin: 30px 0; text-align: center;">
            <a href="${articleUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                ${isZh ? '閱讀完整文章' : 'Read Full Article'}
            </a>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center; margin: 20px 0;">
            ${isZh ? '這是由 AI 自動生成的每日日報。' : 'This is an AI-generated daily report.'}
        </p>
    </div>
</body>
</html>
    `.trim();
}

/**
 * 發送電子報給訂閱者
 */
async function sendNewsletter(slug) {
    // 檢查環境變數
    const gmailUser = process.env.GMAIL_USER;
    const gmailPassword = process.env.GMAIL_APP_PASSWORD;
    const blogUrl = process.env.BLOG_URL || 'https://sunzhi-will.github.io';

    if (!gmailUser || !gmailPassword) {
        console.log('⚠️  Gmail credentials not configured. Skipping newsletter sending.');
        return;
    }

    console.log(`\n📧 Sending newsletter for article: ${slug}...`);

    // 讀取文章內容
    const article = getLatestArticle(slug);
    const articleTypes = getArticleTypes(article);

    console.log(`   Article types: ${articleTypes.join(', ')}`);

    // 讀取訂閱列表
    const subscriptions = await getSubscriptionsFromGoogleSheets();
    console.log(`   Total subscriptions: ${subscriptions.length}`);

    if (subscriptions.length === 0) {
        console.log('   No subscriptions found. Skipping.');
        return;
    }

    // 創建郵件傳輸器
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailUser,
            pass: gmailPassword
        }
    });

    let sentCount = 0;
    let errorCount = 0;

    // 發送給每個訂閱者
    for (const subscription of subscriptions) {
        // 正規化訂閱者的 Email（確保一致性，處理 Gmail + 別名）
        subscription.email = normalizeEmail(subscription.email);
        
        // 只發送給已驗證的訂閱者
        if (!subscription.verified) {
            // 使用遮罩的 Email 記錄日誌（安全措施）
            const maskedEmail = subscription.email.substring(0, 3) + '***@' + subscription.email.split('@')[1];
            console.log(`   Skipping ${maskedEmail} (not verified)`);
            continue;
        }

        // 檢查訂閱類型是否匹配
        const shouldSend = subscription.types.includes('all') ||
            subscription.types.some(type => articleTypes.includes(type));

        if (!shouldSend) {
            // 使用遮罩的 Email 記錄日誌（安全措施）
            const maskedEmail = subscription.email.substring(0, 3) + '***@' + subscription.email.split('@')[1];
            console.log(`   Skipping ${maskedEmail} (not subscribed to this type)`);
            continue;
        }

        try {
            const lang = subscription.lang || 'zh-TW';
            const data = lang === 'zh-TW' ? article.zh : article.en;
            const meta = data.meta;

            // 生成 HTML 電子報
            const htmlContent = generateNewsletterHtml(article, slug, lang, blogUrl);

            // 根據文章類型和語言獲取寄件者名稱
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

                // 根據文章類型決定寄件者名稱（優先順序：ai-daily > blockchain > sun-written）
                let primaryType = null;
                if (articleTypes.includes('ai-daily')) {
                    primaryType = 'ai-daily';
                } else if (articleTypes.includes('blockchain')) {
                    primaryType = 'blockchain';
                } else if (articleTypes.includes('sun-written')) {
                    primaryType = 'sun-written';
                }

                // 如果找到對應類型，返回對應名稱；否則使用預設值
                if (primaryType && senderNames[lang]?.[primaryType]) {
                    return senderNames[lang][primaryType];
                }

                // 預設值（當文章類型無法識別時）
                return lang === 'zh-TW' ? '電子報' : 'Newsletter';
            };

            const senderName = getSenderName(lang, articleTypes);

            // 郵件選項
            const mailOptions = {
                from: `"${senderName}" <${gmailUser}>`,
                to: subscription.email,
                subject: meta.title || (lang === 'zh-TW' ? '【AI日報】每日精選' : '【AI Daily】Daily Highlights'),
                html: htmlContent,
                text: meta.description || ''
            };

            // 發送郵件
            await transporter.sendMail(mailOptions);
            // 使用遮罩的 Email 記錄日誌（安全措施）
            const maskedEmail = subscription.email.substring(0, 3) + '***@' + subscription.email.split('@')[1];
            console.log(`   ✅ Sent to ${maskedEmail}`);
            sentCount++;
        } catch (error) {
            console.error(`   ❌ Failed to send to ${subscription.email}:`, error.message);
            errorCount++;
        }
    }

    console.log(`\n📊 Newsletter sending completed:`);
    console.log(`   ✅ Sent: ${sentCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
}

// 主函數
async function main() {
    const dateInfo = getDateInfo();
    const { timestamp } = dateInfo;

    console.log('=== Newsletter Sender ===');
    console.log(`Date: ${dateInfo.dateStr}`);
    console.log(`Article slug: ${timestamp}`);

    try {
        await sendNewsletter(timestamp);
    } catch (error) {
        console.error('Error:', error);
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

module.exports = {
    sendNewsletter,
    getLatestArticle,
    generateNewsletterHtml
};
