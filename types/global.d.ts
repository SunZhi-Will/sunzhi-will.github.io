import type Lenis from 'lenis';

declare global {
  interface Window {
    // 由 components/SmoothScroll.tsx 掛上，讓其他元件能用同一個平滑捲動實例
    __lenis?: Lenis;
  }
}

export {};
