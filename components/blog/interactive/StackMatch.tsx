'use client'

import { useState } from 'react';
import { Icon } from './icons';
import { Bubble, Note, Segmented } from './kit';
import { InteractiveFrame } from './InteractiveFrame';

type Stack = 'react' | 'vue' | 'plain';
type Fit = 'yes' | 'maybe' | 'no';

const LIBS = [
    { name: 'shadcn/ui', use: '按鈕、輸入框、對話視窗，程式碼可直接修改' },
    { name: 'Reka UI', use: '沒有預設樣式的基礎元件，重視鍵盤操作' },
    { name: 'React Bits', use: '文字動畫、互動背景等動態效果' },
];

const MATRIX: Record<Stack, { fits: Fit[]; notes: string[]; ask: string }> = {
    react: {
        fits: ['yes', 'no', 'yes'],
        notes: ['React 專案可以直接使用', 'Reka UI 是給 Vue 用的', '動態效果元件，少量點綴就好'],
        ask: '我的專案使用 React。請先確認現有技術，推薦適合的元件庫，不要為了一個按鈕就大幅修改架構。',
    },
    vue: {
        fits: ['maybe', 'yes', 'no'],
        notes: ['原版是 React，Vue 另有社群移植版', 'Vue 專案的首選之一', '是 React 元件，Vue 不能直接用'],
        ask: '我的專案使用 Vue。請推薦相容的元件庫，並說明哪些工具不能直接用。',
    },
    plain: {
        fits: ['maybe', 'maybe', 'no'],
        notes: ['需要先有前端框架與設定', '一樣需要框架支援', '需要 React'],
        ask: '我的專案是單純的 HTML 與 CSS。請先評估是否真的需要元件庫，優先用現有寫法完成。',
    },
};

const FIT: Record<Fit, { label: string; cls: string }> = {
    yes: { label: '適合', cls: 'text-success-text' },
    maybe: { label: '要確認', cls: 'text-warning-text' },
    no: { label: '不適用', cls: 'text-danger-text' },
};

/** 元件庫不是看到就裝，先確認專案用什麼技術 */
export function StackMatch() {
    const [stack, setStack] = useState<Stack>('react');
    const m = MATRIX[stack];

    return (
        <InteractiveFrame title="這個元件庫，我的專案能用嗎？" kicker="互動展示" hint="先選你的專案技術，再看三個常被推薦的工具是否適合。">
            <Segmented
                id="stack"
                label="專案技術"
                value={stack}
                onChange={setStack}
                options={[
                    { value: 'react', label: 'React / Next.js' },
                    { value: 'vue', label: 'Vue / Nuxt' },
                    { value: 'plain', label: '純 HTML / CSS' },
                ]}
            />
            <div className="grid gap-2.5 md:grid-cols-3">
                {LIBS.map((lib, i) => {
                    const f = FIT[m.fits[i]];
                    return (
                        <div key={lib.name} className="flex flex-col gap-2 rounded-xl border border-line bg-surface-sunken p-3.5">
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-sm font-black text-fg">{lib.name}</span>
                                <span className={`flex items-center gap-1 text-xs font-black ${f.cls}`}>
                                    <Icon name={m.fits[i] === 'yes' ? 'check' : m.fits[i] === 'no' ? 'x' : 'warn'} className="h-4 w-4" />
                                    {f.label}
                                </span>
                            </div>
                            <div className="text-xs leading-relaxed text-fg-body">{lib.use}</div>
                            <div className="text-xs font-bold leading-snug text-fg">{m.notes[i]}</div>
                        </div>
                    );
                })}
            </div>
            <Bubble who="me">{m.ask}</Bubble>
            <Note id={stack}>
                工具本身沒有好壞，<strong>支援的技術不同，用途也不同</strong>。叫 AI 安裝之前，先讓它確認專案現況。
            </Note>
        </InteractiveFrame>
    );
}
