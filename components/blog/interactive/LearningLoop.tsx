'use client'

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon, type IconName } from './icons';
import { Stage } from './kit';
import { InteractiveFrame, Verdict } from './InteractiveFrame';

const NODES: { name: string; icon: IconName; text: string }[] = [
    { name: '先做一個東西', icon: 'rocket', text: '不用等學完。先讓 AI 幫你弄出一個能動的版本，哪怕很簡陋。' },
    { name: '遇到問題', icon: 'warn', text: '按鈕位置不對、資料不見了、畫面空白。問題是學習的入口。' },
    { name: '問 AI', icon: 'chat', text: '把問題講清楚：我做了什麼、期待什麼、實際發生什麼。' },
    { name: '修改', icon: 'edit', text: '套用 AI 的建議，但先看它到底改了哪裡。' },
    { name: '出錯', icon: 'fire', text: '改完又壞了很正常。Error 訊息是在告訴你哪裡壞。' },
    { name: 'Debug', icon: 'search', text: '看錯誤訊息、檔案、行數，找出剛剛改了什麼。這個動作練得越多越強。' },
    { name: '發現缺觀念', icon: 'ask', text: '原來是 async 沒等到、原來 State 會讓畫面重畫。缺的東西變得很具體。' },
    { name: '補那個觀念', icon: 'learn', text: '現在才去看文件與教學，因為你知道自己為什麼要學。' },
];

const W = 440;
const H = 340;
const CX = W / 2;
const CY = H / 2;
const R = 116;
const CIRC = 2 * Math.PI * R;

function pos(n: number, r = R) {
    const a = (n / NODES.length) * Math.PI * 2 - Math.PI / 2;
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a), cos: Math.cos(a) };
}

/** 學習迴圈：每圈都帶著一個具體的問題回來 */
export function LearningLoop() {
    const [i, setI] = useState(0);
    const [auto, setAuto] = useState(true);
    const [laps, setLaps] = useState(0);

    useEffect(() => {
        if (!auto) return;
        const timer = setTimeout(() => {
            setI((n) => {
                if (n === NODES.length - 1) setLaps((l) => l + 1);
                return (n + 1) % NODES.length;
            });
        }, 3000);
        return () => clearTimeout(timer);
    }, [auto, i]);

    const go = (k: number) => {
        setAuto(false);
        setI(k);
    };
    const node = NODES[i];

    return (
        <InteractiveFrame title="先做、出錯、補觀念，再繼續做" kicker="學習迴圈" hint="自動播放，也可以直接點圓環上的任何一站。">
            <div className="grid items-stretch gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                <Stage className="flex items-center justify-center p-2">
                    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" style={{ maxWidth: W }} role="img" aria-label="八個步驟組成的學習迴圈">
                        <circle cx={CX} cy={CY} r={R} fill="none" className="stroke-fg/10" strokeWidth="10" />
                        <motion.circle
                            cx={CX}
                            cy={CY}
                            r={R}
                            fill="none"
                            className="stroke-brand"
                            strokeWidth="10"
                            strokeLinecap="round"
                            transform={`rotate(-90 ${CX} ${CY})`}
                            strokeDasharray={CIRC}
                            initial={false}
                            animate={{ strokeDashoffset: CIRC * (1 - (i + 0.5) / NODES.length) }}
                            transition={{ type: 'spring', stiffness: 60, damping: 18 }}
                        />
                        {NODES.map((n, k) => {
                            const p = pos(k);
                            const lp = pos(k, R + 36);
                            const active = k === i;
                            const done = k < i;
                            return (
                                <g
                                    key={n.name}
                                    onClick={() => go(k)}
                                    className="cursor-pointer outline-none"
                                    role="button"
                                    tabIndex={0}
                                    aria-label={n.name}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') go(k);
                                    }}
                                >
                                    <circle cx={p.x} cy={p.y} r={active ? 25 : 19} className={active ? 'fill-brand' : done ? 'fill-fg' : 'fill-surface stroke-line-strong'} strokeWidth="2" />
                                    <foreignObject x={p.x - 10} y={p.y - 10} width="20" height="20" pointerEvents="none">
                                        <Icon name={n.icon} className={`h-5 w-5 ${active ? 'text-brand-on' : done ? 'text-canvas' : 'text-fg'}`} />
                                    </foreignObject>
                                    <text
                                        x={lp.x}
                                        y={lp.y + 4}
                                        textAnchor={Math.abs(lp.cos) < 0.2 ? 'middle' : lp.cos > 0 ? 'start' : 'end'}
                                        className={`text-[12px] font-bold ${active ? 'fill-brand-text' : 'fill-fg'}`}
                                    >
                                        {n.name}
                                    </text>
                                </g>
                            );
                        })}
                        <text x={CX} y={CY - 2} textAnchor="middle" className="fill-fg text-[40px] font-black">
                            {laps + 1}
                        </text>
                        <text x={CX} y={CY + 22} textAnchor="middle" className="fill-fg text-[12px] font-bold">
                            第幾圈
                        </text>
                    </svg>
                </Stage>

                <div className="flex flex-col gap-3">
                    <AnimatePresence mode="wait">
                        <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="flex-1 rounded-xl border border-line bg-surface p-4 shadow-card sm:p-5">
                            <div className="mb-2 flex items-center gap-3 sm:mb-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-brand-on">
                                    <Icon name={node.icon} className="h-6 w-6" />
                                </span>
                                <div>
                                    <div className="text-[11px] font-bold tracking-[0.16em] text-brand-text">
                                        第 {i + 1} 站 / 共 {NODES.length} 站
                                    </div>
                                    <div className="text-lg font-black text-fg">{node.name}</div>
                                </div>
                            </div>
                            <div className="text-sm leading-relaxed text-fg-body">{node.text}</div>
                        </motion.div>
                    </AnimatePresence>
                    <div className="flex items-center gap-2">
                        <button type="button" aria-label="上一站" onClick={() => go((i + NODES.length - 1) % NODES.length)} className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-fg">
                            ←
                        </button>
                        <button type="button" onClick={() => setAuto((a) => !a)} className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-fg py-2 text-xs font-bold text-canvas">
                            <Icon name={auto ? 'x' : 'play'} className="h-3.5 w-3.5" />
                            {auto ? '暫停' : '自動播放'}
                        </button>
                        <button type="button" aria-label="下一站" onClick={() => go((i + 1) % NODES.length)} className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-fg">
                            →
                        </button>
                    </div>
                </div>
            </div>

            <Verdict id={i}>
                舊流程是一條直線，走到底才有作品。新流程是一個圈，<strong>每一圈都從一個真實的問題出發</strong>，所以你很清楚自己「現在學這個要幹嘛」。
            </Verdict>
        </InteractiveFrame>
    );
}
