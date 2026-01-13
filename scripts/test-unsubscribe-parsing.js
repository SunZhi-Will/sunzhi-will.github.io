// 測試取消訂閱請求解析
function parseFormData(content) {
    try {
        const formData = content.split('&').reduce((acc, pair) => {
            const [key, value] = pair.split('=');
            acc[decodeURIComponent(key)] = decodeURIComponent(value || '');
            return acc;
        }, {});

        const data = {
            email: formData.email,
            types: formData.types ? (formData.types.includes(',') ? formData.types.split(',') : [formData.types]) : [],
            lang: formData.lang || 'zh-TW',
            action: formData.action || 'subscribe'
        };

        console.log('解析結果:', data);
        return data;
    } catch (error) {
        console.error('解析錯誤:', error.message);
    }
}

// 測試取消訂閱請求
const unsubscribeRequest = 'email=sun055676%40gmail.com&action=unsubscribe';
console.log('測試取消訂閱請求:');
parseFormData(unsubscribeRequest);

// 測試訂閱請求（對比）
const subscribeRequest = 'email=test%40example.com&types=all&lang=zh-TW';
console.log('\n測試訂閱請求:');
parseFormData(subscribeRequest);