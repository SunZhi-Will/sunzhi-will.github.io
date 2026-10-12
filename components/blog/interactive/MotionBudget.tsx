'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { Note, Stage } from './kit';
import { InteractiveFrame } from './InteractiveFrame';

const EFFECTS = [
    { id: 'bg', name: '背景光影特效', sec: 0.8, info: false },
    { id: 'title', name: '標題逐字飛入', sec: 1.2, info: false },
    { id: 'cards', name: '卡片依序旋轉進場', sec: 1.5, info: false },
    { id: 'date', name: '活動日期出現', sec: 0.2, info: true },
    { id: 'btn', name: '按鈕彈跳', sec: 0.5, info: false },
];

/** 動畫是有成本的：使用者想看日期，卻得先等它們演完 */
export function MotionBudget() {
    const [on, setOn] = useState<string[]>(['bg', 'title', 'cards', 'btn']);
    const toggle = (id: string) => setOn((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

    // 依序播放，到日期出現前累積的等待時間
    let t = 0;
    const rows = EFFECTS.map((e) => {
        const enabled = e.info || on.includes(e.id);
        const start = t;
        if (enabled) t += e.sec;
        return { ...e, enabled, start, end: t };
    });
    const wait = rows.find((r) => r.info)!.start;
    const total = Math.max(t, 3.6);
    const tone = wait <= 1 ? 'success' : wait <= 2.5 ? 'warning' : 'danger';
    const bar = { success: 'bg-success', warning: 'bg-warning', danger: 'bg-danger' }[tone];

    return (
        <InteractiveFrame title="動畫要排隊，使用者也在等" kicker="時間軸" hint="這些動畫依序播放。關掉幾個，看使用者要等多久才能讀到活動日期。">
            <Stage className="space-y-2 p-3 sm:p-4">
                {rows.map((r) => (
                    <div key={r.id} className="grid grid-cols-[minmax(0,9.5rem)_1fr] items-center gap-3 sm:grid-cols-[11rem_1fr]">
                        <button
                            type="button"
                            disabled={r.info}
                            aria-pressed={r.enabled}
                            onClick={() => toggle(r.id)}
                            className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs font-bold transition-colors ${
                                r.info ? 'border-brand bg-brand/15 text-fg' : r.enabled ? 'border-line-strong text-fg hover:bg-surface-raised' : 'border-dashed border-line-strong text-fg-muted line-through'
                            }`}
                        >
                            <Icon name={r.info ? 'eye' : r.enabled ? 'check' : 'x'} className="h-3.5 w-3.5 shrink-0" />
                            {r.name}
                        </button>
                        <div className="relative h-5 rounded-full bg-fg/10">
                            <motion.div
                                className={`absolute top-0 h-5 rounded-full ${r.info ? 'bg-brand' : 'bg-fg/55'}`}
                                initial={false}
                                animate={{ left: `${(r.start / total) * 100}%`, width: r.enabled ? `${((r.end - r.start) / total) * 100}%` : '0%' }}
                                transition={{ type: 'spring', stiffness: 160, damping: 22 }}
                            />
                        </div>
                    </div>
                ))}
            </Stage>
            <div>
                <div className="mb-1.5 flex items-baseline justify-between text-xs font-bold text-fg">
                    <span>使用者讀到日期前要等</span>
                    <span className="tabular-nums">{wait.toFixed(1)} 秒</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-fg/10">
                    <motion.div className={`h-full rounded-full ${bar}`} initial={false} animate={{ width: `${Math.min(100, (wait / 4) * 100)}%` }} transition={{ type: 'spring', stiffness: 110, damping: 18 }} />
                </div>
            </div>
            <Note id={tone}>
                {wait <= 1 ? (
                    <>
                        資訊馬上出現，動畫才是加分。<strong>先讓網站清楚、好操作，再考慮適當增加動畫。</strong>
                    </>
                ) : (
                    <>
                        如果使用者只想看活動日期，卻得等 {wait.toFixed(1)} 秒，這些動畫就在<strong>擋住資訊</strong>。也別忘了有人不喜歡大量動態效果。
                    </>
                )}
            </Note>
        </InteractiveFrame>
    );
}
