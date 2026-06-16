const fs = require('fs');
const path = require('path');

const postsDirectory = path.join(process.cwd(), 'content/blog');
const publicBlogDirectory = path.join(process.cwd(), 'public/blog');

if (!fs.existsSync(publicBlogDirectory)) {
    fs.mkdirSync(publicBlogDirectory, { recursive: true });
}

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

function copyImageFile(sourcePath, destPath) {
    try {
        if (!fs.existsSync(sourcePath)) {
            console.error(`\u2717 \u4f86\u6e90\u6587\u4ef6\u4e0d\u5b58\u5728: ${sourcePath}`);
            return false;
        }
        const stats = fs.statSync(sourcePath);
        const maxSize = 10 * 1024 * 1024;
        if (stats.size > maxSize) {
            console.error(`\u2717 \u6a94\u6848\u904e\u5927 (${(stats.size / 1024 / 1024).toFixed(2)}MB): ${sourcePath}`);
            return false;
        }
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
            console.log(`  \u5efa\u7acb\u76ee\u9304: ${destDir}`);
        }
        fs.copyFileSync(sourcePath, destPath);
        if (fs.existsSync(destPath)) {
            const sourceStats = fs.statSync(sourcePath);
            const destStats = fs.statSync(destPath);
            if (sourceStats.size === destStats.size) {
                console.log(`  \u2713 ${path.basename(sourcePath)} -> ${path.relative(process.cwd(), destPath)}`);
                return true;
            } else {
                console.error(`  \u2717 \u6587\u4ef6\u5927\u5c0f\u4e0d\u5339\u914d: ${sourcePath}`);
                return false;
            }
        } else {
            console.error(`  \u2717 \u8907\u88fd\u5f8c\u6587\u4ef6\u4e0d\u5b58\u5728: ${destPath}`);
            return false;
        }
    } catch (error) {
        console.error(`  \u2717 \u8907\u88fd\u5931\u6557: ${sourcePath}`, error.message);
        return false;
    }
}

function processPostFolder(slug) {
    const folderPath = path.join(postsDirectory, slug);
    const files = fs.readdirSync(folderPath);
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];
    const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
    });
    imageFiles.forEach(imageFile => {
        const sourcePath = path.join(folderPath, imageFile);
        const destPath = path.join(publicBlogDirectory, slug, imageFile);
        copyImageFile(sourcePath, destPath);
    });
}

function main() {
    console.log('\u958b\u59cb\u8907\u88fd\u90e8\u843d\u683c\u5716\u7247...\n');
    console.log(`\u4f86\u6e90\u76ee\u9304: ${postsDirectory}`);
    console.log(`\u76ee\u6a19\u76ee\u9304: ${publicBlogDirectory}\n`);
    const postFolders = getPostFolders();
    if (postFolders.length === 0) {
        console.log('\u26a0\ufe0f  \u6c92\u6709\u627e\u5230\u6587\u7ae0\u8cc7\u6599\u593e');
        return;
    }
    console.log(`\u627e\u5230 ${postFolders.length} \u500b\u6587\u7ae0\u8cc7\u6599\u593e:\n`);
    let totalCopied = 0;
    postFolders.forEach(slug => {
        processPostFolder(slug);
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
                console.log(`  ${slug}: ${imageFiles.length} \u500b\u5716\u7247`);
            }
        } catch (error) {
            console.error(`  ${slug}: \u8b80\u53d6\u5931\u6557 - ${error.message}`);
        }
    });
    console.log(`\n\u2713 \u5716\u7247\u8907\u88fd\u5b8c\u6210\uff01\u5171\u8655\u7406 ${totalCopied} \u500b\u5716\u7247\u6587\u4ef6`);
    console.log('\n\u9a57\u8b49\u8907\u88fd\u7d50\u679c:');
    postFolders.forEach(slug => {
        const destFolder = path.join(publicBlogDirectory, slug);
        if (fs.existsSync(destFolder)) {
            const files = fs.readdirSync(destFolder);
            console.log(`  \u2713 ${slug}: ${files.length} \u500b\u6587\u4ef6\u5728 public/blog/`);
        } else {
            console.log(`  \u2717 ${slug}: \u76ee\u6a19\u8cc7\u6599\u593e\u4e0d\u5b58\u5728`);
        }
    });
}

main();
