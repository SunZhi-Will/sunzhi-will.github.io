'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const FRUITS = ['蘋果', '香蕉', '芒果', '葡萄', '鳳梨', '西瓜'];
const PRICES = [120, 45, 80, 200];
const STORAGE_KEY = 'fe-playground-clicks';

function Tile({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col rounded-lg border border-line bg-surface p-3">
            <div className="mb-2 text-xs font-bold text-fg">{title}</div>
            <div className="flex flex-1 items-center justify-center">{children}</div>
        </div>
    );
}

/** 六件前端自己就能做的事，現場玩玩看，全程沒有任何後端 */
export function FrontendPlayground() {
    const t = useFrameTheme();
    const [ops, setOps] = useState(0);
    const bump = () => setOps((n) => n + 1);

    const [red, setRed] = useState(false);
    const [email, setEmail] = useState('');
    const [bounce, setBounce] = useState(0);
    const [asc, setAsc] = useState(false);
    const [query, setQuery] = useState('');
    const [clicks, setClicks] = useState(0);

    useEffect(() => {
        try {
            const saved = Number(localStorage.getItem(STORAGE_KEY));
            if (saved) setClicks(saved);
        } catch {
            // 讀不到就從 0 開始
        }
    }, []);

    const addClick = () => {
        const next = clicks + 1;
        setClicks(next);
        bump();
        try {
            localStorage.setItem(STORAGE_KEY, String(next));
        } catch {
            // 無痕模式寫不進去也沒關係
        }
    };

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const prices = asc ? [...PRICES].sort((a, b) => a - b) : PRICES;
    const fruits = FRUITS.filter((f) => f.includes(query));

    return (
        <InteractiveFrame title="前端自己就能做的事" hint="下面六個都是真的可以操作的。玩的時候留意右上角那個數字。">
            <div className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-semibold ${t.inset}`}>
                <span className={t.sub}>你已經操作 {ops} 次</span>
                <span className="rounded-full bg-success/15 px-2.5 py-1 text-success-text">送給後端的請求：0 次</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                <Tile title="① 按鈕變色">
                    <motion.button
                        type="button"
                        whileTap={{ scale: 0.92 }}
                        onClick={() => {
                            setRed((v) => !v);
                            bump();
                        }}
                        className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${red ? 'bg-danger text-canvas' : 'bg-brand text-brand-on'}`}
                    >
                        {red ? '我變紅了' : '按我'}
                    </motion.button>
                </Tile>

                <Tile title="② 表單檢查">
                    <div className="w-full space-y-1.5">
                        <input
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                bump();
                            }}
                            placeholder="輸入 Email"
                            aria-label="Email"
                            className={`w-full rounded-md border bg-surface-sunken px-2.5 py-1.5 text-xs text-fg outline-none ${email ? (validEmail ? 'border-success' : 'border-danger') : 'border-line-strong'}`}
                        />
                        <div className={`h-4 text-xs ${validEmail ? 'text-success-text' : 'text-danger-text'}`}>{email ? (validEmail ? '格式正確' : '格式不對，少了 @ 或網域') : ''}</div>
                    </div>
                </Tile>

                <Tile title="③ 動畫">
                    <button
                        type="button"
                        onClick={() => {
                            setBounce((n) => n + 1);
                            bump();
                        }}
                        aria-label="讓方塊彈跳"
                        className="rounded-lg px-4 py-1"
                    >
                        <motion.span key={bounce} className="block h-10 w-10 rounded-lg bg-brand" initial={false} animate={bounce ? { y: [0, -26, 0], rotate: [0, 180, 360] } : {}} transition={{ duration: 0.6 }} />
                    </button>
                </Tile>

                <Tile title="④ 排序">
                    <div className="w-full space-y-1.5">
                        <div className="flex gap-1.5">
                            {prices.map((p) => (
                                <motion.span key={p} layout transition={{ type: 'spring', stiffness: 400, damping: 28 }} className="flex-1 rounded bg-brand/20 py-1 text-center text-xs font-bold text-brand-text">
                                    ${p}
                                </motion.span>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setAsc((v) => !v);
                                bump();
                            }}
                            className={`w-full rounded-md border py-1 text-xs font-semibold ${t.ghost}`}
                        >
                            {asc ? '還原順序' : '價格由低到高'}
                        </button>
                    </div>
                </Tile>

                <Tile title="⑤ 搜尋畫面上的資料">
                    <div className="w-full space-y-1.5">
                        <input
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                bump();
                            }}
                            placeholder="搜尋水果"
                            aria-label="搜尋水果"
                            className="w-full rounded-md border border-line-strong bg-surface-sunken px-2.5 py-1.5 text-xs text-fg outline-none"
                        />
                        <div className="flex min-h-[26px] flex-wrap gap-1">
                            {fruits.length ? fruits.map((f) => (
                                <motion.span key={f} layout initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} className="rounded-full bg-fg/10 px-2 py-0.5 text-[11px] text-fg">
                                    {f}
                                </motion.span>
                            )) : <span className={`text-xs ${t.faint}`}>沒有符合的</span>}
                        </div>
                    </div>
                </Tile>

                <Tile title="⑥ 記在瀏覽器（localStorage）">
                    <div className="space-y-1.5 text-center">
                        <button type="button" onClick={addClick} className="rounded-lg bg-fg px-3 py-1.5 text-xs font-bold text-canvas">
                            累積 {clicks} 次
                        </button>
                        <div className={`text-[11px] leading-tight ${t.sub}`}>重新整理網頁，數字還在</div>
                    </div>
                </Tile>
            </div>

            <Verdict id={ops > 0 ? 'played' : 'idle'}>
                {ops > 0 ? (
                    <>
                        你操作了 {ops} 次，送給後端的請求<strong>一次也沒有</strong>。前端自己能處理的就自己處理，需要伺服器資料、權限或重要邏輯，才去找後端。
                    </>
                ) : (
                    <>每個小方塊都玩一下，看看會不會需要後端。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
