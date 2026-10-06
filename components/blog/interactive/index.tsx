'use client'

import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import dynamic from 'next/dynamic';

type Loader = () => Promise<ComponentType>;

// 實測的元件高度（px），佔位框照這個大小，元件載入時內文才不會被往下推
interface Height {
    /** 小於 640px */
    mobile: number;
    /** 640 到 767px，欄寬還會跟著視窗變 */
    tablet?: number;
    /** 768px 以上，欄寬固定 704px */
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
            style={{
                ['--h-mobile' as string]: `${height.mobile}px`,
                ['--h-tablet' as string]: `${height.tablet ?? height.mobile}px`,
                ['--h-desktop' as string]: `${height.desktop}px`,
            }}
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

        if (visible) {
            return (
                <div
                    className="widget-slot"
                    style={{
                ['--h-mobile' as string]: `${height.mobile}px`,
                ['--h-tablet' as string]: `${height.tablet ?? height.mobile}px`,
                ['--h-desktop' as string]: `${height.desktop}px`,
            }}
                >
                    <Widget />
                </div>
            );
        }
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
    AccusationThread: lazyWidget(() => import('./AccusationThread').then((mod) => mod.AccusationThread), { mobile: 404, tablet: 420, desktop: 420 }),
    GenreReflex: lazyWidget(() => import('./GenreReflex').then((mod) => mod.GenreReflex), { mobile: 560, tablet: 439, desktop: 333 }),
    VoxelLineup: lazyWidget(() => import('./VoxelLineup').then((mod) => mod.VoxelLineup), { mobile: 661, tablet: 440, desktop: 450 }),
    GliderSpectrum: lazyWidget(() => import('./GliderSpectrum').then((mod) => mod.GliderSpectrum), { mobile: 532, tablet: 580, desktop: 594 }),
    VoxelCharacterLab: lazyWidget(() => import('./VoxelCharacterLab').then((mod) => mod.VoxelCharacterLab), { mobile: 702, tablet: 440, desktop: 404 }),
    IdeaExpressionSorter: lazyWidget(() => import('./IdeaExpressionSorter').then((mod) => mod.IdeaExpressionSorter), { mobile: 572, tablet: 407, desktop: 407 }),
    ContactGate: lazyWidget(() => import('./ContactGate').then((mod) => mod.ContactGate), { mobile: 517, tablet: 373, desktop: 373 }),
    HudCompare: lazyWidget(() => import('./HudCompare').then((mod) => mod.HudCompare), { mobile: 628, tablet: 507, desktop: 469 }),
    ComparisonMatrix: lazyWidget(() => import('./ComparisonMatrix').then((mod) => mod.ComparisonMatrix), { mobile: 747, tablet: 747, desktop: 727 }),
    RuleStressTest: lazyWidget(() => import('./RuleStressTest').then((mod) => mod.RuleStressTest), { mobile: 744, tablet: 498, desktop: 498 }),
    InspirationPipeline: lazyWidget(() => import('./InspirationPipeline').then((mod) => mod.InspirationPipeline), { mobile: 465, tablet: 412, desktop: 412 }),
    CritiqueOrInsult: lazyWidget(() => import('./CritiqueOrInsult').then((mod) => mod.CritiqueOrInsult), { mobile: 893, tablet: 593, desktop: 570 }),
    ArgumentLoop: lazyWidget(() => import('./ArgumentLoop').then((mod) => mod.ArgumentLoop), { mobile: 477, tablet: 463, desktop: 463 }),
    RestaurantOrder: lazyWidget(() => import('./RestaurantOrder').then((mod) => mod.RestaurantOrder), { mobile: 448, tablet: 414, desktop: 414 }),
    FrontBackSorter: lazyWidget(() => import('./FrontBackSorter').then((mod) => mod.FrontBackSorter), { mobile: 540, tablet: 502, desktop: 502 }),
    TrustTheFrontend: lazyWidget(() => import('./TrustTheFrontend').then((mod) => mod.TrustTheFrontend), { mobile: 772, tablet: 719, desktop: 579 }),
    BuildAndRun: lazyWidget(() => import('./BuildAndRun').then((mod) => mod.BuildAndRun), { mobile: 680, tablet: 604, desktop: 604 }),
    Pm2Guardian: lazyWidget(() => import('./Pm2Guardian').then((mod) => mod.Pm2Guardian), { mobile: 696, tablet: 639, desktop: 449 }),
    DeployPicker: lazyWidget(() => import('./DeployPicker').then((mod) => mod.DeployPicker), { mobile: 875, tablet: 786, desktop: 474 }),
    JsVsTs: lazyWidget(() => import('./JsVsTs').then((mod) => mod.JsVsTs), { mobile: 569, tablet: 477, desktop: 477 }),
    StackGrid: lazyWidget(() => import('./StackGrid').then((mod) => mod.StackGrid), { mobile: 623, tablet: 537, desktop: 537 }),
    ArchitectureMap: lazyWidget(() => import('./ArchitectureMap').then((mod) => mod.ArchitectureMap), { mobile: 682, tablet: 610, desktop: 454 }),
    FiveRulesQuiz: lazyWidget(() => import('./FiveRulesQuiz').then((mod) => mod.FiveRulesQuiz), { mobile: 513, tablet: 452, desktop: 452 }),
    ThreeConcepts: lazyWidget(() => import('./ThreeConcepts').then((mod) => mod.ThreeConcepts), { mobile: 580, tablet: 453, desktop: 431 }),
    WhatIsReact: lazyWidget(() => import('./WhatIsReact').then((mod) => mod.WhatIsReact), { mobile: 561, tablet: 659, desktop: 677 }),
    LoginChecks: lazyWidget(() => import('./LoginChecks').then((mod) => mod.LoginChecks), { mobile: 974, tablet: 902, desktop: 451 }),
    FrontendPlayground: lazyWidget(() => import('./FrontendPlayground').then((mod) => mod.FrontendPlayground), { mobile: 995, tablet: 640, desktop: 548 }),
    PermissionGates: lazyWidget(() => import('./PermissionGates').then((mod) => mod.PermissionGates), { mobile: 584, tablet: 486, desktop: 486 }),
    BuildBundle: lazyWidget(() => import('./BuildBundle').then((mod) => mod.BuildBundle), { mobile: 611, tablet: 565, desktop: 565 }),
    RequestSequence: lazyWidget(() => import('./RequestSequence').then((mod) => mod.RequestSequence), { mobile: 780, tablet: 724, desktop: 724 }),
    SpaVsSsr: lazyWidget(() => import('./SpaVsSsr').then((mod) => mod.SpaVsSsr), { mobile: 1046, tablet: 988, desktop: 632 }),
    StoredVsRuns: lazyWidget(() => import('./StoredVsRuns').then((mod) => mod.StoredVsRuns), { mobile: 632, tablet: 617, desktop: 617 }),
    LearningRoadmap: lazyWidget(() => import('./LearningRoadmap').then((mod) => mod.LearningRoadmap), { mobile: 860, tablet: 822, desktop: 522 }),
    OverviewDeck: lazyWidget(() => import('./OverviewDeck').then((mod) => mod.OverviewDeck), { mobile: 467, tablet: 558, desktop: 573 }),
    LifetimeChart: lazyWidget(() => import('./LifetimeChart').then((mod) => mod.LifetimeChart), { mobile: 670, tablet: 617, desktop: 617 }),
    LoadTimeline: lazyWidget(() => import('./LoadTimeline').then((mod) => mod.LoadTimeline), { mobile: 639, tablet: 586, desktop: 586 }),
    TsPipeline: lazyWidget(() => import('./TsPipeline').then((mod) => mod.TsPipeline), { mobile: 948, tablet: 941, desktop: 473 }),
    HttpAnatomy: lazyWidget(() => import('./HttpAnatomy').then((mod) => mod.HttpAnatomy), { mobile: 774, tablet: 676, desktop: 487 }),
};
