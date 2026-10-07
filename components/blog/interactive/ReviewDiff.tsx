'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './icons';
import { Avatar } from './kit';
import { InteractiveFrame, Verdict } from './InteractiveFrame';

type Hunk = { file: string; del?: string; add?: string; risky: boolean; why: string };

const HUNKS: Hunk[] = [
    { file: 'Button.css', del: 'background: red;', add: 'background: blue;', risky: false, why: '只是把按鈕改成藍色，範圍小、看得懂，放心接受。' },
    { file: 'api.ts', add: 'const API_KEY = "sk-live-9f3a..."', risky: true, why: '金鑰直接寫在前端，任何人打開瀏覽器都看得到。要先問：為什麼不放在後端？' },
    { file: 'UserCard.tsx', del: 'if (!user) return', risky: true, why: '少了「沒有 user 就停下來」的檢查，user 不存在時這裡會直接爆掉。' },
    { file: 'login.test.ts', del: "test('login works', ...)", risky: true, why: '把測試刪掉，錯誤就「消失」了，但只是沒人再檢查。要先問：為什麼要刪？' },
    { file: 'List.tsx', add: '{loading && <Spinner />}', risky: false, why: '多一個載入中的轉圈圈，看得懂，也不會影響其他功能。' },
];

type Decision = 'accept' | 'ask';

