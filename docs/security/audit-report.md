# 資安檢查報告 (Security Audit Report)

**檢查日期**: 2025年1月
**專案**: sunzhi-will.github.io

## 🔴 嚴重安全漏洞 (Critical Vulnerabilities)

### 1. Next.js 15.1.7 - **CRITICAL** ⚠️
目前版本: `15.1.7`  
建議版本: `15.5.9` (修復漏洞) 或 `16.1.0` (最新版)

**發現的漏洞**:
- **GHSA-3h52-269p-cp9r**: 資訊洩露 - Next.js dev server 缺乏來源驗證
- **GHSA-67rr-84xm-4c7r**: DoS 攻擊 - 快取中毒漏洞
- **GHSA-g5qg-72qw-gw5v**: 快取鍵混淆 - Image Optimization API Routes
- **GHSA-xv57-4mr9-wg8v**: 內容注入 - Image Optimization
- **GHSA-4342-x723-ch2f**: SSRF - Middleware 重定向處理不當
- **GHSA-f82v-jwr5-mffw**: 授權繞過 - Next.js Middleware
- **GHSA-9qr9-h5gf-34mp**: RCE - React flight protocol 漏洞
- **GHSA-w37m-7fhw-fmv9**: 原始碼洩露 - Server Actions
- **GHSA-mwv6-3258-q52c**: DoS - Server Components

**修復建議**: 
```bash
npm install next@15.5.9
# 或升級到最新版
npm install next@latest
```

---

## 🟠 高度安全漏洞 (High Vulnerabilities)

### 2. glob 10.2.0 - 10.4.5 - **HIGH** ⚠️
**漏洞**: GHSA-5j98-mcp5-4vw2
- **問題**: CLI 命令注入漏洞，透過 -c/--cmd 參數執行時使用 shell:true
- **修復**: 執行 `npm audit fix` 自動更新

---

## 🟡 中等安全漏洞 (Moderate Vulnerabilities)

### 3. @babel/runtime <7.26.10 - **MODERATE**
**漏洞**: GHSA-968p-4wvh-cqc8
- **問題**: Babel 在轉譯命名捕獲群組時，生成的程式碼中 .replace 的 RegExp 複雜度效率問題
- **修復**: 執行 `npm audit fix`

### 4. @eslint/plugin-kit <0.3.4 - **MODERATE**
**漏洞**: GHSA-xffm-g5w8-qvg7
- **問題**: 透過 ConfigCommentParser 的 Regular Expression Denial of Service (ReDoS) 攻擊
- **影響**: eslint 9.10.0 - 9.26.0 依賴此套件
- **修復**: 執行 `npm audit fix`

### 5. js-yaml 4.0.0 - 4.1.0 - **MODERATE**
**漏洞**: GHSA-mh29-5h37-fv8m
- **問題**: merge (<<) 中的原型污染 (Prototype Pollution)
- **修復**: 執行 `npm audit fix`

### 6. brace-expansion 1.0.0 - 1.1.11 || 2.0.0 - 2.0.1 - **LOW/MODERATE**
**漏洞**: GHSA-v6h2-p8h4-qcjw
- **問題**: Regular Expression Denial of Service (ReDoS) 漏洞
- **修復**: 執行 `npm audit fix`

---

## 📦 需要更新的套件清單

### 核心框架 (建議優先更新)
| 套件                   | 目前版本 | 建議版本 | 最新版本 | 優先級 |
| ---------------------- | -------- | -------- | -------- | ------ |
| **next**               | 15.1.7   | 15.5.9   | 16.1.0   | 🔴 緊急 |
| **react**              | 19.0.0   | 19.2.3   | 19.2.3   | 🟠 高   |
| **react-dom**          | 19.0.0   | 19.2.3   | 19.2.3   | 🟠 高   |
| **eslint**             | 9.20.1   | 9.39.2   | 9.39.2   | 🟡 中   |
| **eslint-config-next** | 15.1.7   | 15.1.7   | 16.1.0   | 🟡 中   |

### 開發依賴
| 套件                 | 目前版本 | 建議版本 | 最新版本 | 優先級 |
| -------------------- | -------- | -------- | -------- | ------ |
| **@eslint/eslintrc** | 3.2.0    | 3.3.3    | 3.3.3    | 🟡 中   |
| **@types/node**      | 20.17.18 | 20.19.27 | 25.0.3   | 🟢 低   |
| **@types/react**     | 19.0.8   | 19.2.7   | 19.2.7   | 🟢 低   |
| **@types/react-dom** | 19.0.3   | 19.2.3   | 19.2.3   | 🟢 低   |
| **typescript**       | 5.7.3    | 5.9.3    | 5.9.3    | 🟢 低   |
| **postcss**          | 8.5.2    | 8.5.6    | 8.5.6    | 🟢 低   |

### 生產依賴
| 套件                            | 目前版本 | 建議版本 | 最新版本 | 優先級 |
| ------------------------------- | -------- | -------- | -------- | ------ |
| **@google/genai**               | 1.31.0   | 1.31.0   | 1.34.0   | 🟢 低   |
| **@tsparticles/slim**           | 3.8.1    | 3.9.1    | 3.9.1    | 🟢 低   |
| **framer-motion**               | 12.4.2   | 12.23.26 | 12.23.26 | 🟢 低   |
| **react-grid-layout**           | 1.5.0    | 1.5.3    | 2.1.0    | 🟡 中   |
| **react-intersection-observer** | 9.15.1   | 9.16.0   | 10.0.0   | 🟢 低   |
| **tailwindcss**                 | 3.4.17   | 3.4.19   | 4.1.18   | 🟡 中   |

---

## 🔧 修復步驟建議

