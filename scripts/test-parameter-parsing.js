// 模擬 Google Apps Script 的 e.parameter 解析
function simulateParameterParsing(formDataString) {
    // 解析表單數據
    const params = {};
    formDataString.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });

    // 模擬 Google Apps Script 的 e.parameter 結構
    const e = {
        parameter: {
            email: params.email,
            types: params.types || '',
            lang: params.lang || 'zh-TW',
            action: params.action || 'subscribe'
        }
    };

    console.log('模擬 e.parameter:', e.parameter);

    // 測試我們的解析邏輯
    if (e.parameter && e.parameter.email) {
        const typesParam = e.parameter.types || '';
        const action = e.parameter.action || 'subscribe';
        const data = {
            email: e.parameter.email,
            types: typesParam ? (typesParam.includes(',') ? typesParam.split(',') : [typesParam]) : [],
            lang: e.parameter.lang || 'zh-TW',
            action: action
        };

        console.log('解析後的 data:', data);
        console.log('action === unsubscribe:', data.action === 'unsubscribe');

        return data;
    }

    return null;
}

// 測試取消訂閱
console.log('測試取消訂閱請求:');
simulateParameterParsing('email=sun055676%40gmail.com&action=unsubscribe');

console.log('\n測試訂閱請求:');
simulateParameterParsing('email=test%40example.com&types=all&lang=zh-TW');