'use client'

import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, useFrameTheme } from './InteractiveFrame';

type Focus = 'phone' | 'server' | 'db';

const SLIDES: {
    title: string;
    text: string;
    focus: Focus[];
    packet?: { from: number; to: number; label: string; back?: boolean };
}[] = [
    { title: '1　使用者按下按鈕', text: '使用者在瀏覽器裡操作畫面。這一層就是前端，React 主要做的就是它。', focus: ['phone'] },
    { title: '2　前端把需求送出去', text: '需要伺服器的資料或判斷時，前端透過 HTTP / API 把請求送給後端。', focus: ['phone', 'server'], packet: { from: 196, to: 262, label: '請求' } },
    { title: '3　後端處理規則與資料', text: '後端檢查帳號、權限與規則，需要資料時再去資料庫拿。', focus: ['server', 'db'], packet: { from: 396, to: 480, label: '查資料' } },
    { title: '4　結果回到畫面', text: '後端把結果回傳，前端負責把畫面換成使用者看得懂的樣子。', focus: ['server', 'phone'], packet: { from: 262, to: 196, label: '回應', back: true } },
    { title: '5　後端要一直活著', text: '後端是持續執行的程式，自架時常用 PM2 顧著它。React 打包後只是檔案，不需要被顧。', focus: ['server'] },
];

const INTERVAL = 5200;

