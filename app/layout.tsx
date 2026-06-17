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
const ogImageWide = `${baseUrl}/og-home.png`;
const ogImageSquare = `${baseUrl}/og-home-square.png`;

// 定義靜態 metadata
export const metadata: Metadata = {
  title: {
    default: "謝上智 - 軟體工程師 | AI 開發者",
    template: "%s | Sun"
  },
  description: "Full-stack engineer specializing in AI application development and Unity game development",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png', sizes: '512x512' }
    ],
    apple: '/apple-icon.png',
  },
  alternates: {
    languages: {
      'en': 'Sun Zhi - Software Engineer | AI Developer',
      'zh-TW': '謝上智 - 軟體工程師 | AI 開發者'
    },
    types: {
      'application/rss+xml': `${baseUrl}/feed.xml`,
      'application/atom+xml': `${baseUrl}/feed.atom`,
    },
  },
  openGraph: {
    title: '謝上智 - 軟體工程師 | AI 開發者',
    description: 'Full-stack engineer specializing in AI application development and Unity game development',
    url: 'https://sunzhi-will.github.io',
    siteName: 'Sun',
    locale: 'zh_TW',
    type: 'website',
    images: [
      { url: ogImageSquare, width: 800, height: 800, alt: 'Sun - Software Engineer' },
      { url: ogImageWide, width: 1200, height: 630, alt: 'Sun - Software Engineer' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '謝上智 - 軟體工程師 | AI 開發者',
    description: 'Full-stack engineer specializing in AI application development and Unity game development',
    images: [ogImageWide],
  },
  // 安全標頭配置（部分標頭在靜態導出時可能需要在部署平台配置）
  other: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  }
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'WebSite',
            '@id': `${baseUrl}/#website`,
            url: baseUrl,
            name: "Sun's Blog - 謝上智",
            description: 'Full-stack engineer specializing in AI application development and Unity game development',
            publisher: {
                '@type': 'Person',
                '@id': `${baseUrl}/#person`,
                name: 'Sun (謝上智)',
                url: baseUrl,
                image: `${baseUrl}/profile.jpg`,
                jobTitle: 'Software Engineer',
                knowsAbout: ['AI', 'Full-Stack Development', 'Unity', 'React', 'Next.js'],
            },
            inLanguage: ['zh-TW', 'en'],
        },
        {
            '@type': 'Person',
            '@id': `${baseUrl}/#person`,
            name: 'Sun (謝上智)',
            givenName: '上智',
            familyName: '謝',
            alternateName: 'Sun Zhi',
            url: baseUrl,
            image: `${baseUrl}/profile.jpg`,
            jobTitle: 'Software Engineer',
            sameAs: [
                'https://github.com/SunZhi-Will',
                'https://www.linkedin.com/in/sunzhiwill',
                'https://sunzhi-will.github.io',
            ],
            knowsAbout: ['Artificial Intelligence', 'Full-Stack Development', 'Unity', 'React', 'Next.js', 'TypeScript'],
        },
    ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
