'use client'

import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import dynamic from 'next/dynamic';

type Loader = () => Promise<ComponentType>;

// 實測的元件高度（px），佔位框照這個大小，元件載入時內文才不會被往下推
interface Height {
    mobile: number;
    desktop: number;
}

// 在視窗下方這麼遠的地方就先開始載入，捲到時通常已經準備好
const PRELOAD_MARGIN = '1200px 0px';

const loaders = new Set<Loader>();
let warmedUp = false;

/**
 * 頁面閒置時先把所有互動元件的程式碼抓下來（只抓 JS，不會渲染，也不會下載元件裡的圖片），
 * 讀者捲到時就能立刻顯示。
 */
function warmUpWhenIdle() {
    if (warmedUp || typeof window === 'undefined') return;
    warmedUp = true;
    const run = () => loaders.forEach((load) => void load().catch(() => {}));
    const start = () => {
        if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 5000 });
        else setTimeout(run, 2000);
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
}

function Placeholder({ height }: { height: Height }) {
    return (
        <div
            aria-hidden="true"
            className="lazy-widget not-prose my-10 animate-pulse rounded-xl border border-line bg-fg/5"
            style={{ ['--h-mobile' as string]: `${height.mobile}px`, ['--h-desktop' as string]: `${height.desktop}px` }}
        />
    );
}

/**
 * 文章互動元件的延遲載入：捲到附近才渲染。
 * 這樣首屏只會載入讀者看得到的東西，元件內的圖片也不會一開頁面就全部下載。
 */
function lazyWidget(load: Loader, height: Height) {
    loaders.add(load);
    const Widget = dynamic(load, { ssr: false, loading: () => <Placeholder height={height} /> });

    function LazyWidget() {
        const ref = useRef<HTMLDivElement>(null);
        const [visible, setVisible] = useState(false);

        useEffect(() => {
            warmUpWhenIdle();
            const element = ref.current;
            if (!element || !('IntersectionObserver' in window)) {
                setVisible(true);
                return;
            }
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries.some((entry) => entry.isIntersecting)) {
                        setVisible(true);
                        observer.disconnect();
                    }
                },
                { rootMargin: PRELOAD_MARGIN },
            );
            observer.observe(element);
            return () => observer.disconnect();
        }, []);

        if (visible) return <Widget />;
        return (
            <div ref={ref}>
                <Placeholder height={height} />
            </div>
        );
    }

    return LazyWidget;
}

// 文章專用的互動元件。逐一動態載入，沒用到的文章不會多載這些程式碼。
// 因為 next-mdx-remote 預設會擋掉 MDX 內的 JS 表達式，這些元件都不吃陣列或物件 props，
// 內容直接寫在元件裡，MDX 中以 <ComponentName /> 使用即可。
export const interactiveMdxComponents = {
    AccusationThread: lazyWidget(() => import('./AccusationThread').then((mod) => mod.AccusationThread), { mobile: 357, desktop: 365 }),
    GenreReflex: lazyWidget(() => import('./GenreReflex').then((mod) => mod.GenreReflex), { mobile: 478, desktop: 274 }),
    VoxelLineup: lazyWidget(() => import('./VoxelLineup').then((mod) => mod.VoxelLineup), { mobile: 674, desktop: 446 }),
    GliderSpectrum: lazyWidget(() => import('./GliderSpectrum').then((mod) => mod.GliderSpectrum), { mobile: 534, desktop: 590 }),
    VoxelCharacterLab: lazyWidget(() => import('./VoxelCharacterLab').then((mod) => mod.VoxelCharacterLab), { mobile: 698, desktop: 400 }),
    IdeaExpressionSorter: lazyWidget(() => import('./IdeaExpressionSorter').then((mod) => mod.IdeaExpressionSorter), { mobile: 392, desktop: 400 }),
    ContactGate: lazyWidget(() => import('./ContactGate').then((mod) => mod.ContactGate), { mobile: 513, desktop: 369 }),
    HudCompare: lazyWidget(() => import('./HudCompare').then((mod) => mod.HudCompare), { mobile: 586, desktop: 465 }),
    ComparisonMatrix: lazyWidget(() => import('./ComparisonMatrix').then((mod) => mod.ComparisonMatrix), { mobile: 1283, desktop: 1003 }),
    RuleStressTest: lazyWidget(() => import('./RuleStressTest').then((mod) => mod.RuleStressTest), { mobile: 740, desktop: 494 }),
    InspirationPipeline: lazyWidget(() => import('./InspirationPipeline').then((mod) => mod.InspirationPipeline), { mobile: 461, desktop: 408 }),
    CritiqueOrInsult: lazyWidget(() => import('./CritiqueOrInsult').then((mod) => mod.CritiqueOrInsult), { mobile: 602, desktop: 358 }),
    ArgumentLoop: lazyWidget(() => import('./ArgumentLoop').then((mod) => mod.ArgumentLoop), { mobile: 451, desktop: 459 }),
};
