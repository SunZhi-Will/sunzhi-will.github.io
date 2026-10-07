'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const COST = 70;

const TASKS = [
    { name: '個人網站', need: 6 },
    { name: '記帳工具', need: 10 },
    { name: 'Discord Bot', need: 12 },
    { name: '資料處理腳本', need: 22 },
    { name: '遊戲引擎', need: 82 },
    { name: '資料庫、瀏覽器核心', need: 95 },
];

/** Rust 很強，但你現在的問題用得到它多少？ */
export function RustFit() {
    const t = useFrameTheme();
    const [i, setI] = useState(0);
    const task = TASKS[i];
    const worth = task.need >= COST;

    return (
        <InteractiveFrame title="Rust 很強，但划算嗎？" kicker="示意圖表" hint="選一個你現在想做的東西，比較「用得到的好處」與「學習成本」。數值是示意，不是統計。">
            <div role="group" aria-label="我想做" className="flex flex-wrap gap-1.5">
                {TASKS.map((x, k) => (
                    <button key={x.name} type="button" aria-pressed={i === k} onClick={() => setI(k)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${i === k ? t.chipOn : t.chip}`}>
                        {x.name}
                    </button>
                ))}
            </div>

            <div className={`space-y-4 rounded-lg border p-4 ${t.inset}`}>
                <div>
                    <div className={`mb-1 flex items-baseline justify-between text-xs font-bold ${t.text}`}>
                        <span>這個問題用得到 Rust 的好處（效能、記憶體控制）</span>
                        <span className="tabular-nums">{task.need}</span>
                    </div>
                    <div className="h-3.5 overflow-hidden rounded-full bg-fg/10">
                        <motion.div className={`h-full rounded-full ${worth ? 'bg-success' : 'bg-info'}`} initial={false} animate={{ width: `${task.need}%` }} transition={{ type: 'spring', stiffness: 110, damping: 18 }} />
                    </div>
                </div>
                <div>
                    <div className={`mb-1 flex items-baseline justify-between text-xs font-bold ${t.text}`}>
                        <span>對新手的學習成本</span>
                        <span className="tabular-nums">{COST}</span>
                    </div>
                    <div className="h-3.5 overflow-hidden rounded-full bg-fg/10">
                        <div className="h-full rounded-full bg-warning" style={{ width: `${COST}%` }} />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Icon name="scale" className={`h-5 w-5 ${worth ? 'text-success-text' : 'text-warning-text'}`} />
                    <motion.span key={`${i}-${worth}`} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className={`text-sm font-bold ${worth ? 'text-success-text' : 'text-warning-text'}`}>
                        {worth ? '好處大於成本，Rust 開始划算' : '成本比較高，現在不急著上'}
                    </motion.span>
                </div>
            </div>

            <Verdict id={i}>
                {worth ? (
                    <>Rust 當然很強。<strong>當你的問題剛好卡在效能與記憶體，它就是對的工具。</strong></>
                ) : (
                    <>
                        你可能只是要鎖一顆螺絲，卻拿出了超高級的工業級工具。問題不是「Rust 強不強」，而是<strong>「我現在的問題需要 Rust 嗎？」</strong>
                    </>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
