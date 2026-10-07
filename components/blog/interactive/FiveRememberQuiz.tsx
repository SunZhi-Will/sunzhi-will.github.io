'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict } from './InteractiveFrame';

const QUESTIONS: { claim: string; answer: boolean; why: string }[] = [
    { claim: '要先決定想做什麼，再決定要學哪個語言。', answer: true, why: '對。語言是工具，目標先決定，才知道哪一個適合你。' },
    { claim: '要先把全部語法學完，才能開始做專案。', answer: false, why: '以前很難不這樣做，現在 AI 可以讓你先做出第一版，再沿著遇到的問題補觀念。' },
    { claim: 'AI 幫我做出來了，就代表我知道自己在做什麼。', answer: false, why: '「做得出來」和「知道自己正在做什麼」是兩件事。做出來之後，還要慢慢理解它為什麼能跑。' },
    { claim: 'AI 每次提議都回答 Yes，專案會比較有效率。', answer: false, why: '一路當 Yes 工程師，最後 Build Failed 時你完全不知道發生什麼事。要學著懷疑和 Review AI。' },
    { claim: '遇到新東西能自己學會，比會很多種語言更長久。', answer: true, why: '對。語言和框架會換，自學的能力不太會過期。' },
];

/** 五件事收尾：一疊卡片，每答一張蓋一個章 */
export function FiveRememberQuiz() {
    const [answers, setAnswers] = useState<(boolean | null)[]>(Array(QUESTIONS.length).fill(null));
    const [dir, setDir] = useState(1);
    const index = answers.findIndex((a) => a === null);
    const done = index === -1;
    const correct = answers.filter((a, i) => a === QUESTIONS[i].answer).length;
    const last = done ? QUESTIONS.length - 1 : index - 1;
    const remaining = done ? 0 : QUESTIONS.length - index;

    const answer = (value: boolean) => {
        if (done) return;
        setDir(value ? 1 : -1);
        setAnswers((prev) => prev.map((a, i) => (i === index ? value : a)));
    };

    return (
        <InteractiveFrame title="五件事，你記住了嗎？" kicker="小測驗" hint="判斷每張卡片上的話對不對。答完會蓋章。">
            <div className="grid grid-cols-5 gap-2">
                {QUESTIONS.map((q, i) => {
                    const a = answers[i];
                    const right = a !== null && a === q.answer;
                    return (
                        <div key={q.claim} className={`flex h-12 items-center justify-center rounded-xl border-2 text-sm font-black ${a === null ? (i === index ? 'border-brand text-brand-text' : 'border-dashed border-line-strong text-fg') : 'border-transparent'}`}>
                            {a === null ? (
                                i + 1
                            ) : (
                                <motion.span initial={{ scale: 2.4, rotate: -20, opacity: 0 }} animate={{ scale: 1, rotate: -8, opacity: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 18 }} className={`rounded-md border-2 px-1.5 py-0.5 text-[11px] font-black tracking-widest sm:text-xs ${right ? 'border-success text-success-text' : 'border-danger text-danger-text'}`}>
                                    {right ? '正確' : '再想想'}
                                </motion.span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="relative h-[210px]">
                {/* 後面疊著的卡片 */}
                {Array.from({ length: Math.min(2, Math.max(0, remaining - 1)) }, (_, k) => (
                    <div key={k} className="absolute inset-x-0 top-0 h-[190px] rounded-2xl border border-line bg-surface-raised" style={{ transform: `translateY(${(k + 1) * 8}px) scale(${1 - (k + 1) * 0.04})`, zIndex: 1 - k }} />
                ))}
                <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                    {!done ? (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            custom={dir}
                            variants={{ gone: (d: number) => ({ opacity: 0, x: d * 160, rotate: d * 10 }) }}
                            exit="gone"
                            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                            className="absolute inset-x-0 top-0 z-10 flex h-[190px] flex-col rounded-2xl border border-line-strong bg-surface p-5 shadow-pop"
                        >
                            <div className="text-[11px] font-bold tracking-[0.16em] text-brand-text">第 {index + 1} 張 / 共 {QUESTIONS.length} 張</div>
                            <div className="mt-2 flex-1 text-lg font-black leading-snug text-fg sm:text-xl">{QUESTIONS[index].claim}</div>
                            <div className="grid grid-cols-2 gap-3">
                                <motion.button type="button" onClick={() => answer(false)} whileTap={{ scale: 0.95 }} className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-danger/50 py-2.5 text-sm font-black text-danger-text hover:bg-danger/10">
                                    <Icon name="x" className="h-4 w-4" />不對
                                </motion.button>
                                <motion.button type="button" onClick={() => answer(true)} whileTap={{ scale: 0.95 }} className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-success/60 py-2.5 text-sm font-black text-success-text hover:bg-success/10">
                                    <Icon name="check" className="h-4 w-4" />對
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="end" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-x-0 top-0 z-10 flex h-[190px] flex-col items-center justify-center rounded-2xl border border-line-strong bg-surface p-5 text-center shadow-pop">
                            <div className="text-5xl font-black text-brand-text">
                                {correct}
                                <span className="text-2xl text-fg"> / {QUESTIONS.length}</span>
                            </div>
                            <div className="mt-1 text-sm font-bold text-fg">{correct === QUESTIONS.length ? '五件事全部記住了。' : '上面的蓋章會告訴你哪幾件可以再看一次。'}</div>
                            <button type="button" onClick={() => setAnswers(Array(QUESTIONS.length).fill(null))} className="mt-3 flex items-center gap-1.5 rounded-full bg-fg px-4 py-1.5 text-sm font-bold text-canvas">
                                <Icon name="loop" className="h-4 w-4" />再測一次
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Verdict id={last >= 0 ? `${last}-${answers[last]}` : 'idle'}>
                {last >= 0 ? (
                    <>
                        <strong>第 {last + 1} 件：</strong>
                        {QUESTIONS[last].why}
                    </>
                ) : (
                    <>五張卡片，對應文章最後的五件事。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
