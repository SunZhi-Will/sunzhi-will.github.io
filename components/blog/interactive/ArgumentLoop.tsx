'use client'

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowPathIcon, CommandLineIcon } from '@heroicons/react/24/outline';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const LOOP = [
    { from: 'them', text: '你抄襲！' },
    { from: 'me', text: '我沒有！' },
    { from: 'them', text: '你就是！' },
    { from: 'me', text: '你先回答我！' },
] as const;

const SYSTEMS = ['技能', 'Boss', '裝備', '地圖', '好感度', '多人內容', '成長設計', '戰鬥內容'];

/** 吵架是一個無窮迴圈，跳出來之後才有進度 */
export function ArgumentLoop() {
    const t = useFrameTheme();
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { amount: 0.4 });
    const [tick, setTick] = useState(0);
    const [broken, setBroken] = useState(false);
    const [built, setBuilt] = useState(0);

    useEffect(() => {
        if (broken || !inView) return;
        const timer = setInterval(() => setTick((n) => n + 1), 900);
        return () => clearInterval(timer);
    }, [broken, inView]);

    const lap = Math.floor(tick / LOOP.length) + 1;
    // 畫面上只留最近幾句，舊的往上淡出
    const visible = Array.from({ length: Math.min(tick + 1, 4) }, (_, i) => tick - Math.min(tick, 3) + i);

    const reset = () => {
        setBroken(false);
        setBuilt(0);
        setTick(0);
    };

    return (
        <InteractiveFrame title="while (true)" kicker="無窮迴圈">
            <div ref={ref} className={`overflow-hidden rounded-lg border ${t.inset}`}>
                <div className={`flex items-center justify-between border-b px-3 py-2 font-mono text-xs ${t.divider} ${t.sub}`}>
                    <span>{broken ? 'loop exited' : `第 ${lap} 圈`}</span>
                    <span>《方界》的進度：+{built}</span>
                </div>

                <div className="relative h-[196px] p-3">
                    <AnimatePresence mode="wait" initial={false}>
                        {broken ? (
                            <motion.div
                                key="build"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex h-full flex-col justify-between gap-3"
                            >
                                <div className={`font-mono text-[13px] leading-relaxed ${t.sub}`}>
                                    <div className={t.accent}>break;</div>
                                    <div className="mt-1 flex flex-wrap gap-1.5">
                                        <AnimatePresence initial={false}>
                                            {SYSTEMS.slice(0, built).map((name) => (
                                                <motion.span
                                                    key={name}
                                                    initial={{ opacity: 0, scale: 0.5, y: 8 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                                                    className={`rounded border px-2 py-0.5 text-xs ${t.accentSoft}`}
                                                >
                                                    + {name}
                                                </motion.span>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 overflow-hidden rounded-full bg-line">
                                        <motion.div
                                            className="h-full rounded-full bg-gradient-to-r from-brand to-brand-text"
                                            animate={{ width: `${(built / SYSTEMS.length) * 100}%` }}
                                            transition={{ type: 'spring', stiffness: 140, damping: 20 }}
                                        />
                                    </div>
                                    <div className={`text-xs ${t.faint}`}>《方界》自己的東西</div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="loop" exit={{ opacity: 0 }} className="flex h-full flex-col justify-end gap-2">
                                <AnimatePresence initial={false} mode="popLayout">
                                    {visible.map((n) => {
                                        const line = LOOP[n % LOOP.length];
                                        const mine = line.from === 'me';
                                        return (
                                            <motion.div
                                                key={n}
                                                layout
                                                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                                                animate={{ opacity: n === tick ? 1 : 0.55, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -12 }}
                                                transition={{ duration: 0.25 }}
                                                className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <span
                                                    className={`rounded-2xl border px-3.5 py-1.5 text-sm font-medium ${
                                                        mine
                                                            ? 'rounded-br-sm border-brand bg-brand text-brand-on'
                                                            : 'rounded-bl-sm border-line-strong bg-surface-raised text-fg-body'
                                                    }`}
                                                >
                                                    「{line.text}」
                                                </span>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex gap-2">
                {broken ? (
                    <>
                        <motion.button
                            type="button"
                            onClick={() => setBuilt((n) => Math.min(n + 1, SYSTEMS.length))}
                            disabled={built >= SYSTEMS.length}
                            whileTap={{ scale: 0.97 }}
                            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${t.button}`}
                        >
                            {built >= SYSTEMS.length ? '今天先寫到這裡' : '再寫一個系統'}
                        </motion.button>
                        <button
                            type="button"
                            onClick={reset}
                            aria-label="回到迴圈"
                            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors ${t.ghost}`}
                        >
                            <ArrowPathIcon className="h-4 w-4" />
                            回去吵
                        </button>
                    </>
                ) : (
                    <motion.button
                        type="button"
                        onClick={() => {
                            setBroken(true);
                            setBuilt(1);
                        }}
                        whileTap={{ scale: 0.97 }}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${t.button}`}
                    >
                        <CommandLineIcon className="h-4 w-4" />
                        break; 去寫程式
                    </motion.button>
                )}
            </div>

            {broken ? (
                <Verdict id="broken">至少多寫一個系統，《方界》就又多了一點自己的東西。</Verdict>
            ) : (
                <Verdict id="looping">第 {lap} 圈了，進度還是 +0。</Verdict>
            )}
        </InteractiveFrame>
    );
}
