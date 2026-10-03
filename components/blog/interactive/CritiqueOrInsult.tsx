'use client'

import { useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const LINES = [
    { id: 'ui', text: '這個 UI 做得很爛。', about: 'work' },
    { id: 'engineer', text: '你不配當工程師。', about: 'person' },
    { id: 'character', text: '這個角色設計太像。', about: 'work' },
    { id: 'literate', text: '你是不是不識字？', about: 'person' },
    { id: 'glider', text: '這個滑翔翼太接近 Cube World。', about: 'work' },
    { id: 'brain', text: '有點腦子的人都看得出來。', about: 'person' },
    { id: 'ugly', text: '畫面超醜。', about: 'work' },
    { id: 'delusion', text: '你有被害幻想？', about: 'person' },
    { id: 'logic', text: '邏輯死。', about: 'person', mine: true },
] as const;

type Line = (typeof LINES)[number];

const SPRING = { type: 'spring', stiffness: 260, damping: 26 } as const;

/** 用一個問題把留言分成兩堆：談作品的，跟談人的 */
export function CritiqueOrInsult() {
    const t = useFrameTheme();
    const [sorted, setSorted] = useState(false);

    const card = (line: Line, index: number) => {
        const person = line.about === 'person';
        const tone = !sorted
            ? t.chip
            : person
                ? 'border-danger/30 bg-danger/10 text-danger-text'
                : t.accentSoft;

        return (
            <motion.span
                key={line.id}
                layoutId={`line-${line.id}`}
                layout
                transition={{ ...SPRING, delay: sorted ? index * 0.03 : 0 }}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium ${tone}`}
            >
                「{line.text}」
                {'mine' in line && sorted && (
                    <span className="rounded bg-black/20 px-1 py-0.5 text-[10px]">這句是我講的</span>
                )}
            </motion.span>
        );
    };

    return (
        <InteractiveFrame
            title="同一串留言，其實是兩種東西"
            hint="這些句子混在一起的時候，看起來都像是在「批評」。"
        >
            <LayoutGroup>
                {sorted ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                        {(['work', 'person'] as const).map((about) => (
                            <div key={about} className={`rounded-lg border p-3 ${t.inset}`}>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="mb-3"
                                >
                                    <div className={`text-sm font-semibold ${t.text}`}>
                                        {about === 'work' ? '在談作品' : '在談你這個人'}
                                    </div>
                                    <div className={`text-xs ${t.sub}`}>
                                        {about === 'work' ? '可以放兩張圖來驗證' : '跟有沒有抄襲無關'}
                                    </div>
                                </motion.div>
                                <div className="flex flex-col items-start gap-2">
                                    {LINES.filter((line) => line.about === about).map(card)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={`flex flex-wrap gap-2 rounded-lg border p-3 ${t.inset}`}>{LINES.map(card)}</div>
                )}
            </LayoutGroup>

            <motion.button
                type="button"
                onClick={() => setSorted((v) => !v)}
                whileTap={{ scale: 0.97 }}
                className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${t.button}`}
            >
                {sorted ? '打散重來' : '問一個問題：這句話，能用兩張截圖驗證嗎？'}
            </motion.button>

            {sorted && (
                <Verdict id="sorted">
                    左邊再刺耳，都還是可以討論的作品批評。右邊不管講得多大聲，都證明不了任何跟抄襲有關的事。
                </Verdict>
            )}
        </InteractiveFrame>
    );
}
