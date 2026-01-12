const fs = require('fs');
const path = require('path');

// 測試取消訂閱功能
async function testUnsubscribe() {
    console.log('🧪 開始測試取消訂閱功能...\n');

    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL ||
                     process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
        console.error('❌ 未找到 Google Apps Script URL');
        console.error('   請設置 NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL 或 GOOGLE_APPS_SCRIPT_URL 環境變數');
        process.exit(1);
    }

    console.log('📡 測試 URL:', scriptUrl);

    // 測試用的 Email 地址
    const testEmails = [
        'test@example.com',
        'user+newsletter@gmail.com', // Gmail 別名測試
        'subscriber@test.org'
    ];

    for (const email of testEmails) {
        console.log(`\n📧 測試取消訂閱: ${email}`);

        try {
            // 準備表單數據
            const formData = new URLSearchParams();
            formData.append('email', email);
            formData.append('action', 'unsubscribe');

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
            });

            clearTimeout(timeoutId);

            console.log(`📥 響應狀態: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                console.error(`❌ 請求失敗: ${response.status}`);
                const errorText = await response.text();
                console.error('錯誤詳情:', errorText.substring(0, 200));
                continue;
            }

            const responseText = await response.text();
            console.log('📄 響應內容:', responseText);

            try {
                const data = JSON.parse(responseText);
                if (data.success) {
                    console.log('✅ 取消訂閱成功:', data.message);
                } else {
                    console.log('⚠️ 取消訂閱失敗:', data.message);
                }
            } catch (parseError) {
                console.log('⚠️ 無法解析 JSON 響應，但請求成功');
                console.log('原始響應:', responseText);
            }

        } catch (error) {
            console.error('❌ 測試失敗:', error.message);
        }

        // 在測試之間稍作等待
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n🎉 取消訂閱功能測試完成');
}

// 檢查環境變數
function checkEnvironment() {
    console.log('🔍 檢查環境配置...\n');

    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL ||
                     process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
        console.log('❌ 未設置 Google Apps Script URL');
        console.log('💡 請設置以下環境變數之一:');
        console.log('   - NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL');
        console.log('   - GOOGLE_APPS_SCRIPT_URL');
        return false;
    }

    console.log('✅ Google Apps Script URL:', scriptUrl);

    try {
        new URL(scriptUrl);
        console.log('✅ URL 格式正確');
    } catch (error) {
        console.log('❌ URL 格式無效:', error.message);
        return false;
    }

    return true;
}

// 主函數
async function main() {
    console.log('🚀 取消訂閱功能測試工具\n');

    if (!checkEnvironment()) {
        process.exit(1);
    }

    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        console.log('用法: node test-unsubscribe.js [選項]');
        console.log('');
        console.log('選項:');
        console.log('  --help, -h    顯示此幫助訊息');
        console.log('  --check       只檢查環境配置，不執行測試');
        console.log('');
        console.log('環境變數:');
        console.log('  GOOGLE_APPS_SCRIPT_URL 或 NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL');
        console.log('    Google Apps Script 的 Web App URL');
        console.log('');
        return;
    }

    if (args.includes('--check')) {
        console.log('✅ 環境檢查完成');
        return;
    }

    await testUnsubscribe();
}

// 如果直接運行此腳本
if (require.main === module) {
    main().catch(error => {
        console.error('❌ 測試過程中發生未預期的錯誤:', error);
        process.exit(1);
    });
}

module.exports = { testUnsubscribe, checkEnvironment };