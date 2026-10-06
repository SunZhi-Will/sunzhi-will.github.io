'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

type Lang = 'js' | 'ts';

const EXAMPLES: {
    name: string;
    js: string[];
    ts: string[];
    tsErrorLine: number;
    tsError: string;
    jsResult: { ok: boolean; text: string };
}[] = [
    {
        name: '年齡變成文字',
        js: ['let age = 18;', 'age = "十八歲";', 'console.log(age + 1);'],
        ts: ['let age: number = 18;', 'age = "十八歲";', 'console.log(age + 1);'],
        tsErrorLine: 1,
        tsError: '不能把 string 指派給 number 型別的變數',
        jsResult: { ok: true, text: '輸出：十八歲1（沒有報錯，但結果根本不是你要的）' },
    },
    {
        name: '加法算出怪結果',
        js: ['function add(a, b) {', '  return a + b;', '}', 'add(1, "2");'],
        ts: ['function add(a: number, b: number) {', '  return a + b;', '}', 'add(1, "2");'],
        tsErrorLine: 3,
        tsError: '參數 "2" 是 string，但這裡要的是 number',
        jsResult: { ok: true, text: '輸出："12"（1 加 2 變成字串相連）' },
    },
    {
        name: '打錯欄位名稱',
        js: ['const user = { name: "Sun" };', 'console.log(user.nmae.length);'],
        ts: ['const user = { name: "Sun" };', 'console.log(user.nmae.length);'],
        tsErrorLine: 1,
        tsError: '型別上沒有 nmae 這個屬性，你是不是想寫 name？',
        jsResult: { ok: false, text: '執行時才爆炸：TypeError，無法讀取 undefined 的 length' },
    },
];

/** 同一段程式，JavaScript 和 TypeScript 什麼時候發現問題 */
export function JsVsTs() {
    const t = useFrameTheme();
    const [example, setExample] = useState(0);
    const [lang, setLang] = useState<Lang>('ts');
    const [ran, setRan] = useState(false);

    const data = EXAMPLES[example];
    const lines = lang === 'js' ? data.js : data.ts;

    const changeLang = (next: Lang) => {
        setLang(next);
        setRan(false);
    };

    const changeExample = (index: number) => {
        setExample(index);
        setRan(false);
    };

    return (
        <InteractiveFrame title="同一段程式，錯誤什麼時候被發現？" hint="切換 JavaScript 與 TypeScript，再按執行看看。">
            <div className="flex flex-wrap items-center gap-2">
                {EXAMPLES.map((item, i) => (
                    <button
                        key={item.name}
                        type="button"
                        aria-pressed={example === i}
                        onClick={() => changeExample(i)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${example === i ? t.chipOn : t.chip}`}
                    >
                        {item.name}
                    </button>
                ))}
                <div role="group" aria-label="語言" className={`ml-auto inline-flex rounded-full border p-0.5 ${t.inset}`}>
                    {(['js', 'ts'] as const).map((l) => (
                        <button
                            key={l}
                            type="button"
                            aria-pressed={lang === l}
                            onClick={() => changeLang(l)}
                            className={`relative rounded-full px-3 py-1 text-xs font-bold ${lang === l ? 'text-brand-on' : t.sub}`}
                        >
                            {lang === l && <motion.span layoutId="jsts-pill" className="absolute inset-0 rounded-full bg-brand" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                            <span className="relative">{l === 'js' ? 'JavaScript' : 'TypeScript'}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className={`overflow-hidden rounded-lg border font-mono text-[13px] ${t.inset}`}>
                <div className="px-3 py-3 sm:px-4">
                    {lines.map((line, i) => {
                        const bad = lang === 'ts' && i === data.tsErrorLine;
                        return (
                            <div key={`${lang}-${i}`}>
                                <div className="flex gap-3">
                                    <span className={`w-4 shrink-0 select-none text-right ${t.faint}`}>{i + 1}</span>
                                    <span className={`whitespace-pre-wrap break-all ${t.text} ${bad ? 'underline decoration-danger decoration-wavy decoration-2 underline-offset-4' : ''}`}>
                                        {line}
                                    </span>
                                </div>
                                <AnimatePresence>
                                    {bad && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden pl-7"
                                        >
                                            <div className="mt-1.5 rounded-md border border-danger/40 bg-danger/10 px-2.5 py-1.5 font-sans text-xs text-danger-text">
                                                還沒執行就提醒你：{data.tsError}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
                <div className={`flex items-center gap-3 border-t px-3 py-2 ${t.divider}`}>
                    <button type="button" onClick={() => setRan(true)} className={`rounded px-3 py-1 font-sans text-xs font-semibold ${t.button}`}>
                        <Icon name="play" className="mr-1 inline h-3 w-3 align-text-bottom" />執行
                    </button>
                    <AnimatePresence mode="wait">
                        {ran && (
                            <motion.span
                                key={lang + example}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className={`font-sans text-xs ${data.jsResult.ok && lang === 'js' ? 'text-warning-text' : lang === 'js' ? 'text-danger-text' : t.sub}`}
                            >
                                {lang === 'js' ? data.jsResult.text : '編輯器早就標出問題了，改完再跑，就不會踩到上面那個結果。'}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <Verdict id={lang + String(ran)}>
                {lang === 'ts' ? (
                    <>
                        TypeScript 多了一套<strong>型別系統</strong>，在你寫程式的當下就能抓到很多錯誤。它最後仍會被轉成 JavaScript 才執行。
                    </>
                ) : (
                    <>JavaScript 不會事先提醒你，錯誤要等程式真的跑到那一行才知道，有時候連錯都不報，只是悄悄給你錯的答案。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
