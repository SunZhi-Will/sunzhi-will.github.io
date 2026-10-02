/**
 * 在本機預覽電子報版面，不會寄出任何信件。
 *
 *   node scripts/preview-newsletter.js            # 最新一篇文章
 *   node scripts/preview-newsletter.js <slug>     # 指定文章
 *
 * 會把每個語言版本輸出成 HTML 檔，用瀏覽器打開就能看。
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { blogDir } = require('./config');
const { getLatestArticle, generateNewsletterHtml, generateNewsletterText } = require('./send-newsletter');

const blogUrl = process.env.BLOG_URL || 'https://sunzhi-will.github.io';
const outDir = path.join(os.tmpdir(), 'newsletter-preview');

function latestSlug() {
    return fs.readdirSync(blogDir)
        .filter((name) => fs.statSync(path.join(blogDir, name)).isDirectory())
        .sort()
        .pop();
}

const slug = process.argv[2] || latestSlug();
if (!slug || !fs.existsSync(path.join(blogDir, slug))) {
    console.error(`找不到文章：${slug || '(content/blog 是空的)'}`);
    process.exit(1);
}

const article = getLatestArticle(slug);
fs.mkdirSync(outDir, { recursive: true });

for (const [lang, key] of [['zh-TW', 'zh'], ['en', 'en']]) {
    if (!article[key]) continue;
    const html = generateNewsletterHtml(article, slug, lang, blogUrl, 'reader@example.com');
    const file = path.join(outDir, `${slug}.${lang}.html`);
    fs.writeFileSync(file, html);
    const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
    console.log(`${lang}  ${kb} KB  ${file}`);
    if (Number(kb) > 102) {
        console.warn('   超過 102 KB，Gmail 會截斷信件並把頁尾（含取消訂閱連結）藏起來。');
    }
    console.log(`\n--- 純文字版本（${lang}）---\n${generateNewsletterText(article, slug, lang, blogUrl, 'reader@example.com')}\n`);
}
