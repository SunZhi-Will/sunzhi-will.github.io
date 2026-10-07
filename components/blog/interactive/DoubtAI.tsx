'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const PACKAGES = ['moment', 'lodash', 'date-fns-tz'];

const QUESTIONS = [
    { q: '這個功能真的需要它們嗎？', a: '只是把今天的日期顯示成 2026/10/07，沒有時區轉換，也沒有複雜計算。' },
    { q: '有沒有更小的做法？', a: '瀏覽器本來就會格式化日期，一行就能做到，不需要裝任何東西。' },
    { q: '裝了之後，我要多顧什麼？', a: '三個套件都要更新、都可能有安全性問題，而且之後換人接手也得看得懂它們。' },
];

/** 「好專業」與「等等，有需要搞這麼複雜嗎」之間的差別 */
export function DoubtAI() {
    const t = useFrameTheme();
    const [asked, setAsked] = useState<number[]>([]);
    const [accepted, setAccepted] = useState(false);
    const all = asked.length === QUESTIONS.length;

    const ask = (i: number) => setAsked((l) => (l.includes(i) ? l : [...l, i]));

    return (
        <InteractiveFrame title="為了小功能裝三個套件？" kicker="情境模擬" hint="需求只有一句話。看看 AI 的方案，再試著問它三個問題。">
            <div className={`rounded-lg border px-3 py-2.5 text-sm ${t.inset}`}>
                <span className={`mr-2 text-xs font-semibold ${t.faint}`}>需求</span>
                <span className={t.text}>在頁面上顯示今天的日期，格式是 2026/10/07。</span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                <div className={`rounded-lg border p-3 ${t.inset}`}>
                    <div className={`mb-2 flex items-center gap-1.5 text-xs font-bold ${t.text}`}>
                        <Icon name="robot" className="h-4 w-4 text-brand-text" />AI 的方案
                    </div>
                    <div className={`mb-2 text-xs ${t.sub}`}>為了解決這個小功能，我們導入另外三個套件：</div>
                    <div className="mb-3 flex flex-wrap gap-1.5">
                        {PACKAGES.map((p, i) => (
                            <motion.span key={p} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="rounded-md border border-warning/50 bg-warning/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-warning-text">
                                + {p}
                            </motion.span>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => setAccepted(true)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${accepted ? 'border-danger bg-danger/15 text-danger-text' : t.chip}`}
                    >
                        好專業，Yes
                    </button>
                </div>

                <div className={`rounded-lg border p-3 ${t.inset}`}>
                    <div className={`mb-2 flex items-center gap-1.5 text-xs font-bold ${t.text}`}>
                        <Icon name="ask" className="h-4 w-4 text-brand-text" />你可以先問
                    </div>
                    <div className="space-y-1.5">
                        {QUESTIONS.map((x, i) => (
                            <div key={x.q}>
                                <button type="button" onClick={() => ask(i)} className={`w-full rounded-md border px-2.5 py-1.5 text-left text-xs font-semibold transition-colors ${asked.includes(i) ? t.accentSoft : t.chip}`}>
                                    {x.q}
                                </button>
                                <AnimatePresence initial={false}>
                                    {asked.includes(i) && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className={`overflow-hidden px-1 pt-1 text-xs leading-relaxed ${t.sub}`}>
                                            {x.a}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-line bg-surface-sunken">
                <div className={`border-b px-3 py-2 text-[11px] ${t.divider} ${t.faint}`}>更小的做法</div>
                <div className="min-h-[56px] px-3 py-2.5">
                    {all ? (
                        <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="m-0 overflow-x-auto bg-transparent p-0 font-mono text-xs leading-6 text-fg">
                            {`new Date().toLocaleDateString('zh-TW', {\n  year: 'numeric', month: '2-digit', day: '2-digit',\n})  // 2026/10/07`}
                        </motion.pre>
                    ) : (
                        <div className={`text-xs ${t.faint}`}>三個問題都問過，才會看到。</div>
                    )}
                </div>
            </div>

            <Verdict id={`${accepted}-${all}`}>
                {all ? (
                    <>
                        新手聽到「導入三個套件」可能覺得專業；有經驗的人第一個反應是：<strong>等等，有需要搞這麼複雜嗎？</strong>AI 負責提出選項，選哪條路仍然是人的工作。
                    </>
                ) : accepted ? (
                    <>按下 Yes 很快，但專案多了三個你不一定看得懂、之後得持續維護的東西。先問問看。</>
                ) : (
                    <>你不需要懂套件，只要敢問「有必要嗎」。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
