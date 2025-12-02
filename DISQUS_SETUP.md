# Disqus 留言系統設置說明

## 如何找到您的 Disqus Shortname

1. 登入 [Disqus Admin](https://disqus.com/admin/)
2. 選擇您的網站（應用程式名稱：blog）
3. 前往 **Settings** > **General**
4. 在 **Shortname** 欄位中找到您的 shortname

或者，您也可以：
- 前往 https://disqus.com/admin/settings/general/
- 查看 **Shortname** 欄位

根據您的應用程式資訊，shortname 是：`suncode`

## 設置環境變數

### 本地開發

在專案根目錄創建 `.env.local` 文件：

```bash
NEXT_PUBLIC_DISQUS_SHORTNAME=suncode
```

### GitHub Pages 部署

如果您使用 GitHub Pages 部署，需要在 GitHub Actions 中設置環境變數：

1. 前往您的 GitHub Repository
2. 點擊 **Settings** > **Secrets and variables** > **Actions**
3. 點擊 **New repository secret**
4. 名稱輸入：`NEXT_PUBLIC_DISQUS_SHORTNAME`
5. 值輸入：您的 Disqus shortname（例如：`suncode`）
6. 點擊 **Add secret**

### Vercel 部署

如果您使用 Vercel 部署：

1. 前往 Vercel Dashboard
2. 選擇您的專案
3. 前往 **Settings** > **Environment Variables**
4. 添加新的環境變數：
   - Name: `NEXT_PUBLIC_DISQUS_SHORTNAME`
   - Value: `suncode`
5. 選擇環境（Production, Preview, Development）
6. 點擊 **Save**

## 驗證設置

設置完成後：

1. 重新啟動開發伺服器（如果是在本地）
2. 訪問任何一篇部落格文章
3. 在文章底部應該能看到 Disqus 留言區

如果看到提示訊息，表示環境變數尚未設置或設置不正確。

## 注意事項

- `NEXT_PUBLIC_` 前綴是必需的，這樣 Next.js 才會將變數暴露給客戶端
- Shortname 區分大小寫
- 確保您的 Disqus 網站設置中已添加您的網站 URL：`https://sunzhi-will.github.io/`

## 測試

設置完成後，您可以在 Disqus Admin 中查看留言統計：
- 前往 https://disqus.com/admin/
- 選擇您的網站
- 查看 **Moderation** 和 **Analytics** 來管理留言

