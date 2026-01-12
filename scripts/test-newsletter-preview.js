const fs = require('fs');
const path = require('path');

// 測試電子報HTML生成
console.log('🧪 開始測試電子報HTML生成...\n');

// 模擬測試數據
const mockArticle = {
    zh: {
        meta: {
            title: '測試文章標題',
            description: '這是一篇測試文章的描述，用來展示電子報的新設計',
            date: '2025-01-12'
        },
        body: '這是測試文章的內容。包含了一些 **粗體文字** 和 [連結](https://example.com)。\n\n這是第二段內容，用來測試多段落的顯示效果。'
    },
    en: {
        meta: {
            title: 'Test Article Title',
            description: 'This is a test article description to showcase the new newsletter design',
            date: '2025-01-12'
        },
        body: 'This is test article content. It includes some **bold text** and [links](https://example.com).\n\nThis is the second paragraph to test multi-paragraph display.'
    }
};

// 載入主要腳本來獲取函數
const scriptPath = path.join(__dirname, 'send-newsletter.js');
let scriptContent;

try {
    scriptContent = fs.readFileSync(scriptPath, 'utf8');
} catch (error) {
    console.error('❌ 無法讀取 send-newsletter.js:', error.message);
    process.exit(1);
}

// 提取所需的函數
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

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        if (!trimmedLine) {
            // 空行處理
            if (result.length > 0 && result[result.length - 1] !== '') {
                result.push('');
            }
            continue;
        }

        // 檢查是否為標題
        const headerMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
        if (headerMatch) {
            const level = headerMatch[1].length;
            const content = headerMatch[2];
            result.push(`<h${level} style="color: #e8e8e8; font-weight: 600; margin: 20px 0 10px 0; line-height: 1.3;">${content}</h${level}>`);
            continue;
        }

        // 檢查是否為無序列表
        const ulMatch = trimmedLine.match(/^(\s*)[-*+]\s+(.+)$/);
        if (ulMatch) {
            const indent = ulMatch[1].length;
            const content = ulMatch[2];
            const level = Math.floor(indent / 2) + 1;

            // 關閉更高層級的列表
            while (listStack.length > level) {
                const closedList = listStack.pop();
                if (closedList.isOrdered) {
                    result.push('</ol>');
                } else {
                    result.push('</ul>');
                }
            }

            // 確保當前層級的列表存在
            if (listStack.length < level) {
                result.push('<ul style="margin: 10px 0; padding-left: 20px;">');
                listStack.push({ level, isOrdered: false, items: [] });
            }

            result.push(`<li style="margin: 5px 0; color: #d4d4d4;">${content}</li>`);
            continue;
        }

        // 檢查是否為有序列表
        const olMatch = trimmedLine.match(/^(\s*)(\d+)\.\s+(.+)$/);
        if (olMatch) {
            const indent = olMatch[1].length;
            const num = olMatch[2];
            const content = olMatch[3];
            const level = Math.floor(indent / 2) + 1;

            // 關閉更高層級的列表
            while (listStack.length > level) {
                const closedList = listStack.pop();
                if (closedList.isOrdered) {
                    result.push('</ol>');
                } else {
                    result.push('</ul>');
                }
            }

            // 確保當前層級的列表存在
            if (listStack.length < level) {
                result.push('<ol style="margin: 10px 0; padding-left: 20px;">');
                listStack.push({ level, isOrdered: true, items: [] });
            }

            result.push(`<li style="margin: 5px 0; color: #d4d4d4;">${content}</li>`);
            continue;
        }

        // 如果不是列表項，關閉所有列表
        while (listStack.length > 0) {
            const closedList = listStack.pop();
            if (closedList.isOrdered) {
                result.push('</ol>');
            } else {
                result.push('</ul>');
            }
        }

        // 常規段落
        if (trimmedLine) {
            result.push(`<p style="margin: 15px 0; color: #d4d4d4; line-height: 1.7;">${line}</p>`);
        }
    }

    // 關閉所有剩餘的列表
    while (listStack.length > 0) {
        const closedList = listStack.pop();
        if (closedList.isOrdered) {
            result.push('</ol>');
        } else {
            result.push('</ul>');
        }
    }

    return result.join('\n');
}

// 生成電子報HTML
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
                            <!-- Logo/Brand -->
                            <div style="display: inline-block; margin-right: 15px;">
                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #000000; font-size: 18px; box-shadow: 0 2px 8px rgba(192, 192, 192, 0.3);">
                                    S
                                </div>
                            </div>
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
                            <a href="${blogUrl}" style="color: #c0c0c0; text-decoration: none; font-size: 12px; padding: 6px 12px; border: 1px solid #333333; border-radius: 4px; transition: all 0.2s;">
                                ${isZh ? '訪問網站' : 'Visit Site'}
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

// 生成測試HTML
try {
    console.log('📧 生成中文版電子報...');
    const zhHtml = generateNewsletterHtml(mockArticle, 'test-article', 'zh-TW', 'https://sunzhi-will.github.io');
    fs.writeFileSync('newsletter-preview-zh.html', zhHtml);
    console.log('✅ 中文版電子報已保存: newsletter-preview-zh.html');

    console.log('📧 生成英文版電子報...');
    const enHtml = generateNewsletterHtml(mockArticle, 'test-article', 'en', 'https://sunzhi-will.github.io');
    fs.writeFileSync('newsletter-preview-en.html', enHtml);
    console.log('✅ 英文版電子報已保存: newsletter-preview-en.html');

    console.log('\n🎉 電子報預覽文件生成成功！');
    console.log('📁 請在瀏覽器中打開以下文件來預覽：');
    console.log('   - newsletter-preview-zh.html (中文版)');
    console.log('   - newsletter-preview-en.html (英文版)');
    console.log('\n✨ 新功能特色：');
    console.log('   • 網站LOGO和品牌標題');
    console.log('   • 專業的網站Header設計');
    console.log('   • 訪問網站按鈕');
    console.log('   • 取消訂閱連結');
    console.log('   • 響應式設計');

} catch (error) {
    console.error('❌ 生成測試HTML時發生錯誤:', error.message);
    process.exit(1);
}