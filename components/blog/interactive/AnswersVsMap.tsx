'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './icons';
import { Segmented, Stage } from './kit';
import { InteractiveFrame, Verdict } from './InteractiveFrame';

const QUESTIONS = ['我應該先學什麼？', '哪些現在不用管？', '做到什麼程度算會？', '下一步要往哪裡走？', 'AI 講的到底對不對？'];

const ROUTE = 'M40 200 C 100 200, 110 120, 170 120 S 250 190, 300 170 S 360 60, 420 70 S 500 150, 560 60';
const POINTS = [
    { x: 170, y: 120 },
    { x: 300, y: 170 },
    { x: 420, y: 70 },
    { x: 488, y: 108 },
    { x: 560, y: 60 },
];

// 散落各處的「答案」：位置固定，避免伺服器與瀏覽器不一致
const DOTS = Array.from({ length: 46 }, (_, k) => ({ x: 20 + ((k * 97) % 580), y: 18 + ((k * 53) % 200), r: 2 + (k % 3) }));

type Era = 'before' | 'now';

/** 老師的價值，從「給答案」變成「整理地圖」 */
export function AnswersVsMap() {
    const [era, setEra] = useState<Era>('now');
    const [sel, setSel] = useState(0);
    const now = era === 'now';

    return (
        <InteractiveFrame title="答案到處都是，地圖卻沒有" kicker="示意圖" hint="切換「以前」與「現在」。現在的路線上每一站，都是一個新手卡住的問題。">
            <Segmented
                id="answers-era"
                label="時代"
                value={era}
                onChange={setEra}
                options={[
                    { value: 'before', label: '以前' },
                    { value: 'now', label: '現在' },
                ]}
            />

            <Stage>
                <svg viewBox="0 0 600 236" className="block w-full" role="img" aria-label={now ? '答案到處都是，需要一條路線' : '答案很少，老師給答案'}>
                    <AnimatePresence>
                        {now &&
                            DOTS.map((d, k) => (
                                <motion.circle key={k} cx={d.x} cy={d.y} r={d.r} className="fill-info" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.35, scale: 1 }} exit={{ opacity: 0 }} transition={{ delay: k * 0.01 }} />
                            ))}
                    </AnimatePresence>
                    {now ? (
                        <g>
                            <motion.path d={ROUTE} fill="none" className="stroke-brand" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 12" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4 }} />
                            <circle cx="40" cy="200" r="9" className="fill-fg" />
                            <text x="40" y="226" textAnchor="middle" className="fill-fg text-[12px] font-black">你在這裡</text>
                            {POINTS.map((p, k) => (
                                <motion.g key={k} onClick={() => setSel(k)} className="cursor-pointer" role="button" tabIndex={0} aria-label={QUESTIONS[k]} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSel(k)} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 + k * 0.2, type: 'spring' }} style={{ originX: `${p.x}px`, originY: `${p.y}px` }}>
                                    <circle cx={p.x} cy={p.y} r={sel === k ? 19 : 15} className={sel === k ? 'fill-brand' : 'fill-surface stroke-brand'} strokeWidth="3" />
                                    <text x={p.x} y={p.y + 5} textAnchor="middle" className={`text-[14px] font-black ${sel === k ? 'fill-brand-on' : 'fill-fg'}`}>{k + 1}</text>
                                </motion.g>
                            ))}
                        </g>
                    ) : (
                        <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ originX: '300px', originY: '118px' }}>
                            <circle cx="300" cy="104" r="62" className="fill-brand/15" />
                            <foreignObject x="268" y="72" width="64" height="64">
                                <Icon name="learn" className="h-16 w-16 text-brand-text" />
                            </foreignObject>
                            {[0, 1, 2].map((k) => (
                                <circle key={k} cx={230 + k * 70} cy="200" r="5" className="fill-info" />
                            ))}
                            <text x="300" y="188" textAnchor="middle" className="fill-fg text-[14px] font-black">答案很少，會的人就是老師</text>
                        </motion.g>
                    )}
                </svg>
            </Stage>

            <div className="min-h-[52px]">
                <AnimatePresence mode="wait">
                    {now ? (
                        <motion.div key={`q-${sel}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3 shadow-card">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-black text-brand-on">{sel + 1}</span>
                            <span className="text-base font-bold text-fg">{QUESTIONS[sel]}</span>
                            <span className="ml-auto flex gap-1">
                                {QUESTIONS.map((_, k) => (
                                    <button key={k} type="button" aria-label={`第 ${k + 1} 站`} onClick={() => setSel(k)} className={`h-2.5 rounded-full transition-all ${k === sel ? 'w-6 bg-brand' : 'w-2.5 bg-fg/20'}`} />
                                ))}
                            </span>
                        </motion.div>
                    ) : (
                        <motion.div key="before" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-xl border border-line bg-surface p-3 text-sm font-semibold text-fg shadow-card">
                            以前答案不好找，老師最大的價值之一，就是告訴你答案。
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Verdict id={era}>
                {now ? (
                    <>
                        現在最難的反而是知道<strong>該往哪走</strong>。好的教學像整理地圖，不是把 Google、文件、AI 上查得到的東西再念一遍。
                    </>
                ) : (
                    <>答案難找的年代，會的人自然就是老師。切到「現在」看看。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
