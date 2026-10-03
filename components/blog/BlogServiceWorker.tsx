'use client'

import { useEffect } from 'react';

/**
 * 註冊部落格的 Service Worker（public/blog-sw.js），只在正式環境啟用。
 * 開發時不註冊，否則改完程式碼會一直拿到快取的舊檔。
 */
export function BlogServiceWorker() {
    useEffect(() => {
        if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;

        const register = () => {
            // scope 用 /blog（不加結尾斜線），列表頁 /blog 與所有文章頁 /blog/... 都會被管到
            navigator.serviceWorker.register('/blog-sw.js', { scope: '/blog' }).catch(() => {
                // 註冊失敗（例如無痕模式）不影響閱讀
            });
        };

        // 等頁面載完再註冊，不跟首屏搶網路
        if (document.readyState === 'complete') register();
        else window.addEventListener('load', register, { once: true });
    }, []);

    return null;
}
