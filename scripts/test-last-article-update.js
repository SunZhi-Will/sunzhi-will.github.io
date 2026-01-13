// 測試 LastArticleSent 更新功能
async function testLastArticleUpdate() {
    console.log('🧪 測試 LastArticleSent 更新功能...\n');

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
        console.error('❌ GOOGLE_APPS_SCRIPT_URL 環境變數未設置');
        console.error('請檢查您的 .env.local 或 .env 文件');
        return;
    }

    console.log('📡 Google Apps Script URL:', scriptUrl);

    // 測試用的數據
    const testEmail = 'test@example.com'; // 請替換為實際存在的訂閱者Email
    const testSlug = '2025-01-13-120000'; // 測試用的文章slug

    try {
        console.log(`📧 測試更新 Email: ${testEmail}`);
        console.log(`📄 測試文章 Slug: ${testSlug}`);

        // 發送更新請求
        const formData = new URLSearchParams();
        formData.append('email', testEmail);
        formData.append('action', 'update_last_article');
        formData.append('article_slug', testSlug);

        console.log('📤 發送請求...');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

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

        console.log(`📥 響應狀態: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            console.error(`❌ 請求失敗: ${response.status}`);
            const errorText = await response.text();
            console.error('錯誤詳情:', errorText);
            return;
        }

        const responseText = await response.text();
        console.log('📄 響應內容:', responseText);

        try {
            const data = JSON.parse(responseText);
            if (data.success) {
                console.log('✅ 更新成功:', data.message);
            } else {
                console.log('❌ 更新失敗:', data.message);
            }
        } catch (parseError) {
            console.log('⚠️ 無法解析JSON響應');
            console.log('原始響應:', responseText);
        }

    } catch (error) {
        console.error('❌ 測試失敗:', error.message);
        console.error('\n🔧 常見問題排查:');
        console.error('1. 檢查 GOOGLE_APPS_SCRIPT_URL 是否正確');
        console.error('2. 確認 Google Apps Script 已重新部署最新版本');
        console.error('3. 檢查 Google Apps Script 的執行權限');
        console.error('4. 查看 Google Apps Script 的日誌');
    }
}

// 檢查 Google Apps Script 版本
async function checkGASVersion() {
    console.log('🔍 檢查 Google Apps Script 版本...\n');

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
        console.error('❌ GOOGLE_APPS_SCRIPT_URL 未設置');
        return;
    }

    try {
        // 嘗試訪問腳本（無參數請求應該會失敗，但可以檢查連接性）
        const response = await fetch(scriptUrl, {
            method: 'GET',
            mode: 'cors',
        });

        console.log(`📡 腳本可訪問: ${response.status}`);

        // 測試 doPost 端點是否存在
        const testData = new URLSearchParams();
        testData.append('email', 'test@example.com');
        testData.append('action', 'update_last_article');
        testData.append('article_slug', 'test-slug');

        const postResponse = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: testData.toString(),
            mode: 'cors',
        });

        console.log(`🔧 doPost 端點響應: ${postResponse.status}`);

        if (postResponse.ok) {
            const responseText = await postResponse.text();
            if (responseText.includes('handleUpdateLastArticle')) {
                console.log('✅ Google Apps Script 包含 handleUpdateLastArticle 函數');
            } else {
                console.log('❌ Google Apps Script 可能沒有最新版本的 handleUpdateLastArticle 函數');
            }
        }

    } catch (error) {
        console.error('❌ 無法連接到 Google Apps Script:', error.message);
    }
}

// 主函數
async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        console.log('LastArticleSent 更新測試工具');
        console.log('');
        console.log('用法:');
        console.log('  node test-last-article-update.js          # 測試更新功能');
        console.log('  node test-last-article-update.js --check  # 檢查腳本版本');
        console.log('');
        console.log('環境變數:');
        console.log('  GOOGLE_APPS_SCRIPT_URL  # Google Apps Script 的 Web App URL');
        console.log('');
        return;
    }

    if (args.includes('--check')) {
        await checkGASVersion();
    } else {
        await testLastArticleUpdate();
    }
}

// 如果直接運行此腳本
if (require.main === module) {
    main().catch(error => {
        console.error('❌ 測試過程中發生未預期的錯誤:', error);
        process.exit(1);
    });
}

module.exports = { testLastArticleUpdate, checkGASVersion };