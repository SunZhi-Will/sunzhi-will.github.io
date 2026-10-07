'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Segmented, Stage } from './kit';
import { InteractiveFrame, Verdict } from './InteractiveFrame';

const HURDLES = [
    { name: '知道自己在做什麼', text: '能說出這個功能為什麼能跑，哪裡可能壞。' },
    { name: '判斷 AI 的答案', text: 'AI 講得很有自信，你要能分辨它是對的、過度複雜的，還是走錯方向。' },
    { name: 'Debug', text: '出錯時先定位，而不是一路叫 AI 重寫。' },
    { name: '設計架構', text: '資料放哪裡、誰負責什麼、之後怎麼擴充。AI 能提案，取捨要有人做。' },
    { name: '理解使用者', text: '做得出來不等於有人要用。真正的需求在人身上，不在程式碼裡。' },
    { name: '把問題拆清楚', text: '好的問題會得到好的答案，也會讓大問題變成幾個小問題。' },
    { name: '持續自學', text: '工具一直在變，能自己把新東西弄懂的人，不會被淘汰。' },
];

const W = 640;
const START = { off: 34, on: 210 };
const FIRST = 262;
const GAP = 52;

type Mode = 'off' | 'on';

/** AI 把起跑線往前搬，終點沒有消失 */
export function RaceTrack() {
    const [mode, setMode] = useState<Mode>('off');
    const [sel, setSel] = useState(0);
    const sx = START[mode];

    return (
        <InteractiveFrame title="起跑線往前，終點還在原地" kicker="示意圖" hint="切換「有 AI」，看起跑線怎麼移動。再點跑道上的欄架。">
            <Segmented
                id="race-ai"
                label="有沒有 AI"
                value={mode}
                onChange={setMode}
                options={[
                    { value: 'off', label: '沒有 AI' },
                    { value: 'on', label: '有 AI' },
                ]}
            />

            <Stage className="px-1 py-3">
                <svg viewBox={`0 0 ${W} 190`} className="block w-full" role="img" aria-label="一條跑道，起跑線、七個欄架與終點">
                    <defs>
                        <pattern id="checker" width="10" height="10" patternUnits="userSpaceOnUse">
                            <rect width="5" height="5" className="fill-fg" />
                            <rect x="5" y="5" width="5" height="5" className="fill-fg" />
                        </pattern>
                    </defs>
                    {/* 跑道 */}
                    <rect x="16" y="64" width={W - 32} height="92" rx="46" className="fill-warning/25" />
                    <line x1="40" x2={W - 40} y1="110" y2="110" className="stroke-surface" strokeWidth="2" strokeDasharray="10 10" />
                    {/* AI 幫你跳過的距離 */}
                    <motion.rect x="16" y="64" height="92" rx="46" className="fill-brand/40" initial={false} animate={{ width: sx - 16 + 6, opacity: mode === 'on' ? 1 : 0 }} transition={{ type: 'spring', stiffness: 70, damping: 15 }} />
                    <AnimatePresence>
                        {mode === 'on' && (
                            <motion.text x="110" y="52" textAnchor="middle" className="fill-brand-text text-[13px] font-black" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                AI 幫你跨過的第一道牆
                            </motion.text>
                        )}
                    </AnimatePresence>
                    {/* 起跑線與跑者 */}
                    <motion.g initial={false} animate={{ x: sx }} transition={{ type: 'spring', stiffness: 70, damping: 15 }}>
                        <rect x="-3" y="60" width="6" height="100" rx="3" className="fill-fg" />
                        <circle cx="-22" cy="96" r="9" className="fill-fg" />
                        <rect x="-30" y="108" width="16" height="22" rx="5" className="fill-info" />
                        <text x="0" y="178" textAnchor="middle" className="fill-fg text-[12px] font-black">起跑</text>
                    </motion.g>
                    {/* 欄架 */}
                    {HURDLES.map((h, k) => {
                        const hx = FIRST + k * GAP;
                        const on = sel === k;
                        return (
                            <g key={h.name} onClick={() => setSel(k)} className="cursor-pointer" role="button" tabIndex={0} aria-label={h.name} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSel(k)}>
                                <rect x={hx - 20} y="60" width="40" height="100" fill="transparent" />
                                <rect x={hx - 15} y="84" width="30" height="7" rx="3" className={on ? 'fill-brand' : 'fill-fg'} />
                                <rect x={hx - 14} y="84" width="4" height="48" className={on ? 'fill-brand' : 'fill-fg'} />
                                <rect x={hx + 10} y="84" width="4" height="48" className={on ? 'fill-brand' : 'fill-fg'} />
                                <circle cx={hx} cy="40" r={on ? 14 : 11} className={on ? 'fill-brand' : 'fill-surface stroke-line-strong'} strokeWidth="2" />
                                <text x={hx} y="45" textAnchor="middle" className={`text-[13px] font-black ${on ? 'fill-brand-on' : 'fill-fg'}`}>
                                    {k + 1}
                                </text>
                            </g>
                        );
                    })}
                    {/* 終點 */}
                    <rect x={W - 44} y="60" width="10" height="100" fill="url(#checker)" className="stroke-fg" strokeWidth="1" />
                    <text x={W - 39} y="178" textAnchor="middle" className="fill-success-text text-[12px] font-black">終點</text>
                </svg>
            </Stage>

            <AnimatePresence mode="wait">
                <motion.div key={sel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4 shadow-card">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-black text-brand-on">{sel + 1}</span>
                    <div>
                        <div className="text-base font-black text-fg">{HURDLES[sel].name}</div>
                        <div className="mt-0.5 text-sm leading-relaxed text-fg-body">{HURDLES[sel].text}</div>
                    </div>
                    <span className="ml-auto flex shrink-0 gap-1 self-center">
                        <button type="button" aria-label="上一個欄架" onClick={() => setSel((sel + HURDLES.length - 1) % HURDLES.length)} className="flex h-8 w-8 items-center justify-center rounded-full border border-line-strong text-fg">
                            ←
                        </button>
                        <button type="button" aria-label="下一個欄架" onClick={() => setSel((sel + 1) % HURDLES.length)} className="flex h-8 w-8 items-center justify-center rounded-full border border-line-strong text-fg">
                            →
                        </button>
                    </span>
                </motion.div>
            </AnimatePresence>

            <Verdict id={mode}>
                {mode === 'on' ? (
                    <>
                        起跑線往前搬了，但<strong>七個欄架一個都沒少，終點也還在原地</strong>。大家都能很快做出東西之後，拉開差距的就是這些。
                    </>
                ) : (
                    <>以前要先跑很長一段，才碰得到第一個欄架。切到「有 AI」看看。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
