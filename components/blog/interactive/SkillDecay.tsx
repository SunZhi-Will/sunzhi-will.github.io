'use client'

import { useRef, useState, type PointerEvent } from 'react';
import { motion } from 'framer-motion';
import { Stage } from './kit';
import { InteractiveFrame, Verdict } from './InteractiveFrame';

const W = 600;
const H = 250;
const PAD = { l: 40, r: 20, t: 20, b: 34 };
const MONTHS = 24;

const LINES = [
    { id: 'ui', name: '某個工具的介面操作', short: '介面操作', stroke: 'stroke-danger', fill: 'fill-danger', dot: 'bg-danger', fn: (m: number) => 100 * Math.exp(-m / 5) },
    { id: 'fw', name: '某個框架的寫法教學', short: '框架寫法', stroke: 'stroke-warning', fill: 'fill-warning', dot: 'bg-warning', fn: (m: number) => 100 * Math.exp(-m / 12) },
    { id: 'self', name: '自己把新東西弄懂的能力', short: '自學能力', stroke: 'stroke-success', fill: 'fill-success', dot: 'bg-success', fn: (m: number) => 100 - m * 0.15 },
];

const x = (m: number) => PAD.l + (m / MONTHS) * (W - PAD.l - PAD.r);
const y = (v: number) => PAD.t + (1 - v / 100) * (H - PAD.t - PAD.b);

function line(fn: (m: number) => number) {
    return Array.from({ length: MONTHS * 2 + 1 }, (_, k) => {
        const m = k / 2;
        return `${k === 0 ? 'M' : 'L'}${x(m).toFixed(1)},${y(fn(m)).toFixed(1)}`;
    }).join(' ');
}

/** 示意圖：不同種類的知識，保鮮期差很多。直接在圖上拖曳 */
export function SkillDecay() {
    const [m, setM] = useState(12);
    const svg = useRef<SVGSVGElement>(null);

    const fromPointer = (e: PointerEvent<SVGSVGElement>) => {
        const box = svg.current?.getBoundingClientRect();
        if (!box) return;
        const px = ((e.clientX - box.left) / box.width) * W;
        setM(Math.round(Math.max(0, Math.min(MONTHS, ((px - PAD.l) / (W - PAD.l - PAD.r)) * MONTHS))));
    };

    return (
        <InteractiveFrame title="哪些知識放半年還能用？" kicker="示意圖表" hint="在圖上左右拖曳，看過了幾個月之後，三種知識還剩多少用處。曲線是示意，不是統計。">
            <Stage className="p-2 sm:p-3">
                <svg
                    ref={svg}
                    viewBox={`0 0 ${W} ${H}`}
                    className="block w-full cursor-ew-resize touch-none select-none"
                    role="img"
                    aria-label="三種知識隨時間變得不適用的示意曲線"
                    onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture(e.pointerId);
                        fromPointer(e);
                    }}
                    onPointerMove={(e) => e.buttons && fromPointer(e)}
                >
                    <defs>
                        <linearGradient id="decay-self" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="rgb(var(--color-success))" stopOpacity="0.28" />
                            <stop offset="1" stopColor="rgb(var(--color-success))" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {[0, 50, 100].map((v) => (
                        <g key={v}>
                            <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} className="stroke-fg/10" strokeWidth="1" />
                            <text x={PAD.l - 8} y={y(v) + 4} textAnchor="end" className="fill-fg text-[11px] font-semibold">{v}</text>
                        </g>
                    ))}
                    {[0, 6, 12, 18, 24].map((mm) => (
                        <text key={mm} x={x(mm)} y={H - 10} textAnchor={mm === MONTHS ? 'end' : mm === 0 ? 'start' : 'middle'} className="fill-fg text-[11px] font-semibold">
                            {mm} 個月
                        </text>
                    ))}
                    <path d={`${line(LINES[2].fn)} L${x(MONTHS)},${y(0)} L${x(0)},${y(0)} Z`} fill="url(#decay-self)" />
                    {LINES.map((l, k) => (
                        <motion.path key={l.id} d={line(l.fn)} fill="none" className={l.stroke} strokeWidth="3.5" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: k * 0.2 }} />
                    ))}
                    <line x1={x(m)} x2={x(m)} y1={PAD.t - 6} y2={H - PAD.b} className="stroke-fg" strokeWidth="1.5" strokeDasharray="4 4" />
                    <g transform={`translate(${Math.min(Math.max(x(m), PAD.l + 34), W - PAD.r - 34)}, ${PAD.t - 6})`}>
                        <rect x="-34" y="-14" width="68" height="22" rx="11" className="fill-fg" />
                        <text y="1" textAnchor="middle" className="fill-canvas text-[11px] font-black">第 {m} 個月</text>
                    </g>
                    {LINES.map((l) => (
                        <circle key={l.id} cx={x(m)} cy={y(l.fn(m))} r="6.5" className={`${l.fill} stroke-surface`} strokeWidth="3" />
                    ))}
                </svg>
            </Stage>

            <input type="range" min={0} max={MONTHS} value={m} onChange={(e) => setM(Number(e.target.value))} aria-label="經過的月數" className="w-full accent-[rgb(var(--color-brand))]" />

            <div className="grid grid-cols-3 gap-2">
                {LINES.map((l) => {
                    const v = Math.round(l.fn(m));
                    return (
                        <div key={l.id} className="rounded-xl border border-line bg-surface p-2.5 shadow-card sm:p-3">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-fg">
                                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${l.dot}`} />
                                <span className="sm:hidden">{l.short}</span>
                                <span className="hidden sm:inline">{l.name}</span>
                            </div>
                            <div className="mt-1 flex items-baseline gap-1">
                                <span className="text-2xl font-black tabular-nums text-fg sm:text-3xl">{v}</span>
                                <span className="hidden text-xs font-bold text-fg-body sm:inline">/ 100</span>
                            </div>
                            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-fg/10">
                                <motion.div className={`h-full rounded-full ${l.dot}`} initial={false} animate={{ width: `${v}%` }} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <Verdict id={m >= 12 ? 'late' : 'early'}>
                {m >= 12 ? (
                    <>
                        過了 {m} 個月，介面和寫法都可能換了。<strong>「遇到不知道的東西，我知道怎麼把它弄懂」</strong>幾乎沒變。工具越更新得快，這個能力越值錢。
                    </>
                ) : (
                    <>剛學完的時候三種都很有用。在圖上往右拖，看哪一條掉得最快。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
