# 🎯 Cursor AI 規則說明

本文檔說明專案中配置的 Cursor AI 規則文件。

---

## 📁 規則文件位置

### 1. `.cursorrules` (根目錄)
主要的 Cursor 規則文件，定義專案的文件組織規則。

### 2. `.cursor/rules/` 目錄
詳細的規則文件，使用 `.mdc` 格式：

- **`file-organization.mdc`** - 文件組織規則（優先級 1）
- **`code-style.mdc`** - 代碼風格規則（優先級 2）

---

## 📋 規則內容

### 文件組織規則

**核心原則**:
- ✅ 所有文檔文件必須放在 `docs/` 目錄下
- ✅ 根目錄只允許 README 和配置文件
- ❌ 禁止在根目錄放置文檔文件、報告文件、臨時文件

**目錄結構**:
```
docs/
├── security/          # 安全相關文檔
├── setup/            # 設置文檔
├── scripts/           # 腳本文檔
├── cleanup-report.md # 清理報告
└── README.md         # 文檔索引
```

### 代碼風格規則

- **組件命名**: PascalCase (`BlogCard.tsx`)
- **函數命名**: camelCase (`getPostBySlug()`)
- **文件組織**: 一個組件一個文件
- **安全規範**: 使用 HTML sanitization，驗證輸入

---

## 🔍 如何使用

### 在 Cursor 中重新加載規則

1. 打開命令面板 (`Cmd/Ctrl + Shift + P`)
2. 搜索 `Reload Cursor Rules`
3. 選擇並執行

### 驗證規則

規則文件會自動被 Cursor 讀取，AI 助手會根據這些規則：
- 自動將文檔文件放在正確的目錄
- 避免在根目錄創建不必要的文件
- 遵循代碼風格規範

---

## 📝 規則更新

當需要更新規則時：

1. 編輯 `.cursorrules` 或 `.cursor/rules/*.mdc` 文件
2. 在 Cursor 中重新加載規則
3. 更新本文檔說明變更

---

## ✅ 檢查清單

在創建新文件前，AI 助手會自動檢查：

- [ ] 文件類型（文檔、代碼、配置）
- [ ] 目標目錄是否正確
- [ ] 是否有重複文件
- [ ] 文件命名是否符合規範

---

**最後更新**: 2025年1月  
**維護者**: SunZhi-Will

