'use client'

import { useState, type ComponentType, type SVGProps } from 'react';
import { motion } from 'framer-motion';
import { Window } from './kit';
import { CSharpLogo, JavaScriptLogo, PythonLogo, RustLogo } from './logos';
import { InteractiveFrame, Verdict } from './InteractiveFrame';

type Lang = 'JavaScript' | 'Python' | 'C#' | 'Rust';

const LANGS: { name: Lang; file: string; logo: ComponentType<SVGProps<SVGSVGElement>> }[] = [
    { name: 'JavaScript', file: 'main.js', logo: JavaScriptLogo },
    { name: 'Python', file: 'main.py', logo: PythonLogo },
    { name: 'C#', file: 'Main.cs', logo: CSharpLogo },
    { name: 'Rust', file: 'main.rs', logo: RustLogo },
];

const CONCEPTS: { name: string; idea: string; code: Record<Lang, string> }[] = [
    { name: '變數', idea: '幫一個值取名字，之後用名字找它。', code: { JavaScript: 'const name = "Sun"', Python: 'name = "Sun"', 'C#': 'var name = "Sun";', Rust: 'let name = "Sun";' } },
    { name: '條件判斷', idea: '如果成立，就做某件事。', code: { JavaScript: 'if (age >= 18) { }', Python: 'if age >= 18:', 'C#': 'if (age >= 18) { }', Rust: 'if age >= 18 { }' } },
    { name: '迴圈', idea: '一個一個處理清單裡的東西。', code: { JavaScript: 'for (const x of items) { }', Python: 'for x in items:', 'C#': 'foreach (var x in items) { }', Rust: 'for x in items { }' } },
    { name: '函式', idea: '把一段會重複用的事情包起來，取個名字。', code: { JavaScript: 'function add(a, b) { }', Python: 'def add(a, b):', 'C#': 'int Add(int a, int b) { }', Rust: 'fn add(a: i32, b: i32) -> i32 { }' } },
    { name: '非同步', idea: '要等一下才有結果的事，等它做完再往下。', code: { JavaScript: 'await fetchUser()', Python: 'await fetch_user()', 'C#': 'await FetchUserAsync()', Rust: 'fetch_user().await' } },
    { name: '錯誤處理', idea: '事情失敗的時候，要怎麼辦。', code: { JavaScript: 'try { } catch (e) { }', Python: 'try: ... except Exception:', 'C#': 'try { } catch (Exception e) { }', Rust: 'match result { Ok(v) => v, Err(e) => ... }' } },
];

/** 語法會換，要處理的事情其實一直重複 */
export function SyntaxChanges() {
    const [i, setI] = useState(4);
    const c = CONCEPTS[i];

    return (
        <InteractiveFrame title="四種語言，同一件事" kicker="並排對照" hint="選一個觀念，看它在四種語言裡長什麼樣子。">
            <div role="group" aria-label="觀念" className="grid grid-cols-3 gap-1 rounded-xl border border-line bg-surface-sunken p-1 sm:grid-cols-6">
                {CONCEPTS.map((x, k) => (
                    <button key={x.name} type="button" aria-pressed={i === k} onClick={() => setI(k)} className={`relative rounded-lg py-2 text-xs font-bold transition-colors ${i === k ? 'text-canvas' : 'text-fg hover:bg-fg/5'}`}>
                        {i === k && <motion.span layoutId="syntax-concept" className="absolute inset-0 rounded-lg bg-fg shadow-card" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
                        <span className="relative">{x.name}</span>
                    </button>
                ))}
            </div>

            <div className="sm:hidden">
                <Window title={c.name} icon="code">
                    <div className="divide-y divide-line">
                        {LANGS.map((l, k) => (
                            <motion.div key={`${i}-${l.name}`} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: k * 0.05 }} className="flex items-center gap-2.5 px-3 py-2.5">
                                <l.logo className="h-5 w-5 shrink-0 rounded-[3px] text-fg" />
                                <code className="min-w-0 break-words font-mono text-[12px] font-semibold leading-5 text-fg">{c.code[l.name]}</code>
                            </motion.div>
                        ))}
                    </div>
                </Window>
            </div>

            <div className="hidden gap-3 sm:grid sm:grid-cols-2">
                {LANGS.map((l, k) => (
                    <Window key={l.name} title={l.file} logo={l.logo}>
                        <motion.pre
                            key={`${i}-${l.name}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: k * 0.06 }}
                            className="m-0 flex min-h-[64px] items-center overflow-x-auto whitespace-pre-wrap break-words bg-transparent px-4 py-3 font-mono text-[13px] font-semibold leading-6 text-fg sm:text-sm"
                        >
                            {c.code[l.name]}
                        </motion.pre>
                    </Window>
                ))}
            </div>

            <Verdict id={i}>
                <strong>{c.name}：</strong>
                {c.idea}四種寫法都不一樣，但<strong>要解決的問題一模一樣</strong>。學會一次，換語言時你學的是「新的寫法」，不是「新的世界」。
            </Verdict>
        </InteractiveFrame>
    );
}
