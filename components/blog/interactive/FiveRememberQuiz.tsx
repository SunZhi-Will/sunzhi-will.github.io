'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const QUESTIONS: { claim: string; answer: boolean; why: string }[] = [
    { claim: '要先決定想做什麼，再決定要學哪個語言。', answer: true, why: '對。語言是工具，目標先決定，才知道哪一個適合你。' },
    { claim: '要先把全部語法學完，才能開始做專案。', answer: false, why: '以前很難不這樣做，現在 AI 可以讓你先做出第一版，再沿著遇到的問題補觀念。' },
    { claim: 'AI 幫我做出來了，就代表我知道自己在做什麼。', answer: false, why: '「做得出來」和「知道自己正在做什麼」是兩件事。做出來之後，還要慢慢理解它為什麼能跑。' },
    { claim: 'AI 每次提議都回答 Yes，專案會比較有效率。', answer: false, why: '一路當 Yes 工程師，最後 Build Failed 時你完全不知道發生什麼事。要學著懷疑和 Review AI。' },
    { claim: '遇到新東西能自己學會，比會很多種語言更長久。', answer: true, why: '對。語言和框架會換，自學的能力不太會過期。' },
];

/** 五句話收尾，每答一題蓋一個章 */
export function FiveRememberQuiz() {
    const t = useFrameTheme();
    const [answers, setAnswers] = useState<(boolean | null)[]>(Array(QUESTIONS.length).fill(null));
    const index = answers.findIndex((a) => a === null);
    const done = index === -1;
    const correct = answers.filter((a, i) => a === QUESTIONS[i].answer).length;
    const last = done ? QUESTIONS.length - 1 : index - 1;

    const answer = (value: boolean) => {
        if (done) return;
        setAnswers((prev) => prev.map((a, i) => (i === index ? value : a)));
    };

    return (
        <InteractiveFrame title="五件事，你記住了嗎？" kicker="小測驗" hint="每一題判斷這句話對不對。答完會蓋章。">
            <div className="flex justify-between gap-2">
                {QUESTIONS.map((q, i) => {
                    const a = answers[i];
                    const right = a !== null && a === q.answer;
                    return (
                        <div key={q.claim} className={`relative flex h-12 flex-1 items-center justify-center rounded-lg border-2 border-dashed text-sm font-bold ${a === null ? `${i === index ? 'border-brand' : 'border-line-strong'} ${t.faint}` : 'border-transparent'}`}>
                            {a === null ? (
                                i + 1
                            ) : (
                                <motion.span initial={{ scale: 2.4, rotate: -20, opacity: 0 }} animate={{ scale: 1, rotate: -6, opacity: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 18 }} className={`rounded border-2 px-2 py-0.5 text-xs font-black tracking-widest ${right ? 'border-success text-success-text' : 'border-danger text-danger-text'}`}>
                                    {right ? '正確' : '再想想'}
                                </motion.span>
                            )}
                        </div>
                    );
                })}
            </div>

            <AnimatePresence mode="wait" initial={false}>
                {!done ? (
                    <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`rounded-lg border px-5 py-5 ${t.inset}`}>
                        <div className={`mb-1 text-[11px] font-medium tracking-[0.18em] ${t.faint}`}>第 {index + 1} 件</div>
                        <div className={`text-base font-semibold leading-snug sm:text-lg ${t.text}`}>{QUESTIONS[index].claim}</div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {[true, false].map((v) => (
                                <motion.button key={String(v)} type="button" onClick={() => answer(v)} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} className={`rounded-lg border px-4 py-2.5 text-sm font-bold transition-colors ${t.chip}`}>
                                    <Icon name={v ? 'check' : 'x'} className="mr-1.5 inline h-4 w-4 align-text-bottom" />{v ? '對' : '不對'}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="end" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className={`rounded-lg border px-5 py-6 text-center ${t.inset}`}>
                        <div className={`text-3xl font-black ${t.accent}`}>{correct} / {QUESTIONS.length}</div>
                        <div className={`mt-1 text-sm ${t.sub}`}>{correct === QUESTIONS.length ? '五件事全部記住了。' : '有幾件還可以再看一次，上面的蓋章會告訴你是哪幾件。'}</div>
                        <button type="button" onClick={() => setAnswers(Array(QUESTIONS.length).fill(null))} className={`mt-3 rounded-full px-4 py-1.5 text-sm font-semibold ${t.button}`}>再測一次</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {last >= 0 && (
                <Verdict id={`${last}-${answers[last]}`}>
                    <strong>第 {last + 1} 件：</strong>
                    {QUESTIONS[last].why}
                </Verdict>
            )}
        </InteractiveFrame>
    );
}
