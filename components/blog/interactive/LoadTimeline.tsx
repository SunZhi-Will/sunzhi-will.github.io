'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

type Who = 'server' | 'browser';

const ROWS: {
    id: string;
    name: string;
    segs: { from: number; to: number; label: string; who: Who }[];
    flags: { at: number; label: string; tone: 'visible' | 'ready' }[];
}[] = [
    {
        id: 'spa',
        name: 'React SPA',
        segs: [
            { from: 0, to: 12, label: '拿空白頁', who: 'server' },
            { from: 12, to: 38, label: '下載 JS', who: 'browser' },
            { from: 38, to: 52, label: 'React 啟動', who: 'browser' },
            { from: 52, to: 84, label: '向 API 要資料', who: 'browser' },
        ],
        flags: [{ at: 84, label: '看到內容、可操作', tone: 'visible' }],
    },
    {
        id: 'ssr',
        name: 'Next.js SSR',
        segs: [
            { from: 0, to: 34, label: 'Server 組頁面', who: 'server' },
            { from: 34, to: 46, label: '收 HTML', who: 'browser' },
            { from: 46, to: 72, label: '下載 JS', who: 'browser' },
            { from: 72, to: 86, label: '接手', who: 'browser' },
        ],
        flags: [
            { at: 46, label: '看到內容', tone: 'visible' },
            { at: 86, label: '可操作', tone: 'ready' },
        ],
    },
];

const DURATION = 6;

/** 載入時間軸（甘特圖）。時間長短只是示意，不是實測數字 */
export function LoadTimeline() {
    const t = useFrameTheme();
    const [run, setRun] = useState(1);

    return (
        <InteractiveFrame title="同一個頁面，載入時間軸對照" kicker="示意圖表" hint="每一段是一個階段，顏色代表是誰在做。長度只是示意，不是實測。">
            <div className={`space-y-5 rounded-lg border p-3 sm:p-4 ${t.inset}`}>
                {ROWS.map((row) => (
                    <div key={row.id}>
                        <div className={`mb-1.5 text-sm font-bold ${t.text}`}>{row.name}</div>
                        <div className="relative h-[76px]">
                            <div className="absolute inset-x-0 top-0 h-11 rounded-md bg-fg/5" />
                            {row.segs.map((s) => (
                                <motion.div
                                    key={`${run}-${s.label}`}
                                    className={`absolute top-0 h-11 overflow-hidden whitespace-nowrap rounded px-1 text-[10px] font-bold leading-[44px] sm:px-1.5 sm:text-[11px] ${
                                        s.who === 'server' ? 'bg-warning text-canvas' : 'bg-info text-canvas'
                                    }`}
                                    style={{ left: `${s.from}%`, width: `${s.to - s.from}%`, transformOrigin: 'left' }}
                                    initial={{ scaleX: 0, opacity: 0 }}
                                    animate={{ scaleX: 1, opacity: 1 }}
                                    transition={{ delay: (s.from / 100) * DURATION, duration: ((s.to - s.from) / 100) * DURATION, ease: 'linear' }}
                                >
                                    <span className="relative">{s.label}</span>
                                </motion.div>
                            ))}
                            {row.flags.map((f) => (
                                <div key={`${run}-${f.label}`}>
                                    <motion.div
                                        className="absolute inset-y-0 w-0.5 bg-fg"
                                        style={{ left: `${f.at}%` }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: (f.at / 100) * DURATION }}
                                    />
                                    <div className="absolute bottom-0" style={{ right: `${100 - f.at}%` }}>
                                        <motion.span
                                            initial={{ y: -6, opacity: 0, scale: 0.7 }}
                                            animate={{ y: 0, opacity: 1, scale: 1 }}
                                            transition={{ delay: (f.at / 100) * DURATION, type: 'spring', stiffness: 400, damping: 16 }}
                                            className={`mr-1.5 inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-black ${f.tone === 'visible' ? 'bg-success text-canvas' : 'bg-brand text-brand-on'}`}
                                        >
                                            {f.label}
                                        </motion.span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-fg-body">
                    <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-warning" />伺服器在做</span>
                    <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-info" />瀏覽器在做</span>
                    <span className="ml-auto">時間 →</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button type="button" onClick={() => setRun((r) => r + 1)} className={`rounded-full px-4 py-2 text-sm font-semibold ${t.button}`}>
                    重播
                </button>
            </div>

            <Verdict id="tl">
                SSR 讓使用者更早<strong>看到</strong>內容，因為 Server 先把頁面組好；SPA 要等 JavaScript 下載並啟動、再向 API 要資料之後才看得到。代價是 SSR 需要一個一直在線的 Server。
            </Verdict>
        </InteractiveFrame>
    );
}
