'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

/** 檔案放在哪，和程式在哪執行，是兩件事 */
export function StoredVsRuns() {
    const t = useFrameTheme();
    const [mode, setMode] = useState<'stored' | 'runs'>('stored');
    const runs = mode === 'runs';

    return (
        <InteractiveFrame title="「放在哪」和「在哪執行」" hint="切換兩個問題，看同樣兩個東西的位置怎麼變。">
            <div role="group" aria-label="問題" className={`inline-flex rounded-full border p-0.5 ${t.inset}`}>
                {(
                    [
                        ['stored', '檔案放在哪？'],
                        ['runs', '程式在哪執行？'],
                    ] as const
                ).map(([key, label]) => (
                    <button
                        key={key}
                        type="button"
                        aria-pressed={mode === key}
                        onClick={() => setMode(key)}
                        className={`relative rounded-full px-3.5 py-1.5 text-xs font-bold ${mode === key ? 'text-brand-on' : t.sub}`}
                    >
                        {mode === key && <motion.span layoutId="stored-pill" className="absolute inset-0 rounded-full bg-brand" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                        <span className="relative">{label}</span>
                    </button>
                ))}
            </div>

            <div className="relative h-[330px] overflow-hidden rounded-lg">
                {/* 兩個區域 */}
                <div className="absolute inset-x-0 top-0 h-[150px] rounded-lg border-2 border-dashed border-brand/50 bg-surface-sunken px-3 py-2">
                    <div className={`flex items-center gap-1.5 text-xs font-bold ${t.text}`}><Icon name="building" className="h-4 w-4" />伺服器</div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-[150px] rounded-lg border-2 border-info/50 bg-surface-sunken px-3 py-2">
                    <div className={`flex items-center gap-1.5 text-xs font-bold ${t.text}`}><Icon name="phone" className="h-4 w-4" />使用者的瀏覽器</div>
                </div>

                {/* 往下的箭頭 */}
                <motion.div
                    aria-hidden="true"
                    className="absolute left-1/2 top-[153px] -translate-x-1/2 text-xs font-bold text-brand-text"
                    animate={runs ? { opacity: [0.2, 1, 0.2], y: [0, 8, 0] } : { opacity: 0 }}
                    transition={{ duration: 1.2, repeat: runs ? Infinity : 0 }}
                >
                    <span className="inline-flex items-center gap-1"><Icon name="down" className="h-4 w-4" />傳給瀏覽器</span>
                </motion.div>

                {/* 前端檔案：放在伺服器，執行時搬到瀏覽器 */}
                <motion.div
                    initial={false}
                    animate={{ top: runs ? 224 : 44 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 17 }}
                    className={`absolute left-[4%] w-[44%] rounded-lg border-2 px-2 py-3 text-center ${runs ? 'border-success' : 'border-line-strong'} bg-surface`}
                >
                    <div className="font-mono text-xs font-bold text-fg">app.js</div>
                    <div className={`text-[11px] ${t.sub}`}>前端程式</div>
                    <motion.div key={mode} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className={`mt-1 text-[11px] font-bold ${runs ? 'text-success-text' : 'text-brand-text'}`}>
                        {runs ? '執行中' : '靜靜放著'}
                    </motion.div>
                </motion.div>
                {/* 留在伺服器的殘影 */}
                <motion.div
                    aria-hidden="true"
                    initial={false}
                    animate={{ opacity: runs ? 0.4 : 0 }}
                    className="absolute left-[4%] top-[44px] w-[44%] rounded-lg border border-dashed border-line-strong px-2 py-3 text-center"
                >
                    <div className="font-mono text-xs text-fg-muted">app.js</div>
                    <div className="text-[11px] text-fg-muted">檔案還在這裡</div>
                </motion.div>

                {/* 後端程式：放在哪就在哪執行 */}
                <div className={`absolute right-[4%] top-[44px] w-[44%] rounded-lg border-2 px-2 py-3 text-center ${runs ? 'border-success' : 'border-line-strong'} bg-surface`}>
                    <div className="font-mono text-xs font-bold text-fg">server.js</div>
                    <div className={`text-[11px] ${t.sub}`}>後端程式</div>
                    <motion.div key={mode + 'b'} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className={`mt-1 text-[11px] font-bold ${runs ? 'text-success-text' : 'text-brand-text'}`}>
                        {runs ? '在這裡執行' : '靜靜放著'}
                    </motion.div>
                </div>
            </div>

            <Verdict id={mode}>
                {runs ? (
                    <>
                        前端程式被下載到<strong>使用者的瀏覽器</strong>才開始跑，後端程式則留在<strong>伺服器</strong>上執行。同樣放在伺服器，執行的地方卻不同。
                    </>
                ) : (
                    <>前後端的程式碼都是「放」在伺服器上。如果只問檔案放在哪，它們一模一樣。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
