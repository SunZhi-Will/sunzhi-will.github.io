'use client'

import dynamic from 'next/dynamic';

// 文章專用的互動元件。逐一動態載入，沒用到的文章不會多載這些程式碼。
// 因為 next-mdx-remote 預設會擋掉 MDX 內的 JS 表達式，這些元件都不吃陣列或物件 props，
// 內容直接寫在元件裡，MDX 中以 <ComponentName /> 使用即可。
export const interactiveMdxComponents = {
    AccusationThread: dynamic(() => import('./AccusationThread').then((mod) => mod.AccusationThread), { ssr: false }),
    VoxelCharacterLab: dynamic(() => import('./VoxelCharacterLab').then((mod) => mod.VoxelCharacterLab), { ssr: false }),
    VoxelLineup: dynamic(() => import('./VoxelLineup').then((mod) => mod.VoxelLineup), { ssr: false }),
    GenreReflex: dynamic(() => import('./GenreReflex').then((mod) => mod.GenreReflex), { ssr: false }),
    IdeaExpressionSorter: dynamic(() => import('./IdeaExpressionSorter').then((mod) => mod.IdeaExpressionSorter), { ssr: false }),
    GliderSpectrum: dynamic(() => import('./GliderSpectrum').then((mod) => mod.GliderSpectrum), { ssr: false }),
    ContactGate: dynamic(() => import('./ContactGate').then((mod) => mod.ContactGate), { ssr: false }),
    HudCompare: dynamic(() => import('./HudCompare').then((mod) => mod.HudCompare), { ssr: false }),
    ComparisonMatrix: dynamic(() => import('./ComparisonMatrix').then((mod) => mod.ComparisonMatrix), { ssr: false }),
    RuleStressTest: dynamic(() => import('./RuleStressTest').then((mod) => mod.RuleStressTest), { ssr: false }),
    CritiqueOrInsult: dynamic(() => import('./CritiqueOrInsult').then((mod) => mod.CritiqueOrInsult), { ssr: false }),
    InspirationPipeline: dynamic(() => import('./InspirationPipeline').then((mod) => mod.InspirationPipeline), { ssr: false }),
    ArgumentLoop: dynamic(() => import('./ArgumentLoop').then((mod) => mod.ArgumentLoop), { ssr: false }),
};
