'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const QUESTIONS = ['我應該先學什麼？', '哪些現在不用管？', '做到什麼程度算會？', '下一步要往哪裡走？', 'AI 講的到底對不對？'];

/** 老師的價值，從「給答案」變成「整理地圖」 */
export function AnswersVsMap() {
    const t = useFrameTheme();
    const [now, setNow] = useState(false);

    const rows = [
        { label: '找到答案的難度', before: 85, after: 12 },
        { label: '選對路線的難度', before: 55, after: 78 },
    ];

    return (
        <InteractiveFrame title="答案到處都是，地圖卻沒有" kicker="示意圖表" hint="切換「以前」與「現在」，看兩件事的難度怎麼變。數值是示意。">
            <div role="group" aria-label="時代" className={`inline-flex rounded-full border p-0.5 ${t.inset}`}>
                {[false, true].map((v) => (
                    <button key={String(v)} type="button" aria-pressed={now === v} onClick={() => setNow(v)} className={`relative rounded-full px-4 py-1 text-xs font-bold ${now === v ? 'text-brand-on' : t.sub}`}>
                        {now === v && <motion.span layoutId="map-pill" className="absolute inset-0 rounded-full bg-brand" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                        <span className="relative">{v ? '現在' : '以前'}</span>
                    </button>
                ))}
            </div>

            <div className={`space-y-4 rounded-lg border p-4 ${t.inset}`}>
                {rows.map((r) => {
                    const v = now ? r.after : r.before;
                    return (
                        <div key={r.label}>
                            <div className={`mb-1 flex items-baseline justify-between text-xs font-bold ${t.text}`}>
                                <span>{r.label}</span>
                                <span className="tabular-nums">{v}</span>
                            </div>
                            <div className="h-3.5 overflow-hidden rounded-full bg-fg/10">
                                <motion.div className={`h-full rounded-full ${r.label.startsWith('找') ? 'bg-info' : 'bg-warning'}`} initial={false} animate={{ width: `${v}%` }} transition={{ type: 'spring', stiffness: 110, damping: 18 }} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={`min-h-[148px] rounded-lg border p-3 ${t.inset}`}>
                <AnimatePresence mode="wait" initial={false}>
                    {now ? (
                        <motion.div key="now" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-1.5">
                            <div className={`mb-1 flex items-center gap-1.5 text-xs font-bold ${t.text}`}><Icon name="map" className="h-4 w-4 text-brand-text" />好的教學現在更像在回答這五件事</div>
                            {QUESTIONS.map((q, i) => (
                                <motion.div key={q} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center gap-2 text-sm text-fg">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-black text-brand-on">{i + 1}</span>
                                    {q}
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div key="before" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`flex min-h-[124px] items-center gap-3 text-sm ${t.sub}`}>
                            <Icon name="learn" className="h-8 w-8 shrink-0 text-brand-text" />
                            以前答案不好找，老師最大的價值之一，就是告訴你答案。
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Verdict id={String(now)}>
                {now ? (
                    <>現在最難的反而是知道<strong>該往哪走</strong>。好的教學像整理地圖，不是把 Google、文件、AI 上查得到的東西再念一遍。</>
                ) : (
                    <>答案難找的年代，會的人自然就是老師。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
