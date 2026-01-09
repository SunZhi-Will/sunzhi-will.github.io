# 電子報測試指南

本指南說明如何測試發布最新電子報的功能。

## 📋 測試方式

### 方式 1：測試模式（Dry Run）- 推薦

**不實際發送郵件，只顯示會發送給誰**

```bash
# 測試今天日期的文章
node scripts/test-newsletter.js --dry-run

# 測試最新文章
node scripts/test-newsletter.js --dry-run --latest

# 測試特定文章
node scripts/test-newsletter.js --dry-run --slug=2026-01-09-045335
```

**輸出範例：**
```
🧪 === 測試模式（Dry Run）===
📄 文章 Slug: 2026-01-09-045335

📋 文章類型: ai-daily
📝 標題（中文）: AI 日報 - 2026年1月9日
📝 標題（英文）: AI Daily - January 9, 2026

📊 總訂閱數: 10

📧 會發送的訂閱者：

   ✅ abc***@gmail.com (zh-TW, types: all, ai-daily)
   ✅ def***@gmail.com (en, types: ai-daily)
   ✅ ghi***@gmail.com (zh-TW, types: all)

📊 統計：
   ✅ 會發送: 3
   ⏭️  跳過（未驗證）: 5
   ⏭️  跳過（類型不匹配）: 2

💡 這是測試模式，沒有實際發送郵件。
```

### 方式 2：發送測試郵件給自己

**實際發送郵件到指定 Email（建議先發給自己測試）**

```bash
# 發送測試郵件到指定 Email（使用最新文章）
node scripts/test-newsletter.js --test-email=your-email@gmail.com --latest

# 發送測試郵件到指定 Email（使用特定文章）
node scripts/test-newsletter.js --test-email=your-email@gmail.com --slug=2026-01-09-045335

# 發送測試郵件到指定 Email（指定語系，只發送一個版本）
node scripts/test-newsletter.js --test-email=your-email@gmail.com --latest --lang=zh-TW

# 使用 --to 參數（等同於 --test-email）
node scripts/test-newsletter.js --to=your-email@gmail.com --latest
```

**注意：**
- 未指定 `--lang` 時，會發送兩種語言版本（中文和英文）到指定 Email（僅用於測試）
- 指定 `--lang=zh-TW` 或 `--lang=en` 時，只發送對應語系的版本
- 郵件主題會加上 `[測試]` 前綴，方便識別
- 需要設置環境變數：`GMAIL_USER` 和 `GMAIL_APP_PASSWORD`
- **正式發文時，每個訂閱者只會收到其設定語系的版本**（根據訂閱者的 `Lang` 欄位）

### 方式 3：列出所有可用文章

**查看所有可用的文章 slug**

```bash
node scripts/test-newsletter.js --list
```

**輸出範例：**
```
📚 === 所有可用文章 ===

   1. 2026-01-09-045335
   2. 2026-01-08-011829
   3. 2026-01-07-011802
   4. 2026-01-06-011753
   5. 2026-01-05-012407

   共 5 篇文章
```

### 方式 4：使用 GitHub Actions 自動化測試（推薦）

**使用 GitHub Actions 工作流程進行測試，無需本地環境設置**

#### 步驟 1：前往 GitHub Actions

1. 前往您的 GitHub 儲存庫
2. 點擊 **Actions** 標籤
3. 在左側選擇 **Test Newsletter** 工作流程
4. 點擊右側的 **Run workflow** 按鈕

#### 步驟 2：配置測試參數

**測試模式（Dry Run）：**
- **測試模式**：選擇 `dry-run`
- **文章 Slug**：（可選）留空使用最新文章，或輸入特定文章 slug（例如：`2026-01-09-045335`）
- **測試郵件地址**：不需要填寫

**發送測試郵件：**
- **測試模式**：選擇 `send-test-email`
- **文章 Slug**：（可選）留空使用最新文章，或輸入特定文章 slug
- **測試郵件地址**：輸入您的 Email 地址（例如：`your-email@gmail.com`）

#### 步驟 3：執行測試

點擊 **Run workflow** 按鈕，工作流程會自動執行。

#### 查看測試結果

1. 點擊執行中的工作流程
2. 查看 **test-newsletter** job 的日誌
3. 查看測試結果摘要

