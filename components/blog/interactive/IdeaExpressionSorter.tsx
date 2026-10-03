'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowPathIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { InteractiveFrame, useFrameTheme } from './InteractiveFrame';

type Kind = 'idea' | 'expression';

const ITEMS: { text: string; kind: Kind; why: string }[] = [
    {
        text: 'RPG 有血量（HP）',
        kind: 'idea',
        why: '這是玩法概念。不然第一款有血量的遊戲出來之後，其他遊戲都不能有血量了。',
    },
    {
        text: '某款遊戲滑翔翼的模型、貼圖、配色與展開動畫',
        kind: 'expression',
        why: '這已經不是「有滑翔翼」，而是那一支滑翔翼具體長什麼樣子。',
    },
    {
        text: '從高處跳下，可以用裝備緩慢滑行',
        kind: 'idea',
        why: '這是玩法概念，很多遊戲都有。',
    },
    {
        text: '角色四肢與軀幹分離的設計方向',
        kind: 'idea',
        why: '偏向概念。只說「四肢分離」還不夠具體，真正要比的是比例、臉型、服裝這些表達。',
    },
    {
        text: '某個特定角色的臉型、服裝、配色與細節',
        kind: 'expression',
        why: '這是具體表達。照著重畫一次，就算沒有拿原檔，也可能有爭議。',
    },
    {
        text: '技能會消耗魔力或怒氣',
        kind: 'idea',
        why: '資源消耗是非常普遍的遊戲機制。',
    },
    {
        text: '某款遊戲的圖示、文字與故事內容',
        kind: 'expression',
        why: '圖示、文字、故事都是具體寫出來、畫出來的東西。',
    },
];

const LABEL: Record<Kind, string> = { idea: '概念／玩法', expression: '具體表達' };

/** 小測驗：把每一項分到「概念」或「具體表達」 */
export function IdeaExpressionSorter() {
    const t = useFrameTheme();
    const [answers, setAnswers] = useState<Kind[]>([]);
    const [revealed, setRevealed] = useState(false);

    const index = revealed ? answers.length - 1 : answers.length;
    const finished = !revealed && answers.length === ITEMS.length;
    const current = ITEMS[index];
    const score = answers.filter((answer, i) => answer === ITEMS[i].kind).length;

    const choose = (kind: Kind) => {
        setAnswers((prev) => [...prev, kind]);
        setRevealed(true);
    };

    const restart = () => {
        setAnswers([]);
        setRevealed(false);
    };

    const lastAnswer = answers[answers.length - 1];
    const correct = revealed && lastAnswer === current.kind;

    return (
        <InteractiveFrame
            title="這是「概念」，還是「具體表達」？"
            kicker="小測驗"
            hint="著作權保護的是具體表達，不是概念。試著分分看。"
        >
            <div className="flex gap-1">
                {ITEMS.map((item, i) => {
                    const answered = i < answers.length;
                    const right = answers[i] === item.kind;
                    return (
                        <motion.span
                            key={item.text}
                            className="h-1.5 flex-1 rounded-full"
                            animate={{
                                backgroundColor: answered
                                    ? right ? 'var(--color-brand-solid)' : 'var(--color-danger-solid)'
                                    : 'var(--color-line)',
                            }}
                        />
                    );
                })}
            </div>

            <div className="relative min-h-[232px]">
                <AnimatePresence mode="wait" initial={false}>
                    {finished ? (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <div className={`text-center text-sm ${t.sub}`}>
                                你答對了
                                <span className={`mx-1.5 text-2xl font-bold tabular-nums ${t.accent}`}>
                                    {score} / {ITEMS.length}
                                </span>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {(['idea', 'expression'] as Kind[]).map((kind) => (
                                    <div key={kind} className={`rounded-lg border p-3 ${kind === 'expression' ? t.accentSoft : t.inset}`}>
                                        <div className="mb-2 text-xs font-semibold">
                                            {LABEL[kind]}
                                            <span className="ml-1.5 font-normal opacity-70">
                                                {kind === 'idea' ? '大家都能用' : '這才是要比的地方'}
                                            </span>
                                        </div>
                                        <div className="space-y-1.5">
                                            {ITEMS.filter((item) => item.kind === kind).map((item, i) => (
                                                <motion.div
                                                    key={item.text}
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 + i * 0.07 }}
                                                    className={`text-[13px] leading-snug ${kind === 'idea' ? t.text : ''}`}
                                                >
                                                    {item.text}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className={`text-xs ${t.faint}`}>這是幫助理解的簡化分類，實際個案仍要看具體內容。</span>
                                <button
                                    type="button"
                                    onClick={restart}
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${t.ghost}`}
                                >
                                    <ArrowPathIcon className="h-3.5 w-3.5" />
                                    再玩一次
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 40, rotate: 2 }}
                            animate={{ opacity: 1, x: 0, rotate: 0 }}
                            exit={{ opacity: 0, x: lastAnswer === 'idea' ? -60 : 60, rotate: lastAnswer === 'idea' ? -4 : 4 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-4"
                        >
                            <div className={`flex min-h-[96px] items-center justify-center rounded-lg border px-4 py-5 text-center ${t.inset}`}>
                                <span className={`text-base font-semibold leading-relaxed sm:text-lg ${t.text}`}>
                                    {current.text}
                                </span>
                            </div>

                            {revealed ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-3"
                                >
                                    <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-relaxed ${
                                        correct
                                            ? t.accentSoft
                                            : 'border-danger/30 bg-danger/10 text-danger-text'
                                    }`}>
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 420, damping: 14 }}
                                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                                                correct ? 'bg-brand text-brand-on' : 'bg-danger text-canvas'
                                            }`}
                                        >
                                            {correct ? <CheckIcon className="h-3.5 w-3.5" /> : <XMarkIcon className="h-3.5 w-3.5" />}
                                        </motion.span>
                                        <span>
                                            <strong>{LABEL[current.kind]}。</strong>
                                            {current.why}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setRevealed(false)}
                                        className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${t.button}`}
                                    >
                                        {answers.length === ITEMS.length ? '看結果' : '下一題'}
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    {(['idea', 'expression'] as Kind[]).map((kind) => (
                                        <motion.button
                                            key={kind}
                                            type="button"
                                            onClick={() => choose(kind)}
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.96 }}
                                            className={`rounded-lg border px-3 py-3 text-sm font-semibold transition-colors ${t.chip}`}
                                        >
                                            {LABEL[kind]}
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </InteractiveFrame>
    );
}
