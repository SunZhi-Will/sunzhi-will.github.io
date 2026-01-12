const fs = require('fs');
const path = require('path');
const { generateFreeImage } = require('./utils/imageGenerator-free');

/**
 * 重新生成文章封面圖
 */
async function regenerateCover(slug) {
    const postFolder = path.join(__dirname, '../content/blog', slug);

    if (!fs.existsSync(postFolder)) {
        console.error(`❌ 文章目錄不存在: ${postFolder}`);
        return;
    }

    // 刪除舊的封面圖
    const existingFiles = fs.readdirSync(postFolder);
    existingFiles.forEach(file => {
        if (file.startsWith('cover-')) {
            const oldCoverPath = path.join(postFolder, file);
            fs.unlinkSync(oldCoverPath);
            console.log(`🗑️  已刪除舊封面: ${file}`);
        }
    });

    // 讀取文章內容
    const articlePath = path.join(postFolder, 'article.zh-TW.mdx');
    if (!fs.existsSync(articlePath)) {
        console.error(`❌ 找不到文章文件: ${articlePath}`);
        return;
    }

    const content = fs.readFileSync(articlePath, 'utf8');
    const titleMatch = content.match(/^title:\s*"([^"]+)"/m);
    const descMatch = content.match(/^description:\s*"([^"]+)"/m);

    if (!titleMatch) {
        console.error(`❌ 無法提取文章標題`);
        return;
    }

    const title = titleMatch[1];
    const description = descMatch ? descMatch[1] : '';
    
    console.log(`📝 文章標題: ${title}`);
    console.log(`📄 文章描述: ${description}`);

    // 基於標題和描述生成提示詞
    const cleanTitle = title
        .replace(/【AI日報】/g, '')
        .replace(/！/g, '')
        .replace(/。/g, '')
        .trim();

    const prompt = `${cleanTitle} ${description}`;

    console.log(`🎨 根據文章內容生成插圖風格封面...`);
    const timestamp = slug.split('-').slice(0, 3).join('');
    
    // 傳遞完整文章內容
    const coverImage = await generateFreeImage(prompt, timestamp, postFolder, content);

    if (coverImage) {
        console.log(`✅ 成功生成基於文章內容的封面圖: ${coverImage}`);
    } else {
        console.log(`❌ 無法生成封面圖`);
    }
}

// 執行
if (require.main === module) {
    const slug = process.argv[2];

    if (!slug) {
        console.log('🔧 重新生成文章封面圖（基於文章內容）');
        console.log('');
        console.log('使用方法:');
        console.log('  node scripts/regenerate-cover.js [文章slug]');
        console.log('');
        console.log('例如:');
        console.log('  node scripts/regenerate-cover.js 2026-01-12-012144');
        process.exit(1);
    }

    regenerateCover(slug).catch((error) => {
        console.error('❌ 生成失敗:', error);
        process.exit(1);
    });
}

module.exports = { regenerateCover };
