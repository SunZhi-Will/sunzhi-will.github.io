'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const TABS = ['登入畫面', '商品列表', '按鈕', '表單', '後台管理介面', '遊戲網站', '會員中心'];

const bar = 'rounded bg-fg/15';

function Screen({ tab }: { tab: string }) {
    if (tab === '登入畫面')
        return (
            <div className="mx-auto w-full max-w-[220px] space-y-2.5 py-2">
                <div className="mx-auto h-9 w-9 rounded-full bg-brand/30" />
                <div className="h-8 rounded-md border border-line-strong bg-surface px-2.5 text-xs leading-8 text-fg-muted">Email</div>
                <div className="h-8 rounded-md border border-line-strong bg-surface px-2.5 text-xs leading-8 text-fg-muted">••••••••</div>
                <div className="h-8 rounded-md bg-brand text-center text-xs font-bold leading-8 text-brand-on">登入</div>
            </div>
        );
    if (tab === '商品列表')
        return (
            <div className="grid grid-cols-3 gap-2.5 py-1">
                {(['photo', 'clock', 'bag'] as const).map((e, i) => (
                    <div key={e} className="rounded-lg border border-line bg-surface p-2 text-center">
                        <div className="flex justify-center rounded-md bg-fg/10 py-2 text-fg"><Icon name={e} className="h-7 w-7" /></div>
                        <div className="mt-1.5 text-[11px] font-semibold text-fg">商品 {i + 1}</div>
                        <div className="text-[11px] font-bold text-brand-text">${(i + 1) * 390}</div>
                        <div className="mt-1 rounded bg-brand py-0.5 text-[10px] font-bold text-brand-on">加入購物車</div>
                    </div>
                ))}
            </div>
        );
    if (tab === '按鈕')
        return (
            <div className="flex flex-wrap items-center justify-center gap-2.5 py-6">
                <span className="rounded-lg bg-brand px-4 py-2 text-xs font-bold text-brand-on">主要</span>
                <span className="rounded-lg border border-line-strong px-4 py-2 text-xs font-semibold text-fg">次要</span>
                <span className="rounded-lg bg-danger px-4 py-2 text-xs font-bold text-canvas">刪除</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-success px-4 py-2 text-xs font-bold text-canvas">完成<Icon name="check" className="h-3 w-3" /></span>
                <span className="rounded-lg bg-fg/10 px-4 py-2 text-xs font-semibold text-fg-muted">停用</span>
            </div>
        );
    if (tab === '表單')
        return (
            <div className="mx-auto w-full max-w-[260px] space-y-2.5 py-2 text-xs text-fg">
                <div className="flex gap-2"><span className="w-10 shrink-0 leading-7">姓名</span><span className="h-7 flex-1 rounded border border-line-strong bg-surface" /></div>
                <div className="flex gap-2"><span className="w-10 shrink-0 leading-7">城市</span><span className="h-7 flex-1 rounded border border-line-strong bg-surface px-2 leading-7">台北</span></div>
                <div className="flex items-center gap-2"><span className="h-4 w-4 rounded border-2 border-brand bg-brand" /> 我同意條款</div>
                <div className="rounded-md bg-brand py-1.5 text-center font-bold text-brand-on">送出</div>
            </div>
        );
    if (tab === '後台管理介面')
        return (
            <div className="flex gap-3 py-1">
                <div className="w-16 space-y-1.5 border-r border-line pr-2">
                    {['總覽', '訂單', '會員'].map((s, i) => (
                        <div key={s} className={`rounded px-1.5 py-1 text-[11px] font-semibold ${i === 0 ? 'bg-brand/20 text-brand-text' : 'text-fg-body'}`}>{s}</div>
                    ))}
                </div>
                <div className="flex flex-1 items-end gap-2 pt-2">
                    {[40, 62, 48, 80, 66, 92].map((h, i) => (
                        <motion.div key={i} className="flex-1 rounded-t bg-brand" initial={{ height: 0 }} animate={{ height: h }} transition={{ delay: i * 0.07, type: 'spring', stiffness: 120, damping: 14 }} />
                    ))}
                </div>
            </div>
        );
    if (tab === '遊戲網站')
        return (
            <div className="py-1">
                <div className="mb-2 flex justify-between text-[11px] font-bold text-fg"><span className="flex gap-0.5 text-danger">{[0, 1, 2].map((h) => <Icon key={h} name="heart" className="h-3.5 w-3.5" />)}</span><span>分數 1280</span></div>
                <div className="grid grid-cols-6 gap-1.5">
                    {Array.from({ length: 18 }, (_, i) => (
                        <motion.div
                            key={i}
                            className={`flex aspect-square items-center justify-center rounded text-base ${i % 5 === 0 ? 'bg-brand/25' : 'bg-fg/10'}`}
                            animate={i === 8 ? { y: [0, -5, 0] } : {}}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        >
                            {i === 8 ? <Icon name="user" className="h-4 w-4 text-brand-text" /> : i === 3 ? <Icon name="fire" className="h-4 w-4 text-danger" /> : i === 14 ? <Icon name="spark" className="h-4 w-4 text-info" /> : null}
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    return (
        <div className="mx-auto flex max-w-[260px] items-center gap-3 py-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand/30 text-brand-text"><Icon name="user" className="h-7 w-7" /></div>
            <div className="flex-1 space-y-1.5">
                <div className="text-sm font-bold text-fg">Sun</div>
                <div className="text-[11px] text-fg-body">黃金會員 · 點數 2,480</div>
                <div className="h-2 overflow-hidden rounded-full bg-fg/10"><motion.div className="h-full rounded-full bg-brand" initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ duration: 0.8 }} /></div>
            </div>
        </div>
    );
}

/** React 做出來的東西長什麼樣子：全部都是使用者看得到、摸得到的那一層 */
export function WhatIsReact() {
    const t = useFrameTheme();
    const [tab, setTab] = useState(TABS[0]);

    return (
        <InteractiveFrame title="React 主要做的，是這些畫面" hint="點一種，看看它長什麼樣子。">
            <div className="flex flex-wrap gap-2">
                {TABS.map((name) => (
                    <button
                        key={name}
                        type="button"
                        aria-pressed={tab === name}
                        onClick={() => setTab(name)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${tab === name ? t.chipOn : t.chip}`}
                    >
                        {name}
                    </button>
                ))}
            </div>

            <div className="overflow-hidden rounded-lg border border-line-strong bg-surface">
                <div className="flex items-center gap-1.5 border-b border-line bg-surface-raised px-3 py-1.5">
                    <span className="h-2 w-2 rounded-full bg-danger" />
                    <span className="h-2 w-2 rounded-full bg-warning" />
                    <span className="h-2 w-2 rounded-full bg-success" />
                    <span className={`ml-2 flex-1 rounded px-2 py-0.5 text-[11px] ${bar} ${t.faint}`}>你的瀏覽器</span>
                </div>
                <div className="min-h-[170px] px-4 py-4">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
                            <Screen tab={tab} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <Verdict id="react">
                全部都是<strong>使用者眼前正在操作的那一層</strong>。看得到、點得到，這就是前端。
            </Verdict>
        </InteractiveFrame>
    );
}
