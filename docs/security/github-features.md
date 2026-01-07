# 🔒 GitHub 內建安全功能配置指南

GitHub 提供了多個內建的自動化安全功能，本文檔說明如何啟用和配置這些功能。

---

## 🤖 Dependabot（已配置）

**狀態**: ✅ **已啟用**

Dependabot 是 GitHub 的自動化安全機器人，會：
- 自動掃描依賴套件的安全漏洞
- 自動建立 Pull Request 修復漏洞
- 每週自動檢查更新

### 配置檔案
- `.github/dependabot.yml` - 已配置完成

### 查看 Dependabot 活動
1. 前往 Repository > **Security** 標籤
2. 點擊 **Dependabot alerts** 查看安全警報
3. 點擊 **Dependabot** 查看自動建立的 PR

---

## 🔍 需要在 GitHub Settings 中啟用的功能

### 1. Dependabot Alerts（安全警報）

**位置**: Repository Settings > Security > Code security and analysis

**功能**:
- 自動掃描依賴套件漏洞
- 發現漏洞時自動建立警報
- 在 Security 標籤中顯示

**啟用步驟**:
1. 前往 Repository Settings
2. 點擊 **Security** > **Code security and analysis**
3. 啟用 **Dependabot alerts**
4. 啟用 **Dependabot security updates**（自動建立修復 PR）

---

### 2. Secret Scanning（機密資訊掃描）

**位置**: Repository Settings > Security > Code security and analysis

**功能**:
- 自動掃描程式碼中的 API keys、tokens、密碼等
- 發現機密資訊時自動通知
- 支援多種服務商（GitHub, AWS, Azure, Google Cloud 等）

**啟用步驟**:
1. 前往 Repository Settings
2. 點擊 **Security** > **Code security and analysis**
3. 啟用 **Secret scanning**

**注意**: 
- 免費方案已包含基本功能
- 企業版有更進階的掃描功能

---

### 3. Code Scanning（代碼掃描）

**位置**: Repository Settings > Security > Code security and analysis

**功能**:
- 使用 CodeQL 自動掃描代碼漏洞
- 發現安全問題時自動建立警報
- 支援多種程式語言

**已配置**:
- ✅ `.github/workflows/codeql.yml` - CodeQL 工作流程已建立

**啟用步驟**:
1. 前往 Repository Settings
2. 點擊 **Security** > **Code security and analysis**
3. 啟用 **Code scanning**
4. 選擇 **Set up this workflow** 或使用已建立的 `codeql.yml`

---

### 4. Dependency Graph（依賴關係圖）

**位置**: Repository Settings > Security > Code security and analysis

**功能**:
- 自動分析專案依賴關係
- 顯示依賴套件的安全狀態
- 支援 Dependabot alerts

**啟用步驟**:
1. 前往 Repository Settings
2. 點擊 **Security** > **Code security and analysis**
3. 啟用 **Dependency graph**

**注意**: 此功能通常預設啟用

---

## 📋 完整啟用檢查清單

### 在 GitHub Repository Settings 中啟用：

- [ ] **Dependabot alerts** - 依賴漏洞警報
- [ ] **Dependabot security updates** - 自動安全更新
- [ ] **Secret scanning** - 機密資訊掃描
- [ ] **Code scanning** - 代碼安全掃描（CodeQL）
- [ ] **Dependency graph** - 依賴關係圖

### 已配置的檔案：

- [x] `.github/dependabot.yml` - Dependabot 配置
- [x] `.github/workflows/codeql.yml` - CodeQL 代碼掃描
- [x] `.github/workflows/security-audit.yml` - 安全審計
- [x] `.github/workflows/security-scan.yml` - 完整安全掃描
- [x] `.github/workflows/security-alert.yml` - 安全警報處理
- [x] `.github/workflows/auto-fix-security.yml` - 自動修復

---

## 🎯 快速啟用指南

### 方法 1: 透過 GitHub Web UI

1. **前往 Repository**
   ```
   https://github.com/SunZhi-Will/sunzhi-will.github.io/settings/security_analysis
   ```

2. **啟用所有安全功能**
   - 點擊每個功能的 **Enable** 按鈕
   - 確認啟用

3. **驗證啟用狀態**
   - 前往 **Security** 標籤
   - 檢查是否有安全掃描結果

### 方法 2: 透過 GitHub CLI

```bash
# 啟用 Dependabot alerts
gh api repos/:owner/:repo/vulnerability-alerts -X PUT

# 啟用 Dependabot security updates
gh api repos/:owner/:repo/automated-security-fixes -X PUT

# 啟用 Secret scanning
gh api repos/:owner/:repo/vulnerability-alerts -X PUT
```

---

## 📊 安全功能對照表

| 功能 | 配置檔案 | Settings 啟用 | 狀態 |
|------|---------|--------------|------|
| Dependabot | `.github/dependabot.yml` | Dependabot alerts | ✅ 已配置 |
| CodeQL | `.github/workflows/codeql.yml` | Code scanning | ✅ 已配置 |
| Secret Scanning | N/A | Secret scanning | ⚠️ 需啟用 |
| Security Audit | `.github/workflows/security-audit.yml` | N/A | ✅ 已配置 |
| Auto Fix | `.github/workflows/auto-fix-security.yml` | N/A | ✅ 已配置 |

---

## 🔔 通知設定

### 接收安全警報通知

1. **個人通知設定**
   - 前往 GitHub Settings > Notifications
   - 啟用 **Security alerts**

2. **Repository 通知設定**
   - 前往 Repository Settings > Notifications
   - 啟用安全相關通知

3. **Email 通知**
   - 在個人設定中啟用 Email 通知
   - 選擇接收安全警報的 Email

---

## 🛠️ 故障排除

### Dependabot 沒有建立 PR

**可能原因**:
- Dependabot alerts 未啟用
- Repository 沒有 `package.json` 或 `package-lock.json`
- 依賴套件沒有已知漏洞

**解決方法**:
1. 確認 Settings 中已啟用 Dependabot alerts
2. 檢查 Security 標籤是否有警報
3. 手動觸發：前往 Security > Dependabot > Create update PR

### CodeQL 掃描失敗

**可能原因**:
- Code scanning 未啟用
- 工作流程配置錯誤
- 語言不支援

**解決方法**:
1. 確認 Settings 中已啟用 Code scanning
2. 檢查 `.github/workflows/codeql.yml` 配置
3. 查看 Actions 中的錯誤訊息

### Secret Scanning 沒有掃描

**可能原因**:
- Secret scanning 未啟用
- 機密資訊格式不符合已知模式

**解決方法**:
1. 確認 Settings 中已啟用 Secret scanning
2. 檢查 Security 標籤中的掃描結果
3. 手動測試：提交包含測試 API key 的 commit

---

## 📚 相關資源

- [GitHub Security Documentation](https://docs.github.com/en/code-security)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [Secret Scanning Documentation](https://docs.github.com/en/code-security/secret-scanning)

---

## ✅ 驗證清單

完成以下步驟後，您的專案將擁有完整的自動化安全保護：

- [ ] 在 GitHub Settings 中啟用所有安全功能
- [ ] 確認 Dependabot 正在運作（查看 Security 標籤）
- [ ] 確認 CodeQL 掃描正在執行（查看 Actions）
- [ ] 測試 Secret scanning（可選：提交測試 commit）
- [ ] 設定通知偏好（接收安全警報）

---

**最後更新**: 2025年1月  
**維護者**: SunZhi-Will

