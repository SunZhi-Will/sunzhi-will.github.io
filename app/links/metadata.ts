import type { Metadata } from "next";

// 定義靜態 metadata
export const metadata: Metadata = {
  title: {
    default: "謝上智 - 個人連結集合 | Sun Zhi - Links",
    template: "%s | Link Collection"
  },
  description: "謝上智的個人連結集合頁面，包含所有社交媒體和作品連結。",
  openGraph: {
    title: "謝上智 - 個人連結集合 | Sun Zhi - Links",
    description: "謝上智的個人連結集合頁面，包含所有社交媒體和作品連結。",
    url: "https://sunzhi-will.github.io/links",
    siteName: "Sun Zhi",
    locale: "zh_TW",
    type: "website",
  },
}; 