'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon, type IconName } from './icons';
import { Stage } from './kit';
import { RustLogo } from './logos';
import { InteractiveFrame, Verdict } from './InteractiveFrame';

const COST = 70;

const TASKS: { name: string; icon: IconName; need: number }[] = [
    { name: '個人網站', icon: 'globe', need: 6 },
    { name: '記帳工具', icon: 'doc', need: 10 },
    { name: 'Discord Bot', icon: 'chat', need: 12 },
    { name: '資料處理腳本', icon: 'code', need: 22 },
    { name: '遊戲引擎', icon: 'bolt', need: 82 },
    { name: '資料庫核心', icon: 'db', need: 95 },
];

/** Rust 很強，但你現在的問題用得到它多少？用一座蹺蹺板來秤 */
export function RustFit() {
    const [i, setI] = useState(0);
    const task = TASKS[i];
    const worth = task.need >= COST;
    // 重的那一邊往下：成本比較重時左邊下沉（逆時針）
    const tilt = Math.max(-11, Math.min(11, ((task.need - COST) / 100) * 16));
    const benefitH = 16 + (task.need / 100) * 74;
    const costH = 16 + (COST / 100) * 74;

    return (
        <InteractiveFrame title="Rust 很強，但划算嗎？" kicker="秤一秤" hint="選一個你現在想做的東西，看蹺蹺板往哪邊倒。數值是示意，不是統計。">
            <div role="group" aria-label="我想做" className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                {TASKS.map((x, k) => (
                    <button
                        key={x.name}
                        type="button"
                        aria-pressed={i === k}
                        onClick={() => setI(k)}
                        className={`flex flex-col items-center gap-1 rounded-xl border px-1 py-2 text-[11px] font-bold transition-colors ${i === k ? 'border-fg bg-fg text-canvas' : 'border-line bg-surface text-fg hover:border-line-strong'}`}
                    >
                        <Icon name={x.icon} className="h-5 w-5" />
                        {x.name}
                    </button>
                ))}
            </div>

            <Stage className="px-2 pt-4">
                <svg viewBox="0 0 520 250" className="block w-full" role="img" aria-label={`${task.name}：${worth ? '好處大於成本' : '成本大於好處'}`}>
                    <motion.g initial={false} animate={{ rotate: tilt }} transition={{ type: 'spring', stiffness: 70, damping: 12 }} style={{ originX: '260px', originY: '176px' }}>
                        <rect x="40" y="170" width="440" height="12" rx="6" className="fill-fg" />
                        {/* 左：學習成本 */}
                        <rect x="60" y={170 - costH} width="120" height={costH} rx="10" className="fill-warning" />
                        <text x="120" y={170 - costH + 26} textAnchor="middle" className="fill-canvas text-[14px] font-black">學習成本</text>
                        <text x="120" y={170 - costH + 46} textAnchor="middle" className="fill-canvas text-[13px] font-bold">{COST}</text>
                        {/* 右：用得到的好處 */}
                        <motion.rect x="340" width="120" rx="10" className={worth ? 'fill-success' : 'fill-info'} initial={false} animate={{ y: 170 - benefitH, height: benefitH }} transition={{ type: 'spring', stiffness: 120, damping: 16 }} />
                        <motion.text x="400" textAnchor="middle" className="fill-canvas text-[14px] font-black" initial={false} animate={{ y: 170 - benefitH + (benefitH > 50 ? 26 : -10) }}>
                            {benefitH > 50 ? '用得到的好處' : ''}
                        </motion.text>
                        <motion.text x="400" textAnchor="middle" className={benefitH > 50 ? 'fill-canvas text-[13px] font-bold' : 'fill-fg text-[13px] font-black'} initial={false} animate={{ y: 170 - benefitH + (benefitH > 50 ? 46 : -10) }}>
                            {benefitH > 50 ? task.need : `用得到的好處 ${task.need}`}
                        </motion.text>
                    </motion.g>
                    <path d="M230 240 L260 182 L290 240 Z" className="fill-fg" />
                    <circle cx="260" cy="214" r="17" className="fill-surface" />
                    <foreignObject x="246" y="200" width="28" height="28">
                        <RustLogo className="h-7 w-7 text-fg" />
                    </foreignObject>
                </svg>
            </Stage>

            <Verdict id={i}>
                {worth ? (
                    <>
                        好處壓過成本，蹺蹺板倒向右邊。<strong>當你的問題剛好卡在效能與記憶體，Rust 就是對的工具。</strong>
                    </>
                ) : (
                    <>
                        成本那邊比較重。你可能只是要鎖一顆螺絲，卻拿出了超高級的工業級工具。問題不是「Rust 強不強」，而是<strong>「我現在的問題需要 Rust 嗎？」</strong>
                    </>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
