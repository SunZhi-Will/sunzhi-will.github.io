# 電子報訂閱功能設置指南

本功能使用 Google 試算表作為訂閱資料庫，透過 Google Apps Script 處理訂閱請求，完全不需要後端 API。

## 📋 完整設置步驟

### 第一步：建立 Google 試算表

1. 前往 [Google 試算表](https://sheets.google.com/)
2. 建立新的試算表，命名為「電子報訂閱者」
3. 在第一行設置以下欄位：
   - **A1**: `Email`
   - **B1**: `Types` (訂閱類型，用逗號分隔，例如：`all,ai-daily`)
   - **C1**: `Lang` (語言偏好：`zh-TW` 或 `en`)
   - **D1**: `SubscribedAt` (訂閱時間)
   - **E1**: `Verified` (是否驗證，預設 `FALSE`)

### 第二步：建立 Google Apps Script

1. 在試算表中，點擊 **擴充功能** > **Apps Script**
2. 將 `scripts/google-apps-script-example.js` 中的代碼複製到編輯器
3. 點擊 **儲存**，為專案命名（例如：「Newsletter Subscription Handler」）
4. 點擊 **部署** > **新增部署作業**
5. 選擇類型：**網頁應用程式**
6. 設置：
   - **說明**：Newsletter Subscription API
   - **執行身分**：我
   - **具有存取權的使用者**：**任何人**（重要！）
7. 點擊 **部署**
8. **複製 Web App URL**（格式：`https://script.google.com/macros/s/.../exec`）

⚠️ **重要**：
- 第一次部署時，Google 會要求授權，請允許
- 如果修改了代碼，需要重新部署（選擇「新增版本」）
- 確保已設置 `BLOG_URL` 環境變數，否則驗證郵件中的連結會不正確

### 寄件者名稱（自動根據文章類型和語言）

系統會**自動根據文章類型和語言**動態設置寄件者名稱，無需手動配置：

| 文章類型      | 繁體中文     | English          |
| ------------- | ------------ | ---------------- |
| `ai-daily`    | AI 日報      | AI Daily         |
| `blockchain`  | 區塊鏈日報   | Blockchain Daily |
| `sun-written` | Sun 的電子報 | Sun's Newsletter |
| 其他/預設     | 電子報       | Newsletter       |

**效果**：
- 發送 `ai-daily` 類型的文章時，所有用戶都會收到來自「**AI 日報**」的郵件
- 發送 `blockchain` 類型的文章時，所有用戶都會收到來自「**區塊鏈日報**」的郵件
- 發送 `sun-written` 類型的文章時，所有用戶都會收到來自「**Sun 的電子報**」的郵件
- 郵件顯示為：`AI 日報 <sun055676@gmail.com>`

**注意**：
- 寄件者名稱是根據**文章類型**決定的，不是根據用戶的訂閱類型
- 驗證郵件會根據用戶訂閱的類型顯示對應名稱（如果訂閱 `all` 則使用預設名稱）

### 設置回覆地址（可選）

如果需要設置回覆地址：

1. **在 Google Apps Script 中設置**：
   - 點擊左側 **專案設定**（齒輪圖示）
   - 在「指令碼內容」中，點擊 **新增指令碼內容**，添加：
     - **`REPLY_TO`**：回覆地址，例如：`noreply@yourdomain.com` 或留空
   - 點擊 **儲存指令碼內容**

2. **效果**：
   - 如果設置了 `REPLY_TO`，回覆郵件會發送到該地址
   - 如果未設置，回覆會發送到預設的 Gmail 地址

**注意**：
- MailApp 無法更改實際的寄件地址，只能更改顯示名稱
- 如果需要完全不同的寄件地址（例如：`newsletter@yourdomain.com`），需要：
  1. 在 Gmail 中設置別名（設定 > 帳戶和匯入 > 新增其他寄件者地址）
  2. 將代碼中的 `MailApp.sendEmail` 改為 `GmailApp.sendEmail`
  3. 在選項中設置 `from` 參數

### 測試郵件發送功能（重要！）

在部署 Web App 之前，**必須先測試並授權郵件發送功能**：

#### 步驟 1：授權 MailApp（必須先完成！）

**方法 1：使用授權函數（推薦）**

1. **運行授權函數**：
   - 在 Google Apps Script 編輯器中，找到 `requestAuthorization` 函數
   - 點擊「執行」按鈕（▶️）
   - **這會明確觸發授權請求**

2. **完成授權流程**：
   - 如果出現「需要授權」提示，點擊「**檢閱權限**」
   - 選擇您的 Google 帳號
   - 如果看到「此應用程式未經過驗證」警告：
     - 點擊「**進階**」
     - 點擊「**前往 [專案名稱]（不安全）**」
   - 點擊「**允許**」
   - 等待授權完成

3. **確認授權成功**：
   - 查看執行日誌，應該顯示「✅ Authorization successful!」
   - 檢查您的 Email（執行腳本的帳號）是否收到測試郵件

**方法 2：使用測試函數**

1. **運行簡單測試**：
   - 找到 `testMailApp` 函數
   - 修改函數中的 `testEmail` 為您的 Email 地址
   - 點擊「執行」按鈕（▶️）

2. **完成授權流程**（同上）

3. **確認授權成功**：
   - 再次運行 `testMailApp` 函數
   - 查看執行日誌，應該顯示「✅ MailApp test successful!」
   - 檢查您的 Email 是否收到測試郵件

#### 步驟 2：測試完整功能

1. **運行完整測試**：
   - 找到 `testSendVerificationEmail` 函數
   - 修改函數中的 `testEmail` 為您的 Email
   - 點擊「執行」按鈕
   - 查看執行日誌確認結果
   - 檢查您的 Email 是否收到驗證郵件

#### 步驟 3：檢查專案設定

1. **確認應用程式存取範圍**：
   - 點擊左側「**專案設定**」（齒輪圖示）
   - 在「**應用程式存取範圍**」中，確認包含：
     - `https://www.googleapis.com/auth/script.send_mail`
   - 如果沒有，手動添加或重新授權

2. **檢查帳號權限**：
   - 前往 [Google 帳號權限](https://myaccount.google.com/permissions)
   - 確認「Google Apps Script API」權限已授權

#### 重要提示

- **必須在編輯器中手動運行一次**，才能觸發授權請求
- Web App 部署後，會使用您在編輯器中授權的帳號發送郵件
- MailApp 會使用執行腳本的 Google 帳號發送郵件
- 郵件會從您的 Google 帳號發送（例如：your-email@gmail.com）

#### 如果授權失敗

如果遇到「You do not have permission to call MailApp.sendEmail」錯誤：

1. **重新授權**：
   - 刪除現有的授權（在 [Google 帳號權限](https://myaccount.google.com/permissions) 中）
   - 重新運行 `testMailApp` 函數
   - 按照授權流程重新授權

2. **檢查部署設置**：
   - 確認「執行身分」設置為「**我**」
   - 確認「具有存取權的使用者」設置為「**任何人**」

3. **檢查專案設定**：
   - 確認應用程式存取範圍包含 `https://www.googleapis.com/auth/script.send_mail`

### 第三步：設置環境變數

#### 在建置時設置（用於客戶端）

由於 Next.js 靜態導出，環境變數需要在建置時設置。有兩種方式：

**方式 1：在 GitHub Actions 建置時設置**

在 `.github/workflows/nextjs.yml` 或建置腳本中添加：

```yaml
env:
  NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL: ${{ secrets.GOOGLE_APPS_SCRIPT_URL }}
```

**方式 2：在本地建置時設置**

```bash
export NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL="https://script.google.com/macros/s/.../exec"
npm run build
```

#### 在 GitHub Secrets 中設置（用於發送腳本）

1. 前往 **Settings** > **Secrets and variables** > **Actions**
2. 點擊 **New repository secret**（新增儲存庫密碼）
3. 逐一添加以下 Secrets：

**必需的 Secrets：**

##### 1. Google Apps Script URL
- **Secret 名稱**：`GOOGLE_APPS_SCRIPT_URL`
- **用途**：用於訂閱表單提交和 Email 驗證
- **格式**：`https://script.google.com/macros/s/.../exec`
- **如何取得**：
  1. 前往您的 Google Apps Script 專案
  2. 點擊「部署」>「管理部署作業」
  3. 複製 Web App URL

##### 2. Google Sheets 憑證（用於發送電子報）
- **Secret 名稱**：`GOOGLE_SHEETS_CREDENTIALS`
- **用途**：讓發送腳本讀取訂閱列表
- **格式**：完整的 JSON 內容（多行）
- **如何取得**：
  1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
  2. 建立新專案或選擇現有專案
  3. 啟用 **Google Sheets API**
  4. 建立服務帳號：
     - 前往 **IAM 與管理** > **服務帳號**
     - 點擊 **建立服務帳號**
     - 輸入名稱（例如：「newsletter-service」）
     - 點擊 **建立並繼續** > **完成**
  5. 建立金鑰：
     - 點擊剛建立的服務帳號
     - 前往 **金鑰** 標籤
     - 點擊 **新增金鑰** > **建立新金鑰**
     - 選擇 **JSON** 格式
     - **下載 JSON 檔案**
  6. 分享試算表給服務帳號：
     - 打開您的 Google 試算表
     - 點擊右上角 **共用**
     - 將服務帳號的 Email（在 JSON 檔案中的 `client_email`）加入，給予「**檢視者**」權限即可
  7. **複製整個 JSON 檔案內容**作為 Secret 值

##### 3. Google Sheets ID
- **Secret 名稱**：`GOOGLE_SHEETS_ID`
- **用途**：指定要讀取的試算表
- **格式**：長字串（例如：`1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`）
- **如何取得**：
  1. 打開您的 Google 試算表
  2. 查看網址列，格式為：`https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
  3. 複製 `[SHEET_ID]` 部分

##### 4. Gmail 用戶名
- **Secret 名稱**：`GMAIL_USER`
- **用途**：發送電子報的 Gmail 帳號
- **格式**：`your-email@gmail.com`
- **範例**：`sun055676@gmail.com`

##### 5. Gmail 應用程式密碼
- **Secret 名稱**：`GMAIL_APP_PASSWORD`
- **用途**：用於通過 SMTP 發送郵件
- **格式**：16 位數密碼（例如：`abcd efgh ijkl mnop`，去掉空格）
- **範例**：`abcdefghijklmnop`
- **如何取得**：
  1. 前往 [Google 帳號設定](https://myaccount.google.com/)
  2. 點擊左側 **安全性**
  3. 在「登入 Google」區塊中，找到 **兩步驟驗證**
  4. 如果尚未啟用，請先啟用兩步驟驗證
  5. 啟用後，回到「安全性」頁面
  6. 在「兩步驟驗證」下方，點擊 **應用程式密碼**
  7. 選擇應用程式：**郵件**
  8. 選擇裝置：**其他（自訂名稱）**
  9. 輸入名稱（例如：「GitHub Actions Newsletter」）
  10. 點擊 **產生**
  11. **複製生成的 16 位數密碼**（格式：`xxxx xxxx xxxx xxxx`，去掉空格）

**可選的 Secrets：**

##### 6. 部落格網址（可選）
- **Secret 名稱**：`BLOG_URL`
- **用途**：電子報中的連結
- **預設值**：`https://sunzhi-will.github.io`
- **如何設置**：如果使用預設值，可以不設置

⚠️ **重要**：應用程式密碼必須放在 **GitHub Secrets** 中，不要提交到代碼庫！

### ✅ GitHub Secrets 檢查清單

使用此清單確認是否已設置所有 Secrets：

- [ ] `GEMINI_API_KEY` - ✅ 已配置（用於生成 AI 日報）
- [ ] `GOOGLE_APPS_SCRIPT_URL` - ❓ 需檢查
- [ ] `GOOGLE_SHEETS_CREDENTIALS` - ❓ 需檢查
- [ ] `GOOGLE_SHEETS_ID` - ❓ 需檢查
- [ ] `GMAIL_USER` - ❓ 需檢查
- [ ] `GMAIL_APP_PASSWORD` - ❓ 需檢查
- [ ] `BLOG_URL` - ❓ 可選（有預設值）

### 🔍 如何檢查當前狀態

#### 方法 1：在 GitHub 中檢查
1. 前往 Repository > Settings > Secrets and variables > Actions
2. 查看是否列出了所有需要的 Secrets

#### 方法 2：查看工作流程執行日誌
1. 前往 Actions 標籤
2. 查看最新的「Generate Daily AI Report」執行
3. 查看「Send newsletter via Gmail」步驟的日誌
4. 如果看到以下訊息，表示缺少配置：
   - `⚠️ Gmail credentials not configured. Skipping newsletter sending.`
   - `⚠️ No Google Sheets configuration found. Using empty subscription list.`

### 更改寄件者顯示名稱

**方法 1：在 Google Apps Script 中設置（推薦）**

1. 在 Google Apps Script 編輯器中，點擊 **專案設定**（齒輪圖示）
2. 在「指令碼內容」中，設置：
   - **`SENDER_NAME`**：您想要的寄件者名稱（例如：`AI Daily Report`、`電子報系統`）
   - **`REPLY_TO`**：（可選）回覆地址

**方法 2：使用 Gmail 別名（完全更改寄件地址）**

如果您想使用完全不同的寄件地址（例如：`newsletter@yourdomain.com`）：

1. **設置 Gmail 別名**：
   - 登入 Gmail > **設定** > **帳戶和匯入**
   - 在「寄件者地址」中，點擊「新增其他寄件者地址」
   - 添加您想要使用的 Email 地址（需要驗證）

2. **修改 Google Apps Script 代碼**：
   - 將 `MailApp.sendEmail` 改為 `GmailApp.sendEmail`
   - 在選項中設置 `from` 參數為您的別名地址

**注意**：MailApp 無法更改實際的寄件地址，只能更改顯示名稱。如果需要完全不同的寄件地址，必須使用 GmailApp 並設置 Gmail 別名。

### 第四步：測試訂閱功能

1. 在本地開發環境設置環境變數：
   ```bash
   export NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL="your-script-url"
   npm run dev
   ```

2. 訪問 blog 頁面，在側邊欄找到訂閱表單
3. 輸入 Email 並選擇訂閱類型
4. 提交後，檢查 Google 試算表是否新增了訂閱記錄

### 第五步：測試讀取訂閱列表

測試 Google Apps Script 的 `doGet` 函數：

1. 在瀏覽器訪問您的 Web App URL
2. 應該會看到所有訂閱者的 JSON 資料

## 🔄 工作流程

### 訂閱流程

1. 用戶在 blog 側邊欄輸入 Email 並選擇訂閱類型
2. 表單提交到 Google Apps Script Web App URL
3. Apps Script 將訂閱資訊寫入 Google 試算表（Verified 設為 FALSE）
4. Apps Script 生成驗證 token 並發送驗證郵件
5. 用戶點擊郵件中的驗證連結
6. Apps Script 驗證 token 並將 Verified 設為 TRUE
7. 只有已驗證的訂閱者才會收到電子報

### 發送流程

1. GitHub Actions 生成新文章
2. 執行 `scripts/send-newsletter.js`
3. 腳本從 Google Apps Script 或 Google Sheets API 讀取訂閱列表
4. 根據文章類型過濾訂閱者
5. 發送對應語言的電子報

## 📝 試算表格式範例

| Email           | Types        | Lang  | SubscribedAt             | Verified | VerifyToken |
| --------------- | ------------ | ----- | ------------------------ | -------- | ----------- |
| user1@gmail.com | all,ai-daily | zh-TW | 2026-01-09T10:00:00.000Z | TRUE     | (已清除)    |
| user2@gmail.com | blockchain   | en    | 2026-01-09T11:00:00.000Z | FALSE    | abc123...   |
| user3@gmail.com | sun-written  | zh-TW | 2026-01-09T12:00:00.000Z | TRUE     | (已清除)    |

**欄位說明**：
- **Email**：訂閱者的 Email 地址
- **Types**：訂閱類型，用逗號分隔（例如：`all,ai-daily`）
- **Lang**：語言偏好（`zh-TW` 或 `en`）
- **SubscribedAt**：訂閱時間（ISO 格式）
- **Verified**：是否已驗證（`TRUE` 或 `FALSE`）
- **VerifyToken**：驗證 token（驗證成功後會清除）

## ⚠️ 注意事項

1. **安全性**：
   - Google Apps Script Web App 是公開的
   - 建議在 Apps Script 中添加簡單驗證（例如：檢查來源域名）
   - 可以添加 rate limiting 防止濫用

2. **環境變數**：
   - `NEXT_PUBLIC_*` 前綴的變數會暴露給客戶端
   - 不要在環境變數中存儲敏感資訊
   - Google Apps Script URL 可以公開（因為它本身就是公開的 Web App）

3. **配額限制**：
   - Google Apps Script：每日執行時間 6 分鐘
   - Google Sheets API：根據方案而定
   - Gmail：每日最多 500 封郵件

## 🛠️ 故障排除

### 問題：訂閱表單顯示「訂閱服務未配置」

**解決方法**：
- 確認已設置 `NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL` 環境變數
- 確認在建置時環境變數已正確設置
- 檢查 `next.config.ts` 中的環境變數配置

### 問題：無法寫入 Google 試算表

**解決方法**：
- 確認 Google Apps Script 已正確部署
- 確認 Web App 設置為「任何人」可訪問
- 檢查 Apps Script 的執行日誌

### 問題：發送腳本無法讀取訂閱列表

**解決方法**：
- 確認已設置 `GOOGLE_APPS_SCRIPT_URL` 或 `GOOGLE_SHEETS_CREDENTIALS`
- 如果使用 Google Sheets API，確認服務帳號有試算表的讀取權限
- 檢查試算表 ID 是否正確

### 問題：沒有收到驗證郵件

**解決方法**：

1. **檢查 Google Apps Script 執行日誌**：
   - 打開 Google Apps Script 編輯器
   - 點擊左側「執行」圖示（▶️）
   - 查看執行日誌，確認是否有錯誤訊息

2. **測試郵件發送功能**：
   - 在 Google Apps Script 編輯器中，找到 `testSendVerificationEmail` 函數
   - 修改函數中的 `testEmail` 為您的 Email
   - 點擊「執行」按鈕運行測試函數
   - 查看執行日誌確認結果

3. **檢查授權**：
   - 確保 Google Apps Script 已授權發送郵件
   - 如果首次運行，Google 會要求授權，請允許
   - 前往 [Google 帳號權限](https://myaccount.google.com/permissions) 檢查應用程式權限

4. **檢查 MailApp 限制**：
   - Google Apps Script 每日郵件發送限制：100 封（免費帳號）
   - 如果超過限制，需要等待 24 小時或升級到 Google Workspace

5. **檢查 Email 地址**：
   - 確認 Email 地址格式正確
   - 檢查垃圾郵件資料夾
   - 某些郵件服務可能會過濾自動發送的郵件

6. **檢查環境變數**：
   - 確認已設置 `BLOG_URL` 環境變數
   - 在 Google Apps Script 編輯器中，點擊「專案設定」>「指令碼內容」
   - 確認 `BLOG_URL` 已正確設置

7. **手動測試**：
   - 在 Google Apps Script 編輯器中運行以下代碼：
   ```javascript
   function testEmail() {
     MailApp.sendEmail({
       to: 'your-email@gmail.com',
       subject: 'Test',
       body: 'This is a test email'
     });
   }
   ```
   - 如果這個測試也失敗，可能是權限問題

---

**最後更新**：2026年1月  
**維護者**：SunZhi-Will
