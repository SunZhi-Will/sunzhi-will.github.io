'use client'

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { InteractiveFrame, useFrameTheme } from './InteractiveFrame';

const MESSAGES = [
    { from: 'them', text: '抄襲作品' },
    { from: 'them', text: '竊取別人的作品' },
    { from: 'them', text: '劣質盜版縫合複製品' },
] as const;

function TypingDots({ align }: { align: 'start' | 'end' }) {
    const t = useFrameTheme();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex ${align === 'end' ? 'justify-end' : 'justify-start'}`}
        >
            <span className={`flex gap-1 rounded-2xl border px-3 py-2.5 ${t.inset}`}>
                {[0, 1, 2].map((i) => (
                    <motion.span
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full ${t.isDark ? 'bg-zinc-500' : 'bg-zinc-400'}`}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                    />
                ))}
            </span>
        </motion.div>
    );
}

/** 開場：留言串裡的指控一則一則跳出來 */
export function AccusationThread() {
    const t = useFrameTheme();
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.5 });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView || count >= MESSAGES.length) return;
        const timer = setTimeout(() => setCount((c) => c + 1), count === 0 ? 500 : 1100);
        return () => clearTimeout(timer);
    }, [inView, count]);

    const done = count >= MESSAGES.length;

    return (
        <InteractiveFrame title="那串留言大概長這樣" kicker="現場重現">
            <div ref={ref} className={`min-h-[212px] space-y-2.5 rounded-lg border p-3 sm:p-4 ${t.inset}`}>
                <AnimatePresence initial={false}>
                    {MESSAGES.slice(0, count).map((message) => (
                        <motion.div
                            key={message.text}
                            initial={{ opacity: 0, scale: 0.8, x: -24 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                            className="flex justify-start"
                        >
                            <span
                                className={`max-w-[85%] rounded-2xl rounded-bl-sm border px-4 py-2 text-[15px] font-medium ${
                                    t.isDark ? 'border-red-500/30 bg-red-500/10 text-red-200' : 'border-red-200 bg-red-50 text-red-800'
                                }`}
                            >
                                「{message.text}」
                            </span>
                        </motion.div>
                    ))}
                    {inView && <TypingDots key={done ? 'me' : 'them'} align={done ? 'end' : 'start'} />}
                </AnimatePresence>
            </div>

            <div className="flex items-center gap-3">
                <span className={`shrink-0 text-xs ${t.sub}`}>火藥味</span>
                <div className={`h-2 flex-1 overflow-hidden rounded-full ${t.isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
                        animate={{ width: `${(count / MESSAGES.length) * 100}%` }}
                        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                    />
                </div>
                <button
                    type="button"
                    onClick={() => setCount(0)}
                    disabled={!done}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 ${t.ghost}`}
                >
                    <ArrowPathIcon className="h-3.5 w-3.5" />
                    重播
                </button>
            </div>
        </InteractiveFrame>
    );
}