**優點：**
- ✅ 無需本地環境設置
- ✅ 自動使用 GitHub Secrets 中的憑證
- ✅ 可以在任何地方觸發測試
- ✅ 測試結果會保存在 GitHub Actions 日誌中

**注意：**
- 需要先在 GitHub Secrets 中設置必要的環境變數
- 測試模式只需要 Google Sheets 憑證
- 發送測試郵件需要 Gmail 憑證

### 方式 5：實際發送電子報

**實際發送給所有訂閱者（謹慎使用！）**

```bash
# 發送今天日期的文章
node scripts/send-newsletter.js

# 注意：此腳本會實際發送郵件給所有已驗證的訂閱者
# 建議先用測試模式確認
```

## 🔧 環境變數設置

### GitHub Secrets 設置（用於 GitHub Actions）

在 GitHub 儲存庫中設置 Secrets：

1. 前往 **Settings** > **Secrets and variables** > **Actions**
2. 點擊 **New repository secret**
3. 添加以下 Secrets：

**測試模式（Dry Run）需要的 Secrets：**
- `GOOGLE_SHEETS_CREDENTIALS` - Google Sheets 服務帳號憑證（JSON 格式）
- `GOOGLE_SHEETS_ID` - Google Sheets ID

**發送測試郵件需要的額外 Secrets：**
- `GMAIL_USER` - Gmail 帳號
- `GMAIL_APP_PASSWORD` - Gmail 應用程式密碼
- `BLOG_URL` - （可選）部落格網址，預設：`https://sunzhi-will.github.io`

詳細設置說明請參考 [電子報設置指南](../setup/newsletter-setup.md)

### 本地環境變數設置

### 測試模式（Dry Run）

只需要設置讀取訂閱列表的環境變數：

```bash
# Windows PowerShell
$env:GOOGLE_SHEETS_CREDENTIALS="$(Get-Content path/to/credentials.json -Raw)"
$env:GOOGLE_SHEETS_ID="your-spreadsheet-id"

# Linux/Mac
export GOOGLE_SHEETS_CREDENTIALS="$(cat path/to/credentials.json)"
export GOOGLE_SHEETS_ID="your-spreadsheet-id"
```

### 發送測試郵件

需要額外設置 Gmail 憑證：

```bash
# Windows PowerShell
$env:GMAIL_USER="your-email@gmail.com"
$env:GMAIL_APP_PASSWORD="your-app-password"
$env:BLOG_URL="https://sunzhi-will.github.io"

# Linux/Mac
export GMAIL_USER="your-email@gmail.com"
export GMAIL_APP_PASSWORD="your-app-password"
export BLOG_URL="https://sunzhi-will.github.io"
```

### 使用 .env 文件（推薦）

在專案根目錄創建 `.env` 文件：

```env
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account",...}
GOOGLE_SHEETS_ID=your-spreadsheet-id
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
BLOG_URL=https://sunzhi-will.github.io
```

然後使用 `dotenv` 載入（需要安裝 `dotenv-cli`）：

```bash
npm install -g dotenv-cli
dotenv node scripts/test-newsletter.js --dry-run --latest
```

## 📝 測試流程建議

### 第一次測試（使用 GitHub Actions - 推薦）

1. **確認 GitHub Secrets 已設置**
   - 前往 **Settings** > **Secrets and variables** > **Actions**
   - 確認已設置 `GOOGLE_SHEETS_CREDENTIALS` 和 `GOOGLE_SHEETS_ID`

2. **執行測試模式（Dry Run）**
   - 前往 **Actions** > **Test Newsletter**
   - 點擊 **Run workflow**
   - 選擇測試模式：`dry-run`
   - 點擊 **Run workflow** 執行
   - 查看測試結果，確認會發送給哪些訂閱者

3. **發送測試郵件給自己**
   - 再次點擊 **Run workflow**
   - 選擇測試模式：`send-test-email`
   - 輸入您的 Email 地址
   - 點擊 **Run workflow** 執行
   - 檢查您的收件匣，確認郵件格式正確

4. **檢查郵件內容**
   - 確認郵件格式正確
   - 確認連結可以正常訪問
   - 確認中文和英文版本都正確

5. **確認無誤後，實際發送**
   - 使用本地環境或 GitHub Actions 執行 `scripts/send-newsletter.js`

