import type { NextConfig } from "next";

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
  // 配置 webpack 以處理客戶端組件
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
