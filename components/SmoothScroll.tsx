"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const pathname = usePathname();

  // 換頁時立即跳頂，避免 Lenis 的 duration 造成視覺卡在中間
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  useEffect(() => {
    // 延遲一下以確保 DOM 已經完全渲染，尤其是 Next.js 頁面轉換後
    const timer = setTimeout(() => {
      // 偵測是否有自定義的滾動容器（例如部落格的 main.overflow-y-auto）
      const scrollContainer = document.querySelector("main.overflow-y-auto") as HTMLElement;

      const lenis = new Lenis({
        wrapper: scrollContainer || undefined,
        content: scrollContainer ? (scrollContainer.firstElementChild as HTMLElement) : undefined,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      lenisRef.current = lenis;

      // Lenis v1 sets overflow:clip on <html> which breaks position:sticky.
      // Use MutationObserver to clear it whenever Lenis (re-)sets it.
      const htmlEl = document.documentElement;
      const observer = new MutationObserver(() => {
        if (htmlEl.style.overflow === "clip" || htmlEl.style.overflow === "hidden") {
          htmlEl.style.removeProperty("overflow");
        }
      });
      observer.observe(htmlEl, { attributes: true, attributeFilter: ["style"] });
      observerRef.current = observer;

      let rafId: number;
      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
        rafIdRef.current = rafId;
      };
      rafId = requestAnimationFrame(raf);
      rafIdRef.current = rafId;
    }, 50);

    return () => {
      clearTimeout(timer);
      
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      
      document.documentElement.style.removeProperty("overflow");
    };
  }, [pathname]);

  return null;
}
