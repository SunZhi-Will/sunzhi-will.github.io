'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const DURATION = 6;

const OLD = [
    { name: '語法', from: 0, to: 20 },
    { name: '物件導向', from: 20, to: 38 },
    { name: '資料庫', from: 38, to: 54 },
    { name: '框架', from: 54, to: 70 },
    { name: '部署', from: 70, to: 84 },
    { name: '做專案', from: 84, to: 100 },
];

const NEW = [
    { name: '做出 Todo', from: 0, to: 12, tone: 'bg-brand text-brand-on' },
    { name: '改按鈕', from: 12, to: 24, tone: 'bg-info/80 text-canvas' },
    { name: '補 State', from: 24, to: 38, tone: 'bg-success/80 text-canvas' },
    { name: '存資料', from: 38, to: 52, tone: 'bg-info/80 text-canvas' },
    { name: '補 API', from: 52, to: 68, tone: 'bg-success/80 text-canvas' },
    { name: 'Debug', from: 68, to: 82, tone: 'bg-warning/80 text-canvas' },
    { name: '補型別', from: 82, to: 100, tone: 'bg-success/80 text-canvas' },
];

function Pole({ at, tone }: { at: number; tone: string }) {
    return <div className={`absolute -bottom-2 -top-1 w-0.5 ${tone}`} style={{ left: `${at}%` }} />;
}

function FlagLabel({ at, label, tone }: { at: number; label: string; tone: string }) {
    const right = at > 50;
    return (
        <div className="mt-2.5 flex" style={{ paddingLeft: right ? 0 : `${at}%`, paddingRight: right ? `${100 - at}%` : 0, justifyContent: right ? 'flex-end' : 'flex-start' }}>
            <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold text-canvas ${tone}`}>
                <Icon name="flag" className="h-3 w-3" />
                {label}
            </span>
        </div>
    );
}

/** 兩條時間軸：以前學完才做，現在先做再補 */
export function LearnFlowCompare() {
    const t = useFrameTheme();
    const [run, setRun] = useState(0);

    return (
        <InteractiveFrame title="第一次看到作品動起來，是什麼時候？" kicker="時間軸對照" hint="兩條時間軸同時往右走，留意旗子出現的位置。">
            <div className={`rounded-lg border p-3 sm:p-4 ${t.inset}`}>
                <motion.div
                    key={run}
                    className="space-y-5 pb-1"
                    initial={{ clipPath: 'inset(-40px 100% -10px 0)' }}
                    animate={{ clipPath: 'inset(-40px 0% -10px 0)' }}
                    transition={{ duration: DURATION, ease: 'linear' }}
                >
                    <div>
                        <div className={`mb-1.5 text-xs font-bold ${t.text}`}>以前：學會了才開始做</div>
                        <div className="relative h-9">
                            {OLD.map((b) => (
                                <div
                                    key={b.name}
                                    className={`absolute inset-y-0 flex items-center justify-center overflow-hidden rounded border-r border-canvas text-[11px] font-semibold ${b.name === '做專案' ? 'bg-brand text-brand-on' : 'bg-fg/15 text-fg'}`}
                                    style={{ left: `${b.from}%`, width: `${b.to - b.from}%` }}
                                >
                                    <span className="truncate px-0.5">{b.name}</span>
                                </div>
                            ))}
                            <Pole at={84} tone="bg-danger" />
                        </div>
                        <FlagLabel at={84} label="第一個作品" tone="bg-danger" />
                    </div>
                    <div>
                        <div className={`mb-1.5 text-xs font-bold ${t.text}`}>現在：先做，遇到再補</div>
                        <div className="relative h-9">
                            {NEW.map((b) => (
                                <div
                                    key={b.name}
                                    className={`absolute inset-y-0 flex items-center justify-center overflow-hidden rounded border-r border-canvas text-[11px] font-semibold ${b.tone}`}
                                    style={{ left: `${b.from}%`, width: `${b.to - b.from}%` }}
                                >
                                    <span className="truncate px-0.5">{b.name}</span>
                                </div>
                            ))}
                            <Pole at={0} tone="bg-success" />
                        </div>
                        <FlagLabel at={0} label="第一個作品" tone="bg-success" />
                    </div>
                </motion.div>
                <div className={`mt-4 flex items-center justify-between text-[11px] ${t.sub}`}>
                    <span>開始</span>
                    <span>學習時間 →</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button type="button" onClick={() => setRun((r) => r + 1)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${t.button}`}>
                    <Icon name="loop" className="mr-1 inline h-3.5 w-3.5 align-text-bottom" />重播
                </button>
                <span className={`text-xs ${t.sub}`}>
                    <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-success/80 align-middle" />綠色是「遇到問題才補的觀念」
                </span>
            </div>

            <Verdict id={run}>
                兩條路學的東西差不多，差別在<strong>順序</strong>。舊路要走到最後才看得到作品，新路一開始就有東西可以玩，後面學的每一個觀念都接在「我剛剛遇到的問題」上。
            </Verdict>
        </InteractiveFrame>
    );
}
