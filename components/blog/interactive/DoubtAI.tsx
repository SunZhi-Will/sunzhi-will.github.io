'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './icons';
import { Bubble, Segmented, Stage, Window } from './kit';
import { InteractiveFrame, Verdict } from './InteractiveFrame';

const PACKAGES = [
    { name: 'moment', x: 70 },
    { name: 'lodash', x: 200 },
    { name: 'date-fns-tz', x: 330 },
];

const QUESTIONS = [
    { short: '真的需要嗎？', q: '這個功能真的需要它們嗎？', a: '只是把今天的日期顯示成 2026/10/07，沒有時區轉換，也沒有複雜計算。' },
    { short: '更小的做法？', q: '有沒有更小的做法？', a: '瀏覽器本來就會格式化日期，一行就能做到，不需要裝任何東西。' },
    { short: '要多顧什麼？', q: '裝了之後我要多顧什麼？', a: '三個套件都要更新、都可能有安全性問題，之後接手的人也得看得懂。' },
];

type View = 'ai' | 'small';

/** 「好專業」與「等等，有需要搞這麼複雜嗎」之間的差別 */
export function DoubtAI() {
    const [asked, setAsked] = useState<number[]>([]);
    const [view, setView] = useState<View>('ai');
    const [current, setCurrent] = useState<number | null>(null);
    const all = asked.length === QUESTIONS.length;

    const ask = (i: number) => {
        const nextAsked = asked.includes(i) ? asked : [...asked, i];
        setAsked(nextAsked);
        setCurrent(i);
        if (nextAsked.length === QUESTIONS.length) setView('small');
    };

    return (
        <InteractiveFrame title="為了小功能裝三個套件？" kicker="情境模擬" hint="需求只有一句話：在頁面顯示今天的日期，格式 2026/10/07。看 AI 的方案，再問它三個問題。">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-3">
                    <Segmented
                        id="doubt-view"
                        label="方案"
                        value={view}
                        onChange={(v) => (v === 'small' && !all ? null : setView(v))}
                        options={[
                            { value: 'ai', label: 'AI 的方案' },
                            { value: 'small', label: all ? '更小的做法' : '更小的做法（先問完）' },
                        ]}
                    />
                    <Stage className="flex min-h-[200px] items-center justify-center p-2 sm:min-h-[250px] sm:p-3">
                        <AnimatePresence mode="wait">
                            {view === 'ai' ? (
                                <motion.svg key="ai" viewBox="0 0 400 230" className="block w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} role="img" aria-label="專案多了三個套件">
                                    {PACKAGES.map((p, i) => (
                                        <motion.path key={p.name} d={`M200 72 C200 120, ${p.x} 110, ${p.x} 150`} fill="none" className="stroke-warning" strokeWidth="2.5" strokeDasharray="5 5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }} />
                                    ))}
                                    <rect x="130" y="24" width="140" height="48" rx="12" className="fill-fg" />
                                    <text x="200" y="54" textAnchor="middle" className="fill-canvas text-[15px] font-black">你的專案</text>
                                    {PACKAGES.map((p, i) => (
                                        <motion.g key={p.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.15 }}>
                                            <rect x={p.x - 58} y="150" width="116" height="42" rx="10" className="fill-warning/15 stroke-warning" strokeWidth="2" />
                                            <text x={p.x} y="176" textAnchor="middle" className="fill-warning-text font-mono text-[13px] font-bold">+ {p.name}</text>
                                        </motion.g>
                                    ))}
                                    <text x="200" y="220" textAnchor="middle" className="fill-fg text-[12px] font-bold">要維護的套件：3 個</text>
                                </motion.svg>
                            ) : (
                                <motion.div key="small" className="w-full space-y-3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                                    <Window title="date.js" icon="code" tone="success">
                                        <pre className="m-0 whitespace-pre-wrap break-words bg-transparent px-3 py-3 font-mono text-[11px] sm:text-[12px] leading-6 text-fg">
                                            {`new Date()\n  .toLocaleDateString('zh-TW', {\n    year: 'numeric',\n    month: '2-digit',\n    day: '2-digit',\n  })\n// 2026/10/07`}
                                        </pre>
                                    </Window>
                                    <div className="flex items-center justify-center gap-1.5 text-xs font-black text-success-text">
                                        <Icon name="check" className="h-4 w-4" />要維護的套件：0 個
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Stage>
                </div>

                <div className="flex min-w-0 flex-col gap-2.5">
                    <div className="hidden md:block">
                        <Bubble who="ai">為了解決這個小功能，我們導入另外三個套件。</Bubble>
                    </div>
                    <AnimatePresence mode="wait">
                        {current !== null && (
                            <motion.div key={current} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2.5">
                                <Bubble who="me">{QUESTIONS[current].q}</Bubble>
                                <Bubble who="ai">{QUESTIONS[current].a}</Bubble>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="mt-auto grid grid-cols-3 gap-1.5 pt-1 md:grid-cols-1">
                        {QUESTIONS.map((x, i) => {
                            const did = asked.includes(i);
                            return (
                                <button
                                    key={x.q}
                                    type="button"
                                    aria-pressed={current === i}
                                    onClick={() => ask(i)}
                                    className={`flex flex-col items-center gap-1 rounded-xl border px-1.5 py-2 text-center text-[11px] font-bold leading-snug transition-colors md:flex-row md:gap-2 md:px-3 md:text-left md:text-xs ${
                                        current === i ? 'border-brand bg-brand/15 text-fg' : did ? 'border-success/50 bg-success/10 text-fg' : 'border-dashed border-brand/60 text-fg hover:bg-brand/10'
                                    }`}
                                >
                                    <Icon name={did ? 'check' : 'ask'} className={`h-4 w-4 shrink-0 ${did ? 'text-success-text' : 'text-brand-text'}`} />
                                    <span className="md:hidden">{x.short}</span>
                                    <span className="hidden md:inline">{x.q}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <Verdict id={`${asked.length}`}>
                {all ? (
                    <>
                        新手聽到「導入三個套件」可能覺得專業；有經驗的人第一個反應是：<strong>等等，有需要搞這麼複雜嗎？</strong>AI 負責提出選項，選哪條路仍然是人的工作。
                    </>
                ) : (
                    <>你不需要懂套件，只要敢問「有必要嗎」。還剩 {QUESTIONS.length - asked.length} 個問題。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
