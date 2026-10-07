'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

type Lang = 'js' | 'ts';

const VALUES = [
    { id: 'num', label: '18', literal: '18', js: '19', ok: true },
    { id: 'str', label: '"18"', literal: '"18"', js: '"181"', ok: false },
    { id: 'zh', label: '"十八歲"', literal: '"十八歲"', js: '"十八歲1"', ok: false },
];

/** AI 寫的程式不小心把數字變成字串：JavaScript 讓它過，TypeScript 先提醒 */
export function TypeSafety() {
    const t = useFrameTheme();
    const [lang, setLang] = useState<Lang>('js');
    const [vid, setVid] = useState('zh');
    const v = VALUES.find((x) => x.id === vid) ?? VALUES[2];
    const caught = lang === 'ts' && !v.ok;

    return (
        <InteractiveFrame title="age 不小心變成文字，誰會先發現？" kicker="互動對照" hint="換一個值，再切換 JavaScript 與 TypeScript。">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div role="group" aria-label="語言" className={`inline-flex rounded-full border p-0.5 ${t.inset}`}>
                    {(['js', 'ts'] as const).map((l) => (
                        <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)} className={`relative rounded-full px-3.5 py-1 text-xs font-bold ${lang === l ? 'text-brand-on' : t.sub}`}>
                            {lang === l && <motion.span layoutId="type-pill" className="absolute inset-0 rounded-full bg-brand" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                            <span className="relative">{l === 'js' ? 'JavaScript' : 'TypeScript'}</span>
                        </button>
                    ))}
                </div>
                <div role="group" aria-label="age 的值" className="flex items-center gap-1.5">
                    <span className={`text-xs ${t.sub}`}>age 的值</span>
                    {VALUES.map((x) => (
                        <button key={x.id} type="button" aria-pressed={vid === x.id} onClick={() => setVid(x.id)} className={`rounded-full border px-2.5 py-1 font-mono text-xs font-semibold transition-colors ${vid === x.id ? t.chipOn : t.chip}`}>
                            {x.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-line bg-surface-sunken">
                <div className={`flex items-center gap-1.5 border-b px-3 py-2 text-[11px] ${t.divider} ${t.faint}`}>
                    <Icon name="code" className="h-3.5 w-3.5" />{lang === 'js' ? 'app.js' : 'app.ts'}
                </div>
                <pre className="m-0 overflow-x-auto bg-transparent px-3 py-3 font-mono text-xs leading-7 sm:text-[13px]">
                    <div className="whitespace-pre">
                        <span className="text-fg">{lang === 'js' ? 'let age = ' : 'let age: number = '}</span>
                        <span className={caught ? 'underline decoration-danger decoration-wavy underline-offset-4 text-fg' : 'text-fg'}>{v.literal}</span>
                    </div>
                    <div className={`whitespace-pre ${t.faint}`}>{'// ...中間經過很多程式...'}</div>
                    <div className="whitespace-pre text-fg">{'console.log(age + 1)'}</div>
                </pre>
            </div>

            <div className="min-h-[76px]">
                {caught ? (
                    <motion.div key={`ts-${vid}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-danger/50 bg-danger/10 px-3 py-2.5 font-mono text-xs leading-relaxed text-danger-text">
                        <div className="font-bold">在你執行之前就提醒了：</div>
                        Type {v.literal} is not assignable to type &apos;number&apos;.
                    </motion.div>
                ) : (
                    <motion.div key={`${lang}-${vid}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`rounded-lg border px-3 py-2.5 font-mono text-xs leading-relaxed ${v.ok ? 'border-success/50 bg-success/10 text-success-text' : 'border-warning/50 bg-warning/10 text-warning-text'}`}>
                        <div className="font-bold">執行結果：</div>
                        {v.js}
                    </motion.div>
                )}
            </div>

            <Verdict id={`${lang}-${vid}`}>
                {caught ? (
                    <>TypeScript 比較有機會提早說：<strong>欸，這裡好像怪怪的。</strong>AI 大量產生程式的時候，有人先幫你攔一些錯誤，很值得。</>
                ) : v.ok ? (
                    <>型別正確的時候，兩邊結果一樣，看不出差別。</>
                ) : (
                    <>JavaScript 很自由：程式照跑，只是答案悄悄變成 {v.js}。這種錯往往要到很後面才被發現。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
