'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon, type IconName } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

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

const R = 112;
const CX = 150;
const CY = 140;

/** 學習迴圈：每圈都帶著一個具體的問題回來 */
export function LearningLoop() {
    const t = useFrameTheme();
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
        }, 3200);
        return () => clearTimeout(timer);
    }, [auto, i]);

    const pos = (n: number) => {
        const a = (n / NODES.length) * Math.PI * 2 - Math.PI / 2;
        return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
    };
    const node = NODES[i];

    return (
        <InteractiveFrame title="先做、出錯、補觀念，再繼續做" kicker="學習迴圈" hint="自動播放，也可以直接點任何一個節點。">
            <div className="grid items-center gap-3 md:grid-cols-[300px_1fr]">
                <svg viewBox="0 0 300 280" style={{ maxWidth: 300 }} className="mx-auto block w-full" role="img" aria-label="八個步驟組成的學習迴圈">
                    <circle cx={CX} cy={CY} r={R} fill="none" className="stroke-line-strong" strokeWidth="2" strokeDasharray="5 6" />
                    {NODES.map((n, k) => {
                        const p = pos(k);
                        const active = k === i;
                        return (
                            <g key={n.name} onClick={() => { setAuto(false); setI(k); }} className="cursor-pointer" role="button" tabIndex={0} aria-label={n.name} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setAuto(false); setI(k); } }}>
                                <circle cx={p.x} cy={p.y} r={active ? 24 : 19} className={active ? 'fill-brand' : 'fill-surface-raised stroke-line-strong'} strokeWidth="2" />
                                <foreignObject x={p.x - 10} y={p.y - 10} width="20" height="20" pointerEvents="none">
                                    <Icon name={n.icon} className={`h-5 w-5 ${active ? 'text-brand-on' : 'text-fg-body'}`} />
                                </foreignObject>
                            </g>
                        );
                    })}
                    <text x={CX} y={CY - 6} textAnchor="middle" className="fill-fg text-[28px] font-black">{laps + 1}</text>
                    <text x={CX} y={CY + 16} textAnchor="middle" className="fill-fg-body text-[12px] font-semibold">第幾圈</text>
                </svg>

                <div className={`min-h-[132px] rounded-lg border p-4 ${t.inset}`}>
                    <div className={`mb-1 text-[11px] font-medium tracking-[0.18em] ${t.faint}`}>步驟 {i + 1} / {NODES.length}</div>
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <div className={`mb-1 flex items-center gap-2 text-base font-bold ${t.text}`}>
                            <Icon name={node.icon} className="h-5 w-5 text-brand-text" />
                            {node.name}
                        </div>
                        <div className={`text-sm leading-relaxed ${t.sub}`}>{node.text}</div>
                    </motion.div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button type="button" onClick={() => setAuto((a) => !a)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${t.button}`}>
                    <Icon name={auto ? 'x' : 'play'} className="mr-1 inline h-3.5 w-3.5 align-text-bottom" />{auto ? '暫停' : '播放'}
                </button>
                <span className={`text-xs ${t.sub}`}>每轉一圈，你就多懂一個「為什麼」。</span>
            </div>

            <Verdict id={i}>
                舊流程是一條直線，走到底才有作品。新流程是一個圈，<strong>每一圈都從一個真實的問題出發</strong>，所以你很清楚自己「現在學這個要幹嘛」。
            </Verdict>
        </InteractiveFrame>
    );
}
