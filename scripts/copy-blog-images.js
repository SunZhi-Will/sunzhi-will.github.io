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
        // 確保目標目錄存在
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        
        // 複製文件
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✓ 已複製: ${path.basename(sourcePath)} -> ${destPath}`);
    } catch (error) {
        console.error(`✗ 複製失敗: ${sourcePath}`, error.message);
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
    
    const postFolders = getPostFolders();
    
    if (postFolders.length === 0) {
        console.log('沒有找到文章資料夾');
        return;
    }
    
    postFolders.forEach(slug => {
        processPostFolder(slug);
    });
    
    console.log('\n✓ 圖片複製完成！');
}

main();






