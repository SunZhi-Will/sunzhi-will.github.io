'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { MotionConfig, motion } from 'framer-motion';

/**
 * 文章內互動元件共用的配色。
 * 全部是設計 token，深淺色由 app/tokens.css 自動切換，所以不需要讀主題。
 * 注意：元件內不要使用 <p> 與 h2~h6，
 * 前者會被 EnhancedArticleContent 的數字高亮改寫 DOM，後者會被目錄抓進去。
 */
const FRAME_THEME = {
    card: 'bg-surface border-line shadow-card',
    inset: 'bg-surface-sunken border-line',
    divider: 'border-line',
    text: 'text-fg',
    sub: 'text-fg-body',
    faint: 'text-fg-muted',
    accent: 'text-brand-text',
    accentSoft: 'bg-brand/10 border-brand/30 text-brand-text',
    chip: 'bg-surface-raised border-line text-fg-body hover:border-line-strong',
    chipOn: 'bg-brand border-brand text-brand-on',
    // 中性的高對比按鈕，深淺色都是反白
    button: 'bg-fg text-canvas hover:bg-fg/90',
    ghost: 'border-line-strong text-fg-body hover:bg-surface-raised',
};

export function useFrameTheme() {
    return FRAME_THEME;
}

/** 標題列左側的小方塊圖示，呼應體素主題 */
function VoxelGlyph() {
    return (
        <motion.span
            aria-hidden="true"
            className="grid h-5 w-5 shrink-0 grid-cols-2 gap-[2px]"
            whileHover={{ rotate: 90 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        >
            <span className="rounded-[2px] bg-yellow-400" />
            <span className="rounded-[2px] bg-yellow-400/40" />
            <span className="rounded-[2px] bg-yellow-400/40" />
            <span className="rounded-[2px] bg-amber-500" />
        </motion.span>
    );
}

interface InteractiveFrameProps {
    title: string;
    kicker?: string;
    hint?: ReactNode;
    /** 內容本來就會大幅伸縮的元件（例如手風琴）。只套用預設最小高度，不啟用「只增不減」 */
    flexible?: boolean;
    children: ReactNode;
}

export function InteractiveFrame({ title, kicker = '互動展示', hint, flexible = false, children }: InteractiveFrameProps) {
    const t = useFrameTheme();
    const ref = useRef<HTMLDivElement>(null);
    // 保險：預設高度之外，若有狀態比預設更高，就把高度記住，之後只增不減。視窗寬度變了就重新計算
    const [floor, setFloor] = useState(0);

    useEffect(() => {
        const element = ref.current;
        if (flexible || !element || typeof ResizeObserver === 'undefined') return;
        let width = window.innerWidth;
        const observer = new ResizeObserver(() => setFloor((current) => Math.max(current, element.offsetHeight)));
        observer.observe(element);
        const onResize = () => {
            if (window.innerWidth === width) return;
            width = window.innerWidth;
            setFloor(0);
        };
        window.addEventListener('resize', onResize);
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', onResize);
        };
    }, [flexible]);

    return (
        <MotionConfig reducedMotion="user">
            <motion.div
                ref={ref}
                style={floor && !flexible ? { minHeight: floor } : undefined}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`interactive-frame not-prose my-10 overflow-hidden rounded-xl border ${t.card}`}
            >
                <div className={`flex items-center gap-3 border-b px-4 py-3 sm:px-5 ${t.divider}`}>
                    <VoxelGlyph />
                    <div className="min-w-0 flex-1">
                        <div className={`text-[11px] font-medium uppercase tracking-[0.18em] ${t.accent}`}>
                            {kicker}
                        </div>
                        <div className={`text-[15px] font-semibold leading-snug ${t.text}`}>{title}</div>
                    </div>
                </div>
                <div className="space-y-4 p-4 sm:p-5">
                    {hint && <div className={`text-sm leading-relaxed ${t.sub}`}>{hint}</div>}
                    {children}
                </div>
            </motion.div>
        </MotionConfig>
    );
}

interface VerdictProps {
    /** 內容變動時用來觸發切換動畫 */
    id: string | number;
    children: ReactNode;
}

/** 互動後出現在底部的一句結論 */
export function Verdict({ id, children }: VerdictProps) {
    const t = useFrameTheme();

    return (
        <motion.div
            key={id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            aria-live="polite"
            className={`rounded-lg border px-4 py-3 text-sm leading-relaxed ${t.accentSoft}`}
        >
            {children}
        </motion.div>
    );
}