### 第一次測試（使用本地環境）

1. **列出所有文章**
   ```bash
   node scripts/test-newsletter.js --list
   ```

2. **測試模式查看會發送給誰**
   ```bash
   node scripts/test-newsletter.js --dry-run --latest
   ```

3. **發送測試郵件給自己**
   ```bash
   node scripts/test-newsletter.js --test-email=your-email@gmail.com --latest
   ```

4. **檢查郵件內容**
   - 確認郵件格式正確
   - 確認連結可以正常訪問
   - 確認中文和英文版本都正確

5. **確認無誤後，實際發送**
   ```bash
   node scripts/send-newsletter.js
   ```

### 日常測試

每次發布新文章前：

1. **使用 GitHub Actions 測試模式**（推薦）
   - 前往 **Actions** > **Test Newsletter**
   - 執行 `dry-run` 模式確認會發送給誰
   - 執行 `send-test-email` 模式發送測試郵件給自己

2. **或使用本地環境**
   - 使用測試模式確認會發送給誰
   - 發送測試郵件給自己確認內容
   - 確認無誤後再實際發送

## ⚠️ 注意事項

1. **測試模式不會實際發送郵件**
   - 使用 `--dry-run` 參數時，只會顯示統計資訊
   - 不會消耗 Gmail 的每日發送配額

2. **測試郵件會實際發送**
   - 使用 `--test-email` 參數時，會實際發送郵件
   - 郵件主題會加上 `[測試]` 前綴
   - 會發送中文和英文兩個版本

3. **實際發送會發給所有訂閱者**
   - 使用 `scripts/send-newsletter.js` 會發送給所有已驗證的訂閱者
   - 建議先用測試模式確認

4. **環境變數設置**
   - 測試模式只需要 Google Sheets 憑證
   - 發送測試郵件需要 Gmail 憑證
   - 實際發送需要所有環境變數

5. **Gmail 配額限制**
   - 免費帳號：每日最多 500 封郵件
   - 建議在測試時使用測試模式，避免浪費配額

## 🐛 故障排除

### 問題：找不到文章

**錯誤訊息：**
```
❌ 文章不存在: 2026-01-09-045335
```

**解決方法：**
1. 使用 `--list` 查看所有可用文章
2. 確認文章 slug 格式正確（YYYY-MM-DD-HHMMSS）
3. 確認文章資料夾存在於 `content/blog/` 目錄

### 問題：無法讀取訂閱列表

**錯誤訊息：**
```
⚠️  No Google Sheets configuration found. Using empty subscription list.
```

**解決方法：**
1. 確認已設置 `GOOGLE_SHEETS_CREDENTIALS` 環境變數
2. 確認已設置 `GOOGLE_SHEETS_ID` 環境變數
3. 確認服務帳號有試算表的讀取權限

### 問題：無法發送測試郵件

**錯誤訊息：**
```
❌ Gmail credentials not configured.
```

**解決方法：**
1. 確認已設置 `GMAIL_USER` 環境變數
2. 確認已設置 `GMAIL_APP_PASSWORD` 環境變數
3. 確認應用程式密碼正確（不是 Gmail 密碼）
4. 確認已啟用兩步驟驗證

### 問題：郵件發送失敗

**錯誤訊息：**
```
❌ 錯誤: Invalid login
```

**解決方法：**
1. 確認 Gmail 應用程式密碼正確
2. 確認已啟用兩步驟驗證
3. 確認帳號沒有被限制
4. 檢查 Gmail 的每日發送配額

## 🚀 GitHub Actions 工作流程說明

### 工作流程檔案

`.github/workflows/test-newsletter.yml`

### 觸發方式

- **手動觸發**：前往 **Actions** > **Test Newsletter** > **Run workflow**

### 輸入參數

| 參數           | 說明                                        | 必填 | 預設值            |
| -------------- | ------------------------------------------- | ---- | ----------------- |
| `test_mode`    | 測試模式                                    | ✅    | `dry-run`         |
| `article_slug` | 文章 Slug（留空使用最新文章或今天的日期）   | ❌    | -                 |
| `test_email`   | 測試郵件地址（僅 send-test-email 模式需要） | ❌    | -                 |
| `test_lang`    | 測試語系（zh-TW 或 en，僅 send-test-email） | ❌    | -（發送兩種語系） |

