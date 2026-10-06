'use client'

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

type Status = 'alive' | 'dead' | 'restarting';

/** 讓後端當機，看有沒有 PM2 顧著的差別 */
export function Pm2Guardian() {
    const t = useFrameTheme();
    const [pm2, setPm2] = useState(false);
    const [status, setStatus] = useState<Status>('alive');
    const [uptime, setUptime] = useState(0);
    const [restarts, setRestarts] = useState(0);
    const [crashed, setCrashed] = useState(false);

    // 活著的時候每秒累加運行時間
    useEffect(() => {
        if (status !== 'alive') return;
        const timer = setInterval(() => setUptime((u) => u + 1), 1000);
        return () => clearInterval(timer);
    }, [status]);

    // 有 PM2 時，死掉之後自動重啟
    useEffect(() => {
        if (status !== 'dead' || !pm2) return;
        const toRestarting = setTimeout(() => setStatus('restarting'), 700);
        return () => clearTimeout(toRestarting);
    }, [status, pm2]);

    useEffect(() => {
        if (status !== 'restarting') return;
        const timer = setTimeout(() => {
            setStatus('alive');
            setUptime(0);
            setRestarts((r) => r + 1);
        }, 1200);
        return () => clearTimeout(timer);
    }, [status]);

    const crash = () => {
        if (status !== 'alive') return;
        setCrashed(true);
        setStatus('dead');
    };

    const manualRestart = () => {
        setStatus('restarting');
    };

    const light = status === 'alive' ? 'bg-success' : status === 'dead' ? 'bg-danger' : 'bg-warning';
    const label = status === 'alive' ? '運行中' : status === 'dead' ? '已經當機' : '重新啟動中…';

    return (
        <InteractiveFrame title="PM2 到底在顧什麼？" hint="先試試沒有 PM2 的情況，再把它打開，各讓後端當機一次。">
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr]">
                {/* Node 後端 */}
                <div className={`rounded-lg border p-3 ${t.inset}`}>
                    <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${t.text}`}>Node.js 後端</span>
                        <span className="flex items-center gap-1.5 text-xs">
                            <motion.span
                                className={`h-2.5 w-2.5 rounded-full ${light}`}
                                animate={status === 'alive' ? { scale: [1, 1.5, 1], opacity: [1, 0.6, 1] } : { scale: 1, opacity: 1 }}
                                transition={{ duration: 1.4, repeat: status === 'alive' ? Infinity : 0 }}
                            />
                            <span className={t.sub}>{label}</span>
                        </span>
                    </div>
                    {/* 心跳 */}
                    <svg viewBox="0 0 120 28" preserveAspectRatio="none" className="mt-3 h-7 w-full" aria-hidden="true">
                        <motion.polyline
                            points="0,14 24,14 30,4 38,24 44,14 70,14 76,4 84,24 90,14 120,14"
                            fill="none"
                            strokeWidth="2"
                            strokeLinejoin="round"
                            className={status === 'alive' ? 'stroke-success' : 'stroke-danger'}
                            initial={false}
                            animate={status === 'alive' ? { pathLength: [0, 1], opacity: 1 } : { pathLength: 1, opacity: 0.5 }}
                            transition={status === 'alive' ? { duration: 1.4, repeat: Infinity, ease: 'linear' } : { duration: 0.3 }}
                        />
                        {status !== 'alive' && <line x1="0" y1="14" x2="120" y2="14" className="stroke-danger" strokeWidth="2" />}
                    </svg>
                    <div className={`mt-2 flex justify-between text-xs ${t.sub}`}>
                        <span>已運行 {status === 'alive' ? uptime : 0} 秒</span>
                        <span>重啟 {restarts} 次</span>
                    </div>
                </div>

                {/* 前端畫面 */}
                <div className={`rounded-lg border p-3 ${t.inset}`}>
                    <div className={`text-sm font-semibold ${t.text}`}>網站畫面（React）</div>
                    <div className="mt-3 min-h-[68px]">
                        <AnimatePresence mode="wait" initial={false}>
                            {status === 'alive' ? (
                                <motion.div key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-1.5">
                                    <div className="h-2.5 w-4/5 rounded bg-success/40" />
                                    <div className="h-2.5 w-3/5 rounded bg-success/40" />
                                    <div className="text-xs text-success-text">資料載入成功</div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="bad"
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="rounded-md border border-danger/40 bg-danger/10 px-2.5 py-2 text-xs text-danger-text"
                                >
                                    呼叫 API 沒有人回
                                    <br />
                                    <span className="mt-0.5 flex items-center gap-1 font-semibold"><Icon name="warn" className="h-3.5 w-3.5" />網站壞了</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* React 靜態檔 */}
                <div className={`rounded-lg border p-3 ${t.inset}`}>
                    <div className={`text-sm font-semibold ${t.text}`}>React 打包後的檔案</div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {['index.html', 'app.js', 'style.css'].map((f) => (
                            <span key={f} className="rounded border border-line-strong bg-surface px-1.5 py-0.5 font-mono text-[11px] text-fg">
                                {f}
                            </span>
                        ))}
                    </div>
                    <div className={`mt-3 text-xs leading-relaxed ${t.sub}`}>只是檔案，沒有程序在跑，所以也沒有東西可以「當機」，不需要誰來顧。</div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    role="switch"
                    aria-checked={pm2}
                    disabled={status !== 'alive'}
                    onClick={() => setPm2((v) => !v)}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors disabled:opacity-50 ${pm2 ? t.chipOn : t.chip}`}
                >
                    <span className={`h-2 w-2 rounded-full ${pm2 ? 'bg-brand-on' : 'bg-fg-muted'}`} />
                    PM2 守護：{pm2 ? '開' : '關'}
                </button>
                <motion.button
                    type="button"
                    disabled={status !== 'alive'}
                    onClick={crash}
                    whileTap={{ scale: 0.94 }}
                    className="rounded-full bg-danger px-4 py-1.5 text-sm font-semibold text-canvas transition-opacity disabled:opacity-40"
                >
                    讓後端當機
                </motion.button>
                {status === 'dead' && !pm2 && (
                    <motion.button
                        type="button"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={manualRestart}
                        className={`rounded-full border px-4 py-1.5 text-sm font-medium ${t.ghost}`}
                    >
                        手動重啟（得自己登入伺服器）
                    </motion.button>
                )}
            </div>

            <Verdict id={`${status}-${pm2}-${crashed}`}>
                {status === 'dead' && !pm2 ? (
                    <>沒有人在顧，後端就這樣躺著，網站一直壞到你發現為止。</>
                ) : status === 'restarting' ? (
                    <>PM2 發現程序死了，正在把它重新叫醒。</>
                ) : crashed && pm2 ? (
                    <>PM2 自動把後端救回來了，重啟次數加一。<strong>它顧的是 Node.js 後端，不是 React。</strong></>
                ) : (
                    <>PM2 可以先理解成：幫你顧著 Node.js 程式，不要讓它死掉。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
