'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon, type IconName } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const GOALS: {
    id: string;
    name: string;
    icon: IconName;
    pick: string;
    why: string;
    later: string[];
    verdict: string;
}[] = [
    {
        id: 'web',
        name: '我想做網站',
        icon: 'globe',
        pick: 'TypeScript',
        why: 'HTML、CSS、JavaScript 這套 Web 生態很難避開。TypeScript 只是比 JavaScript 多檢查一些東西，AI 寫了大量程式的時候，有人先攔一道很安心。',
        later: ['Rust', 'C#', 'Go'],
        verdict: '目標是 Web，就從 Web 的語言開始。',
    },
    {
        id: 'ai',
        name: '我想做 AI、資料、自動化',
        icon: 'spark',
        pick: 'Python',
        why: '不是因為 Python 簡單，而是它周圍已經有大量 AI、機器學習、資料處理、自動化與腳本的工具和生態。',
        later: ['Rust', 'C#', 'TypeScript'],
        verdict: '不是排行榜第一名就適合所有人，要看你的目的。',
    },
    {
        id: 'bot',
        name: '我想做 Discord Bot 或記帳工具',
        icon: 'chat',
        pick: '先決定要做什麼',
        why: '這類小專案用 TypeScript 或 Python 都做得出來。與其煩惱語言，不如先讓 AI 幫你做出第一版，再沿著遇到的問題學。',
        later: ['Rust', 'Java', 'Go'],
        verdict: '先選你真的想做的東西，語言是第二個問題。',
    },
    {
        id: 'work',
        name: '我的公司本來就用 C# 或 Java',
        icon: 'building',
        pick: '公司在用的那個',
        why: '先把工作真的會用到的東西學好。公司整套系統都是 C#，卻因為網路上最近大家一直講 Rust，跑去研究 Ownership，結果工作上的 C# 還是看不懂，有點本末倒置。',
        later: ['Rust', '新流行的語言'],
        verdict: '工作用到什麼，就先學什麼。',
    },
    {
        id: 'rust',
        name: '我想要極致效能與記憶體控制',
        icon: 'bolt',
        pick: 'Rust',
        why: 'Rust 快、記憶體安全、型別系統完整，用途很多。如果你的問題真的在這一塊，它就是對的工具。',
        later: [],
        verdict: '問題對了，Rust 才開始划算。',
    },
];

/** 先決定想做什麼，再決定要學什麼 */
export function GoalPicker() {
    const t = useFrameTheme();
    const [id, setId] = useState('web');
    const g = GOALS.find((x) => x.id === id) ?? GOALS[0];

    return (
        <InteractiveFrame title="我想做的東西，決定我先學什麼" kicker="互動選擇" hint="選一個最接近你的目標。">
            <div className="grid gap-3 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
                <div role="group" aria-label="我想做什麼" className="grid gap-1.5">
                    {GOALS.map((x) => (
                        <button
                            key={x.id}
                            type="button"
                            aria-pressed={id === x.id}
                            onClick={() => setId(x.id)}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-colors sm:text-sm ${id === x.id ? t.chipOn : t.chip}`}
                        >
                            <Icon name={x.icon} className="h-4 w-4 shrink-0" />
                            {x.name}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait" initial={false}>
                    <motion.div key={id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className={`min-h-[232px] space-y-3 rounded-lg border p-4 ${t.inset}`}>
                        <div>
                            <div className={`text-[11px] font-medium tracking-[0.18em] ${t.faint}`}>建議先學</div>
                            <div className={`text-2xl font-black ${t.accent}`}>{g.pick}</div>
                        </div>
                        <div className={`text-sm leading-relaxed ${t.sub}`}>{g.why}</div>
                        {g.later.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className={`text-[11px] font-medium tracking-[0.18em] ${t.faint}`}>先不用急</span>
                                {g.later.map((l) => (
                                    <span key={l} className="rounded-full border border-line-strong px-2 py-0.5 text-[11px] font-semibold text-fg-body">{l}</span>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {id === 'work' && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`grid grid-cols-3 gap-2 rounded-lg border p-3 text-center text-xs font-semibold ${t.inset}`}>
                    {['Day 1：學 Rust', 'Day 2：研究 Ownership', 'Day 3：研究 Borrow Checker'].map((d) => (
                        <div key={d} className="rounded-md border border-line bg-surface px-1.5 py-2 text-fg-body line-through decoration-danger">{d}</div>
                    ))}
                </motion.div>
            )}

            <Verdict id={id}>{g.verdict}</Verdict>
        </InteractiveFrame>
    );
}