**注意：**
- `send-to-all` 模式：留空 `article_slug` 會使用今天的日期（與正式發文一致）
- `dry-run` 和 `send-test-email` 模式：留空 `article_slug` 會使用最新文章
- `test_lang`：僅在 `send-test-email` 模式有效，未指定則發送兩種語系版本（僅用於測試）
- **正式發文時，每個訂閱者只會收到其設定語系的版本**（根據訂閱者的 `Lang` 欄位）
- **正式發文時，只會發送給訂閱了對應文章類型的訂閱者**（根據訂閱者的 `Types` 欄位和文章類型匹配）

### 測試模式選項

1. **dry-run**：測試模式，不實際發送郵件
   - 只顯示會發送給哪些訂閱者
   - 顯示統計資訊（會發送、跳過未驗證、跳過類型不匹配）
   - 不會消耗 Gmail 配額
   - **推薦在發送前先使用此模式確認**

2. **send-test-email**：發送測試郵件
   - 實際發送郵件到指定 Email
   - 可以指定語系（`zh-TW` 或 `en`），未指定則發送兩種語系版本
   - 郵件主題會加上 `[測試]` 前綴
   - 需要提供測試郵件地址
   - **建議先發給自己確認郵件格式**
   - **注意：正式發文時，每個訂閱者只會收到其設定語系的版本**

3. **send-to-all**：發送給所有訂閱者（完全模擬正式發文）
   - 實際發送郵件給所有已驗證的訂閱者
   - 使用與正式發文相同的 `send-newsletter.js` 腳本
   - 環境變數和執行邏輯與正式發文完全一致
   - **每個訂閱者只會收到其設定語系的版本**（zh-TW 或 en）
   - **只發送給訂閱了對應文章類型的訂閱者**（ai-daily, blockchain, sun-written, all）
   - **⚠️ 謹慎使用！會實際發送給所有訂閱者**

### 執行步驟

工作流程會自動執行以下步驟：

1. **Checkout repository** - 檢出程式碼
2. **Setup Node.js** - 設置 Node.js 環境
3. **Install dependencies** - 安裝依賴套件
4. **List available articles** - 列出所有可用文章
5. **Test Newsletter** - 執行測試（根據選擇的模式）：
   - `dry-run`：執行測試模式
   - `send-test-email`：發送測試郵件
   - `send-to-all`：發送給所有訂閱者（完全模擬正式發文）
6. **Test Results Summary** - 顯示測試結果摘要

### 與正式發文流程的對比

| 項目     | 正式發文流程                                                                          | 測試流程（send-to-all）        |
| -------- | ------------------------------------------------------------------------------------- | ------------------------------ |
| 腳本     | `scripts/send-newsletter.js`                                                          | `scripts/send-newsletter.js` ✅ |
| 環境變數 | GMAIL_USER, GMAIL_APP_PASSWORD, BLOG_URL, GOOGLE_SHEETS_CREDENTIALS, GOOGLE_SHEETS_ID | 完全相同 ✅                     |
| 文章選擇 | 自動使用今天的日期                                                                    | 可選擇今天的日期或指定文章     |
| 發送對象 | 所有已驗證的訂閱者                                                                    | 所有已驗證的訂閱者 ✅           |
| 語系處理 | 每個訂閱者只收到其設定語系的版本（zh-TW 或 en）                                       | 完全相同 ✅                     |
| 類型過濾 | 只發送給訂閱了對應文章類型的訂閱者（ai-daily, blockchain, sun-written, all）          | 完全相同 ✅                     |
| 執行邏輯 | 完全一致                                                                              | 完全一致 ✅                     |

**結論：** `send-to-all` 模式完全參考正式發文的方式，使用相同的腳本、環境變數和執行邏輯，可以完全模擬正式發文流程。

### 查看測試結果

1. 前往 **Actions** 標籤
2. 點擊最新的 **Test Newsletter** 執行
3. 點擊 **test-newsletter** job
4. 查看各步驟的日誌輸出

## 📚 相關文檔

- [電子報設置指南](../setup/newsletter-setup.md)
- [發送腳本說明](../scripts/ai-daily-generation.md)

---

**最後更新**：2026年1月  
**維護者**：SunZhi-Will
