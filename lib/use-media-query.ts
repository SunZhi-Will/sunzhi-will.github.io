'use client'

import { useSyncExternalStore } from 'react';

// 訂閱 CSS media query。伺服器端與首次渲染一律回傳 false，避免 hydration 不一致
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
