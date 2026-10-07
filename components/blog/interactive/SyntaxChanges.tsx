'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const LANGS = ['JavaScript', 'Python', 'C#', 'Rust'] as const;

const CONCEPTS: { name: string; idea: string; code: Record<(typeof LANGS)[number], string> }[] = [
    {
        name: '變數',
        idea: '幫一個值取名字，之後用名字找它。',
        code: { JavaScript: 'const name = "Sun"', Python: 'name = "Sun"', 'C#': 'var name = "Sun";', Rust: 'let name = "Sun";' },
    },
    {
        name: '條件判斷',
        idea: '如果成立，就做某件事。',
        code: { JavaScript: 'if (age >= 18) { }', Python: 'if age >= 18:', 'C#': 'if (age >= 18) { }', Rust: 'if age >= 18 { }' },
    },
    {
        name: '迴圈',
        idea: '一個一個處理清單裡的東西。',
        code: { JavaScript: 'for (const x of items) { }', Python: 'for x in items:', 'C#': 'foreach (var x in items) { }', Rust: 'for x in items { }' },
    },
    {
        name: '函式',
        idea: '把一段會重複用的事情包起來，取個名字。',
        code: { JavaScript: 'function add(a, b) { }', Python: 'def add(a, b):', 'C#': 'int Add(int a, int b) { }', Rust: 'fn add(a: i32, b: i32) -> i32 { }' },
    },
    {
        name: '非同步',
        idea: '要等一下才有結果的事，等它做完再往下。',
        code: { JavaScript: 'await fetchUser()', Python: 'await fetch_user()', 'C#': 'await FetchUserAsync()', Rust: 'fetch_user().await' },
    },
    {
        name: '錯誤處理',
        idea: '事情失敗的時候，要怎麼辦。',
        code: { JavaScript: 'try { } catch (e) { }', Python: 'try: ... except Exception:', 'C#': 'try { } catch (Exception e) { }', Rust: 'match result { Ok(v) => v, Err(e) => ... }' },
    },
];

/** 語法會換，要處理的事情其實一直重複 */
export function SyntaxChanges() {
    const t = useFrameTheme();
    const [i, setI] = useState(3);
    const c = CONCEPTS[i];

    return (
        <InteractiveFrame title="四種語言，同一件事" kicker="互動對照" hint="選一個觀念，看它在不同語言裡長什麼樣子。">
            <div role="group" aria-label="觀念" className="flex flex-wrap gap-1.5">
                {CONCEPTS.map((x, k) => (
                    <button key={x.name} type="button" aria-pressed={i === k} onClick={() => setI(k)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${i === k ? t.chipOn : t.chip}`}>
                        {x.name}
                    </button>
                ))}
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
                {LANGS.map((l, k) => (
                    <div key={l} className={`rounded-lg border ${t.inset}`}>
                        <div className={`border-b px-3 py-1.5 text-[11px] font-bold ${t.divider} ${t.sub}`}>{l}</div>
                        <motion.pre key={`${i}-${l}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.06 }} className="m-0 min-h-[56px] overflow-x-auto whitespace-pre-wrap break-words bg-transparent px-3 py-2.5 font-mono text-xs leading-6 text-fg sm:text-[13px]">
                            {c.code[l]}
                        </motion.pre>
                    </div>
                ))}
            </div>

            <Verdict id={i}>
                <strong>{c.name}：</strong>
                {c.idea}語法四種都不一樣，但<strong>要解決的問題一模一樣</strong>。學會一次，換語言時你學的是「新的寫法」，不是「新的世界」。
            </Verdict>
        </InteractiveFrame>
    );
}
