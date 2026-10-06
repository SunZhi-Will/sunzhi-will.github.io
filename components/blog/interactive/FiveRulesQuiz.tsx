'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const QUESTIONS: { rule: string; claim: string; answer: boolean; why: string }[] = [
    { rule: '1', claim: 'React 主要是拿來做前端畫面的。', answer: true, why: '對。登入畫面、商品列表、按鈕、表單，都是它的強項。' },
    {
        rule: '2',
        claim: '打包後的 React 檔案放在伺服器，所以是伺服器在執行它。',
        answer: false,
        why: '檔案放在伺服器，但執行的地方是使用者的瀏覽器。放哪裡和在哪執行是兩件事。',
    },
    {
        rule: '3',
        claim: '前端把刪除按鈕藏起來，權限就安全了。',
        answer: false,
        why: '藏按鈕只是畫面，真正的權限檢查一定要在後端，因為後端通常跑在伺服器上、不在使用者手裡。',
    },
    {
        rule: '4',
        claim: '前端要拿會員餘額，通常是用 HTTP 呼叫後端的 API。',
        answer: true,
        why: '對。前端發請求、後端回結果，這就是前後端最常見的溝通方式。',
    },
    {
        rule: '5',
        claim: 'PM2 是每個 React 專案都必備的工具。',
        answer: false,
        why: 'PM2 是拿來管理需要持續執行的 Node.js 程式，一般 React SPA 並不需要它。',
    },
];

/** 五句話收尾：每答一題蓋一個章 */
export function FiveRulesQuiz() {
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
        <InteractiveFrame title="五句話，你記住了嗎？" kicker="小測驗" hint="每一題判斷這句話對不對。答完會蓋章，五個全蓋滿就畢業。">
            <div className="flex justify-between gap-2">
                {QUESTIONS.map((q, i) => {
                    const a = answers[i];
                    const right = a !== null && a === q.answer;
                    return (
                        <div key={q.rule} className="flex flex-1 flex-col items-center gap-1">
                            <div
                                className={`relative flex h-12 w-full items-center justify-center rounded-lg border-2 border-dashed text-sm font-bold ${
                                    a === null ? `${i === index ? 'border-brand' : 'border-line-strong'} ${t.faint}` : 'border-transparent'
                                }`}
                            >
                                {a === null ? (
                                    i + 1
                                ) : (
                                    <motion.span
                                        initial={{ scale: 2.4, rotate: -20, opacity: 0 }}
                                        animate={{ scale: 1, rotate: -6, opacity: 1 }}
                                        transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                                        className={`rounded border-2 px-2 py-0.5 text-xs font-black tracking-widest ${
                                            right ? 'border-success text-success-text' : 'border-danger text-danger-text'
                                        }`}
                                    >
                                        {right ? '正確' : '再想想'}
                                    </motion.span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <AnimatePresence mode="wait" initial={false}>
                {!done ? (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`rounded-lg border px-5 py-5 ${t.inset}`}
                    >
                        <div className={`mb-1 text-[11px] font-medium tracking-[0.18em] ${t.faint}`}>第 {index + 1} 句</div>
                        <div className={`text-base font-semibold leading-snug sm:text-lg ${t.text}`}>{QUESTIONS[index].claim}</div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {[true, false].map((v) => (
                                <motion.button
                                    key={String(v)}
                                    type="button"
                                    onClick={() => answer(v)}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`rounded-lg border px-4 py-2.5 text-sm font-bold transition-colors ${t.chip}`}
                                >
                                    <Icon name={v ? 'check' : 'x'} className="mr-1.5 inline h-4 w-4 align-text-bottom" />{v ? '對' : '不對'}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="end"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`rounded-lg border px-5 py-6 text-center ${t.inset}`}
                    >
                        <div className={`text-3xl font-black ${t.accent}`}>
                            {correct} / {QUESTIONS.length}
                        </div>
                        <div className={`mt-1 text-sm ${t.sub}`}>
                            {correct === QUESTIONS.length ? '全部答對，五句話都記住了。' : '有幾句還可以再看一次，上面的蓋章會告訴你是哪幾句。'}
                        </div>
                        <button type="button" onClick={() => setAnswers(Array(QUESTIONS.length).fill(null))} className={`mt-3 rounded-full px-4 py-1.5 text-sm font-semibold ${t.button}`}>
                            再測一次
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {last >= 0 && (
                <Verdict id={`${last}-${answers[last]}`}>
                    <strong>第 {last + 1} 句：</strong>
                    {QUESTIONS[last].why}
                </Verdict>
            )}
        </InteractiveFrame>
    );
}
