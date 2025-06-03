'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "../../app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function LinksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-950">
        <div className="absolute inset-0 opacity-20 bg-gradient-to-b from-transparent to-black/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.3)_0,rgba(255,255,255,0)_100%)]"></div>
      </div>
      <div className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </div>
    </>
  );
} 