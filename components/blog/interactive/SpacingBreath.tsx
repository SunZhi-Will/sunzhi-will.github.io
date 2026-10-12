'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Note, Stage } from './kit';
import { InteractiveFrame } from './InteractiveFrame';

const LEVELS = [
    { px: 2, name: '擠', note: '每個區塊黏在一起，眼睛分不出哪些是一組。' },
    { px: 8, name: '普通', note: '分得開了，但標題和內容還是擠在一起。' },
    { px: 20, name: '剛好', note: '區塊之間有呼吸，同一組的東西靠在一起。' },
    { px: 48, name: '太鬆', note: '留白太多，內容散掉，反而像沒做完。' },
];

const spring = { type: 'spring', stiffness: 220, damping: 26 } as const;

/** 兩個區塊之間的紅線標註 */
function Gap({ h }: { h: number }) {
    return (
        <motion.div initial={false} animate={{ height: h }} transition={spring} className="relative flex items-center justify-center">
            <span className="absolute inset-y-0 left-1/2 w-px bg-danger/60" />
            {h >= 14 && <span className="relative rounded bg-danger px-1 font-mono text-[9px] font-bold leading-none text-white">{h}</span>}
        </motion.div>
    );
}

/** 一個線框圖，間距之間標出紅線尺寸，像設計稿的標註 */
export function SpacingBreath() {
    const [i, setI] = useState(0);
    const gap = LEVELS[i].px;
    // 同一組內的距離固定是大間距的一半，這就是「相關的東西靠近」
    const inner = Math.max(2, Math.round(gap / 2));

    return (
        <InteractiveFrame title="留白不是浪費空間" kicker="間距" hint="選一種間距，看同一份內容怎麼變。紅線是設計稿上的間距標註。">
            <Stage className="flex justify-center p-4 sm:p-6">
                <motion.div layout className="w-full rounded-xl bg-white shadow-card" style={{ maxWidth: 300, padding: gap > 2 ? Math.min(gap, 24) : 6 }} transition={spring}>
                    <div className="h-2 w-16 rounded-full bg-[#2563eb]" />
                    <Gap h={inner} />
                    <div className="h-4 w-4/5 rounded bg-[#111827]" />
                    <Gap h={inner} />
                    <div className="space-y-1">
                        <div className="h-1.5 w-full rounded-full bg-[#9ca3af]" />
                        <div className="h-1.5 w-3/4 rounded-full bg-[#9ca3af]" />
                    </div>
                    <Gap h={gap} />
                    <div className="grid grid-cols-3" style={{ columnGap: Math.max(2, inner) }}>
                        {[0, 1, 2].map((k) => (
                            <div key={k} className="h-12 rounded-md bg-[#f3f4f6]" />
                        ))}
                    </div>
                    <Gap h={gap} />
                    <div className="h-7 w-24 rounded-md bg-[#2563eb]" />
                </motion.div>
            </Stage>
            <div role="group" aria-label="間距" className="grid grid-cols-4 gap-1 rounded-full bg-fg/5 p-1">
                {LEVELS.map((l, k) => (
                    <button
                        key={l.name}
                        type="button"
                        aria-pressed={i === k}
                        onClick={() => setI(k)}
                        className={`relative rounded-full py-1.5 text-xs font-bold transition-colors ${i === k ? 'text-canvas' : 'text-fg-body hover:text-fg'}`}
                    >
                        {i === k && <motion.span layoutId="spacing-pill" className="absolute inset-0 rounded-full bg-fg" transition={spring} />}
                        <span className="relative">
                            {l.name} <span className="font-mono opacity-70">{l.px}</span>
                        </span>
                    </button>
                ))}
            </div>
            <Note id={i}>{LEVELS[i].note}</Note>
        </InteractiveFrame>
    );
}
