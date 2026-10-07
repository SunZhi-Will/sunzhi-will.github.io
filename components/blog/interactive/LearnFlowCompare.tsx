'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { Stage } from './kit';
import { InteractiveFrame, Verdict } from './InteractiveFrame';

const DURATION = 6;

type Bar = { name: string; from: number; to: number; tone: string };

const OLD: Bar[] = [
    { name: '語法', from: 0, to: 20, tone: 'bg-fg/20 text-fg' },
    { name: '物件導向', from: 20, to: 38, tone: 'bg-fg/20 text-fg' },
    { name: '資料庫', from: 38, to: 54, tone: 'bg-fg/20 text-fg' },
    { name: '框架', from: 54, to: 70, tone: 'bg-fg/20 text-fg' },
    { name: '部署', from: 70, to: 84, tone: 'bg-fg/20 text-fg' },
    { name: '做專案', from: 84, to: 100, tone: 'bg-brand text-brand-on' },
];

const NEW: Bar[] = [
    { name: '做出 Todo', from: 0, to: 14, tone: 'bg-brand text-brand-on' },
    { name: '改按鈕', from: 14, to: 26, tone: 'bg-info text-canvas' },
    { name: '補 State', from: 26, to: 40, tone: 'bg-success text-canvas' },
    { name: '存資料', from: 40, to: 52, tone: 'bg-info text-canvas' },
    { name: '補 API', from: 52, to: 66, tone: 'bg-success text-canvas' },
    { name: 'Debug', from: 66, to: 80, tone: 'bg-warning text-canvas' },
    { name: '補型別', from: 80, to: 100, tone: 'bg-success text-canvas' },
];

function Lane({ title, bars, flagAt, flagTone, run }: { title: string; bars: Bar[]; flagAt: number; flagTone: string; run: number }) {
    return (
        <div>
            <div className="mb-2 text-sm font-black text-fg">{title}</div>
            <div className="relative h-11">
                {bars.map((b, i) => (
                    <motion.div
                        key={`${run}-${b.name}`}
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ delay: (b.from / 100) * DURATION, duration: ((b.to - b.from) / 100) * DURATION, ease: 'linear' }}
                        style={{ left: `calc(${b.from}% + ${i ? 2 : 0}px)`, width: `calc(${b.to - b.from}% - ${i ? 2 : 0}px)`, transformOrigin: 'left' }}
                        className={`absolute inset-y-0 flex items-center justify-center overflow-hidden rounded-lg text-[11px] font-bold shadow-card ${b.tone}`}
                    >
                        <span className="truncate px-1">{b.name}</span>
                    </motion.div>
                ))}
                <div className={`absolute -bottom-2 -top-2 w-1 -translate-x-1/2 rounded-full ${flagTone}`} style={{ left: `${flagAt}%` }} />
            </div>
            <div
                className="mt-3 flex"
                style={{ paddingLeft: flagAt > 50 ? 0 : `${flagAt}%`, paddingRight: flagAt > 50 ? `${100 - flagAt}%` : 0, justifyContent: flagAt > 50 ? 'flex-end' : 'flex-start' }}
            >
                <motion.span
                    key={run}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (flagAt / 100) * DURATION }}
                    className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-black text-canvas shadow-card ${flagTone}`}
                >
                    <Icon name="flag" className="h-3.5 w-3.5" />第一次看到作品
                </motion.span>
            </div>
        </div>
    );
}

/** 兩條時間軸：以前學完才做，現在先做再補 */
export function LearnFlowCompare() {
    const [run, setRun] = useState(0);

    return (
        <InteractiveFrame title="第一次看到作品動起來，是什麼時候？" kicker="時間軸對照" hint="兩條時間軸同時往右走，留意旗子出現的位置。">
            <Stage className="px-4 pb-4 pt-5 sm:px-5">
                <div className="space-y-6">
                    <Lane title="以前：學會了才開始做" bars={OLD} flagAt={84} flagTone="bg-danger" run={run} />
                    <Lane title="現在：先做，遇到再補" bars={NEW} flagAt={0} flagTone="bg-success" run={run} />
                </div>
                <div className="relative mt-5 border-t border-line pt-2">
                    <motion.div
                        key={`head-${run}`}
                        aria-hidden="true"
                        className="absolute -top-[5px] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-fg"
                        initial={{ left: '0%' }}
                        animate={{ left: '100%' }}
                        transition={{ duration: DURATION, ease: 'linear' }}
                    />
                    <div className="flex items-center justify-between text-[11px] font-semibold text-fg-body">
                        <span>第一天</span>
                        <span>學習時間 →</span>
                    </div>
                </div>
            </Stage>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <button type="button" onClick={() => setRun((r) => r + 1)} className="flex items-center gap-1.5 rounded-full bg-fg px-4 py-1.5 text-xs font-bold text-canvas">
                    <Icon name="loop" className="h-3.5 w-3.5" />重播
                </button>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-fg-body">
                    <span className="h-3 w-3 rounded bg-success" />遇到問題才補的觀念
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-fg-body">
                    <span className="h-3 w-3 rounded bg-info" />做東西
                </span>
            </div>

            <Verdict id={run}>
                兩條路學的東西差不多，差別在<strong>順序</strong>。舊路要走到最後才看得到作品，新路一開始就有東西可以玩，後面學的每一個觀念都接在「我剛剛遇到的問題」上。
            </Verdict>
        </InteractiveFrame>
    );
}
