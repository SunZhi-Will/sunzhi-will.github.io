'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const TILES = [
    { name: 'Container', line: '你為什麼不用 Container？' },
    { name: 'VM', line: '這個跟 VM 比起來呢？' },
    { name: 'CI/CD', line: '部署是手動的嗎？沒有 CI/CD？' },
    { name: 'Reverse Proxy', line: '前面有放 Reverse Proxy 嗎？' },
    { name: 'Cache', line: '常用的資料可以先放 Cache。' },
    { name: 'Queue', line: '寄信這種事可以丟進 Queue。' },
];

/** 最麻煩的不是不會，而是不知道有這個東西 */
export function FogMap() {
    const t = useFrameTheme();
    const [open, setOpen] = useState(0);
    const [asked, setAsked] = useState<string[]>([]);
    const last = open > 0 ? TILES[open - 1] : null;

    const ask = (name: string) => setAsked((l) => (l.includes(name) ? l : [...l, name]));

    return (
        <InteractiveFrame title="你不知道自己不知道的東西" kicker="互動探索" hint="先看你現在的地圖。再按「和其他工程師聊聊」，一塊一塊撥開迷霧。">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <div className="flex min-h-[64px] items-center gap-2 rounded-lg border border-success/50 bg-success/10 px-3 py-2 text-sm font-bold text-success-text">
                    <Icon name="check" className="h-4 w-4 shrink-0" />Docker
                    <span className="text-[11px] font-medium opacity-90">我知道我不懂</span>
                </div>
                {TILES.map((tile, i) => {
                    const revealed = i < open;
                    const did = asked.includes(tile.name);
                    return (
                        <motion.button
                            key={tile.name}
                            type="button"
                            disabled={!revealed}
                            onClick={() => ask(tile.name)}
                            initial={false}
                            animate={{ opacity: revealed ? 1 : 0.55 }}
                            className={`relative flex min-h-[64px] flex-col items-start justify-center rounded-lg border px-3 py-2 text-left transition-colors ${revealed ? (did ? t.accentSoft : t.chip) : 'cursor-default border-dashed border-line-strong bg-fg/10'}`}
                        >
                            {revealed ? (
                                <>
                                    <span className="text-sm font-bold">{tile.name}</span>
                                    <span className="text-[11px] opacity-90">{did ? '已經可以問 AI' : '點一下，拿去問 AI'}</span>
                                </>
                            ) : (
                                <span className={`flex items-center gap-1.5 text-sm font-bold ${t.faint}`}><Icon name="ask" className="h-4 w-4" />???</span>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            <div className={`flex min-h-[52px] items-center rounded-lg border px-3 py-2 text-sm ${t.inset}`}>
                <motion.div key={open} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={t.text}>
                    {last ? (
                        <>
                            <span className={`mr-1.5 text-xs font-bold ${t.accent}`}>他說</span>「{last.line}」
                        </>
                    ) : (
                        <span className={t.faint}>你只知道 Docker 這一格，其他地方一片白。</span>
                    )}
                </motion.div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <button type="button" disabled={open >= TILES.length} onClick={() => setOpen((n) => n + 1)} className={`rounded-full px-4 py-1.5 text-xs font-bold disabled:opacity-40 ${t.button}`}>
                    <Icon name="chat" className="mr-1 inline h-3.5 w-3.5 align-text-bottom" />和其他工程師聊聊
                </button>
                <button type="button" onClick={() => { setOpen(0); setAsked([]); }} className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold ${t.ghost}`}>重來</button>
                <span className={`text-xs ${t.sub}`}>撥開 {open} / {TILES.length}　已拿去問 {asked.length}</span>
            </div>

            <Verdict id={`${open}-${asked.length}`}>
                {open === 0 ? (
                    <>知道自己不懂 Docker，直接問 AI 就好。真正麻煩的是另外那些你連名字都沒聽過的。</>
                ) : (
                    <>他沒有直接教會你什麼，但<strong>讓你知道有這個東西</strong>，你才有辦法回去問 AI。這就是跟其他工程師交流還是很有價值的原因。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
