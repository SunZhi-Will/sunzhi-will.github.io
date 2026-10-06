'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const GATES = [
    { icon: 'id' as const, name: '你是誰？', sub: '有沒有登入' },
    { icon: 'briefcase' as const, name: '是不是管理員？', sub: '身分' },
    { icon: 'trash' as const, name: '有刪除權限嗎？', sub: '權限' },
    { icon: 'scale' as const, name: '操作合法嗎？', sub: '業務規則' },
];

const WHO: { name: string; stop: number; code: string; reason: string }[] = [
    { name: '沒登入的訪客', stop: 0, code: '401', reason: '後端不知道你是誰，連門都進不去。' },
    { name: '一般使用者', stop: 1, code: '403', reason: '知道你是誰，但你不是管理員。' },
    { name: '客服管理員', stop: 2, code: '403', reason: '是管理員，但這個角色沒有刪除使用者的權限。' },
    { name: '管理員（刪自己）', stop: 3, code: '409', reason: '身分和權限都有，但「不能刪除自己」是業務規則，這次操作不合法。' },
    { name: '超級管理員', stop: 4, code: '200', reason: '四關全過，這次刪除才會真的執行。' },
];

/** 一個刪除請求要闖過四道關卡，不同身分在不同關被擋下 */
export function PermissionGates() {
    const t = useFrameTheme();
    const [who, setWho] = useState(1);
    const [pos, setPos] = useState(-1); // 請求目前走到第幾關，-1 還沒出發
    const data = WHO[who];

    useEffect(() => {
        if (pos < 0) return;
        const limit = data.stop === 4 ? 4 : data.stop;
        if (pos > limit) return;
        const timer = setTimeout(() => setPos((p) => p + 1), 750);
        return () => clearTimeout(timer);
    }, [pos, data.stop]);

    const pick = (i: number) => {
        setWho(i);
        setPos(-1);
    };

    const done = pos > (data.stop === 4 ? 3 : data.stop);
    const reach = Math.min(pos, data.stop === 4 ? 4 : data.stop);
    const tokenLeft = pos < 0 ? 14 : reach >= 4 ? 86 : (reach + 0.5) * 25;
    const passed = (i: number) => pos > i && i < data.stop;
    const blocked = (i: number) => pos > i && i === data.stop;

    return (
        <InteractiveFrame title="後端的四道關卡" hint="選一種身分，送出「刪除使用者」的請求，看它會卡在哪一關。">
            <div className="flex flex-wrap gap-2">
                {WHO.map((w, i) => (
                    <button
                        key={w.name}
                        type="button"
                        aria-pressed={who === i}
                        onClick={() => pick(i)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${who === i ? t.chipOn : t.chip}`}
                    >
                        {w.name}
                    </button>
                ))}
            </div>

            <div className={`rounded-lg border p-3 sm:p-4 ${t.inset}`}>
                <div className="relative">
                    <div className="grid grid-cols-4 gap-2">
                        {GATES.map((g, i) => {
                            const ok = passed(i);
                            const bad = blocked(i);
                            const here = pos === i && i <= data.stop;
                            return (
                                <motion.div
                                    key={g.name}
                                    animate={here ? { scale: 1.06 } : bad ? { x: [0, -6, 6, -4, 4, 0] } : { scale: 1, x: 0 }}
                                    transition={{ duration: bad ? 0.4 : 0.25 }}
                                    className={`rounded-lg border-2 px-1 py-3 text-center transition-colors ${
                                        ok ? 'border-success bg-success/10' : bad ? 'border-danger bg-danger/10' : here ? 'border-brand bg-brand/15' : 'border-line bg-surface'
                                    }`}
                                >
                                    <Icon name={g.icon} className="mx-auto h-6 w-6 text-fg sm:h-7 sm:w-7" />
                                    <div className={`mt-1 text-[11px] font-bold leading-tight sm:text-xs ${t.text}`}>{g.name}</div>
                                    <div className="mt-1 h-4 text-xs font-black">
                                        {ok && <span className="text-success-text">放行</span>}
                                        {bad && <span className="text-danger-text">攔下</span>}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                    {/* 請求本身 */}
                    <div className="relative mt-3 h-8">
                        <div aria-hidden="true" className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-line-strong" />
                        <motion.span
                            className="absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-2.5 py-1 text-[11px] font-black text-brand-on"
                            initial={false}
                            animate={{ left: `${tokenLeft}%`, opacity: pos < 0 ? 0.6 : 1 }}
                            transition={{ type: 'spring', stiffness: 130, damping: 18 }}
                        >
                            DELETE /users/123
                        </motion.span>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => setPos(0)} className={`rounded-full px-4 py-2 text-sm font-semibold ${t.button}`}>
                    {pos < 0 ? '送出請求' : '重送一次'}
                </button>
                {done && (
                    <motion.span
                        key={who + 'code'}
                        initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                        className={`rounded-md border-2 px-3 py-1 text-sm font-black ${data.code === '200' ? 'border-success text-success-text' : 'border-danger text-danger-text'}`}
                    >
                        {data.code}
                    </motion.span>
                )}
            </div>

            <Verdict id={done ? who : 'idle'}>{done ? data.reason : <>後端要確認的是：你是誰、是不是管理員、有沒有權限、這次操作是否合法。每一關都要過。</>}</Verdict>
        </InteractiveFrame>
    );
}
