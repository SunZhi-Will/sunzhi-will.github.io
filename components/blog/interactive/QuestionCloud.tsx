'use client'

import { useState, type ComponentType, type SVGProps } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Icon } from './icons';
import { CSharpLogo, ClaudeLogo, GeminiLogo, JavaScriptLogo, PythonLogo, RustLogo, TypeScriptLogo } from './logos';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

type Logo = ComponentType<SVGProps<SVGSVGElement>>;

const VOICES: {
    id: string;
    label: string;
    logos: Logo[];
    line: string;
    good: string;
    watch: string;
    question: 'lang' | 'method';
}[] = [
    {
        id: 'js',
        label: 'JavaScript',
        logos: [JavaScriptLogo],
        line: '先把 JavaScript 學好，網頁一定會用到。',
        good: '網站、前端互動，瀏覽器原生就會跑。',
        watch: '很自由，型別出錯常常要到執行時才發現。',
        question: 'lang',
    },
    {
        id: 'ts',
        label: 'TypeScript',
        logos: [TypeScriptLogo],
        line: '直接上 TypeScript，多一層檢查比較安心。',
        good: '中大型網站，以及大量由 AI 產生的程式。',
        watch: '一開始會覺得型別錯誤訊息很煩。',
        question: 'lang',
    },
    {
        id: 'py',
        label: 'Python',
        logos: [PythonLogo],
        line: 'Python 很適合新手，而且 AI 的工具都在那邊。',
        good: 'AI、機器學習、資料處理、自動化腳本。',
        watch: '要做網頁前端，最後還是會回到 JavaScript 生態。',
        question: 'lang',
    },
    {
        id: 'cs',
        label: 'C#',
        logos: [CSharpLogo],
        line: '公司都在用 C#，那就先學這個。',
        good: '公司既有系統、Unity 遊戲、Windows 應用。',
        watch: '先學工作真的用得到的那部分就好。',
        question: 'lang',
    },
    {
        id: 'rs',
        label: 'Rust',
        logos: [RustLogo],
        line: 'Rust 很快又安全，值得一開始就投資。',
        good: '效能、記憶體控制、系統底層。',
        watch: '對剛開始的人來說，學習成本比較高。',
        question: 'lang',
    },
    {
        id: 'ai',
        label: 'AI 都會寫了',
        logos: [ClaudeLogo, GeminiLogo],
        line: 'Claude Code、Codex、Gemini 都會寫了，還要從語法學起嗎？',
        good: '它問的不是「學哪一個」，而是「怎麼學」。',
        watch: '做得出來，不等於知道自己在做什麼。',
        question: 'method',
    },
];

function Logos({ logos, size }: { logos: Logo[]; size: string }) {
    return (
        <span className="flex items-center gap-1.5 text-fg">
            {logos.map((L, i) => (
                <L key={i} className={`${size} rounded-[3px]`} />
            ))}
        </span>
    );
}

