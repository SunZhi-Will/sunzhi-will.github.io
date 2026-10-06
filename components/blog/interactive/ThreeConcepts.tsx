'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const CONCEPTS = [
    { icon: 'code' as const, name: '寫程式', sub: '用什麼語言、什麼工具寫' },
    { icon: 'box' as const, name: '部署', sub: '成品放到哪裡去' },
    { icon: 'play' as const, name: '在哪執行', sub: '程式實際在誰的機器上跑' },
];

const QUESTIONS = [
    { text: 'React 專案是不是要一直開著後端？', hits: [1, 2], say: '這是「部署」加「在哪執行」：打包後的 React 只是檔案，真正要一直開著的是後端程式。' },
    { text: '前端跟後端到底差在哪？', hits: [0, 2], say: '差別主要在「在哪執行」：前端在使用者的瀏覽器，後端在伺服器，兩邊負責的事情也不同。' },
    { text: '為什麼有時候要用 PM2，有時候不用？', hits: [1, 2], say: '看你的程式是不是需要一直活著的程序，以及誰在幫你顧它，這是「部署」與「在哪執行」的問題。' },
    { text: 'React 現在到底是用 JS 還是 TS？', hits: [0], say: '這只是「寫程式」時的選擇，跟程式放哪、在哪跑完全無關，最後都會變成 JavaScript。' },
];

/** 四個常見的疑問，其實分屬三個不同的概念 */
export function ThreeConcepts() {
    const t = useFrameTheme();
    const [q, setQ] = useState<number | null>(null);
    const hits = q === null ? [] : QUESTIONS[q].hits;

    return (
        <InteractiveFrame title="這些問題為什麼會混在一起？" hint="點一個問題，看它其實屬於哪個概念。">
            <div className="grid gap-2 sm:grid-cols-2">
                {QUESTIONS.map((item, i) => (
                    <button
                        key={item.text}
                        type="button"
                        aria-pressed={q === i}
                        onClick={() => setQ(i)}
                        className={`rounded-lg border px-3 py-2.5 text-left text-sm font-medium leading-snug transition-colors ${q === i ? t.chipOn : t.chip}`}
                    >
                        <span className="mr-1.5 opacity-70">Q{i + 1}</span>
                        {item.text}
                    </button>
                ))}
            </div>

            <div className="relative grid grid-cols-3 gap-2 sm:gap-3">
                {CONCEPTS.map((c, i) => {
                    const on = hits.includes(i);
                    return (
                        <motion.div
                            key={c.name}
                            animate={on ? { y: -6, scale: 1.04 } : { y: 0, scale: q === null ? 1 : 0.96 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                            className={`relative rounded-xl border-2 px-2 py-4 text-center transition-colors ${
                                on ? 'border-brand bg-brand/15' : `border-line ${q === null ? '' : 'opacity-60'} bg-surface`
                            }`}
                        >
                            {on && (
                                <motion.span
                                    aria-hidden="true"
                                    className="absolute inset-0 rounded-xl border-2 border-brand"
                                    initial={{ opacity: 0.8, scale: 1 }}
                                    animate={{ opacity: 0, scale: 1.18 }}
                                    transition={{ duration: 1.1, repeat: Infinity }}
                                />
                            )}
                            <Icon name={c.icon} className="mx-auto h-8 w-8" />
                            <div className={`mt-1.5 text-sm font-bold ${on ? t.accent : t.text}`}>{c.name}</div>
                            <div className={`mt-0.5 text-[11px] leading-tight ${t.sub}`}>{c.sub}</div>
                        </motion.div>
                    );
                })}
            </div>

            <Verdict id={q ?? 'idle'}>
                {q === null ? <>寫程式、部署、程式在哪執行，是三件不同的事。問題會混在一起很正常，因為它們常常同時出現。</> : QUESTIONS[q].say}
            </Verdict>
        </InteractiveFrame>
    );
}
