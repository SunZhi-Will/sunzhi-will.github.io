# 資安修復腳本 (Security Fix Script)
# 此腳本會自動修復發現的安全漏洞

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  資安漏洞修復腳本" -ForegroundColor Cyan
Write-Host "  Security Vulnerability Fix Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 步驟 1: 顯示當前漏洞
Write-Host "[步驟 1/5] 檢查當前安全漏洞..." -ForegroundColor Yellow
npm audit

Write-Host ""
Write-Host "按任意鍵繼續自動修復，或按 Ctrl+C 取消..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# 步驟 2: 自動修復可修復的漏洞
Write-Host ""
Write-Host "[步驟 2/5] 自動修復可修復的漏洞..." -ForegroundColor Yellow
npm audit fix

# 步驟 3: 更新關鍵套件
Write-Host ""
Write-Host "[步驟 3/5] 更新關鍵套件 (Next.js, React)..." -ForegroundColor Yellow
Write-Host "更新 Next.js 到 15.5.9 (修復嚴重漏洞)..." -ForegroundColor Green
npm install next@15.5.9

Write-Host "更新 React 和 React DOM..." -ForegroundColor Green
npm install react@19.2.3 react-dom@19.2.3

# 步驟 4: 更新其他重要套件
Write-Host ""
Write-Host "[步驟 4/5] 更新其他重要套件..." -ForegroundColor Yellow
npm install eslint@9.39.2 --save-dev
npm install @eslint/eslintrc@latest --save-dev
npm install @types/react@latest @types/react-dom@latest --save-dev
npm install typescript@latest --save-dev

# 步驟 5: 再次檢查漏洞
Write-Host ""
Write-Host "[步驟 5/5] 再次檢查剩餘漏洞..." -ForegroundColor Yellow
npm audit

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  修復完成！" -ForegroundColor Green
Write-Host "  Fix Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "建議下一步：" -ForegroundColor Yellow
Write-Host "1. 執行 'npm run build' 測試專案" -ForegroundColor White
Write-Host "2. 執行 'npm run dev' 測試開發環境" -ForegroundColor White
Write-Host "3. 檢查 SECURITY_AUDIT_REPORT.md 查看詳細報告" -ForegroundColor White
Write-Host ""

