'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './icons';
import { Bubble, Window } from './kit';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

type Item = { id: number; text: string; done: boolean };

const SEED: Item[] = [
    { id: 1, text: '買牛奶', done: true },
    { id: 2, text: '寫部落格', done: false },
];

const FILES = ['App.tsx', 'TodoList.tsx', 'style.css'];

let nextId = 10;

/** 跟 AI 說一句話，Todo 就出現了；然後第一個「為什麼」自己冒出來 */
export function TodoBuild() {
    const t = useFrameTheme();
    const [built, setBuilt] = useState(false);
    const [items, setItems] = useState<Item[]>(SEED);
    const [draft, setDraft] = useState('');
    const [persist, setPersist] = useState(false);
    const [flash, setFlash] = useState(0);
    const [lost, setLost] = useState(false);

    const add = () => {
        const text = draft.trim();
        if (!text) return;
        setItems((l) => [...l, { id: nextId++, text, done: false }]);
        setDraft('');
    };

    const reload = () => {
        setFlash((n) => n + 1);
        if (persist) setLost(false);
        else {
            setItems(SEED);
            setLost(true);
        }
    };

    const concepts = [
        { name: 'map()', on: built },
        { name: 'State', on: lost || persist },
        { name: 'LocalStorage', on: persist },
    ];
    const left = items.filter((i) => !i.done).length;

    return (
        <InteractiveFrame title="一句話做出 Todo，然後問題開始出現" kicker="動手玩" hint="按「交給 AI」，自己新增幾個任務，再按瀏覽器上的重新整理。">
            <div className="grid gap-4 md:grid-cols-[230px_minmax(0,1fr)]">
                <div className="flex flex-col gap-2.5 md:gap-3">
                    <Bubble who="me">幫我做一個可以新增、完成、刪除任務的 Todo List。</Bubble>
                    {built ? (
                        <div className="hidden md:block">
                            <Bubble who="ai">
                                完成了，產生 3 個檔案：
                                <span className="mt-1.5 flex flex-wrap gap-1">
                                    {FILES.map((f) => (
                                        <span key={f} className="rounded-md bg-fg/10 px-1.5 py-0.5 font-mono text-[11px]">
                                            {f}
                                        </span>
                                    ))}
                                </span>
                            </Bubble>
                        </div>
                    ) : (
                        <motion.button
                            type="button"
                            onClick={() => setBuilt(true)}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-warning px-4 py-2.5 text-sm font-black text-brand-on shadow-card md:py-3"
                        >
                            <Icon name="spark" className="h-4 w-4" />
                            交給 AI
                        </motion.button>
                    )}
                    <div className="mt-auto flex items-center gap-2 rounded-xl border border-line bg-surface-sunken p-2.5 md:block md:p-3">
                        <div className="hidden text-[11px] font-bold tracking-[0.14em] text-fg-body md:mb-2 md:block">遇到才學的觀念</div>
                        <div className="flex flex-wrap gap-1.5">
                            {concepts.map((c) => (
                                <motion.span
                                    key={c.name}
                                    animate={c.on ? { scale: [1, 1.12, 1] } : {}}
                                    className={`rounded-full border px-2.5 py-1 font-mono text-[11px] font-bold transition-colors ${c.on ? 'border-success bg-success text-canvas' : 'border-dashed border-line-strong text-fg-body'}`}
                                >
                                    {c.on && <Icon name="check" className="mr-1 inline h-3 w-3 align-[-2px]" />}
                                    {c.name}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </div>

                <Window
                    title="localhost:3000"
                    icon="globe"
                    right={
                        <button
                            type="button"
                            aria-label="重新整理"
                            title="重新整理"
                            onClick={reload}
                            disabled={!built}
                            className="flex h-6 w-6 items-center justify-center rounded-md text-fg hover:bg-fg/10 disabled:opacity-30"
                        >
                            <motion.span key={flash} initial={{ rotate: 0 }} animate={{ rotate: flash ? 360 : 0 }} transition={{ duration: 0.5 }} className="flex">
                                <Icon name="loop" className="h-4 w-4" />
                            </motion.span>
                        </button>
                    }
                >
                    <div className="relative min-h-[244px] p-3 sm:min-h-[300px] sm:p-4">
                        {!built ? (
                            <div className="space-y-3" aria-hidden="true">
                                {[70, 100, 88].map((w, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ opacity: [0.35, 0.7, 0.35] }}
                                        transition={{
                                            duration: 1.6,
                                            repeat: Infinity,
                                            delay: i * 0.15,
                                        }}
                                        className="h-9 rounded-lg bg-fg/10"
                                        style={{ width: `${w}%` }}
                                    />
                                ))}
                                <div className="pt-4 text-center text-xs font-semibold text-fg-body sm:pt-6">還沒有畫面，等 AI 產生</div>
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="mb-3 flex items-end justify-between">
                                    <div className="text-lg font-black text-fg">今天要做的事</div>
                                    <div className="text-xs font-bold text-brand-text">還有 {left} 件</div>
                                </div>
                                <div className="mb-3 flex gap-2">
                                    <input
                                        value={draft}
                                        onChange={(e) => setDraft(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && add()}
                                        placeholder="新增任務"
                                        aria-label="新增任務"
                                        className="min-w-0 flex-1 rounded-lg border border-line-strong bg-surface-sunken px-3 py-2 text-sm text-fg outline-none focus:border-brand"
                                    />
                                    <button type="button" onClick={add} className="rounded-lg bg-brand px-4 text-sm font-black text-brand-on">
                                        新增
                                    </button>
                                </div>
                                <div className="space-y-1.5">
                                    <AnimatePresence initial={false}>
                                        {items.map((it) => (
                                            <motion.div
                                                key={it.id}
                                                layout
                                                initial={{ opacity: 0, x: -12 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{
                                                    opacity: 0,
                                                    x: 40,
                                                    transition: { duration: 0.15 },
                                                }}
                                                className="group flex items-center gap-2.5 rounded-lg border border-line bg-surface-raised px-3 py-2"
                                            >
                                                <button
                                                    type="button"
                                                    aria-label={it.done ? '標為未完成' : '標為完成'}
                                                    onClick={() => setItems((l) => l.map((x) => (x.id === it.id ? { ...x, done: !x.done } : x)))}
                                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${it.done ? 'border-success bg-success text-canvas' : 'border-line-strong'}`}
                                                >
                                                    {it.done && <Icon name="check" className="h-3 w-3" />}
                                                </button>
                                                <span className={`min-w-0 flex-1 truncate text-sm ${it.done ? 'text-fg-body line-through' : 'text-fg'}`}>{it.text}</span>
                                                <button
                                                    type="button"
                                                    aria-label="刪除"
                                                    onClick={() => setItems((l) => l.filter((x) => x.id !== it.id))}
                                                    className="text-fg-body hover:text-danger-text"
                                                >
                                                    <Icon name="trash" className="h-4 w-4" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={persist}
                                    onClick={() => setPersist((p) => !p)}
                                    className={`mt-3 flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-xs font-bold transition-colors ${persist ? t.accentSoft : t.chip}`}
                                >
                                    <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${persist ? 'bg-brand' : 'bg-line-strong'}`}>
                                        <motion.span className="absolute top-0.5 h-4 w-4 rounded-full bg-canvas" animate={{ left: persist ? 18 : 2 }} />
                                    </span>
                                    請 AI 把資料存進 LocalStorage
                                </button>
                            </motion.div>
                        )}
                        <AnimatePresence>
                            {flash > 0 && (
                                <motion.div
                                    key={flash}
                                    initial={{ opacity: 0.9 }}
                                    animate={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="pointer-events-none absolute inset-0 bg-surface"
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </Window>
            </div>

            <Verdict id={`${built}-${lost}-${persist}-${flash}`}>
                {!built ? (
                    <>先讓 AI 做出第一版，不需要等學完 JavaScript。</>
                ) : lost ? (
                    <>
                        <strong>為什麼重新整理資料就不見了？</strong>
                        這是你自己問出來的第一個問題。答案是 <strong>State</strong>
                        ：資料只活在這一次的畫面裡。打開下面的開關再試一次。
                    </>
                ) : persist ? (
                    <>資料存進瀏覽器了，重新整理也還在。你剛剛親手遇到「資料要放哪裡」這個問題，之後學資料庫就有畫面可以對照。</>
                ) : (
                    <>你還不知道 map() 是什麼，但已經有東西可以玩了。新增幾個任務，再按右上角的重新整理。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
