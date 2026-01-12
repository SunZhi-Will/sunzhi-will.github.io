const fs = require('fs');
const path = require('path');
const { generateFreeImage } = require('./free-image-alternatives');

/**
 * 為已存在的文章生成封面圖
 */
async function generateCoverForExisting(slug) {
    const postFolder = path.join(__dirname, '../content/blog', slug);

    if (!fs.existsSync(postFolder)) {
        console.error(`❌ 文章目錄不存在: ${postFolder}`);
        return;
    }

    // 檢查是否已有封面圖
    const existingFiles = fs.readdirSync(postFolder);
    const hasCover = existingFiles.some(file => file.startsWith('cover-'));

    if (hasCover) {
        console.log(`ℹ️  文章已有封面圖，跳過生成`);
        return;
    }

    // 讀取文章內容提取標題
    const articlePath = path.join(postFolder, 'article.zh-TW.mdx');
    if (!fs.existsSync(articlePath)) {
        console.error(`❌ 找不到文章文件: ${articlePath}`);
        return;
    }

    const content = fs.readFileSync(articlePath, 'utf8');
    const titleMatch = content.match(/^title:\s*"([^"]+)"/m);

    if (!titleMatch) {
        console.error(`❌ 無法提取文章標題`);
        return;
    }

    const title = titleMatch[1];
    console.log(`📝 文章標題: ${title}`);

    // 基於標題生成圖片提示
    const prompt = `AI technology and ${title.replace(/【AI日報】/g, '').replace(/！/g, '')}, professional infographic, data visualization, business intelligence, clean design`;

    console.log(`🎨 生成封面圖...`);
    const timestamp = slug.split('-').slice(0, 3).join(''); // 從 slug 提取日期
    const coverImage = await generateFreeImage(prompt, timestamp, postFolder);

    if (coverImage) {
        console.log(`✅ 成功為文章 ${slug} 生成封面圖: ${coverImage}`);

        // 更新文章 frontmatter 添加 coverImage 字段
        updateArticleFrontmatter(articlePath, coverImage);
        const enArticlePath = path.join(postFolder, 'article.en.mdx');
        if (fs.existsSync(enArticlePath)) {
            updateArticleFrontmatter(enArticlePath, coverImage);
        }

    } else {
        console.log(`❌ 無法為文章 ${slug} 生成封面圖`);
    }
}

/**
 * 更新文章 frontmatter 添加封面圖
 */
function updateArticleFrontmatter(articlePath, coverImage) {
    let content = fs.readFileSync(articlePath, 'utf8');

    // 在標籤後添加 coverImage 字段
    content = content.replace(
        /(tags:\s*\[[^\]]*\])/,
        `$1\ncoverImage: "${coverImage}"`
    );

    fs.writeFileSync(articlePath, content, 'utf8');
    console.log(`📝 已更新 ${path.basename(articlePath)} 的 frontmatter`);
}

// 如果直接執行此腳本
if (require.main === module) {
    const slug = process.argv[2];

    if (!slug) {
        console.log('🔧 為已存在文章生成封面圖');
        console.log('');
        console.log('使用方法:');
        console.log('  node scripts/generate-cover-for-existing.js [文章slug]');
        console.log('');
        console.log('例如:');
        console.log('  node scripts/generate-cover-for-existing.js 2026-01-12-012144');
        process.exit(1);
    }

    generateCoverForExisting(slug).catch((error) => {
        console.error('❌ 生成失敗:', error);
        process.exit(1);
    });
}

module.exports = { generateCoverForExisting };