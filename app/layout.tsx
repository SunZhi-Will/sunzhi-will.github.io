import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunzhi-will.github.io';
const ogImage = `${baseUrl}/og`;

// 定義靜態 metadata
export const metadata: Metadata = {
  title: {
    default: "謝上智 - 軟體工程師 | AI 開發者",
    template: "%s | Sun"
  },
  description: "Full-stack engineer specializing in AI application development and Unity game development",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: '/favicon.svg',
  },
  alternates: {
    languages: {
      'en': 'Sun Zhi - Software Engineer | AI Developer',
      'zh-TW': '謝上智 - 軟體工程師 | AI 開發者'
    }
  },
  openGraph: {
    title: '謝上智 - 軟體工程師 | AI 開發者',
    description: 'Full-stack engineer specializing in AI application development and Unity game development',
    url: 'https://sunzhi-will.github.io',
    siteName: 'Sun',
    locale: 'zh_TW',
    type: 'website',
    images: [{ url: ogImage, width: 1200, height: 630, alt: 'Sun - Software Engineer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '謝上智 - 軟體工程師 | AI 開發者',
    description: 'Full-stack engineer specializing in AI application development and Unity game development',
    images: [ogImage],
  },
  // 安全標頭配置（部分標頭在靜態導出時可能需要在部署平台配置）
  other: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
