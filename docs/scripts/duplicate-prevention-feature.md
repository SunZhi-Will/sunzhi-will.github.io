# 防重複發送電子報功能

## 📋 功能概述

為了解決用戶重複接收同一篇文章的問題，新增了追蹤機制，確保每位訂閱者不會重複收到同一天的電子報。

## 🎯 問題描述

之前的系統中，如果同一天多次運行發送腳本，或是系統重複執行，用戶會收到多封相同的電子報，造成困擾。

## 🛠️ 解決方案

### Google Sheet 新欄位

**新增欄位**: `LastArticleSent` (第8欄)

**欄位說明**:
- **類型**: 字符串
- **用途**: 記錄用戶最後接收的文章slug
- **格式**: `YYYY-MM-DD-HHMMSS` (例如: `2025-01-13-120000`)

### 發送邏輯優化

#### 1. 發送前檢查
```javascript
// 檢查是否已經發送過這篇文章
if (subscription.lastArticleSent === slug) {
    console.log(`Skipping ${maskedEmail} (already received this article: ${slug})`);
    continue;
}
```

#### 2. 發送後更新
```javascript
// 發送成功後，更新用戶的 LastArticleSent 欄位
await updateLastArticleSent(subscription.email, slug);
```

#### 3. 取消訂閱時清除
```javascript
// 取消訂閱時清除所有相關欄位
sheet.getRange(i + 1, 8).setValue(''); // LastArticleSent (第 8 欄)
```

## 🔧 技術實作

### Google Apps Script 修改

#### 新增函數: `handleUpdateLastArticle()`
```javascript
function handleUpdateLastArticle(email, articleSlug, lang) {
    // 在試算表中找到對應的Email
    // 更新第8欄的LastArticleSent值
    sheet.getRange(i + 1, 8).setValue(articleSlug);
}
```

#### API端點擴展
- **動作**: `update_last_article`
- **參數**: `email`, `article_slug`
- **回應**: 成功/失敗狀態

### Node.js 發送腳本修改

#### 讀取LastArticleSent欄位
```javascript
const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'A2:H', // 包含新欄位
});

// 解析回應
return rows.map(row => ({
    email: email,
    types: types,
    lang: lang,
    subscribedAt: subscribedAt,
    verified: verified,
    lastArticleSent: row[7] || '', // LastArticleSent (第8欄，索引7)
}));
```

#### 更新LastArticleSent欄位
```javascript
async function updateLastArticleSent(email, articleSlug) {
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('action', 'update_last_article');
    formData.append('article_slug', articleSlug);

    const response = await fetch(scriptUrl, {
        method: 'POST',
        body: formData.toString(),
    });

    // 處理回應...
}
```

## 📊 Google Sheet 結構

| 欄位 | 說明 | 範例 |
|------|------|------|
| A (Email) | 用戶Email | user@example.com |
| B (Types) | 訂閱類型 | all,ai-daily |
| C (Lang) | 語言偏好 | zh-TW |
| D (SubscribedAt) | 訂閱時間 | 2025-01-13T12:00:00Z |
| E (Verified) | 驗證狀態 | TRUE |
| F (VerifyToken) | 驗證Token | abc123... |
| G (TokenExpiry) | Token過期時間 | 1673600000000 |
| **H (LastArticleSent)** | **最後文章** | **2025-01-13-120000** |

## 🚀 部署說明

### 1. Google Apps Script 更新
1. 將更新的 `scripts/google-apps-script-example.js` 複製到您的 Google Apps Script
2. 重新部署 Web App
3. 確保新版本生效

### 2. Node.js 發送腳本更新
1. 使用更新的 `scripts/send-newsletter.js`
2. 確保環境變數正確設置

### 3. Google Sheet 遷移
**現有用戶的 LastArticleSent 欄位會自動設為空值**，不會影響正常發送。

## ✅ 功能測試

### 測試案例
1. **首次發送**: 用戶正常收到電子報，LastArticleSent 更新為文章slug
2. **重複發送**: 同一天再次發送時，該用戶會被跳過
3. **新文章**: 新一天的文章會正常發送給所有用戶
4. **取消訂閱**: LastArticleSent 欄位會被清除

### 測試命令
```bash
# 測試發送（只會發送給未接收過該文章的用戶）
npm run send-newsletter

# 查看日誌輸出，確認跳過的用戶
```

## 📈 預期效果

### 用戶體驗改善
- ✅ **不再重複收到**: 同一天的文章只會收到一次
- ✅ **保持靈活性**: 新文章仍會正常發送
- ✅ **數據準確**: 系統記錄每位用戶的接收歷史

### 系統效能提升
- ✅ **減少不必要的發送**: 避免重複發送節省資源
- ✅ **更好的日誌記錄**: 清楚知道哪些用戶被跳過
- ✅ **數據追蹤**: 可以統計實際發送數量

## 🔍 故障排除

### 問題: 用戶仍然收到重複郵件
**解決方案**:
1. 檢查 Google Apps Script 是否為最新版本
2. 確認 Google Sheet 的 H 欄有正確的標題 "LastArticleSent"
3. 查看發送日誌，確認跳過邏輯是否正常執行

### 問題: LastArticleSent 更新失敗
**解決方案**:
1. 檢查 Google Apps Script 的日誌
2. 確認用戶的 Email 在試算表中存在
3. 檢查網路連接和 API 權限

## 📝 注意事項

1. **向後相容**: 現有用戶的空值不會影響功能
2. **數據清理**: 取消訂閱時會清除 LastArticleSent
3. **效能考慮**: 每次發送都會檢查該欄位，影響不大

---

**更新日期**: 2025年1月13日
**功能狀態**: ✅ 已完成實作並測試
**影響範圍**: 所有訂閱用戶的發送邏輯