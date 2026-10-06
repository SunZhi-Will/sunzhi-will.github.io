'use client'

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const FRONT = ['JS', 'TS'] as const;
const BACK = ['JS', 'TS'] as const;
const EXAMPLE: Record<string, string> = {
    'JS-JS': 'React 加 Express',
    'JS-TS': 'React 加 NestJS（前端沒用型別）',
    'TS-JS': 'React 加 Express（前端用 TS）',
    'TS-TS': 'React 加 NestJS',
};
const LEVELS = ['新手', '普通', '高手', '大師', '傳說'];

/** 幫每一種技術組合「評等級」，結果是根本沒有等級這回事 */
export function StackGrid() {
    const t = useFrameTheme();
    const [picked, setPicked] = useState<string | null>(null);
    const [spinning, setSpinning] = useState(false);
    const [levelIndex, setLevelIndex] = useState(0);
    const [done, setDone] = useState(false);
    const timer = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(
        () => () => {
            if (timer.current) clearInterval(timer.current);
        },
        [],
    );

    const pick = (key: string) => {
        if (timer.current) clearInterval(timer.current);
        setPicked(key);
        setDone(false);
        setSpinning(true);
        let ticks = 0;
        timer.current = setInterval(() => {
            ticks += 1;
            setLevelIndex((i) => (i + 1) % LEVELS.length);
            if (ticks >= 14) {
                if (timer.current) clearInterval(timer.current);
                setSpinning(false);
                setDone(true);
            }
        }, 90);
    };

    return (
        <InteractiveFrame title="TS + TS 是高手才用的嗎？" hint="點任一種組合，請「等級評定機」幫它打分數。">
            <div className="grid grid-cols-[3.5rem_1fr_1fr] items-stretch gap-2 text-sm">
                <div />
                {BACK.map((b) => (
                    <div key={b} className={`rounded-md py-1.5 text-center text-xs font-semibold ${t.accentSoft}`}>
                        後端 {b}
                    </div>
                ))}
                {FRONT.map((f) => (
                    <div key={f} className="contents">
                        <div className={`flex flex-col items-center justify-center rounded-md text-xs font-semibold leading-tight ${t.accentSoft}`}><span>前端</span><span>{f}</span></div>
                        {BACK.map((b) => {
                            const key = `${f}-${b}`;
                            const on = picked === key;
                            return (
                                <motion.button
                                    key={key}
                                    type="button"
                                    aria-pressed={on}
                                    onClick={() => pick(key)}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`rounded-lg border px-3 py-4 text-center transition-colors ${on ? 'border-brand bg-brand/10' : t.chip}`}
                                >
                                    <span className={`block text-base font-bold ${t.text}`}>
                                        {f} + {b}
                                    </span>
                                    <span className={`mt-1 block text-xs ${t.sub}`}>{EXAMPLE[key]}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className={`flex min-h-[84px] items-center justify-center rounded-lg border ${t.inset}`}>
                <AnimatePresence mode="wait" initial={false}>
                    {!picked ? (
                        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`text-sm ${t.faint}`}>
                            等級評定機待命中
                        </motion.div>
                    ) : spinning ? (
                        <motion.div
                            key="spin"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <div className={`text-xs ${t.faint}`}>{picked.replace('-', ' + ')} 的等級是…</div>
                            <motion.div key={levelIndex} initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.08 }} className={`text-2xl font-black ${t.accent}`}>
                                {LEVELS[levelIndex]}
                            </motion.div>
                        </motion.div>
                    ) : (
                        done && (
                            <motion.div
                                key="done"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1, x: [0, -8, 8, -5, 5, 0] }}
                                transition={{ duration: 0.5 }}
                                className="text-center"
                            >
                                <div className="text-xl font-black text-danger-text">查無此等級</div>
                                <div className={`text-xs ${t.sub}`}>機器壞掉了，因為這件事本來就不存在</div>
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </div>

            <Verdict id={done ? 'done' : 'idle'}>
                {done ? (
                    <>
                        前端 TS、後端 TS 是很普通的現代組合，不是高手配置。你會 JS 不代表比較弱，用 TS 也不會自動變高手。
                        <strong>真正重要的是：你知不知道程式為什麼這樣設計。</strong>
                    </>
                ) : (
                    <>四種組合都很常見。點一個，看看機器會給它幾級。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
