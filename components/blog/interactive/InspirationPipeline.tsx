'use client'

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const STAGES = [
    { name: '理解', text: '先搞懂前人的東西為什麼好玩、為什麼這樣設計。' },
    { name: '吸收', text: '把它拆開，變成自己腦中可以拿來用的零件。' },
    { name: '重組', text: '跟其他來源的零件重新排列，組成不一樣的形狀。' },
    { name: '改變', text: '依照自己遊戲的需要，把零件一塊一塊換掉。' },
    { name: '加入自己的東西', text: '長出原本沒有的部分。到這裡，它才開始是你的作品。' },
];

const CELL = 26;
const GREY = '#71717a';
const AMBER = '#f59e0b';
const YELLOW = '#fde047';

type Cube = { x: number; y: number; color: string };

const grid = (spacing: number, offsetX: number, offsetY: number): Cube[] =>
    Array.from({ length: 9 }, (_, i) => ({
        x: offsetX + (i % 3) * spacing,
        y: offsetY + Math.floor(i / 3) * spacing,
        color: GREY,
    }));

// 5 + 3 + 1 的金字塔，重組後的形狀
const PYRAMID: [number, number][] = [
    [87, 48],
    [61, 74], [87, 74], [113, 74],
    [35, 100], [61, 100], [87, 100], [113, 100], [139, 100],
];

const pyramid = (colors: string[]): Cube[] => PYRAMID.map(([x, y], i) => ({ x, y, color: colors[i] }));

const REPAINTED = [AMBER, GREY, AMBER, GREY, AMBER, GREY, AMBER, GREY, AMBER];

const LAYOUTS: Cube[][] = [
    grid(CELL, 61, 36),
    grid(CELL + 12, 49, 24),
    pyramid(Array(9).fill(GREY)),
    pyramid(REPAINTED),
    pyramid(REPAINTED),
];

// 最後一步才出現的新方塊
const EXTRAS: [number, number][] = [[87, 22], [9, 100], [165, 100]];

/** 創作流程：一堆方塊從「前人的形狀」慢慢變成「自己的形狀」 */
export function InspirationPipeline() {
    const t = useFrameTheme();
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { amount: 0.6 });
    const [stage, setStage] = useState(0);
    const [auto, setAuto] = useState(true);

    useEffect(() => {
        if (!auto || !inView) return;
        const timer = setTimeout(() => setStage((s) => (s + 1) % STAGES.length), stage === STAGES.length - 1 ? 3600 : 2200);
        return () => clearTimeout(timer);
    }, [auto, inView, stage]);

    const pick = (index: number) => {
        setAuto(false);
        setStage(index);
    };

    const last = stage === STAGES.length - 1;

    return (
        <InteractiveFrame title="創作很多時候是這樣發生的" hint="會自動播放，也可以點下面的步驟自己切。">
            <div ref={ref} className={`rounded-lg border ${t.inset}`}>
                <div className="relative mx-auto h-[150px] w-[200px]">
                    {LAYOUTS[stage].map((cube, i) => (
                        <motion.span
                            key={i}
                            className="absolute left-0 top-0 rounded-[3px]"
                            style={{
                                width: CELL - 2,
                                height: CELL - 2,
                                boxShadow: 'inset -3px -3px 0 rgba(0,0,0,0.22), inset 3px 3px 0 rgba(255,255,255,0.22)',
                            }}
                            initial={false}
                            animate={{ x: cube.x, y: cube.y, backgroundColor: cube.color }}
                            transition={{ type: 'spring', stiffness: 170, damping: 18, delay: i * 0.03 }}
                        />
                    ))}
                    {EXTRAS.map(([x, y], i) => (
                        <motion.span
                            key={`extra-${i}`}
                            className="absolute left-0 top-0 rounded-[3px]"
                            style={{
                                width: CELL - 2,
                                height: CELL - 2,
                                backgroundColor: YELLOW,
                                boxShadow: 'inset -3px -3px 0 rgba(0,0,0,0.18), inset 3px 3px 0 rgba(255,255,255,0.4)',
                            }}
                            initial={false}
                            animate={last ? { x, y, scale: 1, opacity: 1 } : { x, y: y - 26, scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 14, delay: last ? 0.25 + i * 0.12 : 0 }}
                        />
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
                {STAGES.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-1">
                        <button
                            type="button"
                            aria-pressed={stage === index}
                            onClick={() => pick(index)}
                            className={`relative rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                                stage === index ? t.chipOn : index < stage ? t.accentSoft : t.chip
                            }`}
                        >
                            {item.name}
                        </button>
                        {index < STAGES.length - 1 && (
                            <span aria-hidden="true" className={`text-xs ${index < stage ? t.accent : t.faint}`}>
                                →
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <Verdict id={stage}>{STAGES[stage].text}</Verdict>
        </InteractiveFrame>
    );
}
