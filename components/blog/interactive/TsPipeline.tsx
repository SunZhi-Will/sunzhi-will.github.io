'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon, type IconName } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const STAGES: { icon: IconName; name: string; sub: string }[] = [
    { icon: 'code', name: '你寫的 .ts', sub: 'TypeScript 原始碼' },
    { icon: 'shield', name: '型別檢查', sub: '提早抓錯' },
    { icon: 'cog', name: '轉成 JavaScript', sub: '拿掉型別' },
    { icon: 'doc', name: 'app.js', sub: '打包後的檔案' },
    { icon: 'globe', name: '瀏覽器執行', sub: '只認得 JavaScript' },
];

/** TypeScript 從原始碼到瀏覽器的旅程：型別只存在於寫程式的時候 */
export function TsPipeline() {
    const t = useFrameTheme();
    const [bad, setBad] = useState(false);
    const [pos, setPos] = useState(0); // 目前走到第幾站，-1 不動
    const stopAt = bad ? 1 : STAGES.length - 1;

    useEffect(() => {
        if (pos < 0 || pos >= stopAt) return;
        const timer = setTimeout(() => setPos((p) => p + 1), 800);
        return () => clearTimeout(timer);
    }, [pos, stopAt]);

    const play = (nextBad: boolean) => {
        setBad(nextBad);
        setPos(0);
    };

    const finished = pos >= stopAt;

    return (
        <InteractiveFrame title="TypeScript 是怎麼變成網頁程式的？" hint="選一份程式，看它在流程裡走到哪裡。">
            <div className="flex flex-wrap gap-2">
                {[false, true].map((v) => (
                    <button
                        key={String(v)}
                        type="button"
                        aria-pressed={bad === v}
                        onClick={() => play(v)}
                        className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${bad === v ? t.chipOn : t.chip}`}
                    >
                        {v ? '有型別錯誤的程式' : '寫對的程式'}
                    </button>
                ))}
            </div>

            <div className={`rounded-lg border p-3 sm:p-4 ${t.inset}`}>
                <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
                    {STAGES.map((s, i) => {
                        const passed = pos > i;
                        const here = pos === i;
                        const failed = bad && i === 1 && pos >= 1;
                        const unreachable = bad && i > 1;
                        return (
                            <div key={s.name} className="flex flex-col items-stretch gap-2 md:flex-1 md:flex-row md:items-center">
                                <motion.div
                                    animate={failed ? { x: [0, -6, 6, -4, 4, 0] } : here ? { scale: 1.05 } : { scale: 1, x: 0 }}
                                    transition={{ duration: failed ? 0.4 : 0.25 }}
                                    className={`flex-1 rounded-lg border-2 px-2 py-3 text-center transition-colors ${
                                        failed ? 'border-danger bg-danger/10' : passed ? 'border-success bg-success/10' : here ? 'border-brand bg-brand/15' : 'border-line bg-surface'
                                    } ${unreachable && finished ? 'opacity-35' : ''}`}
                                >
                                    <Icon name={failed ? 'warn' : s.icon} className={`mx-auto h-6 w-6 ${failed ? 'text-danger' : 'text-fg'}`} />
                                    <div className={`mt-1 text-xs font-bold leading-tight ${t.text}`}>{s.name}</div>
                                    <div className={`text-[11px] leading-tight ${t.sub}`}>{failed ? '發現型別錯誤' : s.sub}</div>
                                </motion.div>
                                {i < STAGES.length - 1 && (
                                    <span aria-hidden="true" className={`text-center text-sm ${passed ? 'text-success' : t.faint}`}>
                                        <span className="md:hidden">↓</span>
                                        <span className="hidden md:inline">→</span>
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button type="button" onClick={() => play(bad)} className={`rounded-full px-4 py-2 text-sm font-semibold ${t.button}`}>
                    重播
                </button>
            </div>

            <Verdict id={`${bad}-${finished}`}>
                {!finished ? (
                    <>程式正在流程裡一站一站往下走…</>
                ) : bad ? (
                    <>型別檢查在這裡就把問題抓出來了，後面的步驟根本還沒開始。多數專案會讓建置在這一步失敗，你得先改好才能上線。</>
                ) : (
                    <>通過檢查之後，型別會被拿掉，轉成一般的 JavaScript。<strong>瀏覽器看到的永遠只有 JavaScript，型別只存在於寫程式的時候。</strong></>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
