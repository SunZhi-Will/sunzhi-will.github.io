import type { Metadata } from "next";
import { ThemeProvider } from './ThemeProvider';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunzhi-will.github.io';

export const metadata: Metadata = {
  title: {
    default: "Blog | Sun",
    template: "%s | Sun's Blog"
  },
  description: "Exploring software engineering, AI development, and the art of building great products.",
  alternates: {
    canonical: `${baseUrl}/blog`,
    languages: {
      'zh-TW': `${baseUrl}/blog`,
      'en': `${baseUrl}/blog`,
    },
    types: {
      'application/rss+xml': `${baseUrl}/feed.xml`,
      'application/atom+xml': `${baseUrl}/feed.atom`,
    },
  },
  openGraph: {
    title: "Blog | Sun",
    description: "Exploring software engineering, AI development, and the art of building great products.",
    url: `${baseUrl}/blog`,
    siteName: "Sun",
    locale: "en_US",
    type: "website",
    images: [
      { url: `${baseUrl}/og-blog-square.png`, width: 800, height: 800, alt: "Sun's Blog" },
      { url: `${baseUrl}/og-blog.png`, width: 1200, height: 630, alt: "Sun's Blog" },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Blog | Sun",
    description: "Exploring software engineering, AI development, and the art of building great products.",
    images: [`${baseUrl}/og-blog.png`],
  },
};

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <div className="fixed inset-0 overflow-hidden">
        {children}
      </div>
    </ThemeProvider>
  );
}