/** 一張像簡報的總覽動畫：一次按鈕從頭到尾發生了什麼 */
export function OverviewDeck() {
    const t = useFrameTheme();
    const [i, setI] = useState(0);
    const [playing, setPlaying] = useState(true);
    const slide = SLIDES[i];
    const on = (f: Focus) => slide.focus.includes(f);

    useEffect(() => {
        if (!playing) return;
        const timer = setTimeout(() => setI((n) => (n + 1) % SLIDES.length), INTERVAL);
        return () => clearTimeout(timer);
    }, [playing, i]);

    const go = (n: number) => {
        setPlaying(false);
        setI((n + SLIDES.length) % SLIDES.length);
    };

    return (
        <InteractiveFrame title="一分鐘看懂前端與後端" kicker="總覽簡報" hint="自動播放，也可以按左右鍵或下面的進度條自己切換。">
            <MotionConfig reducedMotion="user">
                <div className="overflow-hidden rounded-lg border border-line bg-surface-sunken">
                    <svg viewBox="0 0 640 270" className="block w-full" role="img" aria-label="前端、後端與資料庫的關係動畫">
                        {/* 連線 */}
                        <line x1="196" y1="130" x2="262" y2="130" className="stroke-line-strong" strokeWidth="3" strokeDasharray="6 6" />
                        <line x1="396" y1="130" x2="480" y2="130" className="stroke-line-strong" strokeWidth="3" strokeDasharray="6 6" />

                        {/* 手機：前端 */}
                        <motion.g animate={{ opacity: on('phone') ? 1 : 0.3 }} transition={{ duration: 0.4 }}>
                            <rect x="48" y="40" width="144" height="190" rx="18" className="fill-surface stroke-line-strong" strokeWidth="3" />
                            <rect x="60" y="62" width="120" height="140" rx="8" className="fill-surface-raised" />
                            <AnimatePresence mode="wait" initial={false}>
                                {i === 3 ? (
                                    <motion.g key="done" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ transformOrigin: '120px 130px' }}>
                                        <circle cx="120" cy="116" r="24" className="fill-success" />
                                        <path d="M108 116l9 9 17-19" className="stroke-canvas" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                        <text x="120" y="170" textAnchor="middle" className="fill-fg" fontSize="15" fontWeight="700">歡迎回來</text>
                                    </motion.g>
                                ) : (
                                    <motion.g key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <rect x="72" y="76" width="70" height="10" rx="5" className="fill-fg/15" />
                                        <rect x="72" y="96" width="96" height="10" rx="5" className="fill-fg/15" />
                                        <motion.g animate={i === 0 ? { scale: [1, 1.08, 1] } : { scale: 1 }} transition={{ duration: 1.1, repeat: i === 0 ? Infinity : 0 }} style={{ transformOrigin: '120px 150px' }}>
                                            <rect x="76" y="132" width="88" height="34" rx="9" className="fill-brand" />
                                            <text x="120" y="154" textAnchor="middle" className="fill-brand-on" fontSize="15" fontWeight="700">登入</text>
                                        </motion.g>
                                    </motion.g>
                                )}
                            </AnimatePresence>
                            <text x="120" y="252" textAnchor="middle" className="fill-fg" fontSize="15" fontWeight="700">前端　瀏覽器</text>
                        </motion.g>

                        {/* 伺服器：後端 */}
                        <motion.g animate={{ opacity: on('server') ? 1 : 0.3 }} transition={{ duration: 0.4 }}>
                            {[0, 1, 2].map((r) => (
                                <g key={r}>
                                    <rect x="268" y={58 + r * 56} width="122" height="46" rx="10" className="fill-surface stroke-line-strong" strokeWidth="3" />
                                    <motion.circle
                                        cx="288"
                                        cy={81 + r * 56}
                                        r="6"
                                        className={i === 2 ? 'fill-success' : 'fill-fg/30'}
                                        animate={i === 2 ? { scale: [0, 1.3, 1] } : { scale: 1 }}
                                        transition={{ delay: i === 2 ? 0.5 + r * 0.6 : 0, duration: 0.4 }}
                                        style={{ transformOrigin: `288px ${81 + r * 56}px` }}
                                    />
                                    <rect x="304" y={77 + r * 56} width="64" height="8" rx="4" className="fill-fg/15" />
                                </g>
                            ))}
                            {i === 4 && (
                                <>
                                    <motion.rect
                                        x="258"
                                        y="48"
                                        width="142"
                                        height="170"
                                        rx="16"
                                        className="fill-none stroke-success"
                                        strokeWidth="3"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.03, 1] }}
                                        transition={{ duration: 1.6, repeat: Infinity }}
                                        style={{ transformOrigin: '329px 133px' }}
                                    />
                                    <motion.polyline
                                        points="268,236 292,236 300,222 312,250 322,236 396,236"
                                        className="fill-none stroke-success"
                                        strokeWidth="3"
                                        strokeLinejoin="round"
                                        animate={{ pathLength: [0, 1] }}
                                        transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
                                    />
                                </>
                            )}
                            <text x="329" y={i === 4 ? 262 : 252} textAnchor="middle" className="fill-fg" fontSize="15" fontWeight="700">後端　伺服器</text>
                        </motion.g>

                        {/* 資料庫 */}
                        <motion.g animate={{ opacity: on('db') ? 1 : 0.3 }} transition={{ duration: 0.4 }}>
                            <path d="M488 84v92c0 14 26 24 52 24s52-10 52-24V84z" className="fill-warning/25 stroke-warning" strokeWidth="3" />
                            <ellipse cx="540" cy="84" rx="52" ry="18" className="fill-warning/40 stroke-warning" strokeWidth="3" />
                            <path d="M488 120c0 14 26 24 52 24s52-10 52-24M488 156c0 14 26 24 52 24s52-10 52-24" className="fill-none stroke-warning" strokeWidth="2.5" />
                            <text x="540" y="252" textAnchor="middle" className="fill-fg" fontSize="15" fontWeight="700">資料庫</text>
                        </motion.g>

                        {/* 封包 */}
                        <AnimatePresence>
                            {slide.packet && (
                                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <motion.g
                                        initial={{ x: slide.packet.from }}
                                        animate={{ x: [slide.packet.from, slide.packet.to] }}
                                        transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.3 }}
                                    >
                                        <circle cx="0" cy="130" r="12" className={slide.packet.back ? 'fill-success' : 'fill-brand'} />
                                    </motion.g>
                                    <text x={(slide.packet.from + slide.packet.to) / 2} y="104" textAnchor="middle" className="fill-fg" fontSize="14" fontWeight="700">{slide.packet.label}</text>
                                </motion.g>
                            )}
                        </AnimatePresence>
                    </svg>
                    <div className="border-t border-line px-4 py-3 sm:px-5">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="min-h-[68px]">
                                <div className={`text-base font-bold ${t.accent}`}>{slide.title}</div>
                                <div className={`mt-1 text-sm leading-relaxed ${t.sub}`}>{slide.text}</div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </MotionConfig>

            <div className="flex items-center gap-3">
                <button type="button" onClick={() => go(i - 1)} aria-label="上一張" className={`rounded-full border px-3 py-1.5 text-sm ${t.ghost}`}>
                    上一張
                </button>
                <div className="flex flex-1 gap-1.5" role="tablist" aria-label="投影片進度">
                    {SLIDES.map((s, n) => (
                        <button key={s.title} type="button" role="tab" aria-selected={n === i} aria-label={s.title} onClick={() => go(n)} className="group h-5 flex-1">
                            <span className="relative block h-1.5 overflow-hidden rounded-full bg-line-strong">
                                {n < i && <span className="absolute inset-0 bg-brand" />}
                                {n === i && (
                                    <motion.span
                                        key={`${i}-${playing}`}
                                        className="absolute inset-y-0 left-0 bg-brand"
                                        initial={{ width: playing ? '0%' : '100%' }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: playing ? INTERVAL / 1000 : 0, ease: 'linear' }}
                                    />
                                )}
                            </span>
                        </button>
                    ))}
                </div>
                <button type="button" onClick={() => go(i + 1)} aria-label="下一張" className={`rounded-full border px-3 py-1.5 text-sm ${t.ghost}`}>
                    下一張
                </button>
                <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? '暫停' : '播放'} className={`flex h-8 w-8 items-center justify-center rounded-full ${t.button}`}>
                    {playing ? <span className="flex gap-0.5"><span className="h-3 w-1 rounded-sm bg-canvas" /><span className="h-3 w-1 rounded-sm bg-canvas" /></span> : <Icon name="play" className="h-3.5 w-3.5" />}
                </button>
            </div>
        </InteractiveFrame>
    );
}
