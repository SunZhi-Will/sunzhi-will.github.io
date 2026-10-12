'use client'

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useInView } from 'framer-motion';
import s from './paper.module.css';

/**
 * 文章裡的動畫圖卡，照 GoogleAIStudioTeach《5 天 AI 上手挑戰》簡報的做法：
 * 米白紙面或深色桌面、左上角等寬字小標、右上角頁碼，內容用便利貼、螢光筆、紅筆、蓋章、模擬手機表達。
 * 和原簡報不同的地方只有版面：簡報是 1100×619 固定畫布，這裡要放進文章欄寬、手機上也要讀得到，所以改成流動排版。
 */

export const css = s;

/** 色票：紙面正文 ink／ink2，深色桌面 night 系。gold／hl 是重點，blue 是 AI 說的話，green 做對，red 問題與紅筆。 */
export const C = {
    paper: '#F6F2E9',
    paper2: '#ECE5D5',
    card: '#FFFFFF',
    line: '#D9D0BC',
    ink: '#211D16',
    ink2: '#5B5345',
    gold: '#B7860F',
    hl: '#FBE38A',
    note: '#FFE987',
    noteBlue: '#CFE6FF',
    notePink: '#FFD6D0',
    noteGreen: '#D3F2C9',
    blue: '#2463A8',
    green: '#1F7A4D',
    red: '#C2410C',
    night: '#1A1712',
    night2: '#24201A',
    nightInk: '#F4EFE4',
    // 深色桌面上的次要字。黑底不用灰字，只比主文字暗一點
    nightSub: '#E6DCC6',
    goldLight: '#E8B84A',
} as const;

/** 動畫延遲／長度的簡寫：d(0.4) → { "--d": "0.4s" } */
export function d(delay: number, dur?: number, extra?: CSSProperties): CSSProperties {
    return { ['--d' as string]: `${delay}s`, ...(dur ? { ['--dur' as string]: `${dur}s` } : {}), ...extra } as CSSProperties;
}

const Ctx = createContext({ on: false, k: 0, dark: false });
export const useCard = () => useContext(Ctx);

const TOTAL = 7;

/**
 * 一張圖卡。第一次捲進畫面時才掛上內容、CSS 動畫從頭播一次；還沒捲到之前先隱藏（高度照樣佔著），避免動畫在畫面外就播完。
 * 「重播」會換 key 讓整張重新掛載。
 * n 是這篇文章的第幾張圖卡，tag 是左上角的小標。
 */
