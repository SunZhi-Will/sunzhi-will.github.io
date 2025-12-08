# AI 每日日報自動生成腳本

這個腳本會使用 Google Gemini API 自動生成 AI 領域的每日日報，並保存為 Markdown 文件到 `content/blog/` 目錄。

## 設置步驟

### 1. 取得 Google Gemini API Key

1. 前往 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 建立新的 API Key
3. 複製 API Key

### 2. 在 GitHub 設置 Secrets

1. 前往你的 GitHub Repository
2. 點擊 **Settings** > **Secrets and variables** > **Actions**
3. 點擊 **New repository secret**
4. 名稱輸入：`GEMINI_API_KEY`
5. 值輸入：你剛才複製的 API Key
6. 點擊 **Add secret**

### 3. 測試腳本（本地）

```bash
# 設置環境變數
export GEMINI_API_KEY="your-api-key-here"

# 執行腳本
node scripts/generate-ai-daily.js
```

### 4. 手動觸發 GitHub Actions

1. 前往 GitHub Repository 的 **Actions** 標籤
2. 選擇 **Generate Daily AI Report** workflow
3. 點擊 **Run workflow** 按鈕
4. 選擇分支並點擊 **Run workflow**

## 自動化設定

GitHub Actions 會每天 UTC 時間 00:00（台灣時間 08:00）自動執行，生成當天的 AI 日報。

## 生成的檔案格式

生成的 Markdown 檔案會保存在 `content/blog/` 目錄，檔名格式為：
```
ai-daily-report-YYYY-MM-DD.md
```

## 技術說明

- **SDK**: 使用最新的官方 SDK `@google/genai`（已取代已棄用的 `@google/generative-ai`）
- **模型選擇**: 腳本會自動嘗試多個模型，按優先順序：
  - `gemini-2.0-flash-exp` (最新實驗版)
  - `gemini-1.5-flash-latest` (穩定最新版)
  - `gemini-1.5-pro-latest` (Pro 最新版)
  - `gemini-pro` (穩定版)
- **錯誤處理**: 如果某個模型不可用，會自動嘗試下一個模型
- **注意**: `@google/generative-ai` 已於 2025 年 11 月 30 日停止支援，請使用新的 `@google/genai` SDK

## 注意事項

- 腳本會檢查當天是否已經生成過日報，避免重複生成
- 如果 API 調用失敗，workflow 會顯示錯誤訊息
- 生成的日報會自動提交到 repository
- 腳本使用 Node.js 內建的 `fetch` API（Node.js 18+），無需額外依賴








