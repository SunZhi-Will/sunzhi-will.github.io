const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

/**
 * 使用 Pollinations.ai 生成免費圖片
 * @param {string} prompt - 圖片提示詞
 * @param {string} timestamp - 時間戳
 * @param {string} postFolder - 保存目錄
 * @param {string} articleContent - 文章內容（可選）
 * @returns {Promise<string|null>} 圖片文件名
 */
async function generateFreeImage(prompt, timestamp, postFolder, articleContent = '') {
    console.log('\n🔄 嘗試 Pollinations.ai...');
    
    // 根據文章內容提取關鍵視覺元素
    const visualElements = extractVisualElements(articleContent);
    
    // 構建更具體的插圖風格提示詞
    const enhancedPrompt = buildIllustrationPrompt(prompt, visualElements);
    
    console.log(`🎨 使用 Pollinations.ai 生成文章插圖...`);
    console.log(`📝 視覺元素: ${visualElements.join(', ')}`);
    
    // Pollinations.ai 免費 API - 使用 nologo 參數嘗試移除水印
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1200&height=630&model=flux&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
    
    console.log(`📡 請求 URL: ${imageUrl.substring(0, 150)}...`);
    
    try {
        const imageBuffer = await downloadImage(imageUrl);
        const imageFileName = `cover-${timestamp}.png`;
        const imagePath = path.join(postFolder, imageFileName);
        
        // 保存到 content/blog/ 目錄
        fs.writeFileSync(imagePath, imageBuffer);
        console.log(`✅ 圖片保存到: ${imagePath}`);
        
        // 同時複製到 public/blog/ 目錄供電子郵件訪問
        const publicBlogDir = path.join(__dirname, '../../public/blog');
        if (!fs.existsSync(publicBlogDir)) {
            fs.mkdirSync(publicBlogDir, { recursive: true });
        }
        
        // 提取文章 slug（從 postFolder 路徑）
        const slug = path.basename(postFolder);
        const publicSlugDir = path.join(publicBlogDir, slug);
        if (!fs.existsSync(publicSlugDir)) {
            fs.mkdirSync(publicSlugDir, { recursive: true });
        }
        
        const publicImagePath = path.join(publicSlugDir, imageFileName);
        fs.writeFileSync(publicImagePath, imageBuffer);
        console.log(`✅ 圖片已複製到公開目錄: ${publicImagePath}\n`);
        
        return imageFileName;
    } catch (error) {
        console.error(`❌ Pollinations.ai 生成失敗:`, error.message);
        return null;
    }
}

/**
 * 從文章內容提取視覺元素關鍵詞
 * @param {string} content - 文章內容
 * @returns {Array<string>} 視覺元素列表
 */
function extractVisualElements(content) {
    const elements = [];
    
    // 關鍵詞映射到視覺元素
    const keywordMap = {
        'AI代理|AI Agent|助理|實習生': 'AI robot assistant',
        '晶片|GPU|ASIC|處理器|硬體': 'computer chip processor',
        '醫療|健康|疾病|ChatGPT Health': 'medical healthcare icon',
        '深度偽造|Deepfakes|假新聞': 'warning shield symbol',
        '零售|購物|電商': 'shopping cart retail',
        '數據|資料|分析': 'data analytics visualization',
        '網路|連線|雲端': 'cloud network connection',
        '安全|隱私|保護': 'security lock protection',
        '機器學習|神經網路': 'neural network brain',
        '自動化|自動駕駛': 'automation robot arm'
    };
    
    for (const [keywords, visual] of Object.entries(keywordMap)) {
        const regex = new RegExp(keywords, 'i');
        if (regex.test(content)) {
            elements.push(visual);
        }
    }
    
    // 如果沒有找到特定元素，使用通用AI元素
    if (elements.length === 0) {
        elements.push('AI technology', 'digital innovation');
    }
    
    // 限制最多3個主要元素
    return elements.slice(0, 3);
}

/**
 * 構建插圖風格的提示詞
 * @param {string} basePrompt - 基礎提示
 * @param {Array<string>} visualElements - 視覺元素
 * @returns {string} 完整提示詞
 */
function buildIllustrationPrompt(basePrompt, visualElements) {
    const elementsStr = visualElements.join(', ');
    
    return `Modern tech illustration featuring ${elementsStr}, 
clean minimal design, flat design style, professional infographic look,
soft gradient background in blue and purple tones,
simple geometric shapes, contemporary digital art,
magazine article illustration style,
NO TEXT, NO WORDS, NO LETTERS, NO NUMBERS, NO SYMBOLS,
completely textless, visual only, high quality 4k`;
}

/**
 * 下載圖片
 * @param {string} url - 圖片 URL
 * @returns {Promise<Buffer>} 圖片數據
 */
function downloadImage(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        
        protocol.get(url, (response) => {
            // 處理重定向
            if (response.statusCode === 301 || response.statusCode === 302) {
                return downloadImage(response.headers.location)
                    .then(resolve)
                    .catch(reject);
            }
            
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                return;
            }
            
            const chunks = [];
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', () => resolve(Buffer.concat(chunks)));
        }).on('error', reject);
    });
}

module.exports = {
    generateFreeImage,
};
