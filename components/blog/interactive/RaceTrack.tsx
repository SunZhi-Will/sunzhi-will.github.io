'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const HURDLES = [
    { name: '知道自己在做什麼', text: '能說出這個功能為什麼能跑，哪裡可能壞。' },
    { name: '判斷 AI 的答案', text: 'AI 講得很有自信，但你要能分辨它是對的、過度複雜的，還是根本走錯方向。' },
    { name: 'Debug', text: '出錯時先定位，而不是一路叫 AI 重寫。' },
    { name: '設計架構', text: '資料放哪裡、誰負責什麼、之後怎麼擴充。AI 能提案，取捨要有人做。' },
    { name: '理解使用者', text: '做得出來不等於有人要用。真正的需求在人身上，不在程式碼裡。' },
    { name: '把問題拆清楚', text: '好的問題會得到好的答案，也會讓大問題變成幾個小問題。' },
    { name: '持續自學', text: '工具一直在變，能自己把新東西弄懂的人，不會被淘汰。' },
];

/** AI 把起跑線往前搬，終點沒有消失 */
export function RaceTrack() {
    const t = useFrameTheme();
    const [ai, setAi] = useState(false);
    const [sel, setSel] = useState(0);

    return (
        <InteractiveFrame title="起跑線往前，終點還在原地" kicker="示意圖" hint="按「有 AI」看起跑線怎麼移動，再點中間的關卡。">
            <div className="flex items-center gap-2">
                <div role="group" aria-label="有沒有 AI" className={`inline-flex rounded-full border p-0.5 ${t.inset}`}>
                    {[false, true].map((v) => (
                        <button key={String(v)} type="button" aria-pressed={ai === v} onClick={() => setAi(v)} className={`relative rounded-full px-3.5 py-1 text-xs font-bold ${ai === v ? 'text-brand-on' : t.sub}`}>
                            {ai === v && <motion.span layoutId="race-pill" className="absolute inset-0 rounded-full bg-brand" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                            <span className="relative">{v ? '有 AI' : '沒有 AI'}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className={`rounded-lg border px-3 pb-3 pt-9 ${t.inset}`}>
                <div className="relative h-3 rounded-full bg-fg/10">
                    <motion.div className="absolute inset-y-0 left-0 rounded-full bg-brand/50" initial={false} animate={{ left: ai ? '34%' : '0%' }} transition={{ type: 'spring', stiffness: 80, damping: 16 }} style={{ right: '0%' }} />
                    <motion.div className="absolute -top-8" initial={false} animate={{ left: ai ? '34%' : '0%' }} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
                        <div className="-translate-x-0 whitespace-nowrap text-[11px] font-bold text-brand-text"><Icon name="rocket" className="mr-1 inline h-3.5 w-3.5 align-text-bottom" />起跑</div>
                        <div className="ml-1 h-11 w-0.5 bg-brand" />
                    </motion.div>
                    <div className="absolute -top-8 right-0 text-right">
                        <div className="whitespace-nowrap text-[11px] font-bold text-success-text"><Icon name="flag" className="mr-1 inline h-3.5 w-3.5 align-text-bottom" />做好、做對、做得久</div>
                        <div className="ml-auto mr-1 h-11 w-0.5 bg-success" />
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                    {HURDLES.map((h, i) => (
                        <button key={h.name} type="button" aria-pressed={sel === i} onClick={() => setSel(i)} className={`rounded-md border px-2 py-1.5 text-left text-[11px] font-semibold leading-snug transition-colors ${sel === i ? t.chipOn : t.chip}`}>
                            {h.name}
                        </button>
                    ))}
                </div>
            </div>

            <Verdict id={`${sel}-${ai}`}>
                <strong>{HURDLES[sel].name}：</strong>
                {HURDLES[sel].text}
                {ai && sel === 0 && <> 起跑線前進了，但這些關卡一個都沒少。</>}
            </Verdict>
        </InteractiveFrame>
    );
}
