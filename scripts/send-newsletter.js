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

/**
 * 更新用戶的 LastArticleSent 欄位
 * @param {string} email - 用戶的Email地址
 * @param {string} articleSlug - 文章的slug
 * @param {string} lang - 語言設定
 */
async function updateLastArticleSent(email, articleSlug, lang = 'zh-TW') {
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
        console.error('❌ GOOGLE_APPS_SCRIPT_URL is not configured in environment variables');
        console.error('   Please check your GitHub secrets or local .env file');
        throw new Error('GOOGLE_APPS_SCRIPT_URL is not configured');
    }

    // 驗證 scriptUrl 只允許 https://script.google.com，防止 SSRF
    let parsedScriptUrl;
    try {
        parsedScriptUrl = new URL(scriptUrl);
    } catch {
        throw new Error('GOOGLE_APPS_SCRIPT_URL is not a valid URL');
    }
    if (parsedScriptUrl.protocol !== 'https:' || parsedScriptUrl.hostname !== 'script.google.com') {
        throw new Error('GOOGLE_APPS_SCRIPT_URL must be an https://script.google.com URL');
    }

    // 發送更新請求到 Google Apps Script
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('action', 'update_last_article');
    formData.append('article_slug', articleSlug);
    formData.append('lang', lang);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 增加到30秒

    try {
        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
            signal: controller.signal,
            mode: 'cors',
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseText = await response.text();
        const data = JSON.parse(responseText);

        if (!data.success) {
            throw new Error(data.message || 'Failed to update LastArticleSent');
        }
    } catch (error) {
        throw error;
    }
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
                range: 'A2:H', // 跳過標題行，包含所有欄位（Email, Types, Lang, SubscribedAt, Verified, VerifyToken, TokenExpiry, LastArticleSent）
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
                        lastArticleSent: row[7] || '', // LastArticleSent (第8欄，索引7)
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
 * @returns {Object} 包含可用語言文章內容
 */
function getLatestArticle(slug) {
    const postFolder = path.join(blogDir, slug);
    const articlePathZh = path.join(postFolder, 'article.zh-TW.mdx');
    const articlePathEn = path.join(postFolder, 'article.en.mdx');
    const hasZh = fs.existsSync(articlePathZh);
    const hasEn = fs.existsSync(articlePathEn);

    if (!hasZh && !hasEn) {
        throw new Error(`No article files found for slug: ${slug}`);
    }

    const contentZh = hasZh ? fs.readFileSync(articlePathZh, 'utf8') : null;
    const contentEn = hasEn ? fs.readFileSync(articlePathEn, 'utf8') : null;

    // 解析 frontmatter
    const frontmatterZh = contentZh?.match(/^---\n([\s\S]*?)\n---/);
    const frontmatterEn = contentEn?.match(/^---\n([\s\S]*?)\n---/);

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
    const bodyZh = contentZh?.replace(/^---\n[\s\S]*?\n---\n\n/, '');
    const bodyEn = contentEn?.replace(/^---\n[\s\S]*?\n---\n\n/, '');

    return {
        zh: hasZh ? {
            meta: metaZh,
            body: bodyZh
        } : null,
        en: hasEn ? {
            meta: metaEn,
            body: bodyEn
        } : null
    };
}

/**
 * 依訂閱者偏好的語言選擇可寄送的文章版本。
 * 若偏好語言尚未提供，會回退到另一個可用版本。
 */
function resolveArticleLanguage(article, requestedLang = 'zh-TW') {
    if (requestedLang === 'zh-TW' && article.zh) {
        return 'zh-TW';
    }

    if (requestedLang !== 'zh-TW' && article.en) {
        return 'en';
    }

    if (article.zh) {
        return 'zh-TW';
    }

    if (article.en) {
        return 'en';
    }

    throw new Error('Article does not contain a sendable language version');
}

// Gmail 會截斷超過約 102KB 的信件內文，被截掉的部分包含頁尾的取消訂閱連結
const GMAIL_CLIP_BYTES = 102 * 1024;

// 信件用的顏色與字體，對齊網站的深色版面（docs/uiux-redesign-2026.md）。
// 黑底上不用灰色文字，層次靠字級與字重；強調色只有一個
const EMAIL = {
    bg: '#0a0a0a',
    surface: '#111113',
    line: '#27272a',
    title: '#ffffff',
    text: '#e4e4e7',
    accent: '#facc15',
    ink: '#0a0a0a',
    font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'PingFang TC', 'Microsoft JhengHei', sans-serif",
    mono: "'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', monospace"
};

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/**
 * 主要按鈕（黃底黑字）。用表格包起來，Outlook 才不會把內距吃掉
 */
