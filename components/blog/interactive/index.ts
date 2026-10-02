'use client'

import { createElement } from 'react';
import dynamic from 'next/dynamic';

// 元件載入前先佔一塊位置，減少內文被往下推的幅度
const loading = () =>
    createElement('div', {
        'aria-hidden': true,
        className: 'not-prose my-10 h-72 animate-pulse rounded-xl border border-zinc-500/20 bg-zinc-500/5',
    });

// 文章專用的互動元件。逐一動態載入，沒用到的文章不會多載這些程式碼。
// 因為 next-mdx-remote 預設會擋掉 MDX 內的 JS 表達式，這些元件都不吃陣列或物件 props，
// 內容直接寫在元件裡，MDX 中以 <ComponentName /> 使用即可。
export const interactiveMdxComponents = {
    AccusationThread: dynamic(() => import('./AccusationThread').then((mod) => mod.AccusationThread), { ssr: false, loading }),
    VoxelCharacterLab: dynamic(() => import('./VoxelCharacterLab').then((mod) => mod.VoxelCharacterLab), { ssr: false, loading }),
    VoxelLineup: dynamic(() => import('./VoxelLineup').then((mod) => mod.VoxelLineup), { ssr: false, loading }),
    GenreReflex: dynamic(() => import('./GenreReflex').then((mod) => mod.GenreReflex), { ssr: false, loading }),
    IdeaExpressionSorter: dynamic(() => import('./IdeaExpressionSorter').then((mod) => mod.IdeaExpressionSorter), { ssr: false, loading }),
    GliderSpectrum: dynamic(() => import('./GliderSpectrum').then((mod) => mod.GliderSpectrum), { ssr: false, loading }),
    ContactGate: dynamic(() => import('./ContactGate').then((mod) => mod.ContactGate), { ssr: false, loading }),
    HudCompare: dynamic(() => import('./HudCompare').then((mod) => mod.HudCompare), { ssr: false, loading }),
    ComparisonMatrix: dynamic(() => import('./ComparisonMatrix').then((mod) => mod.ComparisonMatrix), { ssr: false, loading }),
    RuleStressTest: dynamic(() => import('./RuleStressTest').then((mod) => mod.RuleStressTest), { ssr: false, loading }),
    CritiqueOrInsult: dynamic(() => import('./CritiqueOrInsult').then((mod) => mod.CritiqueOrInsult), { ssr: false, loading }),
    InspirationPipeline: dynamic(() => import('./InspirationPipeline').then((mod) => mod.InspirationPipeline), { ssr: false, loading }),
    ArgumentLoop: dynamic(() => import('./ArgumentLoop').then((mod) => mod.ArgumentLoop), { ssr: false, loading }),
};
