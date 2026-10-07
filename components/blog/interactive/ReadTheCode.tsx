'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Segmented, Window } from './kit';
import { JavaScriptLogo } from './logos';
import { InteractiveFrame, Verdict } from './InteractiveFrame';

type Kind = 'kw' | 'fn' | 'var' | 'op' | 'plain';
type Tok = { code: string; tip: string; kind: Kind; step: number };
type Snippet = { id: 'get' | 'guard'; name: string; lines: Tok[][]; flow: string[] };

const COLOR: Record<Kind, string> = {
    kw: 'text-brand-text',
    fn: 'text-info-text',
    var: 'text-success-text',
    op: 'text-fg',
    plain: 'text-fg',
};

const SNIPPETS: Snippet[] = [
    {
        id: 'get',
        name: '取得使用者',
        lines: [
            [
                { code: 'const', tip: '宣告一個之後不會再換掉的名字。', kind: 'kw', step: 3 },
                { code: 'user', tip: '準備一個叫 user 的盒子，等一下把結果放進去。', kind: 'var', step: 3 },
                { code: '=', tip: '把右邊的結果，放進左邊的盒子。', kind: 'op', step: 3 },
                { code: 'await', tip: '等它做完再往下走，因為資料不是馬上就有。', kind: 'kw', step: 2 },
                { code: 'getUser', tip: '呼叫一個叫 getUser 的函式。裡面怎麼寫，現在可以先不管。', kind: 'fn', step: 0 },
                { code: '(id)', tip: '把 id 交給它，告訴它要找誰。', kind: 'plain', step: 1 },
            ],
        ],
        flow: ['呼叫一個東西', '傳入 id', '等待結果', '結果放進 user'],
    },
    {
        id: 'guard',
        name: '沒有就停下來',
        lines: [
            [
                { code: 'if', tip: '如果。括號裡的條件成立，才執行大括號裡的事。', kind: 'kw', step: 0 },
                { code: '(!user)', tip: '! 是「不是」。意思是：如果 user 不存在。', kind: 'var', step: 1 },
                { code: '{', tip: '條件成立時要做的事，從這裡開始。', kind: 'op', step: 1 },
            ],
            [{ code: '  return', tip: '離開這個函式，後面的程式不會再執行。', kind: 'kw', step: 2 }],
            [{ code: '}', tip: '條件成立時要做的事，到這裡結束。之後的程式就不會跑了。', kind: 'op', step: 3 }],
        ],
        flow: ['檢查 user', '如果不在', '直接離開', '不再往下跑'],
    },
];

/** 看得懂 AI 在幹嘛：不用會寫，先會讀 */
export function ReadTheCode() {
    const [sid, setSid] = useState<Snippet['id']>('get');
    const [sel, setSel] = useState<string | null>(null);
    const [seen, setSeen] = useState<string[]>([]);
    const s = SNIPPETS.find((x) => x.id === sid) ?? SNIPPETS[0];

    const all = s.lines.flat();
    const key = (li: number, ti: number) => `${sid}-${li}-${ti}`;
    const selTok = sel ? s.lines.flatMap((l, li) => l.map((tok, ti) => ({ tok, k: key(li, ti) }))).find((x) => x.k === sel)?.tok : undefined;
    const lit = new Set(s.lines.flatMap((l, li) => l.filter((_, ti) => seen.includes(key(li, ti))).map((tok) => tok.step)));
    const read = all.filter((_, n) => seen.includes(s.lines.flatMap((l, li) => l.map((__, ti) => key(li, ti)))[n])).length;

    return (
        <InteractiveFrame title="不用會寫，先試著讀" kicker="動手玩" hint="點程式碼裡的每一個詞，看它在幹嘛。下面的流程會跟著亮起來。">
            <Segmented
                id="read-code"
                label="選擇範例"
                value={sid}
                onChange={(v) => {
                    setSid(v);
                    setSel(null);
                }}
                options={SNIPPETS.map((x) => ({ value: x.id, label: x.name }))}
            />

            <Window title="user.js" logo={JavaScriptLogo} right={<span className="font-mono text-[11px] font-bold text-fg-body">{read}/{all.length}</span>}>
                <div className="min-h-[124px] px-2 py-4 font-mono text-[15px] leading-9 sm:text-base">
                    {s.lines.map((line, li) => (
                        <div key={li} className="flex items-center">
                            <span className="mr-3 w-6 select-none text-right text-xs text-fg-body">{li + 1}</span>
                            <span className="flex flex-wrap items-center gap-x-1.5">
                                {line.map((tok, ti) => {
                                    const k = key(li, ti);
                                    const on = sel === k;
                                    const done = seen.includes(k);
                                    return (
                                        <motion.button
                                            key={k}
                                            type="button"
                                            onClick={() => {
                                                setSel(k);
                                                setSeen((l) => (l.includes(k) ? l : [...l, k]));
                                            }}
                                            whileHover={{ y: -2 }}
                                            className={`relative whitespace-pre rounded-md px-1 font-mono transition-colors ${on ? 'bg-brand text-brand-on' : `${COLOR[tok.kind]} ${done ? 'bg-success/15' : 'hover:bg-fg/10'}`}`}
                                        >
                                            {tok.code}
                                            {!done && !on && <span className="absolute inset-x-1 -bottom-0.5 border-b-2 border-dotted border-brand/70" />}
                                        </motion.button>
                                    );
                                })}
                            </span>
                        </div>
                    ))}
                </div>
                <AnimatePresence mode="wait">
                    <motion.div key={sel ?? 'none'} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex min-h-[52px] items-center gap-2 border-t border-line bg-surface-raised px-4 py-2.5 text-sm text-fg">
                        {selTok ? (
                            <>
                                <span className="shrink-0 rounded-md bg-brand px-1.5 py-0.5 font-mono text-xs font-bold text-brand-on">{selTok.code.trim()}</span>
                                <span>{selTok.tip}</span>
                            </>
                        ) : (
                            <span className="text-fg-body">點上面任何一個有虛線的詞。</span>
                        )}
                    </motion.div>
                </AnimatePresence>
            </Window>

            <div className="relative grid grid-cols-4 gap-1">
                <div className="absolute left-[12.5%] right-[12.5%] top-[15px] h-0.5 bg-fg/15" />
                {s.flow.map((step, i) => {
                    const on = lit.has(i);
                    return (
                        <div key={`${sid}-${step}`} className="relative flex flex-col items-center gap-1.5 text-center">
                            <motion.span
                                animate={on ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-black transition-colors ${on ? 'border-success bg-success text-canvas' : 'border-line-strong bg-surface text-fg'}`}
                            >
                                {i + 1}
                            </motion.span>
                            <span className={`text-[11px] font-bold leading-tight sm:text-xs ${on ? 'text-success-text' : 'text-fg-body'}`}>{step}</span>
                        </div>
                    );
                })}
            </div>

            <Verdict id={lit.size === 4 ? `${sid}-all` : 'idle'}>
                {lit.size === 4 ? (
                    <>
                        四步都亮了：你剛剛把一行程式翻成了白話。<strong>這就是第一個要練的能力：AI 給我程式，我大概看得懂它在幹嘛。</strong>
                    </>
                ) : (
                    <>目標不是離開 AI 還能默寫整個網站，而是看得懂它給你的東西。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
