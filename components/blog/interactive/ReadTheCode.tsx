'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

type Part = { code: string; tip: string };
type Snippet = { name: string; parts: Part[][]; flow: string[] };

const SNIPPETS: Snippet[] = [
    {
        name: '取得使用者',
        parts: [
            [
                { code: 'const user', tip: '準備一個叫 user 的盒子，等一下把結果放進去。' },
                { code: ' = ', tip: '把右邊的結果放進左邊。' },
                { code: 'await', tip: '等它做完再往下走，因為資料不是馬上就有。' },
                { code: ' getUser', tip: '呼叫一個叫 getUser 的函式。裡面怎麼寫，現在可以先不管。' },
                { code: '(id)', tip: '把 id 交給它，告訴它要找誰。' },
            ],
        ],
        flow: ['呼叫一個東西', '傳入 id', '等待結果', '結果放進 user'],
    },
    {
        name: '沒有就停下來',
        parts: [
            [
                { code: 'if', tip: '如果。後面括號裡的條件成立，才執行大括號內的事。' },
                { code: ' (!user)', tip: '! 是「不是」。意思是：如果 user 不存在。' },
                { code: ' {', tip: '條件成立時要做的事從這裡開始。' },
            ],
            [
                { code: '  return', tip: '離開這個函式，後面的程式不會再執行。' },
            ],
            [{ code: '}', tip: '條件成立時要做的事到這裡結束。' }],
        ],
        flow: ['檢查 user 在不在', '不在', '直接離開', '不再往下跑'],
    },
];

/** 看得懂 AI 在幹嘛：不用會寫，先會讀 */
export function ReadTheCode() {
    const t = useFrameTheme();
    const [snip, setSnip] = useState(0);
    const [tip, setTip] = useState<string | null>(null);
    const [seen, setSeen] = useState<string[]>([]);
    const s = SNIPPETS[snip];

    const pick = (key: string, text: string) => {
        setTip(text);
        setSeen((l) => (l.includes(key) ? l : [...l, key]));
    };
    const total = SNIPPETS.reduce((n, sn) => n + sn.parts.flat().length, 0);

    return (
        <InteractiveFrame title="不用會寫，先試著讀" kicker="動手玩" hint="點程式碼的每一小段，看它在幹嘛。">
            <div role="group" aria-label="選擇範例" className="flex gap-2">
                {SNIPPETS.map((x, i) => (
                    <button
                        key={x.name}
                        type="button"
                        aria-pressed={snip === i}
                        onClick={() => {
                            setSnip(i);
                            setTip(null);
                        }}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${snip === i ? t.chipOn : t.chip}`}
                    >
                        {x.name}
                    </button>
                ))}
            </div>

            <div className="overflow-hidden rounded-lg border border-line bg-surface-sunken">
                <div className={`flex items-center gap-1.5 border-b px-3 py-2 text-[11px] ${t.divider} ${t.faint}`}>
                    <Icon name="code" className="h-3.5 w-3.5" />AI 給你的程式
                </div>
                <pre className="m-0 min-h-[96px] overflow-x-auto bg-transparent px-3 py-3 font-mono text-[13px] leading-7 sm:text-sm">
                    {s.parts.map((line, li) => (
                        <div key={li} className="whitespace-pre">
                            {line.map((p, pi) => {
                                const key = `${snip}-${li}-${pi}`;
                                const on = tip === p.tip;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => pick(key, p.tip)}
                                        className={`whitespace-pre rounded px-0.5 text-left font-mono transition-colors ${on ? 'bg-brand text-brand-on' : seen.includes(key) ? 'bg-success/15 text-fg' : 'text-fg hover:bg-fg/10'}`}
                                    >
                                        {p.code}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </pre>
            </div>

            <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5">
                {s.flow.map((step, i) => (
                    <div key={step} className="flex items-center gap-1">
                        <motion.span key={`${snip}-${i}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }} className={`rounded-md border px-2 py-1 text-xs font-semibold ${t.accentSoft}`}>
                            {step}
                        </motion.span>
                        {i < s.flow.length - 1 && <span aria-hidden="true" className={`text-xs ${t.faint}`}>→</span>}
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-fg/10">
                    <motion.div className="h-full rounded-full bg-success" initial={false} animate={{ width: `${(seen.length / total) * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
                </div>
                <span className={`text-xs font-semibold ${t.sub}`}>看懂 {seen.length} / {total} 段</span>
            </div>

            <Verdict id={tip ?? 'idle'}>
                {tip ?? (
                    <>
                        目標不是離開 AI 還能默寫整個網站，而是<strong>AI 給我程式，我大概看得懂它在幹嘛</strong>。
                    </>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
