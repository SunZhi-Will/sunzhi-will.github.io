# 部落格封面圖存放位置

這個目錄用於存放部落格文章的封面圖片。

## 使用方式

1. 將封面圖片放在此目錄下
2. 在文章的 frontmatter 中指定封面圖路徑，例如：
   ```yaml
   coverImage: "/blog/about-website-cover.jpg"
   ```

## 圖片建議

- **尺寸**：建議使用 16:9 的比例（例如 1920x1080 或 1280x720）
- **格式**：支援 JPG、PNG、WebP 等格式
- **大小**：建議壓縮後不超過 500KB，以確保載入速度
- **命名**：使用有意義的檔名，例如 `about-website-cover.jpg`

## 範例

對於文章 `2025-12-02-164303/article.md`，封面圖路徑為：
```
/blog/about-website-cover.jpg
```

圖片應該放在：
```
public/blog/about-website-cover.jpg
```







