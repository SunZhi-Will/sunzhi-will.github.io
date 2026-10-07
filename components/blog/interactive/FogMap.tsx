'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon, type IconName } from './icons';
import { Bubble, Stage } from './kit';
import { InteractiveFrame, Verdict } from './InteractiveFrame';

const TILES: { name: string; icon: IconName; line: string }[] = [
    { name: 'Container', icon: 'box', line: '你為什麼不用 Container？' },
    { name: 'VM', icon: 'monitor', line: '這個跟 VM 比起來呢？' },
    { name: 'CI/CD', icon: 'loop', line: '部署是手動的嗎？沒有 CI/CD？' },
    { name: 'Reverse Proxy', icon: 'shield', line: '前面有放 Reverse Proxy 嗎？' },
    { name: 'Cache', icon: 'bolt', line: '常用的資料可以先放 Cache。' },
    { name: 'Queue', icon: 'mail', line: '寄信這種事可以丟進 Queue。' },
];

/** 最麻煩的不是不會，而是不知道有這個東西 */
export function FogMap() {
    const [open, setOpen] = useState(0);
    const [asked, setAsked] = useState<string[]>([]);
    const last = open > 0 ? TILES[open - 1] : null;

    const ask = (name: string) => setAsked((l) => (l.includes(name) ? l : [...l, name]));

    return (
        <InteractiveFrame title="你不知道自己不知道的東西" kicker="撥開迷霧" hint="你的地圖上只有 Docker。按「和其他工程師聊聊」，一塊一塊撥開迷霧，再把新名詞拿去問 AI。">
            <Stage className="p-2 sm:p-3">
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-2.5">
                    <div className="flex h-[76px] sm:h-[92px] flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-success bg-success/10">
                        <Icon name="box" className="h-5 w-5 text-success-text sm:h-6 sm:w-6" />
                        <span className="text-xs font-black text-fg sm:text-sm">Docker</span>
                        <span className="text-[10px] font-bold text-success-text sm:text-[11px]">我知道我不懂</span>
                    </div>
                    {TILES.map((tile, i) => {
                        const revealed = i < open;
                        const did = asked.includes(tile.name);
                        return (
                            <button
                                key={tile.name}
                                type="button"
                                disabled={!revealed}
                                onClick={() => ask(tile.name)}
                                className={`relative h-[76px] sm:h-[92px] overflow-hidden rounded-xl border-2 transition-colors ${revealed ? (did ? 'border-brand bg-brand/10' : 'border-line-strong bg-surface hover:border-brand') : 'border-transparent bg-fg/5'}`}
                            >
                                <span className="flex h-full flex-col items-center justify-center gap-1 sm:gap-1.5">
                                    <Icon name={tile.icon} className={`h-5 w-5 sm:h-6 sm:w-6 ${did ? 'text-brand-text' : 'text-fg'}`} />
                                    <span className="px-1 text-xs font-black leading-tight text-fg sm:text-sm">{tile.name}</span>
                                    <span className={`text-[10px] font-bold sm:text-[11px] ${did ? 'text-brand-text' : 'text-fg-body'}`}>{did ? '已問 AI' : '拿去問 AI'}</span>
                                </span>
                                <AnimatePresence>
                                    {!revealed && (
                                        <motion.span
                                            initial={false}
                                            exit={{ opacity: 0, scale: 1.4, filter: 'blur(12px)' }}
                                            transition={{ duration: 0.6 }}
                                            className="absolute inset-0 flex items-center justify-center bg-surface-raised"
                                            style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, rgb(var(--color-fg) / 0.12), transparent 55%), radial-gradient(circle at 75% 65%, rgb(var(--color-fg) / 0.1), transparent 50%)' }}
                                        >
                                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-fg/10 text-lg font-black text-fg">?</span>
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        );
                    })}
                    <div className="flex h-[76px] items-center justify-center rounded-xl border-2 border-dashed border-line-strong text-center text-[10px] font-bold text-fg-body sm:h-[92px] sm:text-[11px]">
                        還有更多
                        <br />
                        你沒聽過的
                    </div>
                </div>
            </Stage>

            <div className="min-h-[52px]">
                <AnimatePresence mode="wait">
                    {last ? (
                        <motion.div key={open} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <Bubble who="peer">「{last.line}」</Bubble>
                        </motion.div>
                    ) : (
                        <motion.div key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-[44px] items-center text-sm font-semibold text-fg">
                            你只知道 Docker 這一格，其他地方一片迷霧。
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <motion.button
                    type="button"
                    disabled={open >= TILES.length}
                    onClick={() => setOpen((n) => n + 1)}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-1.5 rounded-full bg-success px-4 py-2 text-xs font-black text-canvas disabled:opacity-40"
                >
                    <Icon name="chat" className="h-4 w-4" />和其他工程師聊聊
                </motion.button>
                <button
                    type="button"
                    onClick={() => {
                        setOpen(0);
                        setAsked([]);
                    }}
                    className="rounded-full border border-line-strong px-3.5 py-2 text-xs font-bold text-fg"
                >
                    重來
                </button>
                <span className="ml-auto text-xs font-bold text-fg">
                    撥開 {open} / {TILES.length}　問過 {asked.length}
                </span>
            </div>

            <Verdict id={`${open}-${asked.length}`}>
                {open === 0 ? (
                    <>知道自己不懂 Docker，直接問 AI 就好。真正麻煩的是另外那些你連名字都沒聽過的。</>
                ) : (
                    <>
                        他沒有直接教會你什麼，但<strong>讓你知道有這個東西</strong>，你才有辦法回去問 AI。這就是跟其他工程師交流還是很有價值的原因。
                    </>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
