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
 * 將 Markdown 轉換為 HTML（改進版本，支持嵌套列表和 BookmarkCard 組件）
 */
function markdownToHtml(markdown) {
    let html = markdown;

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

            // 處理相對路徑圖片
            const blogUrl = process.env.BLOG_URL || 'https://sunzhi-will.github.io';
            let imageHtml = '';
            if (thumbnail) {
                const thumbnailUrl = thumbnail.startsWith('http') ? thumbnail : `${blogUrl}${thumbnail}`;
                imageHtml = `
<td style="width: 140px; padding-left: 20px; vertical-align: middle;">
    <img src="${thumbnailUrl}" alt="" style="width: 140px; height: 100px; object-fit: cover; border-radius: 6px; display: block;" />
</td>
                `;
            }

            let iconHtml = '';
            if (icon) {
                const iconUrl = icon.startsWith('http') ? icon : `${blogUrl}${icon}`;
                iconHtml = `<img src="${iconUrl}" alt="" style="width: 16px; height: 16px; border-radius: 50%; display: inline-block; vertical-align: middle; margin-right: 6px;" />`;
            }

            let hostname = '';
            try {
                hostname = new URL(href).hostname;
            } catch (e) {
                hostname = href;
            }

            return `
<div style="margin: 24px 0; padding: 20px; background-color: #202023; border: 1px solid #3f3f46; border-radius: 8px;">
    <a href="${href}" style="text-decoration: none; color: inherit; display: block;" target="_blank" rel="noopener noreferrer">
        <table role="presentation" style="width: 100%; border-collapse: collapse; border: none;">
            <tr>
                <td style="vertical-align: top;">
                    <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #e8e8e8; line-height: 1.4;">${title}</div>
                    <div style="font-size: 14px; margin-bottom: 12px; color: #a1a1aa; line-height: 1.5;">${description}</div>
                    <div style="font-size: 12px; color: #71717a;">
                        ${iconHtml}
                        <span style="vertical-align: middle;">${hostname}</span>
                    </div>
                </td>
                ${imageHtml}
            </tr>
        </table>
    </a>
</div>
            `.trim();
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
                    insight: { icon: '🔍', title: '內行人的深度點評', bgColor: '#202023', borderColor: '#2d2d30', textColor: '#d4d4d4' },
                    experience: { icon: '💭', title: '我的親身體驗', bgColor: '#142b1b', borderColor: '#1e3f20', textColor: '#a7f3d0' },
                    warning: { icon: '⚠️', title: '重要提醒', bgColor: '#2e2916', borderColor: '#4a3f1a', textColor: '#fef08a' },
                    tip: { icon: '💡', title: '實用技巧', bgColor: '#2e2916', borderColor: '#4a3f1a', textColor: '#fef08a' }
                };
                return configs[type] || configs.insight;
            };

            const config = getTypeConfig(type);
            const authorHtml = author ? `<div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid ${config.borderColor}; font-size: 13px; color: #999999;">${author}${role ? ` • ${role}` : ''}</div>` : '';

            return `
<div style="margin: 32px 0; padding: 24px; background-color: ${config.bgColor}; border: 1px solid ${config.borderColor}; border-radius: 8px;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="vertical-align: top; width: 48px; padding-right: 16px;">
                <div style="width: 48px; height: 48px; border-radius: 50%; background-color: #27272a; display: flex; align-items: center; justify-content: center; font-size: 24px; text-align: center; line-height: 48px;">
                    ${config.icon}
                </div>
            </td>
            <td style="vertical-align: top;">
                <div style="font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #e8e8e8;">
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
            `.trim();
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
                    info: { icon: 'ℹ️', title: '資訊', bgColor: '#202023', borderColor: '#2d2d30', textColor: '#d4d4d4' },
                    success: { icon: '✅', title: '成功', bgColor: '#142b1b', borderColor: '#1e3f20', textColor: '#a7f3d0' },
                    warning: { icon: '⚠️', title: '警告', bgColor: '#2e2916', borderColor: '#4a3f1a', textColor: '#fef08a' },
                    error: { icon: '❌', title: '錯誤', bgColor: '#2d1919', borderColor: '#4a1e1e', textColor: '#fecaca' },
                    tip: { icon: '💡', title: '提示', bgColor: '#2e2916', borderColor: '#4a3f1a', textColor: '#fef08a' }
                };
                return configs[type] || configs.info;
            };

            const config = getTypeConfig(type);
            const titleHtml = title ? `<div style="font-weight: 600; margin-bottom: 8px; color: #e8e8e8;">${config.icon} ${title}</div>` : '';

            return `
<div style="margin: 24px 0; padding: 16px 20px; background-color: ${config.bgColor}; border: 1px solid ${config.borderColor}; border-radius: 8px;">
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
            `.trim();
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
    <div style="font-size: 28px; font-weight: 700; color: #c084fc; margin-bottom: 4px;">${stat.value}</div>
    <div style="font-size: 14px; color: #a1a1aa;">${stat.label}</div>
</td>
                    `;
                }
                statsHtml += '</tr></table>';
            } else {
                statsHtml = '<div style="font-size: 15px; color: #a1a1aa; text-align: center; padding: 12px;">統計數據</div>';
            }

            return `
