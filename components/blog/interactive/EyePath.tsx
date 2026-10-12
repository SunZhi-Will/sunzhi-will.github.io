'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { Note, Stage } from './kit';
import { InteractiveFrame } from './InteractiveFrame';

type Pt = [number, number];

// 兩個線框版面，以及第一次來的人要找到報名按鈕時，視線會停的位置
const LAYOUTS: { name: string; points: Pt[]; blocks: { x: number; y: number; w: number; h: number; tone: 'ink' | 'line' | 'card' | 'cta' | 'mute' }[] }[] = [
    {
        name: '修改前',
        points: [
            [150, 38],
            [60, 82],
            [235, 92],
            [60, 140],
            [250, 140],
            [140, 104],
            [44, 184],
        ],
        blocks: [
            { x: 20, y: 20, w: 270, h: 36, tone: 'ink' },
            ...[70, 80, 90, 100].map((y) => ({ x: 20, y, w: 280, h: 4, tone: 'line' as const })),
            { x: 20, y: 118, w: 90, h: 44, tone: 'card' },
            { x: 115, y: 118, w: 90, h: 44, tone: 'card' },
            { x: 210, y: 118, w: 90, h: 44, tone: 'card' },
            { x: 20, y: 177, w: 48, h: 14, tone: 'mute' },
            { x: 74, y: 177, w: 48, h: 14, tone: 'mute' },
        ],
    },
    {
        name: '修改後',
        points: [
            [100, 40],
            [70, 78],
            [70, 186],
        ],
        blocks: [
            { x: 20, y: 18, w: 60, h: 6, tone: 'cta' },
            { x: 20, y: 30, w: 170, h: 18, tone: 'ink' },
            { x: 20, y: 70, w: 52, h: 14, tone: 'card' },
            { x: 78, y: 70, w: 52, h: 14, tone: 'card' },
            { x: 136, y: 70, w: 52, h: 14, tone: 'card' },
            { x: 20, y: 104, w: 86, h: 52, tone: 'card' },
            { x: 117, y: 104, w: 86, h: 52, tone: 'card' },
            { x: 214, y: 104, w: 86, h: 52, tone: 'card' },
            { x: 20, y: 174, w: 100, h: 24, tone: 'cta' },
        ],
    },
];

const FILL = { ink: '#111827', line: '#c7cbd3', card: '#eef0f3', cta: '#2563eb', mute: '#b8bdc6' };
const STEP = 0.45;

/** 視線路徑：第一次來的人，眼睛要停幾次才找得到報名按鈕 */
export function EyePath() {
    const [run, setRun] = useState(0);

    return (
        <InteractiveFrame title="眼睛要跳幾次，才找到報名按鈕？" kicker="視線路徑" hint="第一次來的人不會從頭讀到尾，而是在畫面上跳著找。按下播放，看看兩個版面的差別。">
            <Stage className="p-3 sm:p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                    {LAYOUTS.map((l) => {
                        const d = l.points.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
                        const dur = l.points.length * STEP;
                        return (
                            <div key={l.name} className="flex flex-col gap-2">
                                <svg viewBox="0 0 320 210" className="block w-full rounded-lg bg-white" role="img" aria-label={`${l.name}：視線停留 ${l.points.length} 次`}>
                                    {l.blocks.map((b, i) => (
                                        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx={b.tone === 'line' ? 2 : 4} fill={FILL[b.tone]} />
                                    ))}
                                    {run > 0 && (
                                        <g key={run}>
                                            <motion.path d={d} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: dur, ease: 'linear' }} />
                                            {l.points.map((p, i) => (
                                                <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: (i / Math.max(1, l.points.length - 1)) * dur, type: 'spring', stiffness: 400, damping: 18 }} style={{ originX: `${p[0]}px`, originY: `${p[1]}px` }}>
                                                    <circle cx={p[0]} cy={p[1]} r="10" fill="#f59e0b" />
                                                    <text x={p[0]} y={p[1] + 4} textAnchor="middle" className="text-[11px] font-black" fill="#ffffff">
                                                        {i + 1}
                                                    </text>
                                                </motion.g>
                                            ))}
                                        </g>
                                    )}
                                </svg>
                                <div className="flex items-baseline justify-between px-1">
                                    <span className="text-[11px] font-bold tracking-[0.12em] text-fg">{l.name}</span>
                                    <motion.span key={run} initial={{ opacity: 0 }} animate={{ opacity: run ? 1 : 0 }} transition={{ delay: dur }} className="text-sm font-black tabular-nums text-fg">
                                        停 {l.points.length} 次
                                    </motion.span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Stage>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                <button type="button" onClick={() => setRun((r) => r + 1)} className="flex shrink-0 items-center gap-2 rounded-full bg-fg py-2 pl-3 pr-4 text-xs font-bold text-canvas hover:bg-fg/90">
                    <Icon name={run ? 'loop' : 'play'} className="h-4 w-4" />
                    {run ? '再看一次' : '播放視線'}
                </button>
                <Note id={run ? 'r' : 'n'}>{run ? <>層級清楚，眼睛就不用來回找。<strong className="text-fg">好看常常是因為好找。</strong></> : <>橘色圓點是眼睛停下來的位置。</>}</Note>
            </div>
        </InteractiveFrame>
    );
}
