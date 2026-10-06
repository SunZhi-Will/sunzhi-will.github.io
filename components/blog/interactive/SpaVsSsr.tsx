'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

type Who = 'server' | 'browser';

const MODES: { id: 'spa' | 'ssr'; name: string; sub: string; contentAt: number; stages: { who: Who; text: string }[] }[] = [
    {
        id: 'spa',
        name: 'React SPA',
        sub: '靜態檔案',
        contentAt: 4,
        stages: [
            { who: 'server', text: '伺服器送來一個幾乎空白的 HTML' },
            { who: 'browser', text: '瀏覽器下載 JavaScript' },
            { who: 'browser', text: 'React 在瀏覽器啟動' },
            { who: 'browser', text: '向 API 要資料，內容出現' },
        ],
    },
    {
        id: 'ssr',
        name: 'Next.js SSR',
        sub: '伺服器先組好',
        contentAt: 2,
        stages: [
            { who: 'server', text: 'Server 先去拿資料、組好完整 HTML' },
            { who: 'browser', text: '收到完整 HTML，內容立刻出現' },
            { who: 'browser', text: '瀏覽器下載 JavaScript' },
            { who: 'browser', text: 'React 接手，頁面變得可以操作' },
        ],
    },
];

function Wire({ id, stage, contentAt }: { id: string; stage: number; contentAt: number }) {
    const filled = stage >= contentAt;
    const skeleton = id === 'spa' && stage === 3;
    const interactive = id === 'ssr' ? stage >= 4 : stage >= 4;
    return (
        <div className="relative min-h-[120px] rounded-md border border-line-strong bg-surface p-3">
            {stage === 0 && <div className="absolute inset-0 flex items-center justify-center text-[11px] text-fg-muted">還沒有人打開網頁</div>}
            {stage >= 1 && (
                <div className="space-y-2">
                    <motion.div layout className={`h-4 w-1/2 rounded ${filled ? 'bg-brand/50' : skeleton ? 'animate-pulse bg-fg/20' : 'bg-transparent'}`} />
                    <motion.div layout className={`h-12 rounded ${filled ? 'bg-fg/15' : skeleton ? 'animate-pulse bg-fg/10' : 'bg-transparent'}`} />
                    <motion.div layout className={`h-3 w-4/5 rounded ${filled ? 'bg-fg/15' : skeleton ? 'animate-pulse bg-fg/10' : 'bg-transparent'}`} />
                    {!filled && !skeleton && <div className="absolute inset-0 flex items-center justify-center text-[11px] text-fg-muted">空白，等待中…</div>}
                </div>
            )}
            {filled && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`absolute bottom-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${interactive ? 'bg-success text-canvas' : 'bg-warning/20 text-warning-text'}`}
                >
                    {interactive ? '可以操作' : '看得到，還不能操作'}
                </motion.div>
            )}
        </div>
    );
}

/** 同一個頁面，SPA 與 SSR 的內容在第幾步出現 */
export function SpaVsSsr() {
    const t = useFrameTheme();
    const [stage, setStage] = useState(0);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        if (!playing) return;
        if (stage >= 4) {
            setPlaying(false);
            return;
        }
        const timer = setTimeout(() => setStage((s) => s + 1), 1500);
        return () => clearTimeout(timer);
    }, [playing, stage]);

    const start = () => {
        setStage(1);
        setPlaying(true);
    };

    return (
        <InteractiveFrame title="SPA 和 SSR，使用者看到內容的時間不一樣" hint="按播放，兩種做法同時開始，看內容在哪一步出現。">
            <div className="grid gap-3 md:grid-cols-2">
                {MODES.map((m) => (
                    <div key={m.id} className={`rounded-lg border p-3 ${t.inset}`}>
                        <div className="mb-2 flex items-center justify-between">
                            <div>
                                <div className={`text-sm font-bold ${t.text}`}>{m.name}</div>
                                <div className={`text-[11px] ${t.sub}`}>{m.sub}</div>
                            </div>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${stage >= m.contentAt ? 'bg-success/15 text-success-text' : 'bg-fg/10 text-fg-body'}`}>
                                第 {m.contentAt} 步出現內容
                            </span>
                        </div>
                        <Wire id={m.id} stage={stage} contentAt={m.contentAt} />
                        <div className="mt-3 space-y-1.5">
                            {m.stages.map((s, i) => {
                                const on = stage === i + 1;
                                const past = stage > i + 1;
                                return (
                                    <div
                                        key={s.text}
                                        className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-[11px] leading-tight transition-colors ${
                                            on ? 'border-brand bg-brand/15 font-semibold text-fg' : past ? 'border-line text-fg-body' : 'border-line text-fg-muted'
                                        }`}
                                    >
                                        <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${past ? 'bg-success text-canvas' : on ? 'bg-brand text-brand-on' : 'bg-fg/10'}`}>{past ? <Icon name="check" className="h-2.5 w-2.5" /> : i + 1}</span>
                                        <span className="flex-1">{s.text}</span>
                                        <span aria-label={s.who === 'server' ? '伺服器' : '瀏覽器'} className="text-fg-body"><Icon name={s.who === 'server' ? 'building' : 'phone'} className="h-4 w-4" /></span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <button type="button" onClick={start} className={`rounded-full px-4 py-2 text-sm font-semibold ${t.button}`}>
                    {stage === 0 ? '播放' : '重播'}
                </button>
                <span className={`flex items-center gap-3 text-xs ${t.sub}`}><span className="inline-flex items-center gap-1"><Icon name="building" className="h-4 w-4" />伺服器做的事</span><span className="inline-flex items-center gap-1"><Icon name="phone" className="h-4 w-4" />瀏覽器做的事</span></span>
            </div>

            <Verdict id={stage >= 4 ? 'end' : 'run'}>
                {stage >= 4 ? (
                    <>
                        SSR 讓內容更早出現，代價是要有一個 <strong>Server 一直在線</strong>幫你組頁面。SPA 只需要靜態檔案，所以不用 PM2。
                    </>
                ) : (
                    <>Next.js 不一定只有前端，它可以在伺服器上做一些事情，這就是 SSR。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
