'use client'

import { useState } from 'react';
import { Icon } from './icons';
import { Meter, Note } from './kit';
import { InteractiveFrame } from './InteractiveFrame';

const ITEMS = [
    { t: '先確認網站的目的與使用者', d: '不要只列功能。' },
    { t: '找幾個參考，說清楚喜歡哪裡', d: '學方法，不是複製內容。' },
    { t: '建立簡單的設計規則', d: '顏色、字級、圓角、間距。' },
    { t: '用適合專案技術的元件庫', d: '不用什麼都從零做。' },
    { t: '先做原型，再接完整功能', d: '看過畫面再決定。' },
    { t: '修改時指出哪裡、希望怎麼改', d: '局部修改，不整個重來。' },
    { t: '最後自己操作一遍', d: '用手機，假裝第一次來。' },
];

/** 七件事，勾完自己的專案 */
export function SevenChecklist() {
    const [on, setOn] = useState<number[]>([]);
    const toggle = (i: number) => setOn((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

    return (
        <InteractiveFrame title="下次請 AI 做網站之前" kicker="檢查清單" hint="拿自己手上的專案對照一下，做到的就勾起來。">
            <div className="grid gap-2 sm:grid-cols-2">
                {ITEMS.map((it, i) => {
                    const checked = on.includes(i);
                    return (
                        <button
                            key={it.t}
                            type="button"
                            aria-pressed={checked}
                            onClick={() => toggle(i)}
                            className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${checked ? 'border-success/50 bg-success/10' : 'border-dashed border-brand/60 hover:bg-brand/10'}`}
                        >
                            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${checked ? 'bg-success text-canvas' : 'bg-fg text-canvas'}`}>
                                {checked ? <Icon name="check" className="h-3.5 w-3.5" /> : i + 1}
                            </span>
                            <span>
                                <span className="block text-sm font-black leading-snug text-fg">{it.t}</span>
                                <span className="block text-xs leading-snug text-fg-body">{it.d}</span>
                            </span>
                        </button>
                    );
                })}
            </div>
            <Meter label="已做到" value={on.length} max={ITEMS.length} suffix={` / ${ITEMS.length}`} tone={on.length === ITEMS.length ? 'success' : 'brand'} />
            <Note id={on.length === ITEMS.length ? 'all' : 'part'}>
                AI 可以幫你把畫面做出來，但<strong>你想帶給使用者什麼樣的體驗，仍然需要自己想清楚</strong>。
            </Note>
        </InteractiveFrame>
    );
}
