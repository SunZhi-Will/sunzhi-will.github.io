const fs = require('fs');
const path = require('path');

const postsDirectory = path.join(process.cwd(), 'content/blog');
const publicBlogDirectory = path.join(process.cwd(), 'public/blog');

// 確保 public/blog 目錄存在
if (!fs.existsSync(publicBlogDirectory)) {
    fs.mkdirSync(publicBlogDirectory, { recursive: true });
}

// 取得所有文章資料夾
function getPostFolders() {
    try {
        const entries = fs.readdirSync(postsDirectory, { withFileTypes: true });
        return entries
            .filter(entry => entry.isDirectory())
            .map(entry => entry.name);
    } catch {
        return [];
    }
}

// 複製圖片文件
function copyImageFile(sourcePath, destPath) {
    try {
        // 檢查來源文件是否存在
        if (!fs.existsSync(sourcePath)) {
            console.error(`✗ 來源文件不存在: ${sourcePath}`);
            return false;
        }
        
        // 確保目標目錄存在
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
            console.log(`  建立目錄: ${destDir}`);
        }
        
        // 複製文件
        fs.copyFileSync(sourcePath, destPath);
        
        // 驗證複製是否成功
        if (fs.existsSync(destPath)) {
            const sourceStats = fs.statSync(sourcePath);
            const destStats = fs.statSync(destPath);
            if (sourceStats.size === destStats.size) {
                console.log(`  ✓ ${path.basename(sourcePath)} -> ${path.relative(process.cwd(), destPath)}`);
                return true;
            } else {
                console.error(`  ✗ 文件大小不匹配: ${sourcePath}`);
                return false;
            }
        } else {
            console.error(`  ✗ 複製後文件不存在: ${destPath}`);
            return false;
        }
    } catch (error) {
        console.error(`  ✗ 複製失敗: ${sourcePath}`, error.message);
        return false;
    }
}

// 處理每個文章資料夾
function processPostFolder(slug) {
    const folderPath = path.join(postsDirectory, slug);
    const files = fs.readdirSync(folderPath);
    
    // 找出所有圖片文件（.png, .jpg, .jpeg, .webp, .gif）
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];
    const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
    });
    
    // 複製每個圖片文件到 public/blog/[slug]/
    imageFiles.forEach(imageFile => {
        const sourcePath = path.join(folderPath, imageFile);
        const destPath = path.join(publicBlogDirectory, slug, imageFile);
        copyImageFile(sourcePath, destPath);
    });
}

// 主函數
function main() {
    console.log('開始複製部落格圖片...\n');
    console.log(`來源目錄: ${postsDirectory}`);
    console.log(`目標目錄: ${publicBlogDirectory}\n`);
    
    const postFolders = getPostFolders();
    
    if (postFolders.length === 0) {
        console.log('⚠️  沒有找到文章資料夾');
        return;
    }
    
    console.log(`找到 ${postFolders.length} 個文章資料夾:\n`);
    
    let totalCopied = 0;
    postFolders.forEach(slug => {
        const beforeCount = totalCopied;
        processPostFolder(slug);
        // 計算這次複製了多少圖片
        const folderPath = path.join(postsDirectory, slug);
        try {
            const files = fs.readdirSync(folderPath);
            const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];
            const imageFiles = files.filter(file => {
                const ext = path.extname(file).toLowerCase();
                return imageExtensions.includes(ext);
            });
            totalCopied += imageFiles.length;
            if (imageFiles.length > 0) {
                console.log(`  ${slug}: ${imageFiles.length} 個圖片`);
            }
        } catch (error) {
            console.error(`  ${slug}: 讀取失敗 - ${error.message}`);
        }
    });
    
    console.log(`\n✓ 圖片複製完成！共處理 ${totalCopied} 個圖片文件`);
    
    // 驗證複製結果
    console.log('\n驗證複製結果:');
    postFolders.forEach(slug => {
        const destFolder = path.join(publicBlogDirectory, slug);
        if (fs.existsSync(destFolder)) {
            const files = fs.readdirSync(destFolder);
            console.log(`  ✓ ${slug}: ${files.length} 個文件在 public/blog/`);
        } else {
            console.log(`  ✗ ${slug}: 目標資料夾不存在`);
        }
    });
}

main();












