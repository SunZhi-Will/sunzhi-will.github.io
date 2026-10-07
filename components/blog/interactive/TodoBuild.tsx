'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

type Item = { id: number; text: string; done: boolean };

const SEED: Item[] = [
    { id: 1, text: '買牛奶', done: true },
    { id: 2, text: '寫部落格', done: false },
];

const FEATURES = ['輸入框', '新增按鈕', '任務列表', '完成狀態', '刪除功能'];

let nextId = 10;

/** 跟 AI 說一句話，Todo 就出現了；然後第一個「為什麼」自己冒出來 */
export function TodoBuild() {
    const t = useFrameTheme();
    const [built, setBuilt] = useState(false);
    const [items, setItems] = useState<Item[]>(SEED);
    const [draft, setDraft] = useState('');
    const [persist, setPersist] = useState(false);
    const [reloaded, setReloaded] = useState(0);
    const [lost, setLost] = useState(false);

    const add = () => {
        const text = draft.trim();
        if (!text) return;
        setItems((l) => [...l, { id: nextId++, text, done: false }]);
        setDraft('');
    };

    const reload = () => {
        setReloaded((n) => n + 1);
        if (persist) {
            setLost(false);
        } else {
            setItems(SEED);
            setLost(true);
        }
    };

    return (
        <InteractiveFrame title="一句話做出 Todo，然後問題開始出現" kicker="動手玩" hint="按「交給 AI」，再自己新增幾個任務，最後按重新整理。">
            <div className={`rounded-lg border px-3 py-2.5 text-sm ${t.inset}`}>
                <span className={`mr-2 text-xs font-semibold ${t.faint}`}>你</span>
                <span className={t.text}>幫我做一個可以新增、完成、刪除任務的 Todo List。</span>
            </div>

            {!built ? (
                <div className="flex min-h-[272px] items-center justify-center rounded-lg border border-dashed border-line-strong">
                    <button type="button" onClick={() => setBuilt(true)} className={`rounded-full px-5 py-2.5 text-sm font-bold ${t.button}`}>
                        <Icon name="robot" className="mr-1.5 inline h-4 w-4 align-text-bottom" />交給 AI
                    </button>
                </div>
            ) : (
                <div className="grid gap-3 md:grid-cols-[1fr_200px]">
                    <div className={`rounded-lg border ${t.inset}`}>
                        <div className={`flex items-center justify-between border-b px-3 py-2 text-xs font-medium ${t.divider} ${t.faint}`}>
                            <span>My Todo（第一版）</span>
                            <button type="button" onClick={reload} className={`rounded-md border px-2 py-0.5 font-semibold ${t.chip}`}>
                                <Icon name="loop" className="mr-1 inline h-3 w-3 align-text-bottom" />重新整理
                            </button>
                        </div>
                        <div className="space-y-2 px-3 py-3">
                            <div className="flex gap-2">
                                <input
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && add()}
                                    placeholder="新增任務"
                                    aria-label="新增任務"
                                    className="min-w-0 flex-1 rounded-md border border-line-strong bg-surface px-2.5 py-1.5 text-sm text-fg outline-none focus:border-brand"
                                />
                                <button type="button" onClick={add} className="rounded-md bg-brand px-3 py-1.5 text-xs font-bold text-brand-on">新增</button>
                            </div>
                            <div className="min-h-[132px] space-y-1.5">
                                <AnimatePresence initial={false}>
                                    {items.map((it) => (
                                        <motion.div key={it.id} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 40 }} className="flex items-center gap-2 rounded-md border border-line bg-surface px-2.5 py-1.5">
                                            <button
                                                type="button"
                                                aria-label={it.done ? '標為未完成' : '標為完成'}
                                                onClick={() => setItems((l) => l.map((x) => (x.id === it.id ? { ...x, done: !x.done } : x)))}
                                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${it.done ? 'border-success bg-success text-canvas' : 'border-line-strong'}`}
                                            >
                                                {it.done && <Icon name="check" className="h-3 w-3" />}
                                            </button>
                                            <span className={`min-w-0 flex-1 truncate text-sm ${it.done ? `${t.faint} line-through` : t.text}`}>{it.text}</span>
                                            <button type="button" aria-label="刪除" onClick={() => setItems((l) => l.filter((x) => x.id !== it.id))} className={`${t.faint} hover:text-danger-text`}>
                                                <Icon name="trash" className="h-4 w-4" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {items.length === 0 && <div className={`py-4 text-center text-xs ${t.faint}`}>清單是空的</div>}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className={`text-xs font-bold ${t.text}`}>AI 一次給了你</div>
                        <div className="flex flex-wrap gap-1.5">
                            {FEATURES.map((f, i) => (
                                <motion.span key={f} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success-text">
                                    {f}
                                </motion.span>
                            ))}
                        </div>
                        <div className={`pt-1 text-xs leading-relaxed ${t.sub}`}>你還沒學 <code className="rounded bg-fg/10 px-1">map()</code>，也還沒學 State，但它已經能玩了。</div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={persist}
                            onClick={() => setPersist((p) => !p)}
                            className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs font-semibold transition-colors ${persist ? t.accentSoft : t.chip}`}
                        >
                            <Icon name={persist ? 'check' : 'db'} className="h-4 w-4 shrink-0" />
                            <span>{persist ? '已用 LocalStorage 存起來' : '把資料存起來'}</span>
                        </button>
                    </div>
                </div>
            )}

            <Verdict id={`${built}-${lost}-${persist}-${reloaded}`}>
                {!built ? (
                    <>先讓 AI 做出第一版，不需要等學完 JavaScript。</>
                ) : lost ? (
                    <>
                        <strong>為什麼重新整理資料就不見了？</strong>這是你自己問出來的第一個問題。答案牽涉到 <strong>State</strong>（資料只活在這次的畫面裡）與 <strong>LocalStorage、API、資料庫</strong>（把資料存到別的地方）。打開右邊的開關再試一次。
                    </>
                ) : persist ? (
                    <>資料存進瀏覽器了，重新整理也還在。你剛剛親手遇到了「資料要放哪裡」這個問題，之後學資料庫就有畫面可以對照。</>
                ) : (
                    <>試著新增幾個任務，再按右上角的「重新整理」。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
