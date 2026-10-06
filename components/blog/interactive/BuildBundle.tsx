'use client'

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const SOURCES = ['App.tsx', 'Login.tsx', 'Cart.tsx', 'api.ts', 'utils.ts', 'theme.css', 'logo.png'];
const OUTPUTS = [
    { name: 'index.html', size: '1 KB' },
    { name: 'app.js', size: '148 KB' },
    { name: 'style.css', size: '6 KB' },
];

type Phase = 'idle' | 'building' | 'done';

/** npm run build：一堆原始檔變成三個普通檔案 */
export function BuildBundle() {
    const t = useFrameTheme();
    const [phase, setPhase] = useState<Phase>('idle');

    useEffect(() => {
        if (phase !== 'building') return;
        const timer = setTimeout(() => setPhase('done'), 2200);
        return () => clearTimeout(timer);
    }, [phase]);

    return (
        <InteractiveFrame title="npm run build 到底做了什麼？" hint="按下按鈕，看專案怎麼被打包。">
            <div className={`grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-lg border p-3 sm:gap-4 sm:p-4 ${t.inset}`}>
                {/* 原始檔 */}
                <div>
                    <div className={`mb-2 flex items-center gap-1.5 text-xs font-bold ${t.text}`}><Icon name="folder" className="h-4 w-4" />src/（你寫的程式）</div>
                    <div className="flex flex-col items-start gap-1.5">
                        {SOURCES.map((name, i) => (
                            <motion.span
                                key={name}
                                initial={false}
                                animate={
                                    phase === 'building'
                                        ? { x: '90%', opacity: 0, scale: 0.4 }
                                        : phase === 'done'
                                          ? { x: 0, opacity: 0.35, scale: 1 }
                                          : { x: 0, opacity: 1, scale: 1 }
                                }
                                transition={{ duration: 0.6, delay: phase === 'building' ? i * 0.12 : 0 }}
                                className="rounded border border-line-strong bg-surface px-2 py-1 font-mono text-[11px] text-fg"
                            >
                                {name}
                            </motion.span>
                        ))}
                    </div>
                </div>

                {/* 打包機 */}
                <div className="flex flex-col items-center gap-2">
                    <motion.div
                        animate={phase === 'building' ? { rotate: 360 } : { rotate: 0 }}
                        transition={phase === 'building' ? { duration: 1.2, repeat: Infinity, ease: 'linear' } : { duration: 0.4 }}
                        className="text-brand-text"
                    >
                        <Icon name="cog" className="h-11 w-11 sm:h-14 sm:w-14" />
                    </motion.div>
                    <div className="h-1.5 w-14 overflow-hidden rounded-full bg-fg/10 sm:w-20">
                        <motion.div
                            className="h-full rounded-full bg-brand"
                            initial={false}
                            animate={{ width: phase === 'idle' ? '0%' : phase === 'building' ? '85%' : '100%' }}
                            transition={{ duration: phase === 'building' ? 2 : 0.3 }}
                        />
                    </div>
                    <div className={`text-[11px] font-semibold ${t.sub}`}>{phase === 'idle' ? '待命' : phase === 'building' ? '打包中' : '完成'}</div>
                </div>

                {/* 成品 */}
                <div>
                    <div className={`mb-2 flex items-center gap-1.5 text-xs font-bold ${t.text}`}><Icon name="box" className="h-4 w-4" />dist/（成品）</div>
                    <div className="flex min-h-[110px] flex-col gap-1.5">
                        <AnimatePresence>
                            {phase === 'done' &&
                                OUTPUTS.map((o, i) => (
                                    <motion.span
                                        key={o.name}
                                        initial={{ opacity: 0, x: -30, scale: 0.7 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 260, damping: 16, delay: i * 0.15 }}
                                        className="flex items-center justify-between gap-2 rounded border border-brand/50 bg-brand/15 px-2 py-1.5 font-mono text-[11px] font-bold text-fg"
                                    >
                                        <span>{o.name}</span>
                                        <span className="font-sans text-[10px] font-medium text-brand-text">{o.size}</span>
                                    </motion.span>
                                ))}
                        </AnimatePresence>
                        {phase !== 'done' && <div className={`rounded border border-dashed border-line-strong px-2 py-6 text-center text-[11px] ${t.faint}`}>還沒有成品</div>}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    disabled={phase === 'building'}
                    onClick={() => setPhase('building')}
                    className={`rounded-full px-4 py-2 font-mono text-sm font-semibold disabled:opacity-50 ${t.button}`}
                >
                    {phase === 'done' ? '再打包一次' : 'npm run build'}
                </button>
            </div>

            <Verdict id={phase}>
                {phase === 'idle' ? (
                    <>專案裡有一堆你寫的檔案：TypeScript、元件、CSS、圖片。瀏覽器看不懂其中大部分。</>
                ) : phase === 'building' ? (
                    <>打包工具把 TypeScript 和 JSX 轉成瀏覽器看得懂的 JavaScript，再把檔案合併、壓縮。</>
                ) : (
                    <>
                        成品只剩<strong>三個普通檔案</strong>，跟圖片、HTML 沒什麼不同。它們可以丟到任何能放檔案的地方。
                    </>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
