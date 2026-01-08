/**
 * Gemini API 客戶端初始化
 */

let genAIClientPromise = null;

/**
 * 動態建立 Gen AI Client（處理 ESM 匯入）
 * @param {string} apiKey - API 金鑰
 * @returns {Promise<Object>} Gemini API 客戶端
 */
async function getGenAIClient(apiKey) {
    if (!genAIClientPromise) {
        genAIClientPromise = import('@google/genai').then((mod) => {
            // 優先使用 GoogleGenAI（新 SDK 主要入口）
            const ClientClass =
                mod.GoogleGenAI ||
                mod.GoogleAI ||
                mod.GoogleGenerativeAI ||
                mod.default?.GoogleGenAI ||
                mod.default?.GoogleAI ||
                mod.default?.GoogleGenerativeAI ||
                (typeof mod.default === 'function' ? mod.default : null);

            if (!ClientClass) {
                const availableKeys = Object.keys(mod || {}).concat(Object.keys(mod?.default || {}));
                throw new Error(
                    `Cannot find GoogleGenAI/GoogleAI/GoogleGenerativeAI in @google/genai. Export keys: ${availableKeys.join(', ')}`
                );
            }

            // 參考 trendpulse：不設定 apiVersion，使用預設（可能支援 tools）
            const client = new ClientClass({ apiKey });
            // 新版 SDK 以 ai.models.* 提供存取
            if (!client.models || typeof client.models.generateContent !== 'function') {
                const keys = Object.keys(client || {});
                throw new Error(`Loaded client does not expose models.generateContent. Client keys: ${keys.join(', ')}`);
            }
            return client;
        });
    }

    return genAIClientPromise;
}

module.exports = {
    getGenAIClient,
};