<div style="margin: 32px 0; padding: 24px; background-color: #0a0a0a; border: 1px solid #333333; border-radius: 8px; text-align: center;">
    ${title ? `<div style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #e8e8e8;">${title}</div>` : ''}
    ${statsHtml}
</div>
            `.trim();
        }
    );

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
                // 為有序列表添加正確的樣式，確保顯示連續編號
                const listStyle = list.isOrdered
                    ? `margin: 12px 0; padding-left: ${padding}px; line-height: 1.7; list-style-type: decimal; counter-reset: item;`
                    : `margin: 12px 0; padding-left: ${padding}px; line-height: 1.7;`;
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
            // 只有當堆疊中沒有列表，或者當前層級的列表不是有序列表時，才關閉列表
            if (listStack.length === 0 || listStack[listStack.length - 1].level !== indentLevel || !listStack[listStack.length - 1].isOrdered) {
                closeListsToLevel(indentLevel);
                listStack.push({
                    level: indentLevel,
                    isOrdered: true,
                    items: []
                });
            }

            const listContent = orderedMatch[2];
            listStack[listStack.length - 1].items.push(`<li style="margin: 12px 0; color: #d4d4d4; line-height: 1.8; padding-left: 4px; display: list-item;">${listContent}</li>`);
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

            const listContent = unorderedMatch[1];
            listStack[listStack.length - 1].items.push(`<li style="margin: 12px 0; color: #d4d4d4; line-height: 1.8; padding-left: 4px;">${listContent}</li>`);
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
    const coverImage = meta.coverImage || '';

    // 生成文章 URL
    const articleUrl = `${blogUrl}/blog/${slug}`;

    // 生成封面圖 URL（如果有的話）
    // 圖片存放在 public/blog/ 目錄，可以直接通過 /blog/ 路徑訪問
    const coverImageUrl = coverImage ? `${blogUrl}/blog/${slug}/${coverImage}` : '';

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
                <!-- Site Header -->
                <div style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); padding: 25px 30px; border-bottom: 1px solid #333333;">
                    <div style="display: table; width: 100%;">
                        <div style="display: table-cell; vertical-align: middle;">
                            <div style="display: inline-block; vertical-align: middle;">
                                <h2 style="color: #e8e8e8; margin: 0; font-size: 20px; font-weight: 600; text-shadow: 0 1px 3px rgba(192, 192, 192, 0.2);">
                                    ${isZh ? 'Sun 的技術分享' : "Sun's Tech Blog"}
                                </h2>
                                <p style="color: #c0c0c0; margin: 0; font-size: 12px; opacity: 0.8;">
                                    ${isZh ? 'AI 與區塊鏈技術探索' : 'AI & Blockchain Technology Exploration'}
                                </p>
                            </div>
                        </div>
                        <div style="display: table-cell; text-align: right; vertical-align: middle;">
                            <a href="${articleUrl}" style="color: #c0c0c0; text-decoration: none; font-size: 12px; padding: 6px 12px; border: 1px solid #333333; border-radius: 4px; transition: all 0.2s;">
                                ${isZh ? '閱讀全文' : 'Read More'}
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Article Header -->
                <div style="background-color: #0a0a0a; padding: 30px 30px; border-bottom: 1px solid #333333;">
                    <h1 style="color: #e8e8e8; margin-top: 0; margin-bottom: 10px; font-size: 26px; font-weight: 700; text-shadow: 0 2px 8px rgba(192, 192, 192, 0.3); line-height: 1.3;">${title}</h1>
                    <p style="color: #c0c0c0; font-size: 14px; margin: 0;">${date}</p>
                </div>
                
                ${coverImageUrl ? `
                <!-- Cover Image -->
                <div style="width: 100%; overflow: hidden; background-color: #0a0a0a;">
                    <img src="${coverImageUrl}" alt="${title}" style="width: 100%; height: auto; display: block; border: none;">
                </div>
                ` : ''}
                
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
                    <p style="color: #999999; font-size: 12px; text-align: center; margin: 0 0 15px 0; line-height: 1.6;">
                        ${isZh ? '這是由 AI 自動生成的每日日報。' : 'This is an AI-generated daily report.'}
                    </p>
                    <p style="color: #666666; font-size: 11px; text-align: center; margin: 0; line-height: 1.5;">
                        <a href="${blogUrl}/unsubscribe" style="color: #888888; text-decoration: underline; transition: color 0.2s;">
                            ${isZh ? '取消訂閱' : 'Unsubscribe'}
                        </a>
                        <span style="color: #666666; margin: 0 8px;">|</span>
                        <a href="${blogUrl}" style="color: #888888; text-decoration: underline; transition: color 0.2s;">
                            ${isZh ? 'Sun 的網站' : "Sun's Website"}
                        </a>
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
    if (!fs.existsSync(path.join(postFolder, 'article.zh-TW.mdx')) ||
        !fs.existsSync(path.join(postFolder, 'article.en.mdx'))) {
        console.error(`❌ Error: Article files not found for slug: ${slug}`);
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
    generateNewsletterHtml,
    updateLastArticleSent
};
