'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Note, Slider, Stage } from './kit';
import { InteractiveFrame } from './InteractiveFrame';

// sRGB 灰階的相對亮度，公式來自 WCAG
function luminance(v: number) {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

const MAX = 21;
const MARKS = [
    { at: 3, name: '大字' },
    { at: 4.5, name: '內文' },
    { at: 7, name: '最佳' },
];

// 對比值轉成刻度位置，用對數讓 1 到 21 平均分布
const place = (r: number) => (Math.log(r) / Math.log(MAX)) * 100;

/** 文字顏色從黑調到淺灰，看對比度什麼時候跌破標準 */
export function ContrastDial() {
    const [gray, setGray] = useState(190);
    const ratio = (1.05) / (luminance(gray) + 0.05);
    const hex = `#${gray.toString(16).padStart(2, '0').repeat(3)}`;
    const pass = ratio >= 4.5;

    return (
        <InteractiveFrame title="淺灰字，真的看得清楚嗎？" kicker="對比度" hint="白底上的文字越淺，對比度越低。網頁無障礙指引建議內文至少 4.5 : 1。">
            <Stage className="grid gap-5 p-4 sm:grid-cols-[1.2fr_1fr] sm:items-center sm:p-6">
                <div className="rounded-xl bg-white px-5 py-6" style={{ color: hex }}>
                    <div className="text-[22px] font-bold leading-tight">活動時間</div>
                    <div className="mt-1 text-[15px] leading-relaxed">10 月 18 日 14:00，台北信義區，免費參加。</div>
                </div>
                <div className="text-center sm:text-left">
                    <motion.div key={pass ? 'p' : 'f'} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`text-5xl font-black tabular-nums ${pass ? 'text-success-text' : 'text-danger-text'}`}>
                        {ratio.toFixed(1)}
                        <span className="text-2xl"> : 1</span>
                    </motion.div>
                    <div className="mt-1 font-mono text-xs font-bold text-fg-body">文字色 {hex}</div>
                </div>
            </Stage>

            <div className="relative h-10">
                <div className="absolute inset-x-0 top-3 h-[3px] rounded-full bg-gradient-to-r from-danger via-warning to-success opacity-70" />
                {MARKS.map((m) => (
                    <div key={m.at} className="absolute top-0 -translate-x-1/2 text-center" style={{ left: `${place(m.at)}%` }}>
                        <div className="mx-auto h-[15px] w-px bg-fg/40" />
                        <div className="mt-1 whitespace-nowrap text-[10px] font-bold text-fg-body">
                            {m.at} {m.name}
                        </div>
                    </div>
                ))}
                <motion.div
                    className="absolute top-[7px] h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-fg bg-canvas"
                    initial={false}
                    animate={{ left: `${place(ratio)}%` }}
                    transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                />
            </div>

            <Slider label="文字顏色" value={gray} min={0} max={235} onChange={setGray} display={gray < 60 ? '深' : gray < 150 ? '中灰' : '淺灰'} />
            <Note id={pass ? 'p' : 'f'}>
                {pass ? (
                    <>夠清楚了。很多 AI 產生的「質感灰字」其實落在 3 以下，在手機或陽光下幾乎讀不到。</>
                ) : (
                    <>
                        <strong className="text-fg">低於 4.5，內文就不夠清楚。</strong>看起來高級，讀起來吃力。
                    </>
                )}
            </Note>
        </InteractiveFrame>
    );
}
