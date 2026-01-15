import type { NextConfig } from "next";
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Enable static export for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
    domains: ['opengraph.githubassets.com', 'cdn.jsdelivr.net', 'static.cdninstagram.com', 'www.threads.net', 'img.youtube.com'],
  },
  // 安全配置（注意：靜態導出時某些標頭可能需要在部署時配置）
  // 建議在 GitHub Pages 或其他部署平台配置安全標頭
  poweredByHeader: false, // 移除 X-Powered-By 標頭
  // 確保 React 在靜態生成時正確初始化
  reactStrictMode: true,
  // 環境變數（客戶端可訪問的變數需要 NEXT_PUBLIC_ 前綴）
  env: {
    // Google Apps Script URL（用於電子報訂閱）
    // 可以從環境變數讀取，或直接設置（因為這是公開的 Web App URL）
    NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL: process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL ||
      'https://script.google.com/macros/s/AKfycbx2P2fpDI5c_4cBYfmjxYpmK1iOej3akV52RaeH1eA8yL3pmIVKilce7uWzlJcKUUCK/exec',
    // 服務端使用的 Google Apps Script URL（用於更新 LastArticleSent）
    GOOGLE_APPS_SCRIPT_URL: process.env.GOOGLE_APPS_SCRIPT_URL ||
      'https://script.google.com/macros/s/AKfycbx2P2fpDI5c_4cBYfmjxYpmK1iOej3akV52RaeH1eA8yL3pmIVKilce7uWzlJcKUUCK/exec',
  },
  // MDX 配置
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