### 步驟 1: 自動修復可修復的漏洞
```bash
npm audit fix
```

### 步驟 2: 手動更新關鍵套件
```bash
# 更新 Next.js (修復嚴重漏洞)
npm install next@15.5.9

# 更新 React 和 React DOM
npm install react@19.2.3 react-dom@19.2.3

# 更新 ESLint
npm install eslint@9.39.2 --save-dev
```

### 步驟 3: 更新其他套件
```bash
# 更新開發依賴
npm install @eslint/eslintrc@latest @types/node@latest @types/react@latest @types/react-dom@latest typescript@latest postcss@latest --save-dev

# 更新生產依賴
npm install @google/genai@latest @tsparticles/slim@latest framer-motion@latest --save
```

### 步驟 4: 強制修復所有漏洞 (謹慎使用)
```bash
npm audit fix --force
```
⚠️ **注意**: 這可能會更新到主要版本，可能導致破壞性變更

### 步驟 5: 測試專案
```bash
npm run build
npm run dev
```

---

## 🔍 GitHub Actions 安全檢查

### 檢查結果: ✅ 基本安全

**發現的配置**:
- ✅ 使用 `actions/checkout@v4` (最新版本)
- ✅ 使用 `actions/setup-node@v4` (最新版本)
- ✅ 使用 `JamesIves/github-pages-deploy-action@v4.6.4` (較新版本)
- ✅ 正確使用 secrets 管理 API keys
- ✅ 使用 `npm ci` 而非 `npm install` (更安全)

**建議改進**:
1. 考慮使用 Dependabot 自動更新依賴
2. 考慮在 workflow 中加入安全掃描步驟
3. 檢查 `github-pages-deploy-action` 是否有更新版本

---

## 📋 後續建議

### 1. 建立自動化安全檢查
在 `.github/workflows/` 中新增安全檢查 workflow:
```yaml
name: Security Audit
on:
  schedule:
    - cron: '0 0 * * 1'  # 每週一檢查
  workflow_dispatch:
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm audit --audit-level=moderate
```

### 2. 啟用 Dependabot
在 `.github/dependabot.yml` 中設定自動更新:
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

### 3. 定期檢查
- 每週執行 `npm audit`
- 每月檢查主要套件更新
- 關注安全公告

---

## 📊 漏洞統計

- **Critical (嚴重)**: 1 個 (Next.js)
- **High (高度)**: 1 個 (glob)
- **Moderate (中等)**: 4 個
- **Low (低度)**: 1 個
- **總計**: 7 個漏洞

---

## ⚠️ 重要提醒

1. **Next.js 漏洞最緊急**: 包含多個嚴重漏洞，建議立即更新
2. **測試後再部署**: 更新後務必完整測試專案功能
3. **備份專案**: 更新前建議先建立備份或建立新分支
4. **逐步更新**: 建議先更新安全漏洞，再更新其他套件

---

## 🔐 敏感資訊檢查

### ✅ 檢查結果: 良好

**已確認的安全措施**:
- ✅ `.gitignore` 正確配置，忽略 `.env*` 檔案
- ✅ `.gitignore` 正確配置，忽略 `*.pem` 私鑰檔案
- ✅ API keys 透過 GitHub Secrets 管理（`GEMINI_API_KEY`）
- ✅ 沒有發現硬編碼的 API keys 或憑證
- ✅ GitHub Actions 正確使用 secrets

**建議**:
1. 定期檢查是否有新的敏感檔案被意外提交
2. 使用 `git-secrets` 或類似工具防止敏感資訊提交
3. 考慮使用環境變數管理工具（如 `dotenv`）

---

## 🛠️ 快速修復

### 使用 GitHub Actions 自動修復（推薦）
1. 前往 GitHub Repository > Actions
2. 選擇 **Auto Fix Security Issues** workflow
3. 點擊 **Run workflow**，選擇修復級別
4. 審查自動建立的 Pull Request

### 手動修復步驟
```bash
# 1. 自動修復
npm audit fix

# 2. 更新關鍵套件
npm install next@15.5.9 react@19.2.3 react-dom@19.2.3

# 3. 更新開發依賴
npm install eslint@9.39.2 @eslint/eslintrc@latest --save-dev

# 4. 測試
npm run build
npm run dev
```

---

## 📝 檢查清單

在更新後，請確認：
- [ ] 專案可以正常建置 (`npm run build`)
- [ ] 開發伺服器正常運行 (`npm run dev`)
- [ ] 所有頁面正常顯示
- [ ] API 功能正常運作
- [ ] 沒有新的錯誤或警告
- [ ] GitHub Actions workflow 正常執行

---

---

## ✅ 修復狀態

**最後修復時間**: 2025年1月  
**修復結果**: ✅ **所有安全漏洞已修復**

### 已執行的修復
- ✅ 執行 `npm audit fix` - 修復了 6 個漏洞
- ✅ 更新 Next.js 從 15.1.7 到 15.5.9 - 修復了 9 個嚴重漏洞
- ✅ 更新 React 從 19.0.0 到 19.2.3
- ✅ 更新 React DOM 從 19.0.0 到 19.2.3
- ✅ 更新 ESLint 從 9.20.1 到 9.39.2
- ✅ 更新 @eslint/eslintrc 從 3.2.0 到 3.3.3
- ✅ 修復 TypeScript 配置，排除子專案目錄
- ✅ 專案建置測試通過

### 當前安全狀態
```bash
npm audit
# found 0 vulnerabilities ✅
```

**報告生成時間**: 2025年1月  
**最後修復時間**: 2025年1月  
**下次檢查建議**: 1週後  
**自動修復**: 使用 GitHub Actions 自動化安全修復（`.github/workflows/auto-fix-security.yml`）