/** 不要每次都 Accept All：先看一下它到底改了什麼 */
export function ReviewDiff() {
    const [dec, setDec] = useState<(Decision | null)[]>(Array(HUNKS.length).fill(null));
    const [blind, setBlind] = useState(false);
    // 手機一次只看一個檔案
    const [focus, setFocus] = useState(0);
    const done = dec.every((d) => d !== null);

    const decide = (i: number, d: Decision) => {
        setBlind(false);
        const next = dec.map((x, k) => (k === i ? d : x));
        setDec(next);
        const after = next.findIndex((x, k) => k > i && x === null);
        const any = next.findIndex((x) => x === null);
        if (after !== -1) setFocus(after);
        else if (any !== -1) setFocus(any);
    };
    const reset = () => {
        setBlind(false);
        setDec(Array(HUNKS.length).fill(null));
        setFocus(0);
    };

    const riskyTotal = HUNKS.filter((h) => h.risky).length;
    const caught = HUNKS.filter((h, i) => h.risky && dec[i] === 'ask').length;
    const slipped = HUNKS.filter((h, i) => h.risky && dec[i] === 'accept').length;
    const adds = HUNKS.filter((h) => h.add).length;
    const dels = HUNKS.filter((h) => h.del).length;

    return (
        <InteractiveFrame title="AI 這次改了五個地方" kicker="Review 練習" hint="每一個改動選「接受」或「先問問」。其中有幾個不太對。">
            <div className="overflow-hidden rounded-xl border border-line-strong bg-surface shadow-card">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line bg-surface-raised px-3 py-2.5">
                    <span className="hidden sm:block"><Avatar who="ai" /></span>
                    <div className="min-w-0 flex-1">
                        <div className="text-sm font-black text-fg">AI 送出的修改</div>
                        <div className="text-[11px] font-bold text-fg-body">
                            {HUNKS.length} 個檔案　<span className="text-success-text">+{adds}</span>　<span className="text-danger-text">-{dels}</span>
                        </div>
                    </div>
                    <span className="flex gap-1">
                        {dec.map((d, k) => (
                            <button
                                key={k}
                                type="button"
                                aria-label={`看第 ${k + 1} 個檔案`}
                                onClick={() => setFocus(k)}
                                className={`h-2.5 w-6 rounded-full ring-offset-2 ring-offset-surface-raised sm:pointer-events-none sm:h-2 sm:w-5 ${focus === k ? 'ring-2 ring-brand sm:ring-0' : ''} ${d === null ? 'bg-fg/15' : done && HUNKS[k].risky ? (d === 'ask' ? 'bg-success' : 'bg-danger') : 'bg-fg'}`}
                            />
                        ))}
                    </span>
                </div>

                <div className="hidden divide-y divide-line sm:block">
                    {HUNKS.map((h, i) => {
                        const d = dec[i];
                        return (
                            <div key={h.file}>
                                <div className="flex items-center gap-2 px-3 py-1.5 sm:py-2">
                                    <Icon name="doc" className="h-4 w-4 shrink-0 text-fg" />
                                    <span className="min-w-0 flex-1 truncate font-mono text-xs font-bold text-fg">{h.file}</span>
                                    <span className="flex shrink-0 rounded-full border border-line bg-surface-sunken p-0.5">
                                        {(['accept', 'ask'] as const).map((v) => (
                                            <button
                                                key={v}
                                                type="button"
                                                aria-pressed={d === v}
                                                onClick={() => decide(i, v)}
                                                className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${d === v ? (v === 'accept' ? 'bg-fg text-canvas' : 'bg-brand text-brand-on') : 'text-fg hover:bg-fg/10'}`}
                                            >
                                                {v === 'accept' ? '接受' : '先問問'}
                                            </button>
                                        ))}
                                    </span>
                                </div>
                                <div className={`px-3 pb-2 font-mono text-[11px] leading-5 sm:text-xs sm:leading-6 ${done ? 'hidden sm:block' : ''}`}>
                                    {h.del && <div className="overflow-x-auto whitespace-pre rounded-t bg-danger/10 px-2 text-danger-text last:rounded-b">- {h.del}</div>}
                                    {h.add && <div className={`overflow-x-auto whitespace-pre bg-success/10 px-2 text-success-text ${h.del ? 'rounded-b' : 'rounded'}`}>+ {h.add}</div>}
                                </div>
                                <AnimatePresence>
                                    {done && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                            <div className={`mx-3 mb-2 flex items-start gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold leading-snug sm:leading-relaxed ${h.risky ? 'bg-danger/10 text-danger-text' : 'bg-success/10 text-success-text'}`}>
                                                <Icon name={h.risky ? 'warn' : 'check'} className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                                <span>{h.why}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                <div className="sm:hidden">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div key={focus} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.18 }} className="space-y-2.5 p-3">
                            <div className="flex items-center gap-2">
                                <Icon name="doc" className="h-4 w-4 shrink-0 text-fg" />
                                <span className="min-w-0 flex-1 truncate font-mono text-xs font-bold text-fg">{HUNKS[focus].file}</span>
                                <span className="text-[11px] font-bold text-fg-body">
                                    {focus + 1} / {HUNKS.length}
                                </span>
                            </div>
                            <div className="font-mono text-[11px] leading-6">
                                {HUNKS[focus].del && <div className="whitespace-pre-wrap break-all rounded-t bg-danger/10 px-2 text-danger-text last:rounded-b">- {HUNKS[focus].del}</div>}
                                {HUNKS[focus].add && <div className={`whitespace-pre-wrap break-all bg-success/10 px-2 text-success-text ${HUNKS[focus].del ? 'rounded-b' : 'rounded'}`}>+ {HUNKS[focus].add}</div>}
                            </div>
                            {done && (
                                <div className={`flex items-start gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold leading-snug ${HUNKS[focus].risky ? 'bg-danger/10 text-danger-text' : 'bg-success/10 text-success-text'}`}>
                                    <Icon name={HUNKS[focus].risky ? 'warn' : 'check'} className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                    <span>{HUNKS[focus].why}</span>
                                </div>
                            )}
                            <div className="grid grid-cols-[36px_1fr_1fr_36px] gap-1.5">
                                <button type="button" aria-label="上一個檔案" onClick={() => setFocus((focus + HUNKS.length - 1) % HUNKS.length)} className="rounded-full border border-line-strong text-fg">
                                    ←
                                </button>
                                {(['accept', 'ask'] as const).map((v) => (
                                    <button
                                        key={v}
                                        type="button"
                                        aria-pressed={dec[focus] === v}
                                        onClick={() => decide(focus, v)}
                                        className={`rounded-full border py-2 text-xs font-black transition-colors ${dec[focus] === v ? (v === 'accept' ? 'border-fg bg-fg text-canvas' : 'border-brand bg-brand text-brand-on') : 'border-line-strong text-fg'}`}
                                    >
                                        {v === 'accept' ? '接受' : '先問問'}
                                    </button>
                                ))}
                                <button type="button" aria-label="下一個檔案" onClick={() => setFocus((focus + 1) % HUNKS.length)} className="rounded-full border border-line-strong text-fg">
                                    →
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-line bg-surface-raised px-3 py-2.5">
                    <button
                        type="button"
                        onClick={() => {
                            setBlind(true);
                            setDec(Array(HUNKS.length).fill('accept'));
                        }}
                        className="rounded-full bg-success px-4 py-1.5 text-xs font-black text-canvas"
                    >
                        Accept All
                    </button>
                    <button type="button" onClick={reset} className="flex items-center gap-1 rounded-full border border-line-strong px-3.5 py-1.5 text-xs font-bold text-fg">
                        <Icon name="loop" className="h-3.5 w-3.5" />重來
                    </button>
                    <span className="ml-auto text-xs font-bold text-fg">已決定 {dec.filter(Boolean).length} / {HUNKS.length}</span>
                </div>
            </div>

            <Verdict id={`${done}-${caught}-${blind}`}>
                {!done ? (
                    <>就算一開始只能看懂 20%，下一次 30%，再下一次 40%，這才是真的在成長。</>
                ) : blind ? (
                    <>
                        全部接受：<strong>{riskyTotal} 個有問題的改動都過關了</strong>：金鑰外洩、少了檢查、測試被刪。程式可能還是跑得動，直到有一天不動。
                    </>
                ) : (
                    <>
                        {riskyTotal} 個有問題的改動，你攔下 <strong>{caught}</strong> 個{slipped > 0 ? `，放過 ${slipped} 個` : ''}。
                        {caught === riskyTotal ? '全部攔到了。' : '放過的那些，下次看到類似的就多問一句。'}
                    </>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
