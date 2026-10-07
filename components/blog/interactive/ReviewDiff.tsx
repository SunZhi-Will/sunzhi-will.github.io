'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

type Hunk = { file: string; del?: string; add?: string; risky: boolean; why: string };

const HUNKS: Hunk[] = [
    { file: 'Button.css', del: 'background: red;', add: 'background: blue;', risky: false, why: '只是把按鈕改成藍色，範圍小、看得懂，放心接受。' },
    { file: 'api.ts', add: 'const API_KEY = "sk-live-9f3a..."', risky: true, why: '金鑰直接寫在前端，任何人打開瀏覽器都看得到。要先問：這個為什麼不放在後端？' },
    { file: 'UserCard.tsx', del: 'if (!user) return', risky: true, why: '少了「沒有 user 就停下來」的檢查。之後 user 不存在時，這裡會直接爆掉。' },
    { file: 'login.test.ts', del: "test('login works', ...)", risky: true, why: '把測試刪掉，錯誤就「消失」了，但只是沒人再檢查。要先問：為什麼要刪？' },
    { file: 'List.tsx', add: '{loading && <Spinner />}', risky: false, why: '多加一個載入中的轉圈圈，看得懂，也不會影響其他功能。' },
];

type Decision = 'accept' | 'ask';

/** 不要每次都 Accept All：先看一下它到底改了什麼 */
export function ReviewDiff() {
    const t = useFrameTheme();
    const [dec, setDec] = useState<(Decision | null)[]>(Array(HUNKS.length).fill(null));
    const [blind, setBlind] = useState(false);
    const done = dec.every((d) => d !== null);

    const decide = (i: number, d: Decision) => {
        setBlind(false);
        setDec((l) => l.map((x, k) => (k === i ? d : x)));
    };
    const acceptAll = () => {
        setBlind(true);
        setDec(Array(HUNKS.length).fill('accept'));
    };
    const reset = () => {
        setBlind(false);
        setDec(Array(HUNKS.length).fill(null));
    };

    const caught = HUNKS.filter((h, i) => h.risky && dec[i] === 'ask').length;
    const slipped = HUNKS.filter((h, i) => h.risky && dec[i] === 'accept').length;
    const riskyTotal = HUNKS.filter((h) => h.risky).length;

    return (
        <InteractiveFrame title="AI 這次改了五個地方" kicker="Review 練習" hint="每一個改動選「接受」或「先問問」。其中有些不太對。">
            <div className="space-y-2">
                {HUNKS.map((h, i) => {
                    const d = dec[i];
                    const showJudge = done;
                    return (
                        <motion.div key={h.file} layout className={`overflow-hidden rounded-lg border ${showJudge && h.risky ? 'border-danger/60' : 'border-line'} bg-surface-sunken`}>
                            <div className="flex items-center justify-between gap-2 px-3 py-1.5">
                                <span className={`font-mono text-[11px] font-semibold ${t.text}`}>{h.file}</span>
                                <span className="flex shrink-0 gap-1.5">
                                    <button type="button" aria-pressed={d === 'accept'} onClick={() => decide(i, 'accept')} className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold transition-colors ${d === 'accept' ? t.chipOn : t.chip}`}>接受</button>
                                    <button type="button" aria-pressed={d === 'ask'} onClick={() => decide(i, 'ask')} className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold transition-colors ${d === 'ask' ? t.chipOn : t.chip}`}>先問問</button>
                                </span>
                            </div>
                            <div className="font-mono text-[11px] leading-5 sm:text-xs">
                                {h.del && <div className="overflow-x-auto whitespace-pre bg-danger/10 px-3 text-danger-text">- {h.del}</div>}
                                {h.add && <div className="overflow-x-auto whitespace-pre bg-success/10 px-3 text-success-text">+ {h.add}</div>}
                            </div>
                            {showJudge && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className={`flex items-start gap-1.5 px-3 py-1.5 text-xs leading-relaxed ${h.risky ? 'bg-danger/10 text-danger-text' : 'bg-success/10 text-success-text'}`}>
                                    <Icon name={h.risky ? 'warn' : 'check'} className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                    <span>{h.why}</span>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={acceptAll} className={`rounded-full border px-3.5 py-1.5 text-xs font-bold ${t.ghost}`}>Accept All</button>
                <button type="button" onClick={reset} className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold ${t.ghost}`}>
                    <Icon name="loop" className="mr-1 inline h-3.5 w-3.5 align-text-bottom" />重來
                </button>
                <span className={`text-xs ${t.sub}`}>已決定 {dec.filter(Boolean).length} / {HUNKS.length}</span>
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
