'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon, type IconName } from './icons';
import { Bubble, Stage } from './kit';
import { InteractiveFrame, Verdict } from './InteractiveFrame';

const STAGES: { name: string; icon: IconName; goal: string; say: string; words: string[]; verdict: string }[] = [
    {
        name: '看得懂',
        icon: 'eye',
        goal: 'AI 給我的程式，我大概知道它在幹嘛。',
        say: '幫我把這個按鈕改成藍色。這段是在幹嘛？',
        words: ['變數', '函式', '條件判斷', 'Error 訊息'],
        verdict: '這個階段還不需要會寫。能把一段程式用白話講出來，就是進步。',
    },
    {
        name: '改得動',
        icon: 'edit',
        goal: '我開始知道問題大概出在哪一層。',
        say: '這個資料是從 API 回來的，State 改掉之後畫面會重新 Render。',
        words: ['Component', 'API', 'State', 'Render'],
        verdict: '你學的已經不只是 JavaScript，而是軟體怎麼運作：資料從哪來、畫面為什麼會變。',
    },
    {
        name: '能懷疑',
        icon: 'shield',
        goal: 'AI 走錯方向的時候，我看得出來。',
        say: '這邊的資料應該從後端拿，不該寫死在前端。',
        words: ['架構', '權限', '相依套件', '取捨'],
        verdict: 'AI 可以產生很多選項，但最後選哪個方向，仍然是人的工作。',
    },
];

const STEP_W = 124;
const STEP_H = 62;

/** 三個階段：看得懂、改得動、能懷疑 */
export function SkillStages() {
    const [i, setI] = useState(0);
    const stage = STAGES[i];
    const charX = 22 + i * STEP_W + STEP_W / 2;
    const charY = 250 - (i + 1) * STEP_H;

    return (
        <InteractiveFrame title="你會一階一階往上走" kicker="三個階段" hint="點階梯或下面的按鈕，看看每個階段的你會對 AI 說什麼。">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <Stage className="flex flex-col p-2 sm:p-3">
                    <svg viewBox="0 0 420 254" className="block w-full" role="img" aria-label="三階樓梯">
                        {STAGES.map((s, k) => {
                            const x = 22 + k * STEP_W;
                            const h = (k + 1) * STEP_H;
                            const on = k <= i;
                            return (
                                <g key={s.name} onClick={() => setI(k)} className="cursor-pointer" role="button" tabIndex={0} aria-label={s.name} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setI(k)}>
                                    <rect x={x} y={250 - h} width={STEP_W - 4} height={h} rx="8" className={on ? 'fill-brand' : 'fill-fg/15'} style={{ transition: 'fill .3s' }} />
                                    <rect x={x} y={250 - h} width={STEP_W - 4} height="8" rx="4" className={on ? 'fill-warning' : 'fill-fg/20'} />
                                    <text x={x + (STEP_W - 4) / 2} y={250 - h + 36} textAnchor="middle" className={`text-[15px] font-black ${on ? 'fill-brand-on' : 'fill-fg'}`}>
                                        {k + 1}　{s.name}
                                    </text>
                                </g>
                            );
                        })}
                        <motion.g initial={false} animate={{ x: charX, y: charY, scale: 1.35 }} transition={{ type: 'spring', stiffness: 160, damping: 14 }}>
                            <rect x="-14" y="-62" width="28" height="26" rx="5" className="fill-[#f1c9a0]" />
                            <rect x="-14" y="-62" width="28" height="8" rx="4" className="fill-[#2a1d14]" />
                            <rect x="-8" y="-50" width="4" height="6" rx="1" className="fill-[#111]" />
                            <rect x="4" y="-50" width="4" height="6" rx="1" className="fill-[#111]" />
                            <rect x="-12" y="-34" width="24" height="22" rx="4" className="fill-info" />
                            <rect x="-10" y="-12" width="8" height="10" rx="2" className="fill-fg" />
                            <rect x="2" y="-12" width="8" height="10" rx="2" className="fill-fg" />
                        </motion.g>
                    </svg>
                    <div className="mt-2 hidden grid-cols-3 gap-1.5 sm:grid">
                        {STAGES.map((s, k) => (
                            <button key={s.name} type="button" aria-pressed={i === k} onClick={() => setI(k)} className={`flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-bold transition-colors ${i === k ? 'bg-fg text-canvas' : 'text-fg hover:bg-fg/10'}`}>
                                <Icon name={s.icon} className="h-4 w-4" />
                                {s.name}
                            </button>
                        ))}
                    </div>
                </Stage>

                <AnimatePresence mode="wait">
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-2.5 rounded-xl border border-line bg-surface p-3.5 shadow-card sm:gap-3 sm:p-4">
                        <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-brand-on">
                                <Icon name={stage.icon} className="h-6 w-6" />
                            </span>
                            <div>
                                <div className="text-[11px] font-bold tracking-[0.16em] text-brand-text">第 {i + 1} 階段</div>
                                <div className="text-base font-black leading-snug text-fg">{stage.goal}</div>
                            </div>
                        </div>
                        <Bubble who="me">{stage.say}</Bubble>
                        <div>
                            <div className="mb-1.5 text-[11px] font-bold tracking-[0.14em] text-fg-body">開始聽得懂的詞</div>
                            <div className="flex flex-wrap gap-1.5">
                                {stage.words.map((w, k) => (
                                    <motion.span key={w} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + k * 0.06 }} className="rounded-full bg-success px-2.5 py-1 text-[11px] font-bold text-canvas">
                                        {w}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <Verdict id={i}>{stage.verdict}</Verdict>
        </InteractiveFrame>
    );
}