function emailButton(href, label) {
    return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td style="border-radius: 999px; background-color: ${EMAIL.accent};">
            <a href="${href}" target="_blank" style="display: inline-block; padding: 14px 28px; font-family: ${EMAIL.font}; font-size: 16px; font-weight: 700; line-height: 1; color: ${EMAIL.ink}; text-decoration: none; border-radius: 999px;">${label}</a>
        </td>
    </tr>
</table>`.trim();
}

/**
 * 將 Markdown 轉換為 HTML（支援巢狀列表、引言、圖片、表格與站內的 MDX 元件）
 * @param {string} markdown - 文章內文
 * @param {Object} options - lang、blogUrl、slug、articleUrl
 */
function markdownToHtml(markdown, options = {}) {
    const lang = options.lang || 'zh-TW';
    const isZh = lang === 'zh-TW';
    const blogUrl = options.blogUrl || process.env.BLOG_URL || 'https://sunzhi-will.github.io';
    const slug = options.slug || '';
    const articleUrl = options.articleUrl || (slug ? `${blogUrl}/blog/${slug}` : blogUrl);

    let html = markdown.replace(/\r\n/g, '\n');

    // 區塊層級的 HTML 先收起來，換成一行佔位符，最後再放回去。
    // 這樣多行的 HTML 才不會在逐行處理時被包進 <p>
    const blocks = [];
    const stash = (blockHtml) => {
        blocks.push(blockHtml.trim());
        return `\n\n@@BLOCK_${blocks.length - 1}@@\n\n`;
    };
    const inlines = [];
    const stashInline = (inlineHtml) => {
        inlines.push(inlineHtml);
        return `@@INLINE_${inlines.length - 1}@@`;
    };

    // 站內圖片用相對路徑，信件裡要換成完整網址
    const resolveUrl = (src) => {
        if (/^(https?:|mailto:|data:)/.test(src)) return src;
        if (src.startsWith('#')) return `${articleUrl}${src}`;
        if (src.startsWith('/')) return `${blogUrl}${src}`;
        return `${blogUrl}/blog/${slug}/${src.replace(/^\.\//, '')}`;
    };

    // 程式碼區塊（要在其他規則之前處理，內容才不會被當成 Markdown）
    html = html.replace(/^```[^\n]*\n([\s\S]*?)\n```[ \t]*$/gm, (match, code) => stash(
        `<pre style="margin: 24px 0; padding: 16px 18px; background-color: ${EMAIL.bg}; border: 1px solid ${EMAIL.line}; border-radius: 10px; font-family: ${EMAIL.mono}; font-size: 13px; line-height: 1.7; color: ${EMAIL.text}; white-space: pre-wrap; word-break: break-word;">${escapeHtml(code)}</pre>`
    ));
    html = html.replace(/`([^`\n]+)`/g, (match, code) => stashInline(
        `<code style="padding: 2px 6px; background-color: ${EMAIL.bg}; border: 1px solid ${EMAIL.line}; border-radius: 4px; font-family: ${EMAIL.mono}; font-size: 0.9em; color: ${EMAIL.title};">${escapeHtml(code)}</code>`
    ));

    // MDX 的 import / export 不屬於內文
    html = html.replace(/^(import|export)\s.+$/gm, '');

    // 先處理 BookmarkCard 組件（需要在分割之前處理）
    // 將多行 BookmarkCard 轉換為單行格式
    html = html.replace(
        /<BookmarkCard([\s\S]*?)\/>/g,
        (match, attrs) => {
            // 移除換行和多餘空格，將所有屬性放在一行，保持完整的標籤結構
            return `<BookmarkCard${attrs.replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ').trim()}/>`;
        }
    );

    // 先處理 InsightQuote 組件（需要在分割之前處理）
    // 將多行 InsightQuote 轉換為單行格式
    html = html.replace(
        /<InsightQuote([\s\S]*?)\/>/g,
        (match, attrs) => {
            // 移除換行和多餘空格，將所有屬性放在一行，保持完整的標籤結構
            return `<InsightQuote${attrs.replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ').trim()}/>`;
        }
    );

    // 先處理 Callout 組件（需要在分割之前處理）
    // 將多行 Callout 轉換為單行格式
    html = html.replace(
        /<Callout([\s\S]*?)>([\s\S]*?)<\/Callout>/g,
        (match, attrs, content) => {
            // 移除換行和多餘空格，保持完整的標籤結構
            return `<Callout${attrs.replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ').trim()}>${content.trim()}</Callout>`;
        }
    );

    // 先處理 StatsHighlight 組件（需要在分割之前處理）
    // 將多行 StatsHighlight 轉換為單行格式
    html = html.replace(
        /<StatsHighlight([\s\S]*?)\/>/g,
        (match, attrs) => {
            // 移除換行和多餘空格，將所有屬性放在一行，保持完整的標籤結構
            return `<StatsHighlight${attrs.replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ').trim()}/>`;
        }
    );

    // 處理 BookmarkCard 組件
    html = html.replace(
        /<BookmarkCard\s+([^>]+)\s*\/>/g,
        (match, attrs) => {
            // 解析屬性
            const hrefMatch = attrs.match(/href="([^"]+)"/);
            const titleMatch = attrs.match(/title="([^"]+)"/);
            const descriptionMatch = attrs.match(/description="([^"]+)"/);
            const iconMatch = attrs.match(/icon="([^"]+)"/);
            const thumbnailMatch = attrs.match(/thumbnail="([^"]+)"/);

            const href = hrefMatch ? hrefMatch[1] : '';
            const title = titleMatch ? titleMatch[1] : '';
            const description = descriptionMatch ? descriptionMatch[1] : '';
            const icon = iconMatch ? iconMatch[1] : '';
            const thumbnail = thumbnailMatch ? thumbnailMatch[1] : '';

            let imageHtml = '';
            if (thumbnail) {
                imageHtml = `
<td style="width: 140px; padding-left: 20px; vertical-align: middle;">
    <img src="${resolveUrl(thumbnail)}" alt="" style="width: 140px; height: 100px; object-fit: cover; border-radius: 6px; display: block;" />
</td>
                `;
            }

            let iconHtml = '';
            if (icon) {
                iconHtml = `<img src="${resolveUrl(icon)}" alt="" style="width: 16px; height: 16px; border-radius: 50%; display: inline-block; vertical-align: middle; margin-right: 6px;" />`;
            }

            let hostname = '';
            try {
                hostname = new URL(href).hostname;
            } catch (e) {
                hostname = href;
            }

            return stash(`
<div style="margin: 24px 0; padding: 20px; background-color: ${EMAIL.bg}; border: 1px solid ${EMAIL.line}; border-radius: 12px;">
    <a href="${href}" style="text-decoration: none; color: inherit; display: block;" target="_blank" rel="noopener noreferrer">
        <table role="presentation" style="width: 100%; border-collapse: collapse; border: none;">
            <tr>
                <td style="vertical-align: top;">
                    <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: ${EMAIL.title}; line-height: 1.4;">${title}</div>
                    <div style="font-size: 14px; margin-bottom: 12px; color: ${EMAIL.text}; line-height: 1.5;">${description}</div>
                    <div style="font-family: ${EMAIL.mono}; font-size: 12px; color: ${EMAIL.accent};">
                        ${iconHtml}
                        <span style="vertical-align: middle;">${hostname}</span>
                    </div>
                </td>
                ${imageHtml}
            </tr>
        </table>
    </a>
</div>
            `);
        }
    );

    // 處理 InsightQuote 組件
    html = html.replace(
        /<InsightQuote\s+([^>]+)\s*\/>/g,
        (match, attrs) => {
            // 解析屬性
            const typeMatch = attrs.match(/type="([^"]+)"/);
            const contentMatch = attrs.match(/content="([^"]+)"/);
            const authorMatch = attrs.match(/author="([^"]+)"/);
            const roleMatch = attrs.match(/role="([^"]+)"/);

            const type = typeMatch ? typeMatch[1] : 'insight';
            const content = contentMatch ? contentMatch[1] : '';
            const author = authorMatch ? authorMatch[1] : '';
            const role = roleMatch ? roleMatch[1] : '';

            // 根據類型決定樣式 (與網站的 bg-opacity 和 border 同步)
            const getTypeConfig = (type) => {
                const configs = {
                    insight: { icon: '🔍', title: isZh ? '內行人的深度點評' : 'An insider take', bgColor: '#18181b', borderColor: EMAIL.line, textColor: EMAIL.text },
                    experience: { icon: '💭', title: isZh ? '我的親身體驗' : 'From my own experience', bgColor: '#142b1b', borderColor: '#1e3f20', textColor: '#a7f3d0' },
                    warning: { icon: '⚠️', title: isZh ? '重要提醒' : 'Heads up', bgColor: '#2e2916', borderColor: '#4a3f1a', textColor: '#fef08a' },
                    tip: { icon: '💡', title: isZh ? '實用技巧' : 'Practical tip', bgColor: '#2e2916', borderColor: '#4a3f1a', textColor: '#fef08a' }
                };
                return configs[type] || configs.insight;
            };

            const config = getTypeConfig(type);
            const authorHtml = author ? `<div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid ${config.borderColor}; font-size: 13px; color: ${EMAIL.text};">${author}${role ? ` • ${role}` : ''}</div>` : '';

            return stash(`
<div style="margin: 32px 0; padding: 24px; background-color: ${config.bgColor}; border: 1px solid ${config.borderColor}; border-radius: 12px;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="vertical-align: top; width: 48px; padding-right: 16px;">
                <div style="width: 48px; height: 48px; border-radius: 50%; background-color: ${EMAIL.line}; font-size: 24px; text-align: center; line-height: 48px;">
                    ${config.icon}
                </div>
            </td>
            <td style="vertical-align: top;">
                <div style="font-size: 16px; font-weight: 600; margin-bottom: 12px; color: ${EMAIL.title};">
                    ${config.title}
                </div>
                <div style="font-size: 15px; line-height: 1.7; color: ${config.textColor};">
                    ${content}
                </div>
                ${authorHtml}
            </td>
        </tr>
    </table>
</div>
            `);
        }
    );

    // 處理 Callout 組件
    html = html.replace(
        /<Callout\s+([^>]+)>([^<]*)<\/Callout>/g,
        (match, attrs, content) => {
            // 解析屬性
            const typeMatch = attrs.match(/type="([^"]+)"/);
            const titleMatch = attrs.match(/title="([^"]+)"/);

            const type = typeMatch ? typeMatch[1] : 'info';
            const title = titleMatch ? titleMatch[1] : '';

            // 根據類型決定樣式
            const getTypeConfig = (type) => {
                const configs = {
                    info: { icon: 'ℹ️', bgColor: '#18181b', borderColor: EMAIL.line, textColor: EMAIL.text },
                    success: { icon: '✅', bgColor: '#142b1b', borderColor: '#1e3f20', textColor: '#a7f3d0' },
                    warning: { icon: '⚠️', bgColor: '#2e2916', borderColor: '#4a3f1a', textColor: '#fef08a' },
                    error: { icon: '❌', bgColor: '#2d1919', borderColor: '#4a1e1e', textColor: '#fecaca' },
                    tip: { icon: '💡', bgColor: '#2e2916', borderColor: '#4a3f1a', textColor: '#fef08a' }
                };
                return configs[type] || configs.info;
            };

            const config = getTypeConfig(type);
            const titleHtml = title ? `<div style="font-weight: 600; margin-bottom: 8px; color: ${EMAIL.title};">${config.icon} ${title}</div>` : '';

            return stash(`
<div style="margin: 24px 0; padding: 16px 20px; background-color: ${config.bgColor}; border: 1px solid ${config.borderColor}; border-radius: 12px;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            ${!title ? `<td style="vertical-align: top; width: 24px; padding-right: 12px; font-size: 16px; line-height: 1.6;">${config.icon}</td>` : ''}
            <td style="vertical-align: top;">
                ${titleHtml}
                <div style="color: ${config.textColor}; line-height: 1.6; font-size: 14px;">${content.trim()}</div>
            </td>
        </tr>
    </table>
</div>
            `);
        }
    );

    // 處理 StatsHighlight 組件 (支援多個數據水平排列)
    html = html.replace(
        /<StatsHighlight\s+([^>]+)\s*\/>/g,
        (match, attrs) => {
            const titleMatch = attrs.match(/title="([^"]+)"/);
            const title = titleMatch ? titleMatch[1] : '';

            // 解析 stats 陣列屬性
            let statsData = [];
            const statsStart = attrs.indexOf('stats={');
            if (statsStart !== -1) {
                let bracketCount = 1;
                let i = statsStart + 7;
                let statsStr = '';
                while (i < attrs.length && bracketCount > 0) {
                    const char = attrs[i];
                    if (char === '{') bracketCount++;
                    else if (char === '}') bracketCount--;
                    if (bracketCount > 0) {
                        statsStr += char;
                    }
                    i++;
                }

                try {
                    // 比對以提取 value 與 label
                    const objectRegex = /\{\s*value:\s*['"]([^'"]+)['"]\s*,\s*label:\s*['"]([^'"]+)['"](?:[^}]*)?\}/g;
                    let m;
                    while ((m = objectRegex.exec(statsStr)) !== null) {
                        statsData.push({ value: m[1], label: m[2] });
                    }
                    if (statsData.length === 0) {
                        const objectRegex2 = /\{\s*["']?value["']?\s*:\s*['"]([^'"]+)['"]\s*,\s*["']?label["']?\s*:\s*['"]([^'"]+)['"](?:[^}]*)?\}/g;
                        let m2;
                        while ((m2 = objectRegex2.exec(statsStr)) !== null) {
                            statsData.push({ value: m2[1], label: m2[2] });
                        }
                    }
                } catch (e) {
                    console.error('StatsHighlight parsing error:', e);
                }
            }

            let statsHtml = '';
            if (statsData.length > 0) {
                statsHtml = '<table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 16px;"><tr>';
                const cellWidth = Math.floor(100 / statsData.length);
                for (const stat of statsData) {
                    statsHtml += `
<td style="width: ${cellWidth}%; text-align: center; padding: 12px; vertical-align: top;">
    <div style="font-size: 28px; font-weight: 700; color: ${EMAIL.accent}; margin-bottom: 4px;">${stat.value}</div>
    <div style="font-size: 14px; color: ${EMAIL.text};">${stat.label}</div>
</td>
                    `;
                }
                statsHtml += '</tr></table>';
            }

            return stash(`
<div style="margin: 32px 0; padding: 24px; background-color: ${EMAIL.bg}; border: 1px solid ${EMAIL.line}; border-radius: 12px; text-align: center;">
    ${title ? `<div style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: ${EMAIL.title};">${title}</div>` : ''}
    ${statsHtml}
</div>
            `);
        }
    );

    // 其餘的 MDX 元件是網頁上才能操作的互動內容（components/blog/interactive/），
    // 信件裡沒辦法執行，改放一張卡片帶讀者回網頁版，不要讓那一段憑空消失
    const interactiveCard = () => stash(`
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 28px 0; background-color: ${EMAIL.bg}; border: 1px solid ${EMAIL.line}; border-radius: 12px;">
    <tr>
        <td style="padding: 18px 20px;">
            <div style="font-family: ${EMAIL.mono}; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: ${EMAIL.accent}; margin-bottom: 6px;">${isZh ? '互動內容' : 'Interactive'}</div>
            <div style="font-size: 15px; line-height: 1.7; color: ${EMAIL.text};">
                ${isZh ? '這一段是可以動手操作的互動內容，信件裡無法顯示。' : 'This part is interactive and cannot be shown in an email.'}
                <a href="${articleUrl}" target="_blank" style="color: ${EMAIL.accent}; font-weight: 600; text-decoration: underline; white-space: nowrap;">${isZh ? '到網頁版操作' : 'Try it on the web'}</a>
            </div>
        </td>
    </tr>
</table>
    `);
    html = html.replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*\/>/g, interactiveCard);
    html = html.replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*>[\s\S]*?<\/\1>/g, interactiveCard);

    // 圖片：獨立一行的當成區塊，夾在文字裡的維持行內。要在連結之前處理，否則會被當成連結
    const imageTag = (alt, src, block) =>
        `<img src="${resolveUrl(src)}" alt="${escapeHtml(alt)}" style="display: block; width: 100%; max-width: 100%; height: auto; border: 0; border-radius: 12px;${block ? '' : ' margin: 12px 0;'}" />`;
    html = html.replace(/^[ \t]*!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)[ \t]*$/gm, (match, alt, src) =>
        stash(`<div style="margin: 28px 0;">${imageTag(alt, src, true)}</div>`));
    html = html.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (match, alt, src) => stashInline(imageTag(alt, src, false)));

    // 粗體、斜體和連結（在分割之前）
    html = html.replace(/\*\*(.*?)\*\*/g, `<strong style="color: ${EMAIL.title}; font-weight: 700;">$1</strong>`);
    html = html.replace(/(^|[^*\w])\*([^*\s](?:[^*\n]*[^*\s])?)\*(?![*\w])/gm, '$1<em>$2</em>');
    html = html.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (match, text, href) =>
        `<a href="${resolveUrl(href)}" target="_blank" style="color: ${EMAIL.accent}; text-decoration: underline;">${text}</a>`);

    // 同一行內擠了多個編號項目（例如：1. xxx 2. xxx 3. xxx）時拆成多行。
    // 只處理以編號開頭、而且編號連續的行，標題裡的數字（### 3. xxx）不能動
    html = html.split('\n').map((line) => {
        const first = line.match(/^(\s*)(\d+)\.\s+/);
        if (!first) return line;
        let expected = Number(first[2]) + 1;
        return line.replace(/\s+(\d+)\.\s+(?=\S)/g, (match, number, offset) => {
            if (offset === 0 || Number(number) !== expected) return match;
            expected++;
            return `\n${first[1]}${number}. `;
        });
    }).join('\n');

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
                // 為有序列表添加正確的樣式，確保顯示連續編號
                const listStyle = list.isOrdered
                    ? `margin: 16px 0; padding-left: ${padding}px; list-style-type: decimal;`
                    : `margin: 16px 0; padding-left: ${padding}px;`;
                const listHtml = `<${listTag} style="${listStyle}">${list.items.join('')}</${listTag}>`;

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

    // 字級、行高與顏色由外層儲存格繼承。每一段都重複寫的話，長文會超過 Gmail 約 102KB 的截斷上限
    const paragraphStyle = 'margin: 18px 0;';
    const listItemStyle = 'margin: 8px 0; padding-left: 4px;';
    const isListLine = (text) => /^[\*\-]\s/.test(text) || /^\d+\.\s+/.test(text);
    const isTableLine = (text) => /^\|.*\|$/.test(text);
    const tableCells = (text) => text.replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());

    for (let i = 0; i < lines.length; i++) {
        const originalLine = lines[i];
        const trimmedLine = originalLine.trim();
        const nextLine = i < lines.length - 1 ? lines[i + 1] : '';

        if (!trimmedLine) {
            // 空行：如果下一行不是列表項目，關閉所有列表
            if (!isListLine(nextLine.trim()) && listStack.length > 0) {
                closeListsToLevel(0);
            }
            continue;
        }

        // 先前收起來的區塊，原樣放回
        const blockMatch = trimmedLine.match(/^@@BLOCK_(\d+)@@$/);
        if (blockMatch) {
            closeListsToLevel(0);
            result.push(blocks[Number(blockMatch[1])]);
            continue;
        }

        // 處理標題
        if (trimmedLine.match(/^#### /)) {
            closeListsToLevel(0);
            result.push(`<h4 style="font-size: 17px; font-weight: 700; margin: 28px 0 12px 0; color: ${EMAIL.title}; line-height: 1.5;">${trimmedLine.replace(/^#### /, '')}</h4>`);
            continue;
        }
        if (trimmedLine.match(/^### /)) {
            closeListsToLevel(0);
            result.push(`<h3 style="font-size: 19px; font-weight: 700; margin: 32px 0 14px 0; color: ${EMAIL.title}; line-height: 1.45;">${trimmedLine.replace(/^### /, '')}</h3>`);
            continue;
        }
        if (trimmedLine.match(/^## /)) {
            closeListsToLevel(0);
            result.push(`<h2 style="font-size: 23px; font-weight: 700; margin: 44px 0 16px 0; color: ${EMAIL.title}; line-height: 1.4;">${trimmedLine.replace(/^## /, '')}</h2>`);
            continue;
        }
        if (trimmedLine.match(/^# /)) {
            closeListsToLevel(0);
            result.push(`<h1 style="font-size: 26px; font-weight: 700; margin: 48px 0 20px 0; color: ${EMAIL.title}; line-height: 1.35;">${trimmedLine.replace(/^# /, '')}</h1>`);
            continue;
        }

        // 分隔線
        if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmedLine)) {
            closeListsToLevel(0);
            result.push(`<hr style="border: none; border-top: 1px solid ${EMAIL.line}; margin: 36px 0;">`);
            continue;
        }

        // 引言：連續的 > 行合成一個區塊，中間的空行分段
        if (trimmedLine.startsWith('>')) {
            closeListsToLevel(0);
            const paragraphs = [[]];
            while (i < lines.length && lines[i].trim().startsWith('>')) {
                const content = lines[i].trim().replace(/^>\s?/, '').trim();
                if (content) {
                    paragraphs[paragraphs.length - 1].push(content);
                } else if (paragraphs[paragraphs.length - 1].length > 0) {
                    paragraphs.push([]);
                }
                i++;
            }
            i--;
            const quoteHtml = paragraphs
                .filter((paragraph) => paragraph.length > 0)
                .map((paragraph, index, all) =>
                    `<p style="margin: 0 0 ${index === all.length - 1 ? 0 : 12}px 0; font-size: 17px; line-height: 1.75; color: ${EMAIL.title};">${paragraph.join('<br>')}</p>`)
                .join('');
            result.push(`<blockquote style="margin: 24px 0; padding: 4px 0 4px 18px; border-left: 3px solid ${EMAIL.accent};">${quoteHtml}</blockquote>`);
            continue;
        }

        // 表格：連續的 | 行，第二行是 | --- | 分隔線時第一行當表頭
        if (isTableLine(trimmedLine)) {
            closeListsToLevel(0);
            const rows = [];
            while (i < lines.length && isTableLine(lines[i].trim())) {
                rows.push(tableCells(lines[i].trim()));
                i++;
            }
            i--;
            const hasHeader = rows.length > 1 && rows[1].every((cell) => /^:?-{2,}:?$/.test(cell));
            const bodyRows = hasHeader ? rows.slice(2) : rows;
            const cellStyle = `padding: 12px 14px; border-top: 1px solid ${EMAIL.line}; font-size: 15px; line-height: 1.65; color: ${EMAIL.text}; text-align: left; vertical-align: top;`;
            const headHtml = hasHeader
                ? `<tr>${rows[0].map((cell) => `<th style="padding: 12px 14px; font-size: 14px; font-weight: 700; line-height: 1.5; color: ${EMAIL.title}; text-align: left; vertical-align: top;">${cell}</th>`).join('')}</tr>`
                : '';
            const bodyHtml = bodyRows
                .map((row, rowIndex) => `<tr>${row.map((cell) => `<td style="${!hasHeader && rowIndex === 0 ? cellStyle.replace(`border-top: 1px solid ${EMAIL.line}; `, '') : cellStyle}">${cell}</td>`).join('')}</tr>`)
                .join('');
            result.push(`<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 28px 0; border-collapse: separate; border-spacing: 0; background-color: ${EMAIL.bg}; border: 1px solid ${EMAIL.line}; border-radius: 12px;">${headHtml}${bodyHtml}</table>`);
            continue;
        }

        const indentLevel = getIndentLevel(originalLine);

        // 處理編號列表項目
        const orderedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
        if (orderedMatch) {
            // 只有當堆疊中沒有列表，或者當前層級的列表不是有序列表時，才關閉列表
            if (listStack.length === 0 || listStack[listStack.length - 1].level !== indentLevel || !listStack[listStack.length - 1].isOrdered) {
                closeListsToLevel(indentLevel);
                listStack.push({
                    level: indentLevel,
                    isOrdered: true,
                    items: []
                });
            }

            // 用 value 保留原文的編號：被段落隔開的列表才不會每一段都從 1 開始
            listStack[listStack.length - 1].items.push(`<li value="${orderedMatch[1]}" style="${listItemStyle}">${orderedMatch[2]}</li>`);
            continue;
        }

        // 處理無序列表項目（以 * 或 - 開頭）
        const unorderedMatch = trimmedLine.match(/^[\*\-]\s+(.+)$/);
        if (unorderedMatch) {
            // 只有當堆疊中沒有列表，或者當前層級的列表不是無序列表時，才關閉列表
            if (listStack.length === 0 || listStack[listStack.length - 1].level !== indentLevel || listStack[listStack.length - 1].isOrdered) {
                closeListsToLevel(indentLevel);
                listStack.push({
                    level: indentLevel,
                    isOrdered: false,
                    items: []
                });
            }

            listStack[listStack.length - 1].items.push(`<li style="${listItemStyle}">${unorderedMatch[1]}</li>`);
            continue;
        }

        // 處理普通段落或列表項目的延續內容
        if (listStack.length > 0) {
            // 檢查是否是列表項目的延續（有縮排但不是列表標記）
            if (indentLevel > 0 && !isListLine(trimmedLine)) {
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
        result.push(`<p style="${paragraphStyle}">${trimmedLine}</p>`);
    }

    // 關閉所有剩餘的列表
    closeListsToLevel(0);

    return result.join('\n').replace(/@@INLINE_(\d+)@@/g, (match, index) => inlines[Number(index)]);
}

/**
 * 把 frontmatter 的日期（YYYY-MM-DD）轉成讀者看得懂的寫法
 */
function formatArticleDate(date, isZh) {
    const match = String(date).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (!match) return date || '';
    const [, year, month, day] = match;
    if (isZh) return `${year}.${month.padStart(2, '0')}.${day.padStart(2, '0')}`;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[Number(month) - 1]} ${Number(day)}, ${year}`;
}

/**
 * 取消訂閱連結。帶上收件信箱與語言，讀者點進去不用再打一次
 */
function getUnsubscribeUrl(blogUrl, lang, recipientEmail) {
    const params = new URLSearchParams();
    if (recipientEmail) params.set('email', recipientEmail);
    params.set('lang', lang);
    return `${blogUrl}/unsubscribe?${params.toString()}`;
}

/**
 * 生成電子報 HTML
 * @param {string} recipientEmail - 收件信箱（可省略），用來預填取消訂閱頁
 */
function generateNewsletterHtml(article, slug, lang, blogUrl, recipientEmail) {
    const isZh = lang === 'zh-TW';
    const data = isZh ? article.zh : article.en;
    const meta = data.meta;
    const body = data.body;

    const title = meta.title || '';
    const description = meta.description || '';
    const date = formatArticleDate(meta.date || '', isZh);
    const coverImage = meta.coverImage || '';

    // 生成文章 URL
    const articleUrl = `${blogUrl}/blog/${slug}`;
    const unsubscribeUrl = getUnsubscribeUrl(blogUrl, lang, recipientEmail);

    // 生成封面圖 URL（如果有的話）
    // 圖片存放在 public/blog/ 目錄，可以直接通過 /blog/ 路徑訪問
    const coverImageUrl = coverImage ? `${blogUrl}/blog/${slug}/${coverImage}` : '';

    // AI 自動生成的日報才標示來源，Sun 自己寫的文章不標
    const isAiDaily = !getArticleTypes(article).includes('sun-written');
    const label = isAiDaily ? (isZh ? 'AI 日報' : 'AI Daily') : (isZh ? '電子報' : 'Newsletter');

    // 網頁上的互動內容在信件裡看不到，有的話在開頭先說明
    const interactiveCount = (body.match(/^<(?!BookmarkCard|InsightQuote|Callout|StatsHighlight)[A-Z][A-Za-z0-9]*\b/gm) || []).length;

    // 轉換 Markdown 為 HTML
    const htmlBody = markdownToHtml(body, { lang, blogUrl, slug, articleUrl });

    const eyebrowStyle = `font-family: ${EMAIL.mono}; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: ${EMAIL.text};`;
    const footerLinkStyle = `color: ${EMAIL.text}; text-decoration: underline;`;

    return `
<!DOCTYPE html>
<html lang="${isZh ? 'zh-Hant-TW' : 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark">
    <meta name="supported-color-schemes" content="dark">
    <title>${escapeHtml(title)}</title>
    <style>
        @media only screen and (max-width: 620px) {
            .nl-wrap { padding: 0 !important; }
            .nl-card { border-radius: 0 !important; border-left: 0 !important; border-right: 0 !important; }
            .nl-pad { padding-left: 20px !important; padding-right: 20px !important; }
            .nl-title { font-size: 26px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${EMAIL.bg}; font-family: ${EMAIL.font}; -webkit-text-size-adjust: 100%;">
    <!-- 收件匣預覽文字 -->
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent; mso-hide: all;">${escapeHtml(description)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: ${EMAIL.bg};">
        <tr>
            <td class="nl-wrap" align="center" style="padding: 32px 16px 0 16px;">
                <table role="presentation" class="nl-card" width="600" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; background-color: ${EMAIL.surface}; border: 1px solid ${EMAIL.line}; border-radius: 16px; font-family: ${EMAIL.font};">
                    <!-- Site Header -->
                    <tr>
                        <td class="nl-pad" style="padding: 22px 40px; border-bottom: 1px solid ${EMAIL.line};">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="vertical-align: middle;">
                                        <a href="${blogUrl}/blog" target="_blank" style="text-decoration: none; color: ${EMAIL.title};">
                                            <img src="${blogUrl}/logo.png" width="32" height="32" alt="" style="display: inline-block; vertical-align: middle; width: 32px; height: 32px; border: 0; border-radius: 8px;">
                                            <span style="display: inline-block; vertical-align: middle; padding-left: 8px; font-size: 18px; font-weight: 700; letter-spacing: -0.01em; color: ${EMAIL.title};">Sun</span>
                                        </a>
                                    </td>
                                    <td align="right" style="vertical-align: middle; ${eyebrowStyle}">${label}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Article Header -->
                    <tr>
                        <td class="nl-pad" style="padding: 36px 40px 32px 40px;">
                            ${date ? `<div style="${eyebrowStyle} margin-bottom: 14px;">${date}</div>` : ''}
                            <h1 class="nl-title" style="margin: 0; font-size: 30px; font-weight: 700; line-height: 1.3; letter-spacing: -0.01em; color: ${EMAIL.title};">${title}</h1>
                            ${description ? `<p style="margin: 16px 0 0 0; font-size: 17px; line-height: 1.75; color: ${EMAIL.text};">${description}</p>` : ''}
                            <div style="margin-top: 26px;">
                                ${emailButton(articleUrl, isZh ? '在網站上閱讀' : 'Read on the website')}
                            </div>
                            ${interactiveCount > 0 ? `<p style="margin: 16px 0 0 0; font-size: 14px; line-height: 1.7; color: ${EMAIL.text};">${isZh
                                ? `這篇有 ${interactiveCount} 段可以動手操作的互動內容，只有網頁版看得到。`
                                : `This post has ${interactiveCount} interactive ${interactiveCount === 1 ? 'section' : 'sections'} that only work on the web.`}</p>` : ''}
                        </td>
                    </tr>
                    ${coverImageUrl ? `
                    <!-- Cover Image -->
                    <tr>
                        <td class="nl-pad" style="padding: 0 40px;">
                            <a href="${articleUrl}" target="_blank" style="display: block;">
                                <img src="${coverImageUrl}" alt="${escapeHtml(title)}" width="520" style="display: block; width: 100%; max-width: 100%; height: auto; border: 0; border-radius: 12px;">
                            </a>
                        </td>
                    </tr>
                    ` : ''}
                    <!-- Content -->
                    <tr>
                        <td class="nl-pad" style="padding: 16px 40px 40px 40px; font-size: 16px; line-height: 1.8; color: ${EMAIL.text};">
                            ${htmlBody}
                        </td>
                    </tr>

                    <!-- Closing -->
                    <tr>
                        <td class="nl-pad" style="padding: 32px 40px 36px 40px; border-top: 1px solid ${EMAIL.line};">
                            <p style="margin: 0 0 6px 0; font-size: 19px; font-weight: 700; line-height: 1.4; color: ${EMAIL.title};">${isZh ? '讀完了，想聊聊？' : 'Finished reading?'}</p>
                            <p style="margin: 0 0 22px 0; font-size: 15px; line-height: 1.7; color: ${EMAIL.text};">${isZh ? '網頁版可以留言，也方便分享給朋友。' : 'Leave a comment or share the post from the web version.'}</p>
                            ${emailButton(articleUrl, isZh ? '打開網頁版' : 'Open the web version')}
                        </td>
                    </tr>
                </table>

                <!-- Footer -->
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; font-family: ${EMAIL.font};">
                    <tr>
                        <td class="nl-pad" style="padding: 28px 24px 40px 24px; text-align: center; font-size: 13px; line-height: 1.8; color: ${EMAIL.text};">
                            ${isZh ? '你會收到這封信，是因為你訂閱了 Sun 的電子報。' : "You are receiving this email because you subscribed to Sun's newsletter."}
                            ${isAiDaily ? `<br>${isZh ? '這是由 AI 自動生成的每日日報。' : 'This is an AI-generated daily report.'}` : ''}
                            <br>
                            <a href="${unsubscribeUrl}" target="_blank" style="${footerLinkStyle}">${isZh ? '取消訂閱' : 'Unsubscribe'}</a>
                            <span style="padding: 0 8px;">·</span>
                            <a href="${blogUrl}/blog" target="_blank" style="${footerLinkStyle}">${isZh ? '所有文章' : 'All posts'}</a>
                            <span style="padding: 0 8px;">·</span>
                            <a href="${blogUrl}" target="_blank" style="${footerLinkStyle}">${isZh ? 'Sun 的網站' : "Sun's website"}</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}

/**
 * 純文字版本：給不顯示 HTML 的信箱，也讓垃圾信過濾器看到與 HTML 相符的內容
 */
function generateNewsletterText(article, slug, lang, blogUrl, recipientEmail) {
    const isZh = lang === 'zh-TW';
    const meta = (isZh ? article.zh : article.en).meta;
    return [
        meta.title || '',
        meta.description || '',
        `${isZh ? '在網站上閱讀：' : 'Read on the website: '}${blogUrl}/blog/${slug}`,
        `${isZh ? '取消訂閱：' : 'Unsubscribe: '}${getUnsubscribeUrl(blogUrl, lang, recipientEmail)}`
    ].filter(Boolean).join('\n\n');
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

    // 檢查今天是否已經發送過電子報（避免重複發送）
    // 通過檢查訂閱者的 LastArticleSent 欄位來判斷
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 格式

    console.log(`🔍 Checking if newsletter was already sent today (${today})...`);

    // 提前讀取訂閱列表來檢查是否已經發送過
    const subscriptionsForCheck = await getSubscriptionsFromGoogleSheets();
    const verifiedSubscribers = subscriptionsForCheck.filter(sub => sub.verified);
    const todayRecipients = verifiedSubscribers.filter(sub =>
        sub.lastArticleSent && sub.lastArticleSent.startsWith(today)
    );

    console.log(`   Total verified subscribers: ${verifiedSubscribers.length}`);
    console.log(`   Subscribers who received today's newsletter: ${todayRecipients.length}`);

    // 如果今天已經發送給大部分訂閱者（>80%），則跳過發送
    if (verifiedSubscribers.length > 0 && todayRecipients.length / verifiedSubscribers.length > 0.8) {
        console.log(`⚠️  Newsletter appears to have been sent today (${today}). Skipping to prevent duplicates.`);
        console.log(`   ${todayRecipients.length}/${verifiedSubscribers.length} subscribers already received today's newsletter.`);
        console.log('   This prevents sending multiple newsletters per day.');
        return;
    }

    console.log('✅ No previous newsletter detected for today. Proceeding with sending.');

    console.log(`\n📧 Sending newsletter for article: ${slug}...`);
    console.log(`📡 Google Apps Script URL: ${process.env.GOOGLE_APPS_SCRIPT_URL || 'NOT SET'}`);

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

        // 檢查是否已經發送過這篇文章
        if (subscription.lastArticleSent === slug) {
            // 使用遮罩的 Email 記錄日誌（安全措施）
            const maskedEmail = subscription.email.substring(0, 3) + '***@' + subscription.email.split('@')[1];
            console.log(`   Skipping ${maskedEmail} (already received this article: ${slug})`);
            continue;
        }

        try {
            const requestedLang = subscription.lang || 'zh-TW';
            const lang = resolveArticleLanguage(article, requestedLang);
            const data = lang === 'zh-TW' ? article.zh : article.en;

            if (lang !== requestedLang) {
                console.log(`   ℹ️  ${requestedLang} version is unavailable. Sending the ${lang} version instead.`);
            }

            const meta = data.meta;

            // 生成 HTML 電子報（帶上收件信箱，取消訂閱頁才能預填）
            const htmlContent = generateNewsletterHtml(article, slug, lang, blogUrl, subscription.email);
            if (Buffer.byteLength(htmlContent, 'utf8') > GMAIL_CLIP_BYTES) {
                console.warn(`   ⚠️  Newsletter HTML is over ${GMAIL_CLIP_BYTES} bytes. Gmail will clip the message and hide the footer.`);
            }

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
                text: generateNewsletterText(article, slug, lang, blogUrl, subscription.email),
                // 讓 Gmail 等信箱在寄件者旁邊顯示內建的「取消訂閱」
                list: {
                    unsubscribe: {
                        url: getUnsubscribeUrl(blogUrl, lang, subscription.email),
                        comment: lang === 'zh-TW' ? '取消訂閱' : 'Unsubscribe'
                    }
                }
            };

            // 發送郵件
            await transporter.sendMail(mailOptions);

            // 發送成功後，更新用戶的 LastArticleSent 欄位
            try {
                console.log(`   🔄 Updating LastArticleSent for ${subscription.email} with slug: ${slug}`);
                console.log(`   📡 Using Google Apps Script URL: ${process.env.GOOGLE_APPS_SCRIPT_URL}`);
                await updateLastArticleSent(subscription.email, slug, lang);
                console.log(`   ✅ LastArticleSent updated successfully for ${subscription.email}`);
            } catch (updateError) {
                console.error(`   ❌ CRITICAL: Failed to update LastArticleSent for ${subscription.email}:`, updateError.message);
                console.error(`   📡 GOOGLE_APPS_SCRIPT_URL: ${process.env.GOOGLE_APPS_SCRIPT_URL || 'NOT SET'}`);
                console.error(`   ⚠️  WARNING: Duplicate prevention may not work for this subscriber!`);
                console.error(`   💡 Consider checking:`);
                console.error(`      1. Google Apps Script URL is correct`);
                console.error(`      2. GAS script is deployed and has proper permissions`);
                console.error(`      3. Spreadsheet has LastArticleSent column (8th column)`);
                console.error(`   Full error:`, updateError);

                // 不要因為更新失敗而中斷發送，但記錄警告
                errorCount++; // 將此計為錯誤，因為重複發送防護失效
            }

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

    // 如果成功發送了電子報，記錄發送狀態（保留舊的日誌格式）
    if (sentCount > 0) {
        try {
            const timestamp = new Date().toISOString();
            const sentLogPath = path.join(__dirname, 'newsletter-sent.log');
            const logEntry = `${today} ${timestamp} ${slug} sent:${sentCount} errors:${errorCount}\n`;
            fs.appendFileSync(sentLogPath, logEntry);
            console.log(`   📝 Newsletter send status recorded for ${today}`);
        } catch (error) {
            console.warn('⚠️  Could not record newsletter send status:', error.message);
        }
    }
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
        console.warn(`⚠️  Could not read success marker for ${slug}:`, error.message);
        return false;
    }
}

/**
 * 檢查今天是否已經發送過電子報
 * @param {string} dateStr - 日期字串 (YYYY-MM-DD)
 * @returns {boolean} 如果今天已經發送過則返回 true
 */
function hasNewsletterBeenSentToday(dateStr) {
    const sentLogPath = path.join(__dirname, 'newsletter-sent.log');

    try {
        if (!fs.existsSync(sentLogPath)) {
            return false; // 日誌文件不存在，表示從未發送過
        }

        const logContent = fs.readFileSync(sentLogPath, 'utf8');
        const lines = logContent.trim().split('\n');

        // 檢查是否有今天日期的發送記錄
        return lines.some(line => line.startsWith(dateStr + ' '));
    } catch (error) {
        console.warn(`⚠️  Could not check newsletter sent log:`, error.message);
        return false; // 出錯時假設沒有發送過，避免阻止發送
    }
}

// 主函數
async function main() {
    const dateInfo = getDateInfo();
    const { dateStr } = dateInfo;

    // 檢查是否為測試模式
    const isTestMode = process.argv.includes('--test') || process.argv.includes('--force');
    const specifiedSlug = process.argv.find(arg => arg.startsWith('--slug='))?.split('=')[1];

    console.log('=== Newsletter Sender ===');
    console.log(`Date: ${dateStr}`);
    if (isTestMode) {
        console.log('🔧 Test mode enabled - bypassing generation marker check');
    }

    let slug = specifiedSlug;

    if (!slug) {
        // 查找今天日期的最新文章
        slug = findLatestArticleForToday(dateStr);

        if (!slug) {
            console.log(`ℹ️  No article found for date ${dateStr}. This is normal if AI Daily Report hasn't run yet.`);
            console.log('   Skipping newsletter sending.');
            process.exit(0);
        }
    }

    console.log(`Article slug: ${slug}`);

    // 檢查文章是否存在
    const postFolder = path.join(blogDir, slug);
    if (!fs.existsSync(path.join(postFolder, 'article.zh-TW.mdx')) &&
        !fs.existsSync(path.join(postFolder, 'article.en.mdx'))) {
        console.error(`❌ Error: No article files found for slug: ${slug}`);
        process.exit(1);
    }

    // 檢查文章是否成功生成（有成功標記文件）- 測試模式下跳過此檢查
    if (!isTestMode) {
        const isSuccessfullyGenerated = isArticleSuccessfullyGenerated(slug);
        if (!isSuccessfullyGenerated) {
            console.log(`⚠️  Article found but generation was not successful (no success marker).`);
            console.log('   This means the AI Daily Report process ran but failed to complete properly.');
            console.log('   Skipping newsletter sending to avoid sending incomplete content.');
            process.exit(0);
        }

        console.log(`✅ Article generation marker verified. Proceeding with newsletter sending.`);
    } else {
        console.log(`🔧 Test mode: Skipping generation marker check.`);
    }

    // 檢查今天是否已經發送過電子報 - 測試模式下跳過此檢查
    if (!isTestMode) {
        const hasAlreadySent = hasNewsletterBeenSentToday(dateStr);
        if (hasAlreadySent) {
            console.log(`ℹ️  Newsletter for ${dateStr} has already been sent today.`);
            console.log('   Skipping duplicate newsletter sending.');
            process.exit(0);
        }
    } else {
        console.log(`🔧 Test mode: Skipping duplicate send check.`);
    }

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
    resolveArticleLanguage,
    generateNewsletterHtml,
    generateNewsletterText,
    markdownToHtml,
    updateLastArticleSent
};
