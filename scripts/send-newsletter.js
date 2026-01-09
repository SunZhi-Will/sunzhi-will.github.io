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
 * 將 Markdown 轉換為 HTML（改進版本，支持嵌套列表）
 */
function markdownToHtml(markdown) {
    let html = markdown;

    // 先處理粗體和連結（在分割之前）
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #e8e8e8; font-weight: 600;">$1</strong>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #c0c0c0; text-decoration: underline; transition: color 0.2s;">$1</a>');

    // 先處理同一行內的多個編號列表項目（例如：1. xxx 2. xxx 3. xxx）
    html = html.replace(/(\d+)\.\s+([^\d]+?)(?=\s+\d+\.|$)/g, '$1. $2\n');

    // 按行分割處理（保留原始縮排）
    const lines = html.split('\n');
    const result = [];

    // 用於追蹤嵌套列表的堆疊
    const listStack = []; // [{ level, isOrdered, items }]

    // 計算縮排層級（每4個空格或1個tab為一層）
    const getIndentLevel = (line) => {
        const match = line.match(/^(\s*)/);
        if (!match) return 0;
        const spaces = match[1];
        // 將 tab 轉換為4個空格
        const normalized = spaces.replace(/\t/g, '    ');
        return Math.floor(normalized.length / 4);
    };

    // 關閉列表到指定層級
    const closeListsToLevel = (targetLevel) => {
        while (listStack.length > targetLevel) {
            const list = listStack.pop();
            if (list.items.length > 0) {
                const listTag = list.isOrdered ? 'ol' : 'ul';
                const padding = 24 + (list.level * 20); // 每層增加20px縮排
                const listHtml = `<${listTag} style="margin: 12px 0; padding-left: ${padding}px; line-height: 1.7;">${list.items.join('')}</${listTag}>`;

                if (listStack.length > 0) {
                    // 將這個列表添加到上一層的最後一個項目中
                    const parentList = listStack[listStack.length - 1];
                    if (parentList.items.length > 0) {
                        const lastItem = parentList.items[parentList.items.length - 1];
                        parentList.items[parentList.items.length - 1] = lastItem.replace('</li>', listHtml + '</li>');
                    }
                } else {
                    result.push(listHtml);
                }
            }
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const originalLine = lines[i];
        const trimmedLine = originalLine.trim();
        const nextLine = i < lines.length - 1 ? lines[i + 1] : '';

        if (!trimmedLine) {
            // 空行：如果下一行不是列表項目，關閉所有列表
            const nextTrimmed = nextLine.trim();
            const nextIsList = nextTrimmed.match(/^[\*\-] /) || nextTrimmed.match(/^\d+\.\s+/);
            if (!nextIsList && listStack.length > 0) {
                closeListsToLevel(0);
            }
            continue;
        }

        // 處理標題
        if (trimmedLine.match(/^### /)) {
            closeListsToLevel(0);
            result.push(`<h3 style="font-size: 20px; font-weight: 600; margin: 32px 0 16px 0; color: #e8e8e8; line-height: 1.4;">${trimmedLine.replace(/^### /, '')}</h3>`);
            continue;
        }
        if (trimmedLine.match(/^## /)) {
            closeListsToLevel(0);
            result.push(`<h2 style="font-size: 24px; font-weight: 600; margin: 40px 0 20px 0; color: #e8e8e8; line-height: 1.4;">${trimmedLine.replace(/^## /, '')}</h2>`);
            continue;
        }
        if (trimmedLine.match(/^# /)) {
            closeListsToLevel(0);
            result.push(`<h1 style="font-size: 28px; font-weight: 700; margin: 48px 0 24px 0; color: #e8e8e8; line-height: 1.3;">${trimmedLine.replace(/^# /, '')}</h1>`);
            continue;
        }

        const indentLevel = getIndentLevel(originalLine);
        const trimmedIndentLevel = getIndentLevel(trimmedLine);

        // 處理編號列表項目
        const orderedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
        if (orderedMatch) {
            closeListsToLevel(indentLevel);

            // 確保當前層級有列表
            if (listStack.length <= indentLevel || !listStack[indentLevel] || !listStack[indentLevel].isOrdered) {
                closeListsToLevel(indentLevel);
                listStack.push({
                    level: indentLevel,
                    isOrdered: true,
                    items: []
                });
            }

            const listContent = orderedMatch[2];
            listStack[indentLevel].items.push(`<li style="margin: 12px 0; color: #d4d4d4; line-height: 1.8; padding-left: 4px;">${listContent}</li>`);
            continue;
        }

        // 處理無序列表項目（以 * 或 - 開頭）
        const unorderedMatch = trimmedLine.match(/^[\*\-]\s+(.+)$/);
        if (unorderedMatch) {
            closeListsToLevel(indentLevel);

            // 確保當前層級有列表
            if (listStack.length <= indentLevel || !listStack[indentLevel] || listStack[indentLevel].isOrdered) {
                closeListsToLevel(indentLevel);
                listStack.push({
                    level: indentLevel,
                    isOrdered: false,
                    items: []
                });
            }

            const listContent = unorderedMatch[1];
            listStack[indentLevel].items.push(`<li style="margin: 12px 0; color: #d4d4d4; line-height: 1.8; padding-left: 4px;">${listContent}</li>`);
            continue;
        }

        // 處理普通段落或列表項目的延續內容
        if (listStack.length > 0) {
            // 檢查是否是列表項目的延續（有縮排但不是列表標記）
            if (trimmedIndentLevel > 0 && !trimmedLine.match(/^[\*\-] /) && !trimmedLine.match(/^\d+\.\s+/)) {
                // 這是列表項目的延續內容
                const topList = listStack[listStack.length - 1];
                if (topList.items.length > 0) {
                    const lastItem = topList.items[topList.items.length - 1];
                    topList.items[topList.items.length - 1] = lastItem.replace('</li>', ` ${trimmedLine}</li>`);
                }
                continue;
            } else {
                // 不是列表項目的延續，關閉列表
                closeListsToLevel(0);
            }
        }

        // 處理普通段落
        if (listStack.length === 0 && trimmedLine) {
            result.push(`<p style="margin: 20px 0; line-height: 1.8; color: #d4d4d4; font-size: 15px;">${trimmedLine}</p>`);
        }
    }

    // 關閉所有剩餘的列表
    closeListsToLevel(0);

    return result.join('\n');
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

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #000000; min-height: 100vh; padding: 40px 20px;">
    <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 16px; box-shadow: 0 10px 40px rgba(192, 192, 192, 0.1); overflow: hidden; border: 1px solid #333333;">
        <tr>
            <td style="padding: 0;">
                <!-- Header -->
                <div style="background-color: #0a0a0a; padding: 40px 30px; border-bottom: 1px solid #333333;">
                    <h1 style="color: #e8e8e8; margin-top: 0; margin-bottom: 10px; font-size: 28px; font-weight: 700; text-shadow: 0 2px 8px rgba(192, 192, 192, 0.3);">${title}</h1>
                    <p style="color: #c0c0c0; font-size: 14px; margin: 0;">${date}</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 50px 40px; background-color: #1a1a1a;">
                    <p style="color: #d4d4d4; font-size: 17px; margin: 0 0 40px 0; line-height: 1.7; font-weight: 400;">${description}</p>
                    
                    <hr style="border: none; border-top: 1px solid #333333; margin: 40px 0;">
                    
                    <div style="color: #d4d4d4; font-size: 15px; line-height: 1.8;">
                        ${htmlBody}
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #0a0a0a; padding: 30px 40px; border-top: 1px solid #333333;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <a href="${articleUrl}" style="display: inline-block; color: #c0c0c0; text-decoration: none; font-size: 13px; padding: 8px 16px; border: 1px solid #333333; border-radius: 6px; transition: all 0.2s;">
                            ${isZh ? '看網頁版' : 'View on Web'}
                        </a>
                    </div>
                    <p style="color: #999999; font-size: 12px; text-align: center; margin: 0; line-height: 1.6;">
                        ${isZh ? '這是由 AI 自動生成的每日日報。' : 'This is an AI-generated daily report.'}
                    </p>
                </div>
            </td>
        </tr>
    </table>
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
                return lang === 'zh-TW' ? 'Sun 的電子報' : "Sun's Newsletter";
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
 * 查找今天日期的最新文章
 */
function findLatestArticleForToday(dateStr) {
    const allSlugs = getAllArticleSlugs();

    // 查找今天日期開頭的文章
    const todayArticles = allSlugs.filter(slug => slug.startsWith(dateStr));

    if (todayArticles.length === 0) {
        return null;
    }

    // 返回最新的（第一個，因為已經排序）
    return todayArticles[0];
}

// 主函數
async function main() {
    const dateInfo = getDateInfo();
    const { dateStr } = dateInfo;

    console.log('=== Newsletter Sender ===');
    console.log(`Date: ${dateStr}`);

    // 查找今天日期的最新文章
    const slug = findLatestArticleForToday(dateStr);

    if (!slug) {
        console.error(`❌ Error: No article found for date ${dateStr}`);
        console.error('   Please ensure an article exists for today, or specify a slug manually.');
        process.exit(1);
    }

    console.log(`Article slug: ${slug}`);

    try {
        await sendNewsletter(slug);
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
