'use client'

import { useState, type ComponentType, type SVGProps } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon, type IconName } from './icons';
import { CSharpLogo, PythonLogo, RustLogo, TypeScriptLogo } from './logos';
import { InteractiveFrame, Verdict } from './InteractiveFrame';

type Logo = ComponentType<SVGProps<SVGSVGElement>>;

const LOGO: Record<string, Logo> = { TypeScript: TypeScriptLogo, Python: PythonLogo, 'C#': CSharpLogo, Rust: RustLogo };

const GOALS: { id: string; name: string; short: string; icon: IconName; pick: string; logos: Logo[]; why: string; later: string[]; verdict: string }[] = [
    {
        id: 'web',
        name: '我想做網站', short: '做網站',
        icon: 'globe',
        pick: 'TypeScript',
        logos: [TypeScriptLogo],
        why: 'Web 生態很難避開 JavaScript。TypeScript 只是多檢查一些東西，AI 大量產生程式的時候，有人先攔一道很安心。',
        later: ['Rust', 'C#', 'Go'],
        verdict: '目標是 Web，就從 Web 的語言開始。',
    },
    {
        id: 'ai',
        name: '我想做 AI、資料、自動化', short: 'AI 與資料',
        icon: 'spark',
        pick: 'Python',
        logos: [PythonLogo],
        why: '不是因為 Python 簡單，而是它周圍已經有大量 AI、機器學習、資料處理與自動化的工具和生態。',
        later: ['Rust', 'C#', 'TypeScript'],
        verdict: '不是排行榜第一名就適合所有人，要看你的目的。',
    },
    {
        id: 'bot',
        name: '我想做 Discord Bot、記帳工具', short: 'Bot、小工具',
        icon: 'chat',
        pick: 'TypeScript 或 Python',
        logos: [TypeScriptLogo, PythonLogo],
        why: '兩個都做得出來。與其煩惱語言，不如先讓 AI 做出第一版，再沿著遇到的問題學。',
        later: ['Rust', 'Java', 'Go'],
        verdict: '先選你真的想做的東西，語言是第二個問題。',
    },
    {
        id: 'work',
        name: '公司本來就用 C#、Java', short: '公司系統',
        icon: 'building',
        pick: '公司在用的那個',
        logos: [CSharpLogo],
        why: '先把工作真的會用到的東西學好。整套系統都是 C#，卻跑去研究 Rust，結果工作上的 C# 還是看不懂。',
        later: ['Rust', '新流行的語言'],
        verdict: '工作用到什麼，就先學什麼。',
    },
    {
        id: 'rust',
        name: '我要極致效能與記憶體控制', short: '極致效能',
        icon: 'bolt',
        pick: 'Rust',
        logos: [RustLogo],
        why: 'Rust 快、記憶體安全、型別系統完整。如果你的問題真的在這一塊，它就是對的工具。',
        later: [],
        verdict: '問題對了，Rust 才開始划算。',
    },
];

/** 先決定想做什麼，再決定要學什麼 */
export function GoalPicker() {
    const [id, setId] = useState('web');
    const g = GOALS.find((x) => x.id === id) ?? GOALS[0];

    return (
        <InteractiveFrame title="我想做的東西，決定我先學什麼" kicker="互動選擇" hint="選一個最接近你的目標。">
            <div className="grid gap-4 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
                <div role="group" aria-label="我想做什麼" className="grid grid-cols-2 gap-1 md:flex md:flex-col md:gap-1.5">
                    {GOALS.map((x) => {
                        const on = id === x.id;
                        return (
                            <button key={x.id} type="button" aria-pressed={on} onClick={() => setId(x.id)} className="relative flex items-center gap-2 rounded-xl px-2 py-1.5 text-left text-xs font-bold md:gap-2.5 md:px-3 md:py-2.5 md:text-sm">
                                {on && <motion.span layoutId="goal-pick" className="absolute inset-0 rounded-xl bg-fg shadow-card" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                                <span className={`relative flex h-7 w-7 shrink-0 md:h-8 md:w-8 items-center justify-center rounded-lg ${on ? 'bg-brand text-brand-on' : 'bg-fg/10 text-fg'}`}>
                                    <Icon name={x.icon} className="h-4 w-4" />
                                </span>
                                <span className={`relative ${on ? 'text-canvas' : 'text-fg'}`}>
                                    <span className="md:hidden">{x.short}</span>
                                    <span className="hidden md:inline">{x.name}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }} className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 shadow-card md:gap-4 md:p-5">
                        <div className="flex items-center gap-4">
                            <div className="flex shrink-0 gap-2">
                                {g.logos.map((L, k) => (
                                    <motion.span key={k} initial={{ scale: 0.4, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 16, delay: k * 0.08 }} className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-surface-raised text-fg md:h-16 md:w-16">
                                        <L className="h-8 w-8 rounded-[3px] md:h-10 md:w-10" />
                                    </motion.span>
                                ))}
                            </div>
                            <div className="min-w-0">
                                <div className="text-[11px] font-bold tracking-[0.16em] text-brand-text">建議先學</div>
                                <div className="text-xl font-black leading-tight text-fg md:text-2xl">{g.pick}</div>
                            </div>
                        </div>
                        <div className="text-sm leading-relaxed text-fg-body">{g.why}</div>
                        {id === 'work' && (
                            <div className="grid grid-cols-3 gap-1.5">
                                {['Day 1：學 Rust', 'Day 2：Ownership', 'Day 3：Borrow Checker'].map((d) => (
                                    <div key={d} className="rounded-lg bg-danger/10 px-1.5 py-2 text-center text-[11px] font-bold text-danger-text line-through">{d}</div>
                                ))}
                            </div>
                        )}
                        {g.later.length > 0 && (
                            <div className="mt-auto flex flex-wrap items-center gap-1.5 border-t border-line pt-3">
                                <span className="mr-1 text-[11px] font-bold tracking-[0.14em] text-fg-body">先不用急</span>
                                {g.later.map((l) => {
                                    const L = LOGO[l];
                                    return (
                                        <span key={l} className="flex items-center gap-1 rounded-full border border-line-strong px-2 py-0.5 text-[11px] font-bold text-fg opacity-80">
                                            {L && <L className="h-3.5 w-3.5 rounded-[2px] grayscale" />}
                                            {l}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <Verdict id={id}>{g.verdict}</Verdict>
        </InteractiveFrame>
    );
}
