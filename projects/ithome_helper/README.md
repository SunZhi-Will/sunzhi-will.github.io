# iT邦幫忙輔助工具

一個專為 iT邦幫忙 (https://ithelp.ithome.com.tw/) 設計的Chrome擴充工具，提供更好的編輯體驗和寫作輔助功能。

## 功能特色

- 🎯 **垂直工具列**：將原本水平的編輯工具列轉換為垂直顯示
- 📍 **懸浮定位**：工具列固定在左側，不影響編輯區域
- 🎨 **自訂外觀**：可調整透明度、位置等設定
- 🖱️ **拖拽移動**：支援拖拽調整工具列位置
- ⌨️ **快捷鍵支援**：提供快捷鍵快速切換功能
- 🌙 **深色模式**：自動適應系統深色模式

## 安裝方式

### 開發版本

1. 克隆此專案
2. 安裝依賴：
   ```bash
   npm install
   ```
3. 建置專案：
   ```bash
   npm run build
   ```
4. 在Chrome中載入擴充功能：
   - 開啟 `chrome://extensions/`
   - 啟用「開發者模式」
   - 點擊「載入未封裝的擴充功能」
   - 選擇專案的 `dist` 資料夾

## 使用方式

1. 前往iT邦幫忙編輯頁面（草稿或編輯模式）
2. 工具列會自動轉換為垂直懸浮顯示
3. 點擊擴充功能圖示可進行設定調整
4. 使用快捷鍵快速切換功能

## 快捷鍵

- `Ctrl+Shift+T`：切換工具列顯示/隱藏
- `Ctrl+Shift+E`：切換擴充功能啟用狀態

## 技術規格

- **TypeScript**：使用TypeScript開發，提供型別安全
- **Manifest V3**：使用最新的Chrome擴充功能API
- **Webpack**：模組化建置系統
- **CSS3**：現代化樣式設計，支援動畫效果

## 專案結構

```
src/
├── manifest.json          # 擴充功能配置
├── content.ts            # 內容腳本（主要功能）
├── content.css           # 內容樣式
├── background.ts         # 背景腳本
├── popup.ts             # 彈出視窗腳本
├── popup.html           # 彈出視窗HTML
└── assets/              # 圖示資源
```

## 開發指令

```bash
# 安裝依賴
npm install

# 開發模式（監聽檔案變化）
npm run dev

# 建置生產版本
npm run build

# 清理建置檔案
npm run clean
```

## 瀏覽器支援

- Chrome 88+
- Edge 88+
- 其他基於Chromium的瀏覽器

## 授權

MIT License

## 貢獻

歡迎提交Issue和Pull Request來改善此專案。

## 更新日誌

### v1.0.0
- 初始版本發布
- 實現垂直工具列功能
- 支援拖拽移動
- 提供設定介面
- 支援快捷鍵操作
