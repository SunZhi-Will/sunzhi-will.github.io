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

// 定義靜態 metadata
export const metadata: Metadata = {
  title: {
    default: "謝上智 - 軟體工程師 | AI 開發者",
    template: "%s | Sun Zhi"
  },
  description: "Full-stack engineer specializing in AI application development and Unity game development",
  alternates: {
    languages: {
      'en': 'Sun Zhi - Software Engineer | AI Developer',
      'zh-TW': '謝上智 - 軟體工程師 | AI 開發者'
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-blue-950`}
      >
        <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
