import type { Metadata } from "next";

// 定義靜態 metadata
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunzhi-will.github.io';

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
    images: [
      { url: `${baseUrl}/og-links-square.png`, width: 800, height: 800, alt: 'Sun - Links' },
      { url: `${baseUrl}/og-links.png`, width: 1200, height: 630, alt: 'Sun - Links' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`${baseUrl}/og-links.png`],
  },
}; 