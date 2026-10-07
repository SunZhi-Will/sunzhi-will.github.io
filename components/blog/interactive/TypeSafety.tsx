'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './icons';
import { Segmented, Window } from './kit';
import { JavaScriptLogo, TypeScriptLogo } from './logos';
import { InteractiveFrame, Verdict } from './InteractiveFrame';

type Vid = 'num' | 'str' | 'zh';

const VALUES: Record<Vid, { literal: string; js: string; ok: boolean }> = {
    num: { literal: '18', js: '19', ok: true },
    str: { literal: '"18"', js: '"181"', ok: false },
    zh: { literal: '"十八歲"', js: '"十八歲1"', ok: false },
};

function Code({ ts, literal, squiggle }: { ts: boolean; literal: string; squiggle: boolean }) {
    return (
        <div className="px-1 py-2 font-mono text-[12px] leading-7 sm:py-3 sm:text-[13px]">
            <div className="flex whitespace-pre">
                <span className="mr-3 w-5 select-none text-right text-xs leading-7 text-fg-body">1</span>
                <span className="text-brand-text">let</span>
                <span className="text-fg"> age</span>
                {ts && <span className="text-info-text">: number</span>}
                <span className="text-fg"> = </span>
                <span className={`text-success-text ${squiggle ? 'underline decoration-danger decoration-wavy decoration-2 underline-offset-4' : ''}`}>{literal}</span>
            </div>
            <div className="hidden whitespace-pre sm:flex">
                <span className="mr-3 w-5 select-none text-right text-xs leading-7 text-fg-body">2</span>
                <span className="text-fg-body">{'// …中間經過很多程式…'}</span>
            </div>
            <div className="flex whitespace-pre">
                <span className="mr-3 w-5 select-none text-right text-xs leading-7 text-fg-body"><span className="sm:hidden">2</span><span className="hidden sm:inline">3</span></span>
                <span className="text-info-text">console</span>
                <span className="text-fg">.log(age + 1)</span>
            </div>
        </div>
    );
}

/** AI 寫的程式不小心把數字變成字串：JavaScript 讓它過，TypeScript 先提醒 */
export function TypeSafety() {
    const [vid, setVid] = useState<Vid>('zh');
    const v = VALUES[vid];

    return (
        <InteractiveFrame title="age 不小心變成文字，誰會先發現？" kicker="並排對照" hint="換一個 age 的值，比較兩邊的反應。">
            <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-fg">age 的值</span>
                <Segmented
                    id="type-safety"
                    label="age 的值"
                    value={vid}
                    onChange={setVid}
                    options={[
                        { value: 'num', label: '18' },
                        { value: 'str', label: '"18"' },
                        { value: 'zh', label: '"十八歲"' },
                    ]}
                />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                <Window title="app.js" logo={JavaScriptLogo} tone={v.ok ? 'success' : 'default'}>
                    <Code ts={false} literal={v.literal} squiggle={false} />
                    <div className="border-t border-line bg-surface-raised px-3 py-2.5">
                        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.12em] text-fg-body">
                            <Icon name="play" className="h-3 w-3" />執行結果
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div key={vid} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`font-mono text-base font-black ${v.ok ? 'text-success-text' : 'text-warning-text'}`}>
                                {v.js}
                                {!v.ok && <span className="ml-2 font-sans text-xs font-bold">程式照跑，答案錯了</span>}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </Window>

                <Window title="app.ts" logo={TypeScriptLogo} tone={v.ok ? 'success' : 'danger'}>
                    <Code ts literal={v.literal} squiggle={!v.ok} />
                    <div className={`border-t px-3 py-2.5 ${v.ok ? 'border-line bg-surface-raised' : 'border-danger/40 bg-danger/10'}`}>
                        <div className={`mb-1 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.12em] ${v.ok ? 'text-fg-body' : 'text-danger-text'}`}>
                            <Icon name={v.ok ? 'play' : 'warn'} className="h-3 w-3" />
                            {v.ok ? '執行結果' : '執行之前就提醒'}
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div key={vid} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`font-mono font-black ${v.ok ? 'text-base text-success-text' : 'text-xs leading-relaxed text-danger-text'}`}>
                                {v.ok ? '19' : `Type ${v.literal} is not assignable to type 'number'.`}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </Window>
            </div>

            <Verdict id={vid}>
                {v.ok ? (
                    <>型別正確的時候，兩邊結果一樣，看不出差別。換成文字試試看。</>
                ) : (
                    <>
                        JavaScript 很自由，答案悄悄變成 {v.js}；TypeScript 比較有機會提早說：<strong>欸，這裡好像怪怪的。</strong>AI 大量產生程式的時候，有人先攔一道很值得。
                    </>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
