'use client'

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './icons';
import { Note, Segmented, Stage } from './kit';
import { InteractiveFrame } from './InteractiveFrame';

type Mode = 'yes' | 'no';
type Phase = 'idle' | 'loading' | 'done';

/** 按下送出之後有沒有回應：沒有回應的話，使用者會一直按 */
export function FeedbackButton() {
    const [mode, setMode] = useState<Mode>('no');
    const [phase, setPhase] = useState<Phase>('idle');
    const [rows, setRows] = useState<number[]>([]);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

    const reset = (m: Mode) => {
        timers.current.forEach(clearTimeout);
        setMode(m);
        setPhase('idle');
        setRows([]);
    };

    const press = () => {
        if (mode === 'no') return setRows((r) => [...r, Date.now()]);
        if (phase !== 'idle') return;
        setPhase('loading');
        setRows((r) => [...r, Date.now()]);
        later(() => setPhase('done'), 1100);
        later(() => setPhase('idle'), 3200);
    };

    const dup = rows.length > 1;

    return (
        <InteractiveFrame title="按下去之後，然後呢？" kicker="操作回饋" hint="試著按幾次報名按鈕，同時看右邊的後台收到了幾筆。">
            <Segmented
                id="feedback"
                label="按鈕"
                value={mode}
                onChange={reset}
                options={[
                    { value: 'no', label: '沒有回饋' },
                    { value: 'yes', label: '有回饋' },
                ]}
            />
            <Stage className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
                <div className="flex min-h-[150px] items-center justify-center rounded-xl bg-white">
                    <motion.button
                        type="button"
                        onClick={press}
                        layout
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                        aria-label="立即報名"
                        className="flex h-12 items-center justify-center overflow-hidden text-sm font-bold text-white"
                        style={{
                            width: mode === 'yes' && phase === 'loading' ? 48 : 150,
                            borderRadius: 999,
                            background: mode === 'yes' && phase === 'done' ? '#16a34a' : '#2563eb',
                        }}
                    >
                        {mode === 'yes' && phase === 'loading' ? (
                            <motion.span key="l" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="block h-5 w-5 rounded-full border-2 border-white/40 border-t-white" />
                        ) : mode === 'yes' && phase === 'done' ? (
                            <motion.span key="d" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 whitespace-nowrap">
                                <Icon name="check" className="h-4 w-4" />
                                報名成功
                            </motion.span>
                        ) : (
                            <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-nowrap">
                                立即報名
                            </motion.span>
                        )}
                    </motion.button>
                </div>
                <div className="flex flex-col">
                    <div className="mb-2 flex items-center justify-between text-[11px] font-bold tracking-[0.12em] text-fg">
                        <span className="flex items-center gap-1.5">
                            <Icon name="db" className="h-3.5 w-3.5" />
                            後台收到的報名
                        </span>
                        <span className={`text-sm tabular-nums ${dup ? 'text-danger-text' : ''}`}>{rows.length} 筆</span>
                    </div>
                    <div className="flex h-[120px] flex-col-reverse justify-start gap-1 overflow-hidden">
                        <AnimatePresence initial={false}>
                            {rows.slice(-5).map((id, i, arr) => (
                                <motion.div
                                    key={id}
                                    initial={{ opacity: 0, y: -14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`flex items-center justify-between rounded-md px-2.5 py-1 font-mono text-[11px] ${rows.length - arr.length + i > 0 ? 'bg-danger/15 text-danger-text' : 'bg-fg/5 text-fg'}`}
                                >
                                    <span>王小明 · AI 交流會</span>
                                    {rows.length - arr.length + i > 0 && <span className="font-sans font-bold">重複</span>}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </Stage>
            <Note id={mode + String(dup)}>
                {mode === 'no' ? (
                    dup ? (
                        <>
                            畫面毫無變化，使用者以為沒按到，就再按一次。<strong className="text-fg">結果後台收到 {rows.length} 筆一樣的報名。</strong>
                        </>
                    ) : (
                        <>多按幾下看看。</>
                    )
                ) : (
                    <>送出中先鎖住按鈕、轉圈，成功了再變綠。使用者知道發生什麼事，就不會重複按。</>
                )}
            </Note>
        </InteractiveFrame>
    );
}
