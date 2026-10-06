'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

type Side = 'front' | 'back';

const CARDS: { text: string; answer: Side; why: string }[] = [
    { text: '按一下按鈕，把它變成紅色', answer: 'front', why: '純粹是畫面變化，瀏覽器自己就能做，不用問任何人。' },
    { text: '查詢這個會員帳戶還剩多少錢', answer: 'back', why: '餘額存在伺服器的資料庫裡，前端自己不會知道，只能去問後端。' },
    { text: '把已經載入的商品依價格由低到高排序', answer: 'front', why: '資料已經在畫面上了，排序是前端自己就能算的事。' },
    { text: '判斷這個人有沒有權限刪除使用者', answer: 'back', why: '權限判斷是規則，也是安全的底線，必須由後端說了算。' },
    { text: '播放一段按鈕的彈跳動畫', answer: 'front', why: '動畫只存在於使用者看到的畫面，是前端的工作。' },
    { text: '檢查登入密碼對不對', answer: 'back', why: '密碼比對要在伺服器上進行，不能把正確答案交給使用者的瀏覽器。' },
    { text: '記住使用者選的是深色模式', answer: 'front', why: '這種小偏好可以直接存在瀏覽器的 localStorage，不用打擾後端。' },
    { text: '把訂單寫進資料庫', answer: 'back', why: '要永久保存、讓別台裝置也看得到的資料，一定要交給後端和資料庫。' },
];

/** 一題一題判斷：這件事是前端做，還是後端做 */
export function FrontBackSorter() {
    const t = useFrameTheme();
    const [index, setIndex] = useState(0);
    const [picked, setPicked] = useState<Side | null>(null);
    const [score, setScore] = useState(0);

    const done = index >= CARDS.length;
    const card = CARDS[Math.min(index, CARDS.length - 1)];
    const correct = picked === card.answer;

    const choose = (side: Side) => {
        if (picked) return;
        setPicked(side);
        if (side === card.answer) setScore((s) => s + 1);
    };

    const next = () => {
        setPicked(null);
        setIndex((i) => i + 1);
    };

    const restart = () => {
        setIndex(0);
        setPicked(null);
        setScore(0);
    };

    return (
        <InteractiveFrame title="這件事該誰做？" hint="每一張卡片都選選看：前端自己能處理，還是得找後端？">
            <div className="flex items-center gap-1.5" aria-label={`進度 ${Math.min(index, CARDS.length)} / ${CARDS.length}`}>
                {CARDS.map((_, i) => (
                    <motion.span
                        key={i}
                        className={`h-1.5 flex-1 rounded-full ${i < index ? 'bg-brand' : i === index && !done ? 'bg-brand/50' : 'bg-line-strong'}`}
                        animate={i === index && !done ? { scaleY: [1, 1.8, 1] } : { scaleY: 1 }}
                        transition={{ duration: 0.6 }}
                    />
                ))}
            </div>

            <div className="relative min-h-[132px]">
                <AnimatePresence mode="wait" initial={false}>
                    {done ? (
                        <motion.div
                            key="done"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`flex min-h-[132px] flex-col items-center justify-center gap-2 rounded-lg border text-center ${t.inset}`}
                        >
                            <div className={`text-3xl font-black ${t.accent}`}>
                                {score} / {CARDS.length}
                            </div>
                            <div className={`px-4 text-sm ${t.sub}`}>
                                {score === CARDS.length ? '全對！你已經分得清楚前端和後端各管什麼了。' : '不用急，回頭看看答錯的那幾張，規則其實很單純。'}
                            </div>
                            <button type="button" onClick={restart} className={`mt-1 rounded-full px-4 py-1.5 text-sm font-semibold ${t.button}`}>
                                再玩一次
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 40, rotate: 2 }}
                            animate={{ opacity: 1, x: 0, rotate: 0 }}
                            exit={{ opacity: 0, x: -40, rotate: -2 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                            className={`flex min-h-[132px] flex-col justify-center rounded-lg border px-5 py-4 ${t.inset}`}
                        >
                            <div className={`mb-1 text-[11px] font-medium tracking-[0.18em] ${t.faint}`}>
                                第 {index + 1} 題
                            </div>
                            <div className={`text-base font-semibold leading-snug sm:text-lg ${t.text}`}>{card.text}</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {!done && (
                <div className="grid grid-cols-2 gap-3">
                    {(['front', 'back'] as const).map((side) => {
                        const isAnswer = card.answer === side;
                        const state = !picked ? 'idle' : isAnswer ? 'right' : picked === side ? 'wrong' : 'dim';
                        return (
                            <motion.button
                                key={side}
                                type="button"
                                disabled={!!picked}
                                onClick={() => choose(side)}
                                whileHover={picked ? undefined : { y: -2 }}
                                whileTap={picked ? undefined : { scale: 0.96 }}
                                animate={state === 'wrong' ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                                transition={{ duration: 0.4 }}
                                className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                                    state === 'right'
                                        ? 'border-success bg-success/15 text-success-text'
                                        : state === 'wrong'
                                          ? 'border-danger bg-danger/15 text-danger-text'
                                          : state === 'dim'
                                            ? `opacity-50 ${t.chip}`
                                            : t.chip
                                }`}
                            >
                                <span className="block text-base font-bold">{side === 'front' ? '前端' : '後端'}</span>
                                <span className="block text-xs opacity-80">{side === 'front' ? '在使用者的瀏覽器' : '在伺服器上'}</span>
                            </motion.button>
                        );
                    })}
                </div>
            )}

            {picked && !done && (
                <>
                    <Verdict id={`${index}-${picked}`}>
                        <strong>{correct ? '答對了。' : `答案是${card.answer === 'front' ? '前端' : '後端'}。`}</strong>
                        {card.why}
                    </Verdict>
                    <button type="button" onClick={next} className={`rounded-full px-4 py-2 text-sm font-semibold ${t.button}`}>
                        {index === CARDS.length - 1 ? '看成績' : '下一題'}
                    </button>
                </>
            )}
        </InteractiveFrame>
    );
}
