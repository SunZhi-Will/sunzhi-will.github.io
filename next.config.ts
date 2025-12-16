import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Enable static export for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
    domains: ['opengraph.githubassets.com', 'cdn.jsdelivr.net', 'static.cdninstagram.com', 'www.threads.net', 'img.youtube.com'],
  },
};

export default nextConfig;
