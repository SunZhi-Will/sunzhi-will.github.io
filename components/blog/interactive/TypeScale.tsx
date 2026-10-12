'use client'

import { useState } from 'react';
import { Note, Segmented, Stage } from './kit';
import { InteractiveFrame } from './InteractiveFrame';

const RATIOS = [
    { value: '1', r: 1, note: '全部一樣大，沒有任何層次，讀者不知道從哪裡開始看。' },
    { value: '1.125', r: 1.125, note: '差距很小，適合資訊很多的後台系統。' },
    { value: '1.25', r: 1.25, note: '標題與內文分得清楚，又不會太誇張，多數網站的安全選擇。' },
    { value: '1.5', r: 1.5, note: '對比強烈，適合首頁大標，用在內頁會太吵。' },
];

const LEVELS = [
    { step: 3, name: '大標', text: 'AI 技術交流活動' },
    { step: 2, name: '小標', text: '活動內容' },
    { step: 1, name: '強調', text: '10 月 18 日，台北' },
    { step: 0, name: '內文', text: '給對 AI 有興趣的人，不需要程式背景。' },
];

const BASE = 15;

/** 字級比例：每一級都是上一級乘上同一個倍數 */
export function TypeScale() {
    const [v, setV] = useState('1');
    const cur = RATIOS.find((x) => x.value === v)!;

    return (
        <InteractiveFrame title="一個倍數，決定所有字的大小" kicker="字級" hint="設計規則裡的字級通常不是一個個挑，而是從內文開始，每一級乘上同一個倍數。">
            <Segmented id="type-ratio" label="倍數" value={v} onChange={setV} options={RATIOS.map((x) => ({ value: x.value, label: `× ${x.value}` }))} />
            <Stage className="space-y-3 p-4 sm:p-6">
                {LEVELS.map((l) => {
                    const size = Math.round(BASE * cur.r ** l.step);
                    return (
                        <div key={l.name} className="grid grid-cols-[3.5rem_1fr] items-baseline gap-3">
                            <span className="font-mono text-[11px] font-bold text-fg-body">
                                {size}px
                                <span className="block font-sans text-[10px] text-brand-text">{l.name}</span>
                            </span>
                            <span
                                style={{ fontSize: size, transition: 'font-size 0.35s cubic-bezier(0.22, 1, 0.36, 1)' }}
                                className={`block truncate leading-tight text-fg ${l.step >= 2 ? 'font-black' : l.step === 1 ? 'font-bold' : ''}`}
                            >
                                {l.text}
                            </span>
                        </div>
                    );
                })}
            </Stage>
            <Note id={v}>{cur.note}</Note>
        </InteractiveFrame>
    );
}
