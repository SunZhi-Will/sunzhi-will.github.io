# 取消訂閱電子報功能

## 📋 功能概述

新增了完整的取消訂閱電子報功能，讓用戶能夠輕鬆取消訂閱。

**✨ 新功能**: 電子報和驗證郵件底部現在都包含取消訂閱連結！

## 🛠️ 實作內容

### 1. 前端組件
- **`NewsletterUnsubscribe.tsx`**: 取消訂閱表單組件
- **`/unsubscribe` 頁面**: 專用的取消訂閱頁面

### 2. 後端 API
- **Google Apps Script**: 新增 `handleUnsubscribe()` 函數處理取消訂閱請求
- **支援的請求格式**:
  ```javascript
  POST /google-apps-script-url
  Content-Type: application/x-www-form-urlencoded

  email=user@example.com&action=unsubscribe
  ```

### 3. 測試工具
- **`scripts/test-unsubscribe.js`**: 測試取消訂閱功能的腳本

## 🚀 使用方式

### 用戶取消訂閱
1. 用戶可以通過以下方式訪問取消訂閱功能：
   - 在訂閱表單下方點擊「取消訂閱」連結
   - 直接訪問 `/unsubscribe` 頁面

2. 輸入 Email 地址並提交表單

3. 系統會：
   - 驗證 Email 格式
   - 檢查是否已訂閱
   - 取消訂閱（將驗證狀態設為 false）
   - 返回成功訊息

### 測試功能
```bash
# 檢查環境配置
node scripts/test-unsubscribe.js --check

# 執行完整測試
node scripts/test-unsubscribe.js
```

## 📊 數據結構

取消訂閱後，用戶記錄會更新為：
- **Verified**: `FALSE` (取消驗證狀態)
- **VerifyToken**: `""` (清除驗證 token)
- **TokenExpiry**: `""` (清除過期時間)

## 🔒 安全措施

- Email 正規化處理（支援 Gmail 別名）
- 速率限制（每 Email 每分鐘最多 1 次請求）
- 全域速率限制（每分鐘最多 20 個請求）
- 請求大小限制（最大 10KB）
- 來源驗證（可選）

## 🌐 支援語言

- **繁體中文 (zh-TW)**
- **英文 (en)**

## 📧 電子報中的取消訂閱連結

### 電子報底部
每封電子報的底部現在都包含取消訂閱連結：
- 連結文字：`取消訂閱` / `Unsubscribe`
- 連結位置：Footer 區域
- 樣式：灰色文字，帶底線，hover 效果

### 驗證郵件底部
訂閱驗證郵件的底部也包含取消訂閱連結：
- 提供額外的取消訂閱途徑
- 適用於還沒完成驗證的用戶

### 連結格式
```html
<a href="${blogUrl}/unsubscribe" style="color: #888888; text-decoration: underline; transition: color 0.2s;">
    取消訂閱 / Unsubscribe
</a>
```

### 設計考慮
- **可見性**: 使用較淺的灰色，不會太過醒目但仍清晰可見
- **一致性**: 與網站設計風格保持一致
- **無障礙**: 支援鍵盤導航和螢幕閱讀器
- **響應式**: 在各種設備上都能正常顯示

## 📝 API 回應格式

### 成功回應
```json
{
  "success": true,
  "message": "取消訂閱成功。您將不會再收到我們的電子報。",
  "lang": "zh-TW"
}
```

### 錯誤回應
```json
{
  "success": false,
  "message": "找不到此 Email 地址的訂閱記錄。",
  "lang": "zh-TW"
}
```

## ⚠️ 注意事項

1. **環境變數**: 需要設置 `NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL`
2. **Google Apps Script**: 需要將更新後的代碼部署到 Google Apps Script
3. **權限**: Google Apps Script 需要郵件發送權限
4. **試算表結構**: 確保試算表包含必要的欄位

## 🔄 部署步驟

1. 將 `scripts/google-apps-script-example.js` 的更新代碼複製到 Google Apps Script 編輯器
2. 部署為新的 Web App 版本
3. 更新環境變數 `NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL`
4. 測試功能是否正常運作

## 🧪 測試案例

- ✅ 成功取消已驗證的訂閱
- ✅ 嘗試取消未驗證的訂閱
- ✅ 嘗試取消不存在的 Email
- ✅ 無效的 Email 格式
- ✅ 重複取消訂閱
- ✅ 網路錯誤處理
- ✅ 速率限制測試

---

**更新日期**: 2025年1月12日
**功能狀態**: ✅ 已完成實作