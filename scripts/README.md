# AI 每日日報自動生成腳本

這個腳本會使用 Google Gemini API 自動生成 AI 領域的每日日報，並根據資料結構保存為 Markdown 文件到 `content/blog/[日期時間]/` 目錄。同時支援自動生成封面圖片。

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

**（可選）圖片生成設定：**
- 如果要啟用自動生成封面圖片功能，需要額外設置 `OPENAI_API_KEY`
- 圖片生成使用 OpenAI DALL-E 3 API
- 如果未設置 `OPENAI_API_KEY`，腳本仍會正常運行，但不會生成封面圖片

### 3. 測試腳本（本地）

```bash
# 設置環境變數（必需）
export GEMINI_API_KEY="your-api-key-here"

# 設置環境變數（可選，用於圖片生成）
export OPENAI_API_KEY="your-openai-api-key-here"

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

生成的檔案會保存在 `content/blog/` 目錄，符合專案的資料結構：

```
content/blog/
  └── YYYYMMDD-HHMMSS/          # 日期時間戳作為資料夾名稱
      ├── article.zh-TW.md      # 繁體中文文章
      └── cover-YYYYMMDD-HHMMSS.png  # 封面圖片（如果啟用）
```

**資料結構說明：**
- 使用時間戳（`YYYYMMDD-HHMMSS`）作為資料夾名稱，例如：`20251203-173413`
- 文章檔案命名為 `article.zh-TW.md`（符合多語言支援結構）
- 封面圖片（如果生成）會保存在同一個資料夾中
- Frontmatter 中會自動包含 `coverImage` 欄位（如果生成了圖片）

## 技術說明

### 文章生成
- **SDK**: 使用最新的官方 SDK `@google/genai`（已取代已棄用的 `@google/generative-ai`）
- **模型選擇**: 腳本會自動嘗試多個模型，按優先順序：
  - `gemini-2.5-pro` (Gemini 2.5 Pro - 專業版本，優先使用)
  - `gemini-2.5-flash` (Gemini 2.5 Flash - 快速版本)
  - `gemini-2.5-pro-latest` / `gemini-2.5-flash-latest` (備用命名)
  - `gemini-2.0-flash-exp` (Gemini 2.0 Flash Experimental)
  - `gemini-1.5-flash-latest` (Gemini 1.5 Flash Latest)
  - `gemini-1.5-pro-latest` (Gemini 1.5 Pro Latest)
  - `gemini-pro` (Gemini Pro 穩定版)
- **錯誤處理**: 如果某個模型不可用，會自動嘗試下一個模型
- **注意**: `@google/generative-ai` 已於 2025 年 11 月 30 日停止支援，請使用新的 `@google/genai` SDK

### 圖片生成
- **API**: 使用 OpenAI DALL-E 3 API 生成封面圖片
- **流程**: 
  1. 使用 Gemini 生成圖片描述
  2. 使用 DALL-E 3 根據描述生成圖片
  3. 自動下載並保存圖片到文章資料夾
- **可選功能**: 如果未設置 `OPENAI_API_KEY`，腳本仍會正常運行，但不會生成封面圖片

## 注意事項

- 腳本會檢查當天是否已經生成過日報（檢查資料夾是否存在），避免重複生成
- 如果 API 調用失敗，workflow 會顯示錯誤訊息
- 生成的日報會自動提交到 repository
- 腳本使用 Node.js 內建的 `fetch` API（Node.js 18+），無需額外依賴
- **資料結構**: 生成的檔案符合專案的資料結構要求，使用資料夾結構和多語言檔案命名
- **圖片支援**: 生成的圖片會自動複製到 `public/blog/` 目錄（透過 `copy-blog-images.js` 腳本）








