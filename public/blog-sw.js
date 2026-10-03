/*
 * 部落格的 Service Worker（只管 /blog 底下的頁面）。
 *
 * 為什麼需要：GitHub Pages 對所有檔案都只給 cache-control: max-age=600，也不能自訂標頭。
 * 連檔名帶雜湊、內容永遠不會變的 JS 和字型，回訪時也要每 10 分鐘重新驗證一次。
 * 這支 Service Worker 讓瀏覽器自己決定怎麼快取：
 *
 *   /_next/static/*（檔名帶雜湊，內容不會變）   → 先用快取，永久保存
 *   圖片                                       → 先用快取，背景再更新（下次就是新的）
 *   頁面 HTML 與換頁用的 .txt 資料               → 先抓網路，斷線或太慢才用快取（看過的文章可以離線讀）
 *
 * 要停用時：把 VERSION 改掉並在 activate 裡清空，或在瀏覽器開發者工具 Application → Service Workers 解除註冊。
 */

const VERSION = 'v1';
const STATIC_CACHE = `blog-static-${VERSION}`;
const MEDIA_CACHE = `blog-media-${VERSION}`;
const PAGE_CACHE = `blog-pages-${VERSION}`;
const CURRENT = [STATIC_CACHE, MEDIA_CACHE, PAGE_CACHE];

// 各快取最多保留幾筆，超過就從最舊的刪
const LIMITS = { [STATIC_CACHE]: 300, [MEDIA_CACHE]: 150, [PAGE_CACHE]: 60 };

// 網路超過這個時間還沒回應，就先拿快取的頁面出來
const NETWORK_TIMEOUT_MS = 3500;

const IMAGE_PATTERN = /\.(?:webp|png|jpe?g|gif|svg|avif|ico)$/i;

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const names = await caches.keys();
            await Promise.all(
                names
                    .filter((name) => name.startsWith('blog-') && !CURRENT.includes(name))
                    .map((name) => caches.delete(name)),
            );
            await self.clients.claim();
        })(),
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    // 其他網站的資源（例如電子報後端、留言系統）一律不碰
    if (url.origin !== self.location.origin) return;

    if (url.pathname.startsWith('/_next/static/')) {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
        return;
    }

    if (request.destination === 'image' || IMAGE_PATTERN.test(url.pathname)) {
        event.respondWith(staleWhileRevalidate(event, request, MEDIA_CACHE));
        return;
    }

    const isPage = request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');
    // Next.js 靜態輸出換頁時抓的是同名的 .txt（React Server Component 資料）
    const isPageData = url.pathname.endsWith('.txt') && (url.searchParams.has('_rsc') || request.headers.get('RSC') === '1');
    if (isPage || isPageData) {
        event.respondWith(networkFirst(event, request, PAGE_CACHE, isPageData));
    }
});

function isCacheable(response) {
    return response && response.ok && response.type === 'basic';
}

async function trim(cacheName) {
    const limit = LIMITS[cacheName];
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    // keys() 依加入順序排列，前面的是最舊的
    for (let i = 0; i < keys.length - limit; i++) {
        await cache.delete(keys[i]);
    }
}

async function put(cacheName, request, response) {
    const cache = await caches.open(cacheName);
    await cache.put(request, response);
    await trim(cacheName);
}

async function cacheFirst(request, cacheName) {
    const cached = await caches.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (isCacheable(response)) await put(cacheName, request, response.clone());
    return response;
}

async function staleWhileRevalidate(event, request, cacheName) {
    const cached = await caches.match(request);
    const refresh = fetch(request)
        .then(async (response) => {
            if (isCacheable(response)) await put(cacheName, request, response.clone());
            return response;
        })
        .catch(() => undefined);
    if (cached) {
        event.waitUntil(refresh);
        return cached;
    }
    return (await refresh) || Response.error();
}

async function networkFirst(event, request, cacheName, ignoreSearch) {
    const network = fetch(request).then(async (response) => {
        if (isCacheable(response)) await put(cacheName, request, response.clone());
        return response;
    });
    // 就算先回了快取，網路那邊仍繼續跑完並寫回快取
    event.waitUntil(network.catch(() => {}));

    const timeout = new Promise((resolve) => setTimeout(resolve, NETWORK_TIMEOUT_MS));
    try {
        const response = await Promise.race([network, timeout]);
        if (response) return response;
    } catch {
        // 斷線，往下找快取
    }

    // .txt 的 ?_rsc= 參數每次建置都不同，找快取時忽略查詢字串
    const cached = await caches.match(request, { ignoreSearch });
    if (cached) return cached;

    try {
        return await network;
    } catch {
        // 斷線又沒看過這一頁：頁面給一張簡單的離線說明，換頁資料就讓它失敗（瀏覽器會改成整頁載入）
        return request.mode === 'navigate' ? offlinePage() : Response.error();
    }
}

function offlinePage() {
    const html = `<!doctype html><html lang="zh-Hant-TW"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>目前離線 | Sun's Blog</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0a0a0a;color:#fafafa;
    font-family:system-ui,-apple-system,"PingFang TC","Noto Sans TC",sans-serif;padding:24px;box-sizing:border-box}
  main{max-width:420px;text-align:center;line-height:1.8}
  h1{font-size:22px;margin:0 0 8px}
  p{color:#e4e4e7;margin:0 0 20px}
  a{display:inline-block;padding:10px 18px;border-radius:10px;background:#facc15;color:#000;font-weight:600;text-decoration:none}
</style></head><body><main>
<h1>目前沒有網路</h1>
<p>這篇文章還沒有下載過，連上網路後就能閱讀。看過的文章離線也能打開。</p>
<a href="/blog">回到文章列表</a>
</main></body></html>`;
    return new Response(html, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