/** 開場：六種聲音排成網格，點開變成卡片 */
export function QuestionCloud() {
    const t = useFrameTheme();
    const [open, setOpen] = useState<string | null>(null);
    const [seen, setSeen] = useState<string[]>([]);
    const all = seen.length === VOICES.length;
    const voice = VOICES.find((v) => v.id === open);

    const pick = (id: string) => {
        setOpen(id);
        setSeen((s) => (s.includes(id) ? s : [...s, id]));
    };
    const next = () => {
        const i = VOICES.findIndex((v) => v.id === open);
        const rest = VOICES.slice(i + 1).concat(VOICES.slice(0, i + 1));
        pick((rest.find((v) => !seen.includes(v.id)) ?? rest[0]).id);
    };

    return (
        <InteractiveFrame title="大家在吵的，是同一個問題嗎？" kicker="開場" hint="點開每一張，看看每種聲音在回答什麼。">
            <LayoutGroup id="question-cloud">
                <div className="relative">
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                        {VOICES.map((v, i) => {
                            const visited = seen.includes(v.id);
                            return (
                                <motion.button
                                    key={v.id}
                                    layoutId={`qc-${v.id}`}
                                    type="button"
                                    onClick={() => pick(v.id)}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: open === v.id ? 0 : 1, y: 0 }}
                                    transition={{ delay: open ? 0 : i * 0.06 }}
                                    whileHover={{ y: -3 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="group relative flex h-[104px] flex-col items-center justify-center gap-2 sm:gap-3 rounded-xl border border-line bg-surface-raised shadow-card transition-colors hover:border-brand sm:h-[146px]"
                                >
                                    <Logos logos={v.logos} size="h-9 w-9 sm:h-11 sm:w-11" />
                                    <span className={`text-sm font-bold ${t.text}`}>{v.label}</span>
                                    {visited && (
                                        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-success text-canvas">
                                            <Icon name="check" className="h-3 w-3" />
                                        </span>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>

                    <AnimatePresence>
                        {voice && (
                            <motion.div
                                key={voice.id}
                                layoutId={`qc-${voice.id}`}
                                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                                className="absolute inset-0 z-10 flex flex-col overflow-hidden rounded-xl border border-line-strong bg-surface shadow-pop"
                            >
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.12 }} className="flex h-full flex-col gap-2.5 p-3.5 sm:gap-3 sm:p-5">
                                    <div className="flex items-center gap-3">
                                        <Logos logos={voice.logos} size="h-10 w-10 sm:h-12 sm:w-12" />
                                        <div className="min-w-0 flex-1">
                                            <div className={`text-lg font-black ${t.text}`}>{voice.label}</div>
                                            <span
                                                className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                                    voice.question === 'method' ? 'bg-brand text-brand-on' : 'bg-info/15 text-info-text'
                                                }`}
                                            >
                                                {voice.question === 'method' ? '回答的是：學的方法要不要變' : '回答的是：該學哪一個語言'}
                                            </span>
                                        </div>
                                        <button type="button" aria-label="收合卡片" onClick={() => setOpen(null)} className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${t.ghost}`}>
                                            <Icon name="x" className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className={`border-l-4 border-brand pl-3 text-[15px] font-semibold leading-snug sm:text-lg sm:leading-relaxed ${t.text}`}>「{voice.line}」</div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="rounded-lg border border-success/40 bg-success/10 px-2.5 py-1.5 sm:px-3 sm:py-2">
                                            <div className="text-[11px] font-bold tracking-[0.12em] text-success-text">{voice.question === 'method' ? '這題不一樣' : '適合'}</div>
                                            <div className={`text-xs leading-snug sm:text-sm ${t.text}`}>{voice.good}</div>
                                        </div>
                                        <div className="rounded-lg border border-warning/40 bg-warning/10 px-2.5 py-1.5 sm:px-3 sm:py-2">
                                            <div className="text-[11px] font-bold tracking-[0.12em] text-warning-text">要注意</div>
                                            <div className={`text-xs leading-snug sm:text-sm ${t.text}`}>{voice.watch}</div>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between">
                                        <button type="button" onClick={() => setOpen(null)} className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold ${t.ghost}`}>
                                            回到網格
                                        </button>
                                        <button type="button" onClick={next} className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${t.button}`}>
                                            {all ? '下一張' : '看下一個'} →
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </LayoutGroup>

            <div className="flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-fg/10">
                    <motion.div className="h-full rounded-full bg-brand" initial={false} animate={{ width: `${(seen.length / VOICES.length) * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
                </div>
                <span className={`text-xs font-semibold ${t.sub}`}>
                    看過 {seen.length} / {VOICES.length}
                </span>
            </div>

            <Verdict id={all ? 'all' : 'idle'}>
                {all ? (
                    <>
                        前面五張都在回答<strong>「該學哪一個語言」</strong>。最後一張問的其實是另一件事：<strong>AI 會寫之後，學程式的方法要不要跟著變？</strong>這篇主要談後者。
                    </>
                ) : (
                    <>六張都看完，你會發現它們其實分成兩種問題。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
