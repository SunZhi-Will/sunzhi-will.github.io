/**
 * Google Apps Script 範例代碼
 * 
 * 將此代碼複製到 Google Apps Script 編輯器中
 * 部署為 Web App，允許任何人訪問
 * 
 * 試算表格式：
 * - A1: Email
 * - B1: Types (訂閱類型，用逗號分隔)
 * - C1: Lang (語言偏好)
 * - D1: SubscribedAt (訂閱時間)
 * - E1: Verified (是否驗證，TRUE/FALSE)
 * - F1: VerifyToken (驗證 token)
 * 
 * 環境變數設置（在 Google Apps Script 專案設置中）：
 * - BLOG_URL: 部落格網址（例如：https://sunzhi-will.github.io）
 * - SENDER_NAME: 寄件者名稱（例如：AI Daily Report 或 電子報系統）
 * - REPLY_TO: 回覆地址（可選，例如：noreply@yourdomain.com）
 */

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

// 生成隨機驗證 token（使用更安全的方法）
function generateVerifyToken() {
    // 使用 Utilities.getRandomString 生成更安全的隨機字符串
    // 如果失敗，回退到原方法
    try {
        return Utilities.getRandomString(32);
    } catch (error) {
        // 備用方法：使用時間戳 + 隨機字符
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const timestamp = Date.now().toString(36);
        let randomPart = '';
        for (let i = 0; i < 32 - timestamp.length; i++) {
            randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return timestamp + randomPart;
    }
}

// 獲取寄件者名稱（根據語言和訂閱類型）
function getSenderName(lang, types) {
    // 根據訂閱類型和語言返回對應的寄件者名稱
    // 注意：這裡是驗證郵件，所以根據用戶訂閱的類型來決定
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

    // 如果訂閱了 'all'，使用預設名稱；否則使用第一個訂閱類型
    if (types.includes('all') || types.length === 0) {
        return lang === 'zh-TW' ? 'Sun 的電子報' : "Sun's Newsletter";
    }

    // 使用第一個訂閱類型
    const primaryType = types[0];
    return senderNames[lang]?.[primaryType] || (lang === 'zh-TW' ? 'Sun 的電子報' : "Sun's Newsletter");
}

// 發送驗證郵件
function sendVerificationEmail(email, token, lang, blogUrl, types) {
    try {
        const isZh = lang === 'zh-TW';
        // 帶上語言，驗證頁一打開就是訂閱時選的語言
        const verifyUrl = `${blogUrl}/verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}&lang=${encodeURIComponent(lang)}`;

        // 獲取寄件者名稱（品牌名稱）
        const senderName = getSenderName(lang, types || ['all']);

        const copy = isZh
            ? {
                subject: '確認訂閱 Sun 的電子報',
                preheader: '點一下按鈕就完成訂閱，連結 7 天內有效。',
                label: '電子報',
                title: '還差一步，確認你的信箱',
                body: '點下面的按鈕完成訂閱，之後有新文章就會寄到這個信箱。',
                button: '確認訂閱',
                fallback: '按鈕打不開的話，把這段網址貼到瀏覽器：',
                expiry: '這個連結 7 天內有效。',
                ignore: '如果你沒有訂閱，直接忽略這封信就好，之後不會收到任何信件。',
                text: `還差一步，確認你的信箱。\n\n打開下面的連結完成訂閱，之後有新文章就會寄到這個信箱：\n${verifyUrl}\n\n這個連結 7 天內有效。\n\n如果你沒有訂閱，直接忽略這封信就好。`
            }
            : {
                subject: "Confirm your subscription to Sun's newsletter",
                preheader: 'One click to finish subscribing. The link is valid for 7 days.',
                label: 'Newsletter',
                title: 'One more step: confirm your email',
                body: 'Click the button below to finish subscribing. New posts will be sent to this address.',
                button: 'Confirm subscription',
                fallback: 'If the button does not work, paste this address into your browser:',
                expiry: 'This link is valid for 7 days.',
                ignore: 'If you did not subscribe, simply ignore this email and you will not hear from us again.',
                text: `One more step: confirm your email.\n\nOpen the link below to finish subscribing. New posts will be sent to this address:\n${verifyUrl}\n\nThis link is valid for 7 days.\n\nIf you did not subscribe, simply ignore this email.`
            };

        const subject = copy.subject;

        // 純文字版本（作為備用）
        const textBody = copy.text;

        // 顏色與字體對齊網站的深色版面與 scripts/send-newsletter.js 的電子報樣板：
        // 黑底上不用灰色文字，強調色只有黃色
        const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'PingFang TC', 'Microsoft JhengHei', sans-serif";
        const mono = "'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', monospace";

        const htmlBody = `
<!DOCTYPE html>
<html lang="${isZh ? 'zh-Hant-TW' : 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark">
    <meta name="supported-color-schemes" content="dark">
    <title>${copy.subject}</title>
    <style>
        @media only screen and (max-width: 620px) {
            .nl-wrap { padding: 0 !important; }
            .nl-card { border-radius: 0 !important; border-left: 0 !important; border-right: 0 !important; }
            .nl-pad { padding-left: 20px !important; padding-right: 20px !important; }
            .nl-title { font-size: 24px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: ${font}; -webkit-text-size-adjust: 100%;">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent; mso-hide: all;">${copy.preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #0a0a0a;">
        <tr>
            <td class="nl-wrap" align="center" style="padding: 32px 16px 0 16px;">
                <table role="presentation" class="nl-card" width="560" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 560px; background-color: #111113; border: 1px solid #27272a; border-radius: 16px; font-family: ${font};">
                    <!-- Header -->
                    <tr>
                        <td class="nl-pad" style="padding: 22px 40px; border-bottom: 1px solid #27272a;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="vertical-align: middle;">
                                        <a href="${blogUrl}/blog" target="_blank" style="text-decoration: none; color: #ffffff;">
                                            <img src="${blogUrl}/logo.png" width="32" height="32" alt="" style="display: inline-block; vertical-align: middle; width: 32px; height: 32px; border: 0; border-radius: 8px;">
                                            <span style="display: inline-block; vertical-align: middle; padding-left: 8px; font-size: 18px; font-weight: 700; color: #ffffff;">Sun</span>
                                        </a>
                                    </td>
                                    <td align="right" style="vertical-align: middle; font-family: ${mono}; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #e4e4e7;">${copy.label}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td class="nl-pad" style="padding: 40px 40px 36px 40px;">
                            <h1 class="nl-title" style="margin: 0; font-size: 28px; font-weight: 700; line-height: 1.3; color: #ffffff;">${copy.title}</h1>
                            <p style="margin: 16px 0 28px 0; font-size: 17px; line-height: 1.75; color: #e4e4e7;">${copy.body}</p>

                            <!-- Verify Button -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="border-radius: 999px; background-color: #facc15;">
                                        <a href="${verifyUrl}" target="_blank" style="display: inline-block; padding: 16px 32px; font-family: ${font}; font-size: 17px; font-weight: 700; line-height: 1; color: #0a0a0a; text-decoration: none; border-radius: 999px;">${copy.button}</a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 20px 0 0 0; font-size: 14px; line-height: 1.7; color: #e4e4e7;">${copy.expiry}</p>
                        </td>
                    </tr>

                    <!-- Alternative Link -->
                    <tr>
                        <td class="nl-pad" style="padding: 24px 40px 28px 40px; border-top: 1px solid #27272a;">
                            <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.7; color: #e4e4e7;">${copy.fallback}</p>
                            <p style="margin: 0; padding: 12px 14px; background-color: #0a0a0a; border: 1px solid #27272a; border-radius: 10px; font-family: ${mono}; font-size: 12px; line-height: 1.6; color: #ffffff; word-break: break-all;">${verifyUrl}</p>
                        </td>
                    </tr>
                </table>

                <!-- Footer -->
                <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 560px; font-family: ${font};">
                    <tr>
                        <td class="nl-pad" style="padding: 28px 24px 40px 24px; text-align: center; font-size: 13px; line-height: 1.8; color: #e4e4e7;">
                            ${copy.ignore}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
      `;

        // 獲取回覆地址（可選，從環境變數讀取）
        const replyTo = PropertiesService.getScriptProperties().getProperty('REPLY_TO') || '';

        // 使用 MailApp 發送郵件
        // 注意：MailApp 無法更改實際的寄件地址，但可以設置寄件者名稱和回覆地址
        const emailOptions = {
            to: email,
            subject: subject,
            body: textBody,
            htmlBody: htmlBody,
            name: senderName // 動態設置寄件者名稱
        };

        // 如果設置了回覆地址，添加回覆地址
        if (replyTo) {
            emailOptions.replyTo = replyTo;
        }

        MailApp.sendEmail(emailOptions);

        // 使用遮罩的 Email 記錄日誌（安全措施）
        const maskedEmail = email.substring(0, 3) + '***@' + email.split('@')[1];
        Logger.log('✅ Verification email sent successfully to: ' + maskedEmail);
        return true;

    } catch (error) {
        // 使用遮罩的 Email 記錄日誌（安全措施）
        const maskedEmail = email ? (email.substring(0, 3) + '***@' + email.split('@')[1]) : 'unknown';
        Logger.log('❌ Failed to send verification email to ' + maskedEmail);
        Logger.log('Error: ' + error.toString());
        Logger.log('Error stack: ' + (error.stack || 'No stack trace'));

        // 如果是授權錯誤，提供更詳細的訊息
        if (error.toString().includes('permission') || error.toString().includes('authorization')) {
            Logger.log('⚠️ Authorization required! Please run the script once manually to authorize.');
        }

        return false;
    }
}

function doPost(e) {
    try {
        // 簡單的來源驗證（檢查 Referer，可選）
        // 注意：Referer 可能被偽造，但可以過濾大部分無效請求
        const referer = e.parameter.referer || '';
        const allowedOrigins = [
            'sunzhi-will.github.io',
            'localhost:3000' // 僅開發環境
        ];

        // 如果提供了 referer，進行驗證（但不強制，因為可能被偽造）
        if (referer && !allowedOrigins.some(origin => referer.includes(origin))) {
            Logger.log('⚠️ Request from unauthorized origin: ' + referer.substring(0, 50));
            // 不直接拒絕，因為 Referer 可能被瀏覽器阻止
        }

        // 檢查請求大小（防止 DoS）
        if (e.postData && e.postData.contents && e.postData.contents.length > 10000) {
            return ContentService.createTextOutput(
                JSON.stringify({
                    success: false,
                    message: 'Request too large'
                })
            ).setMimeType(ContentService.MimeType.JSON);
        }

        // 解析請求資料（支援 JSON 和表單編碼）
        let data;

        // 優先檢查 e.parameter（表單編碼數據）
        if (e.parameter && e.parameter.email) {
            // 表單編碼格式
            const typesParam = e.parameter.types || '';
            const action = e.parameter.action || 'subscribe';
            data = {
                email: e.parameter.email,
                types: typesParam ? (typesParam.includes(',') ? typesParam.split(',') : [typesParam]) : [],
                lang: e.parameter.lang || 'zh-TW',
                action: action
            };
        } else if (e.postData && e.postData.contents) {
            // 嘗試解析 JSON（支援 application/json 和 text/plain）
            try {
                const content = e.postData.contents;
                // 首先嘗試解析為 JSON
                data = JSON.parse(content);
                // 如果 types 是數組，保持原樣；如果是字符串，轉換為數組
                if (data.types && typeof data.types === 'string') {
                    data.types = [data.types];
                }
            } catch (jsonError) {
                // JSON 解析失敗，嘗試解析為表單編碼數據
                try {
                    const formData = content.split('&').reduce((acc, pair) => {
                        const [key, value] = pair.split('=');
                        acc[decodeURIComponent(key)] = decodeURIComponent(value || '');
                        return acc;
                    }, {});

                    data = {
                        email: formData.email,
                        types: formData.types ? (formData.types.includes(',') ? formData.types.split(',') : [formData.types]) : [],
                        lang: formData.lang || 'zh-TW',
                        action: formData.action || 'subscribe'
                    };
                } catch (formError) {
                    // 表單編碼解析也失敗，返回錯誤
                    return ContentService.createTextOutput(
                        JSON.stringify({
                            success: false,
                            message: 'Invalid request format. Expected JSON or form-encoded data.'
                        })
                    ).setMimeType(ContentService.MimeType.JSON);
                }
            }
        } else {
            // 沒有數據
            return ContentService.createTextOutput(
                JSON.stringify({
                    success: false,
                    message: 'No data received'
                })
            ).setMimeType(ContentService.MimeType.JSON);
        }

        // 正規化 Email（處理 Gmail 的 + 別名）
        const email = normalizeEmail(data.email);

        // 全局速率限制（防止多 Email 攻擊）
        const now = Date.now();
        const globalRateLimitKey = 'global_rate_limit';
        const globalLastRequest = PropertiesService.getScriptProperties().getProperty(globalRateLimitKey);
        const globalRequestCountKey = 'global_request_count';

        // 如果在一分鐘內，檢查請求計數
        if (globalLastRequest && (now - parseInt(globalLastRequest)) < 60000) {
            const requestCount = parseInt(PropertiesService.getScriptProperties().getProperty(globalRequestCountKey) || '0');
            // 限制每分鐘最多 20 個請求（全局）
            if (requestCount >= 20) {
                Logger.log('⚠️ Global rate limit exceeded: ' + requestCount + ' requests in the last minute');
                return ContentService.createTextOutput(
                    JSON.stringify({
                        success: false,
                        message: 'Too many requests. Please try again later.'
                    })
                ).setMimeType(ContentService.MimeType.JSON);
            }
            // 增加計數
            PropertiesService.getScriptProperties().setProperty(globalRequestCountKey, (requestCount + 1).toString());
        } else {
            // 重置計數器（新的一分鐘）
            PropertiesService.getScriptProperties().setProperty(globalRateLimitKey, now.toString());
            PropertiesService.getScriptProperties().setProperty(globalRequestCountKey, '1');
        }

        // 每個 Email 的速率限制檢查（防止單個 Email 濫用）
        if (email) {
            const rateLimitKey = 'rate_limit_' + email;
            const lastRequest = PropertiesService.getScriptProperties().getProperty(rateLimitKey);

            // 限制每個 Email 每 60 秒只能提交一次
            if (lastRequest && (now - parseInt(lastRequest)) < 60000) {
                return ContentService.createTextOutput(
                    JSON.stringify({
                        success: false,
                        message: 'Please wait before submitting again. Rate limit: 1 request per minute per email.'
                    })
                ).setMimeType(ContentService.MimeType.JSON);
            }

            PropertiesService.getScriptProperties().setProperty(rateLimitKey, now.toString());
        }
        const types = Array.isArray(data.types) ? data.types : (data.types ? [data.types] : []);
        const lang = data.lang || 'zh-TW';
        const action = data.action || 'subscribe';

        // 驗證 Email 格式
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return ContentService.createTextOutput(
                JSON.stringify({ success: false, message: 'Invalid email address' })
            ).setMimeType(ContentService.MimeType.JSON);
        }

        // 處理取消訂閱請求
        if (action === 'unsubscribe') {
            return handleUnsubscribe(email, lang);
        }

        // 處理更新最後文章請求
        if (action === 'update_last_article') {
            return handleUpdateLastArticle(email, data.article_slug, lang);
        }

        // 驗證訂閱類型
        if (!types || types.length === 0) {
            return ContentService.createTextOutput(
                JSON.stringify({ success: false, message: 'At least one subscription type is required' })
            ).setMimeType(ContentService.MimeType.JSON);
        }

        // 訂閱類型白名單驗證
        const allowedTypes = ['all', 'ai-daily', 'blockchain', 'sun-written'];
        const validTypes = types.filter(type => allowedTypes.includes(type));
        if (validTypes.length === 0) {
            return ContentService.createTextOutput(
                JSON.stringify({ success: false, message: 'Invalid subscription type' })
            ).setMimeType(ContentService.MimeType.JSON);
        }

        // Email 長度限制
        if (email.length > 254) {
            return ContentService.createTextOutput(
                JSON.stringify({ success: false, message: 'Email address too long' })
            ).setMimeType(ContentService.MimeType.JSON);
        }

        // 取得試算表
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

        // 如果試算表是空的，先添加標題行
        if (sheet.getLastRow() === 0) {
            sheet.appendRow(['Email', 'Types', 'Lang', 'SubscribedAt', 'Verified', 'VerifyToken', 'TokenExpiry', 'LastArticleSent']);
        }

        // 檢查是否已存在
        const dataRange = sheet.getDataRange();
        const values = dataRange.getValues();
        let existingRow = -1;

        // 從第二行開始查找（第一行是標題）
        for (let i = 1; i < values.length; i++) {
            // 正規化試算表中的 Email 進行比較（處理 Gmail 的 + 別名）
            const storedEmail = normalizeEmail(values[i][0]);
            if (storedEmail === email) {
                existingRow = i + 1; // +1 因為陣列索引從 0 開始，但行號從 1 開始
                break;
            }
        }

        const subscribedAt = new Date().toISOString();
        const typesStr = validTypes.join(','); // 使用驗證後的類型
        const blogUrl = PropertiesService.getScriptProperties().getProperty('BLOG_URL') || 'https://sunzhi-will.github.io';

        // 生成驗證 token（包含過期時間戳）
        const verifyToken = generateVerifyToken();
        const tokenExpiry = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 天後過期

        // 更新試算表結構：添加 LastArticleSent 欄位（第 8 欄）
        if (sheet.getLastRow() === 0 || sheet.getLastColumn() < 8) {
            // 確保有所有必要的欄位
            if (sheet.getLastRow() === 0) {
                sheet.appendRow(['Email', 'Types', 'Lang', 'SubscribedAt', 'Verified', 'VerifyToken', 'TokenExpiry', 'LastArticleSent']);
            }
        }

        if (existingRow > 0) {
            // 更新現有訂閱
            sheet.getRange(existingRow, 2).setValue(typesStr); // Types
            sheet.getRange(existingRow, 3).setValue(lang); // Lang
            sheet.getRange(existingRow, 4).setValue(subscribedAt); // SubscribedAt
            sheet.getRange(existingRow, 5).setValue(false); // Verified (重置為未驗證)
            sheet.getRange(existingRow, 6).setValue(verifyToken); // VerifyToken
            sheet.getRange(existingRow, 7).setValue(tokenExpiry); // TokenExpiry
        } else {
            // 添加新訂閱
            sheet.appendRow([email, typesStr, lang, now, false, verifyToken, tokenExpiry, '']);
        }

        // 發送驗證郵件
        let emailSent = false;
        let emailError = null;

        try {
            emailSent = sendVerificationEmail(email, verifyToken, lang, blogUrl, validTypes);
        } catch (emailError) {
            Logger.log('Error sending verification email: ' + emailError.toString());
            emailError = emailError.toString();
        }

        // 記錄結果（不記錄完整 Email，只記錄部分）
        const maskedEmail = email.substring(0, 3) + '***@' + email.split('@')[1];
        Logger.log('Subscription result - Email: ' + maskedEmail + ', Verification sent: ' + emailSent);

        return ContentService.createTextOutput(
            JSON.stringify({
                success: true,
                message: lang === 'zh-TW'
                    ? (emailSent ? '訂閱成功！請檢查您的 Email 進行驗證。' : '訂閱成功，但驗證郵件發送失敗。請檢查 Google Apps Script 的執行日誌或聯繫管理員。')
                    : (emailSent ? 'Subscription successful! Please check your email to verify.' : 'Subscription successful, but verification email failed to send. Please check Google Apps Script execution logs or contact administrator.'),
                email: email,
                verificationSent: emailSent,
                error: emailError || null
            })
        ).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(
            JSON.stringify({
                success: false,
                message: 'Internal server error: ' + error.toString()
            })
        ).setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * 處理 OPTIONS 請求（CORS 預檢請求）
 */
function doOptions() {
    return ContentService.createTextOutput('')
        .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * 強制觸發授權請求
 * 
 * 運行此函數會觸發授權對話框
 * 當出現授權提示時，點擊「允許」即可
 */
function requestAuthorization() {
    Logger.log('🔐 正在觸發授權請求...');
    Logger.log('📧 將發送測試郵件到: ' + Session.getActiveUser().getEmail());

    try {
        // 嘗試發送測試郵件來觸發授權
        MailApp.sendEmail({
            to: Session.getActiveUser().getEmail(),
            subject: 'Authorization Test',
            body: 'If you receive this email, authorization is successful!'
        });

        Logger.log('✅ 授權成功！');
        Logger.log('📬 請檢查您的收件匣');
        return true;
    } catch (error) {
        Logger.log('❌ 錯誤: ' + error.toString());
        Logger.log('');
        Logger.log('💡 如果看到授權提示，請點擊「允許」');
        Logger.log('💡 然後再次運行此函數');
        return false;
    }
}

/**
 * 測試函數：測試發送驗證郵件
 * 在 Google Apps Script 編輯器中運行此函數來測試郵件發送功能
 * 
 * 使用方式：
 * 1. 修改下面的 testEmail 為您的 Email
 * 2. 點擊「執行」按鈕
 * 3. 首次運行時，Google 會要求授權，請點擊「檢閱權限」並允許
 * 4. 查看執行日誌確認結果
 */
function testSendVerificationEmail() {
    const testEmail = 'sun055676@gmail.com'; // ⚠️ 請替換為您的測試 Email
    const testToken = generateVerifyToken();
    const blogUrl = PropertiesService.getScriptProperties().getProperty('BLOG_URL') || 'https://sunzhi-will.github.io';

    Logger.log('🧪 Testing verification email send...');
    Logger.log('📧 Email: ' + testEmail);
    Logger.log('🔑 Token: ' + testToken);
    Logger.log('🌐 Blog URL: ' + blogUrl);
    Logger.log('');

    try {
        const result = sendVerificationEmail(testEmail, testToken, 'zh-TW', blogUrl, ['all']);

        if (result) {
            Logger.log('✅ Test email sent successfully!');
            Logger.log('📬 Please check your inbox: ' + testEmail);
        } else {
            Logger.log('❌ Test email failed to send. Check execution logs above for details.');
            Logger.log('');
            Logger.log('💡 If you see authorization errors, please:');
            Logger.log('   1. Run the "requestAuthorization" function first');
            Logger.log('   2. Complete the authorization process');
            Logger.log('   3. Then run this test again');
        }

        return result;
    } catch (error) {
        Logger.log('❌ Test failed with error: ' + error.toString());
        Logger.log('');
        Logger.log('💡 Please run "requestAuthorization" function first to authorize the script.');
        return false;
    }
}

/**
 * 簡單測試：只測試 MailApp 是否可用
 * 
 * ⚠️ 首次運行時會出現授權提示，點擊「允許」即可
 */
function testMailApp() {
    try {
        const testEmail = 'sun055676@gmail.com'; // ⚠️ 請替換為您的 Email

        Logger.log('🧪 測試 MailApp...');
        Logger.log('📧 發送測試郵件到: ' + testEmail);

        MailApp.sendEmail({
            to: testEmail,
            subject: 'Test Email from Google Apps Script',
            body: 'This is a test email. If you receive this, MailApp is working correctly!'
        });

        Logger.log('✅ 測試成功！');
        Logger.log('📬 請檢查您的收件匣: ' + testEmail);
        return true;
    } catch (error) {
        Logger.log('❌ 測試失敗: ' + error.toString());

        if (error.toString().includes('permission') || error.toString().includes('authorization')) {
            Logger.log('');
            Logger.log('💡 需要授權！');
            Logger.log('💡 如果出現授權提示，請點擊「允許」');
            Logger.log('💡 然後再次運行此函數');
        }

        return false;
    }
}

/**
 * 處理 GET 請求（僅用於驗證 Email）
 * 
 * ⚠️ 安全注意：已移除返回所有訂閱列表的功能
 * 如果需要讀取訂閱列表，請使用 Google Sheets API 並添加身份驗證
 */
function doGet(e) {
    try {
        const params = e.parameter;

        // 如果是驗證請求
        if (params.email && params.token) {
            // 檢查是否要求返回 JSON（通過 format=json 參數）
            const returnJson = params.format === 'json';
            return verifyEmail(params.email, params.token, returnJson);
        }

        // 其他 GET 請求返回錯誤（安全措施）
        return ContentService.createTextOutput(
            JSON.stringify({
                success: false,
                message: 'This endpoint only accepts verification requests with email and token parameters.'
            })
        ).setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        Logger.log('❌ doGet 錯誤: ' + error.toString());
        // 不暴露內部錯誤詳情（安全措施）
        return ContentService.createTextOutput(
            JSON.stringify({
                success: false,
                message: 'Server error occurred. Please try again later.'
            })
        ).setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * 更新用戶的 LastArticleSent 欄位
 * @param {string} email - 用戶的Email地址
 * @param {string} articleSlug - 文章的slug
 * @param {string} lang - 語言設定
 */
function handleUpdateLastArticle(email, articleSlug, lang) {
    try {
        Logger.log('🔄 開始處理更新最後文章請求...');
        const maskedEmail = email.substring(0, 3) + '***@' + email.split('@')[1];
        Logger.log('📧 Email: ' + maskedEmail);
        Logger.log('📄 Article Slug: ' + articleSlug);

        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

        // 確保試算表有正確的欄位結構
        if (sheet.getLastRow() === 0 || sheet.getLastColumn() < 8) {
            Logger.log('⚠️ 試算表欄位不足，正在修復...');
            if (sheet.getLastRow() === 0) {
                sheet.appendRow(['Email', 'Types', 'Lang', 'SubscribedAt', 'Verified', 'VerifyToken', 'TokenExpiry', 'LastArticleSent']);
            }
            Logger.log('✅ 試算表結構已修復');
        }
        const dataRange = sheet.getDataRange();
        const values = dataRange.getValues();

        // 從第二行開始查找（第一行是標題）
        for (let i = 1; i < values.length; i++) {
            const rowEmail = normalizeEmail(values[i][0]?.toString());

            if (rowEmail === email) {
                // 更新 LastArticleSent 欄位（第 8 欄）
                sheet.getRange(i + 1, 8).setValue(articleSlug);

                Logger.log('✅ LastArticleSent 更新成功');

                return ContentService.createTextOutput(
                    JSON.stringify({
                        success: true,
                        message: lang === 'zh-TW'
                            ? '最後文章記錄已更新'
                            : 'Last article record updated',
                        lang: lang
                    })
                ).setMimeType(ContentService.MimeType.JSON);
            }
        }

        // 找不到 Email
        Logger.log('❌ 找不到匹配的 Email: ' + maskedEmail);
        return ContentService.createTextOutput(
            JSON.stringify({
                success: false,
                message: lang === 'zh-TW'
                    ? '找不到此 Email 的訂閱記錄'
                    : 'No subscription found for this email',
                lang: lang
            })
        ).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        Logger.log('❌ 更新LastArticleSent錯誤: ' + error.toString());
        return ContentService.createTextOutput(
            JSON.stringify({
                success: false,
                message: lang === 'zh-TW'
                    ? '更新最後文章記錄時發生錯誤'
                    : 'Error updating last article record',
                lang: lang
            })
        ).setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * 驗證 Email
 * @param {string} email - 要驗證的 Email
 * @param {string} token - 驗證 token
 * @param {boolean} returnJson - 是否返回 JSON（用於 API 調用）
 */
function verifyEmail(email, token, returnJson) {
    try {
        // 清理和正規化輸入（處理 Gmail 的 + 別名）
        const cleanEmail = normalizeEmail(email);
        const cleanToken = token?.trim();

        Logger.log('🔍 開始驗證...');
        // 不記錄完整的 Email 和 Token（安全措施）
        const maskedEmail = cleanEmail.substring(0, 3) + '***@' + cleanEmail.split('@')[1];
        Logger.log('📧 Email: ' + maskedEmail);
        Logger.log('🔑 Token: ' + cleanToken.substring(0, 4) + '***');

        if (!cleanEmail || !cleanToken) {
            Logger.log('❌ 缺少 Email 或 Token');
            if (returnJson) {
                return ContentService.createTextOutput(
                    JSON.stringify({
                        success: false,
                        message: 'Missing email or token'
                    })
                ).setMimeType(ContentService.MimeType.JSON);
            }
            return HtmlService.createHtmlOutput(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>驗證失敗</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        .error { color: #f44336; font-size: 24px; margin-bottom: 20px; }
                    </style>
                </head>
                <body>
                    <div class="error">✗</div>
                    <h1>驗證失敗</h1>
                    <p>缺少必要的驗證參數</p>
                </body>
                </html>
            `);
        }

        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        const dataRange = sheet.getDataRange();
        const values = dataRange.getValues();

        Logger.log('📊 試算表總行數: ' + values.length);

        // 檢查標題行
        if (values.length > 0) {
            Logger.log('📋 標題行: ' + JSON.stringify(values[0]));
        }

        // 從第二行開始查找（第一行是標題）
        for (let i = 1; i < values.length; i++) {
            // 正規化試算表中的 Email 進行比較（處理 Gmail 的 + 別名）
            const rowEmail = normalizeEmail(values[i][0]?.toString());
            const storedToken = values[i][5]?.toString().trim(); // VerifyToken 在第 6 欄（索引 5）
            const tokenExpiry = values[i][6] ? parseInt(values[i][6]) : null; // TokenExpiry 在第 7 欄（索引 6）
            const isVerified = values[i][4] === true || values[i][4] === 'TRUE' || values[i][4] === true;

            if (rowEmail === cleanEmail) {
                // 已經驗證過（token 在驗證成功時清掉了）：讀者重複點信裡的連結時，
                // 回覆「已驗證」而不是「連結無效」，免得以為訂閱失敗
                if (returnJson && isVerified && !storedToken) {
                    const lang = values[i][2] || 'zh-TW';
                    return ContentService.createTextOutput(
                        JSON.stringify({
                            success: true,
                            code: 'already_verified',
                            message: lang === 'zh-TW'
                                ? '這個信箱已經驗證過了。'
                                : 'This email is already verified.',
                            lang: lang
                        })
                    ).setMimeType(ContentService.MimeType.JSON);
                }

                // 檢查 token 是否過期
                if (tokenExpiry && Date.now() > tokenExpiry) {
                    Logger.log('❌ Token 已過期');
                    const lang = values[i][2] || 'zh-TW';
                    if (returnJson) {
                        return ContentService.createTextOutput(
                            JSON.stringify({
                                success: false,
                                message: lang === 'zh-TW'
                                    ? '驗證連結已過期，請重新訂閱。'
                                    : 'Verification link has expired. Please subscribe again.',
                                lang: lang
                            })
                        ).setMimeType(ContentService.MimeType.JSON);
                    }
                    return HtmlService.createHtmlOutput(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <title>${lang === 'zh-TW' ? '驗證失敗' : 'Verification Failed'}</title>
                            <style>
                                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                                .error { color: #f44336; font-size: 24px; margin-bottom: 20px; }
                            </style>
                        </head>
                        <body>
                            <div class="error">✗</div>
                            <h1>${lang === 'zh-TW' ? '驗證失敗' : 'Verification Failed'}</h1>
                            <p>${lang === 'zh-TW' ? '驗證連結已過期，請重新訂閱。' : 'Verification link has expired. Please subscribe again.'}</p>
                        </body>
                        </html>
                    `);
                }

                // 檢查 token 是否匹配（使用 trim 去除空格）
                if (storedToken && storedToken === cleanToken) {
                    Logger.log('✅ Token 匹配！');

                    // 更新為已驗證
                    sheet.getRange(i + 1, 5).setValue(true); // Verified (第 5 欄)
                    sheet.getRange(i + 1, 6).setValue(''); // 清除 token (第 6 欄)
                    sheet.getRange(i + 1, 7).setValue(''); // 清除過期時間 (第 7 欄)

                    Logger.log('✅ 驗證成功，已更新試算表');

                    const lang = values[i][2] || 'zh-TW';

                    // 如果要求返回 JSON，返回 JSON 格式
                    if (returnJson) {
                        return ContentService.createTextOutput(
                            JSON.stringify({
                                success: true,
                                message: lang === 'zh-TW'
                                    ? 'Email 驗證成功！感謝您驗證您的 Email 地址。您現在將開始收到我們的電子報。'
                                    : 'Email verified successfully! Thank you for verifying your email address. You will now receive our newsletter.',
                                lang: lang
                            })
                        ).setMimeType(ContentService.MimeType.JSON);
                    }

                    // 否則返回 HTML（向後兼容）
                    return HtmlService.createHtmlOutput(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <title>${lang === 'zh-TW' ? '驗證成功' : 'Verification Successful'}</title>
                            <style>
                                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                                .success { color: #4CAF50; font-size: 24px; margin-bottom: 20px; }
                            </style>
                        </head>
                        <body>
                            <div class="success">✓</div>
                            <h1>${lang === 'zh-TW' ? 'Email 驗證成功！' : 'Email Verified Successfully!'}</h1>
                            <p>${lang === 'zh-TW' ? '感謝您驗證您的 Email 地址。您現在將開始收到我們的電子報。' : 'Thank you for verifying your email address. You will now receive our newsletter.'}</p>
                        </body>
                        </html>
                    `);
                } else {
                    Logger.log('❌ Token 不匹配');
                    // 不記錄完整的 token（安全措施）

                    const lang = values[i][2] || 'zh-TW';
                    if (returnJson) {
                        return ContentService.createTextOutput(
                            JSON.stringify({
                                success: false,
                                message: lang === 'zh-TW'
                                    ? '無效的驗證連結或連結已過期。'
                                    : 'Invalid verification link or link has expired.',
                                lang: lang
                            })
                        ).setMimeType(ContentService.MimeType.JSON);
                    }
                    return HtmlService.createHtmlOutput(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <title>${lang === 'zh-TW' ? '驗證失敗' : 'Verification Failed'}</title>
                            <style>
                                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                                .error { color: #f44336; font-size: 24px; margin-bottom: 20px; }
                            </style>
                        </head>
                        <body>
                            <div class="error">✗</div>
                            <h1>${lang === 'zh-TW' ? '驗證失敗' : 'Verification Failed'}</h1>
                            <p>${lang === 'zh-TW' ? '無效的驗證連結或連結已過期。' : 'Invalid verification link or link has expired.'}</p>
                        </body>
                        </html>
                    `);
                }
            }
        }

        // 使用遮罩的 Email 記錄日誌（安全措施）
        // 注意：maskedEmail 已在函數開頭聲明，這裡重新計算以確保正確
        const maskedEmailNotFound = cleanEmail ? (cleanEmail.substring(0, 3) + '***@' + cleanEmail.split('@')[1]) : 'unknown';
        Logger.log('❌ 找不到匹配的 Email: ' + maskedEmailNotFound);

        // 找不到 Email
        if (returnJson) {
            return ContentService.createTextOutput(
                JSON.stringify({
                    success: false,
                    message: '找不到此 Email 地址的訂閱記錄。',
                    lang: 'zh-TW'
                })
            ).setMimeType(ContentService.MimeType.JSON);
        }
        return HtmlService.createHtmlOutput(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>驗證失敗</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    .error { color: #f44336; font-size: 24px; margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <div class="error">✗</div>
                <h1>驗證失敗</h1>
                <p>找不到此 Email 地址的訂閱記錄。</p>
            </body>
            </html>
        `);
    } catch (error) {
        Logger.log('❌ verifyEmail 錯誤: ' + error.toString());
        if (returnJson) {
            // 不暴露內部錯誤詳情（安全措施）
            Logger.log('❌ doGet 錯誤: ' + error.toString());
            return ContentService.createTextOutput(
                JSON.stringify({
                    success: false,
                    message: 'Server error occurred. Please try again later.'
                })
            ).setMimeType(ContentService.MimeType.JSON);
        }
        return HtmlService.createHtmlOutput(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>錯誤</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    .error { color: #f44336; font-size: 24px; margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <div class="error">✗</div>
                <h1>發生錯誤</h1>
                <p>${error.toString()}</p>
            </body>
            </html>
        `);
    }
}

/**
 * 處理取消訂閱請求
 * @param {string} email - 要取消訂閱的 Email
 * @param {string} lang - 語言設定
 */
function handleUnsubscribe(email, lang) {
    try {
        Logger.log('🔄 開始處理取消訂閱請求...');
        const maskedEmail = email.substring(0, 3) + '***@' + email.split('@')[1];
        Logger.log('📧 Email: ' + maskedEmail);

        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        const dataRange = sheet.getDataRange();
        const values = dataRange.getValues();

        // 從第二行開始查找（第一行是標題）
        for (let i = 1; i < values.length; i++) {
            const rowEmail = normalizeEmail(values[i][0]?.toString());
            const isVerified = values[i][4] === true || values[i][4] === 'TRUE' || values[i][4] === 'true';

            if (rowEmail === email) {
                // 檢查是否已經取消訂閱（未驗證或已刪除）
                if (!isVerified) {
                    Logger.log('⚠️ 此 Email 尚未驗證或已經取消訂閱');
                    return ContentService.createTextOutput(
                        JSON.stringify({
                            success: false,
                            message: lang === 'zh-TW'
                                ? '此 Email 尚未驗證或已經取消訂閱。'
                                : 'This email is not verified or has already been unsubscribed.',
                            lang: lang
                        })
                    ).setMimeType(ContentService.MimeType.JSON);
                }

                // 取消訂閱：將驗證狀態設為 false，並清除驗證相關欄位
                sheet.getRange(i + 1, 5).setValue(false); // Verified (第 5 欄)
                sheet.getRange(i + 1, 6).setValue(''); // VerifyToken (第 6 欄)
                sheet.getRange(i + 1, 7).setValue(''); // TokenExpiry (第 7 欄)
                sheet.getRange(i + 1, 8).setValue(''); // LastArticleSent (第 8 欄)

                Logger.log('✅ 取消訂閱成功');

                return ContentService.createTextOutput(
                    JSON.stringify({
                        success: true,
                        message: lang === 'zh-TW'
                            ? '取消訂閱成功。您將不會再收到我們的電子報。'
                            : 'Successfully unsubscribed. You will no longer receive our newsletter.',
                        lang: lang
                    })
                ).setMimeType(ContentService.MimeType.JSON);
            }
        }

        // 找不到 Email
        Logger.log('❌ 找不到匹配的 Email: ' + maskedEmail);
        return ContentService.createTextOutput(
            JSON.stringify({
                success: false,
                message: lang === 'zh-TW'
                    ? '找不到此 Email 地址的訂閱記錄。'
                    : 'No subscription found for this email address.',
                lang: lang
            })
        ).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        Logger.log('❌ 取消訂閱錯誤: ' + error.toString());
        return ContentService.createTextOutput(
            JSON.stringify({
                success: false,
                message: lang === 'zh-TW'
                    ? '取消訂閱過程中發生錯誤，請稍後再試。'
                    : 'An error occurred during unsubscribe. Please try again later.',
                lang: lang
            })
        ).setMimeType(ContentService.MimeType.JSON);
    }
}