export function Card({ tone = 'paper', tag, n, children }: { tone?: 'paper' | 'desk'; tag: string; n: number; children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    // 只在第一次捲到時播放；之後停在最終畫面，要再看一次就按「重播」
    const inView = useInView(ref, { amount: 0.35, once: true });
    const [k, setK] = useState(0);
    const dark = tone === 'desk';
    const dim = dark ? C.nightSub : C.ink2;

    return (
        <Ctx.Provider value={{ on: inView, k, dark }}>
            <div
                ref={ref}
                className={`slide-card not-prose relative my-10 rounded-xl ${s.card} ${dark ? s.desk : s.paper}`}
                style={{ color: dark ? C.nightInk : C.ink, border: `1px solid ${dark ? '#2e2920' : C.line}` }}
            >
                <div className={`${s.mono} flex items-center justify-between px-5 pt-4 text-[11px] tracking-[0.14em] sm:px-9 sm:pt-6 sm:text-xs`} style={{ color: dim }}>
                    <span className="flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-[2px]" style={{ background: dark ? C.hl : C.gold }} />
                        {tag}
                    </span>
                    <span>
                        {String(n).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
                    </span>
                </div>
                <div key={k} style={inView ? undefined : { visibility: 'hidden' }} className="relative flex flex-col gap-6 px-5 pb-9 pt-5 sm:min-h-[400px] sm:px-9 sm:pb-10 sm:pt-6">
                    {children}
                </div>
                <button
                    type="button"
                    onClick={() => setK((x) => x + 1)}
                    className={`${s.mono} absolute bottom-2 right-3 rounded px-2 py-1 text-[11px] tracking-[0.12em] sm:right-5`}
                    style={{ color: dim }}
                >
                    重播
                </button>
            </div>
        </Ctx.Provider>
    );
}

/** 標題：粗黑體 */
export function Title({ children, delay = 0.05, size = 'text-[26px] sm:text-[38px]' }: { children: ReactNode; delay?: number; size?: string }) {
    return (
        <div className={`${s.rise} ${size} font-black leading-[1.22]`} style={d(delay)}>
            {children}
        </div>
    );
}

/** 螢光筆 */
export function Mark({ children, delay = 0.6, color }: { children: ReactNode; delay?: number; color?: string }) {
    return (
        <span className={s.mark} style={d(delay, undefined, color ? ({ ['--mk' as string]: color } as CSSProperties) : undefined)}>
            {children}
        </span>
    );
}

/** 紅筆劃掉 */
export function Strike({ children, delay = 0.6, color }: { children: ReactNode; delay?: number; color?: string }) {
    return (
        <span className={s.strike} style={d(delay, undefined, color ? ({ ['--sc' as string]: color } as CSSProperties) : undefined)}>
            {children}
        </span>
    );
}

/** 手寫字：便利貼、紅筆批註 */
export function Hand({ children, delay = 0, className = '', color, anim = 'fade' }: { children: ReactNode; delay?: number; className?: string; color?: string; anim?: 'fade' | 'rise' | 'pop' }) {
    return (
        <div className={`${s.hand} ${s[anim]} ${className}`} style={{ ...d(delay), color, lineHeight: 1.35 }}>
            {children}
        </div>
    );
}

/** 便利貼：旋轉著貼上 */
export function Sticky({ children, rot = -2, color = C.note, delay = 0, className = '', style }: { children: ReactNode; rot?: number; color?: string; delay?: number; className?: string; style?: CSSProperties }) {
    return (
        <div
            className={`${s.stick} ${s.hand} ${className}`}
            style={{
                ...d(delay, undefined, { ['--rot' as string]: `${rot}deg` } as CSSProperties),
                padding: '14px 16px 16px',
                background: color,
                color: C.ink,
                lineHeight: 1.35,
                boxShadow: '0 10px 18px -10px rgba(60, 40, 10, 0.45), 0 1px 0 rgba(0,0,0,0.04)',
                borderRadius: '2px 2px 6px 2px',
                ...style,
            }}
        >
            {children}
        </div>
    );
}

/** 蓋上去的章：圓角框、斜放 */
export function Stamp({ children, color = C.red, rot = -8, delay = 0, className = 'text-lg sm:text-2xl' }: { children: ReactNode; color?: string; rot?: number; delay?: number; className?: string }) {
    return (
        <div style={{ transform: `rotate(${rot}deg)`, display: 'inline-block' }}>
            <div className={`${s.stamp} ${className} font-black`} style={{ ...d(delay), border: `3px solid ${color}`, color, borderRadius: 8, padding: '2px 12px', letterSpacing: '0.08em', background: 'rgba(255,255,255,0.4)' }}>
                {children}
            </div>
        </div>
    );
}

/** 白紙卡片：放信、表格、筆記 */
export function Sheet({ children, delay = 0, anim = 'rise', rot = 0, className = '', style }: { children: ReactNode; delay?: number; anim?: 'rise' | 'fade' | 'slideL' | 'slideR' | 'pop'; rot?: number; className?: string; style?: CSSProperties }) {
    return (
        <div className={className} style={{ transform: rot ? `rotate(${rot}deg)` : undefined }}>
            <div className={s[anim]} style={{ ...d(delay), background: C.card, color: C.ink, border: `1px solid ${C.line}`, borderRadius: 6, boxShadow: '0 14px 24px -18px rgba(60,40,10,0.5)', ...style }}>
                {children}
            </div>
        </div>
    );
}

/** 打字機：捲進畫面、再等 delay 秒後逐字打出。減少動態時直接顯示全文。 */
export function Typed({ text, delay = 0, cps = 26 }: { text: string; delay?: number; cps?: number }) {
    const { on, k } = useCard();
    const [count, setCount] = useState(0);
    const [reduced, setReduced] = useState(false);
    useEffect(() => setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);
    useEffect(() => {
        setCount(0);
        if (!on || reduced) return;
        let timer: ReturnType<typeof setInterval> | undefined;
        const start = setTimeout(() => {
            timer = setInterval(() => setCount((c) => (c >= text.length ? c : c + 1)), 1000 / cps);
        }, delay * 1000);
        return () => {
            clearTimeout(start);
            if (timer) clearInterval(timer);
        };
    }, [on, k, text, delay, cps, reduced]);
    const shown = reduced ? text : text.slice(0, count);
    const typing = !reduced && count > 0 && count < text.length;
    return (
        <span>
            {shown}
            {typing && <span className={s.caret} aria-hidden="true" />}
            <span style={{ visibility: 'hidden' }}>{reduced ? '' : text.slice(count)}</span>
        </span>
    );
}

/** 手機外框，一律標示「模擬畫面」 */
export function Phone({ children, title = 'AI 助理', delay = 0, className = '', height = 380 }: { children: ReactNode; title?: string; delay?: number; className?: string; height?: number }) {
    return (
        <div className={`${s.rise} relative ${className}`} style={{ ...d(delay), height }}>
            <div className="absolute inset-0" style={{ borderRadius: 34, background: '#1B1915', padding: 8, boxShadow: '0 24px 40px -22px rgba(40, 25, 5, 0.6)' }}>
                <div className="relative flex h-full w-full flex-col overflow-hidden bg-white" style={{ borderRadius: 27 }}>
                    <div className={`${s.mono} flex h-7 flex-none items-center justify-between px-5 text-[11px] font-bold`} style={{ color: C.ink }}>
                        <span>9:41</span>
                        <span className="h-4 w-16 rounded-full" style={{ background: '#1B1915' }} />
                        <span>●●●</span>
                    </div>
                    <div className="flex h-9 flex-none items-center justify-center text-sm font-bold" style={{ borderBottom: `1px solid ${C.line}`, color: C.ink }}>
                        {title}
                    </div>
                    <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
                </div>
            </div>
            <div className={`${s.mono} absolute -bottom-5 right-1 text-[10px] tracking-[0.12em]`} style={{ color: C.ink2 }}>
                模擬畫面
            </div>
        </div>
    );
}

export type Turn = { role: 'me' | 'ai'; text?: ReactNode; typed?: string; delay: number };

/** 手機裡的對話：我的訊息靠右深色泡泡，AI 靠左、前面一個小圓標 */
export function Chat({ turns, thinkingAt }: { turns: Turn[]; thinkingAt?: number }) {
    return (
        <div className="absolute inset-0 flex flex-col">
            <div className="flex min-h-0 flex-1 flex-col justify-end gap-2.5 overflow-hidden px-3 pb-2 pt-3">
                {turns.map((t, i) =>
                    t.role === 'me' ? (
                        <div key={i} className={`${s.slideR} max-w-[86%] self-end px-3 py-2 text-[13.5px] font-medium leading-normal text-white`} style={{ ...d(t.delay), background: C.ink, borderRadius: '16px 16px 4px 16px' }}>
                            {t.text}
                        </div>
                    ) : (
                        <div key={i} className={`${s.fade} flex max-w-[96%] items-start gap-2`} style={d(t.delay)}>
                            <AiDot />
                            <div className="text-[13.5px] leading-relaxed" style={{ color: C.ink }}>
                                {t.typed ? <Typed text={t.typed} delay={t.delay} cps={30} /> : t.text}
                            </div>
                        </div>
                    ),
                )}
                {thinkingAt !== undefined && (
                    <div className={`${s.fade} flex items-center gap-2`} style={{ ...d(thinkingAt), color: C.blue }}>
                        <AiDot />
                        <span>
                            <span className={s.dot} />
                            <span className={s.dot} />
                            <span className={s.dot} />
                        </span>
                    </div>
                )}
            </div>
            <div className="mx-2.5 mb-3 flex h-9 flex-none items-center rounded-full px-3.5 text-[12.5px]" style={{ border: `1px solid ${C.line}`, color: C.ink2 }}>
                輸入訊息…
            </div>
        </div>
    );
}

function AiDot() {
    return (
        <span className="grid h-5 w-5 flex-none place-items-center rounded-full text-[9px] font-black text-white" style={{ background: C.blue }} aria-hidden="true">
            AI
        </span>
    );
}
