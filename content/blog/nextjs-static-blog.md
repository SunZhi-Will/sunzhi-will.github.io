---
title: "使用 Next.js 打造靜態部落格"
date: "2025-11-25"
description: "學習如何使用 Next.js 15 和 Markdown 建立一個高效能的靜態部落格系統，支援文章管理、標籤分類等功能。"
tags: ["Next.js", "React", "教學"]
---

## 前言

在這篇文章中，我將分享如何使用 Next.js 建立一個靜態部落格系統。這個系統支援：

- 📝 Markdown 文章撰寫
- 🏷️ 標籤分類系統
- 🎨 美觀的 UI 設計
- ⚡ 超快的載入速度

## 技術架構

### 使用的套件

```bash
npm install gray-matter remark remark-html
```

- **gray-matter**: 解析 Markdown 檔案的 frontmatter
- **remark**: 處理 Markdown 內容
- **remark-html**: 將 Markdown 轉換為 HTML

### 目錄結構

```
├── content/
│   └── blog/           # Markdown 文章存放處
├── lib/
│   └── blog.ts         # 部落格工具函數
├── app/
│   └── blog/
│       ├── page.tsx    # 文章列表頁
│       └── [slug]/
│           └── page.tsx  # 文章詳情頁
```

## 核心程式碼

### 1. 文章解析工具

```typescript
import matter from 'gray-matter';

export function getPostBySlug(slug: string) {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
        slug,
        title: data.title,
        date: data.date,
        content,
    };
}
```

### 2. Markdown 轉 HTML

```typescript
import { remark } from 'remark';
import html from 'remark-html';

export async function markdownToHtml(markdown: string) {
    const result = await remark().use(html).process(markdown);
    return result.toString();
}
```

## 文章格式

每篇文章的 Markdown 檔案需要包含 frontmatter：

```markdown
---
title: "文章標題"
date: "2025-11-25"
description: "文章描述"
tags: ["標籤1", "標籤2"]
coverImage: "/images/cover.jpg"
---

文章內容...
```

## 總結

使用 Next.js 建立靜態部落格是一個很好的學習專案，它可以幫助你：

1. 深入了解 Next.js 的靜態生成功能
2. 學習如何處理 Markdown 檔案
3. 實作完整的前端應用程式

希望這篇文章對你有幫助！如果有任何問題，歡迎在下方留言討論。

