'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const DURATION = 7;
const CRASH = 46;
const PM2_BACK = 52;

function Lane({ label, sub, children }: { label: string; sub: string; children: React.ReactNode }) {
    const t = useFrameTheme();
    return (
        <div>
            <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className={`text-xs font-bold ${t.text}`}>{label}</span>
                <span className={`text-[11px] ${t.sub}`}>{sub}</span>
            </div>
            <div className="relative h-8 overflow-hidden rounded-md bg-fg/5">{children}</div>
        </div>
    );
}

function Bar({ from, to, className }: { from: number; to: number; className: string }) {
    return <div className={`absolute inset-y-1.5 rounded ${className}`} style={{ left: `${from}%`, width: `${to - from}%` }} />;
}

/** 時間軸圖表：誰一直都在、誰有人用才在、誰掛了會怎樣 */
export function LifetimeChart() {
    const t = useFrameTheme();
    const [pm2, setPm2] = useState(false);
    const [run, setRun] = useState(0);

    const downFrom = CRASH;
    const downTo = pm2 ? PM2_BACK : 100;
    const downPct = downTo - downFrom;

    return (
        <InteractiveFrame title="誰必須一直活著？時間軸對照" kicker="示意圖表" hint="三條時間軸同時往右走。切換 PM2，看後端當機之後的差別。">
            <div role="group" aria-label="PM2" className="flex items-center gap-2">
                <span className={`text-xs ${t.sub}`}>後端有沒有 PM2 顧著</span>
                <div className={`inline-flex rounded-full border p-0.5 ${t.inset}`}>
                    {[false, true].map((v) => (
                        <button
                            key={String(v)}
                            type="button"
                            aria-pressed={pm2 === v}
                            onClick={() => {
                                setPm2(v);
                                setRun((r) => r + 1);
                            }}
                            className={`relative rounded-full px-3 py-1 text-xs font-bold ${pm2 === v ? 'text-brand-on' : t.sub}`}
                        >
                            {pm2 === v && <motion.span layoutId="life-pill" className="absolute inset-0 rounded-full bg-brand" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                            <span className="relative">{v ? '有 PM2' : '沒有'}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className={`rounded-lg border p-3 sm:p-4 ${t.inset}`}>
                <div className="relative space-y-3">
                    <motion.div
                        key={`${run}-${String(pm2)}`}
                        className="space-y-3"
                        initial={{ clipPath: 'inset(0 100% 0 0)' }}
                        animate={{ clipPath: 'inset(0 0% 0 0)' }}
                        transition={{ duration: DURATION, ease: 'linear' }}
                    >
                        <Lane label="React 打包後的檔案" sub="只是檔案，一直放在那裡">
                            <Bar from={0} to={100} className="bg-fg/25" />
                        </Lane>
                        <Lane label="使用者瀏覽器裡的 React" sub="有人打開網頁才在執行">
                            <Bar from={8} to={30} className="bg-info" />
                            <Bar from={58} to={74} className="bg-info" />
                            <Bar from={82} to={94} className="bg-info" />
                        </Lane>
                        <Lane label="Node.js 後端" sub={pm2 ? 'PM2 在背後顧著' : '沒有人顧'}>
                            <Bar from={0} to={downFrom} className="bg-success" />
                            <Bar from={downFrom} to={downFrom + downPct} className="bg-danger" />
                            {pm2 && <Bar from={PM2_BACK} to={100} className="bg-success" />}
                            <div className="absolute inset-y-0 flex items-center text-canvas" style={{ left: `${downFrom + 1}%` }}>
                                <Icon name="dead" className="h-5 w-5 text-canvas" />
                            </div>
                        </Lane>
                    </motion.div>

                    {/* 掃過的游標 */}
                    <motion.div
                        key={`head-${run}-${String(pm2)}`}
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-1 -top-1 w-0.5 bg-brand"
                        initial={{ left: '0%' }}
                        animate={{ left: '100%' }}
                        transition={{ duration: DURATION, ease: 'linear' }}
                    />
                </div>

                <div className="mt-3 flex justify-between text-[11px] text-fg-muted">
                    <span>時間</span>
                    <span>→</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-fg-body">
                    <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-success" />執行中</span>
                    <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-danger" />當機、網站壞掉</span>
                    <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-info" />在使用者的瀏覽器執行</span>
                    <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-fg/25" />只是檔案</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button type="button" onClick={() => setRun((r) => r + 1)} className={`rounded-full px-4 py-2 text-sm font-semibold ${t.button}`}>
                    重播
                </button>
            </div>

            <Verdict id={String(pm2)}>
                {pm2 ? (
                    <>PM2 發現後端死了，很快把它叫醒，網站只壞了一小段。<strong>需要被顧的是後端，不是 React 檔案。</strong></>
                ) : (
                    <>後端一旦死掉就一直死，網站從那一刻起都是壞的，直到有人發現並手動重啟。React 的檔案則完全沒受影響。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
