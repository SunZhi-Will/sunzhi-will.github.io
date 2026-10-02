'use client'

import type { ReactNode } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import { useTheme } from '@/app/blog/ThemeProvider';

/**
 * 文章內互動元件共用的配色。
 * 注意：元件內不要使用 <p> 與 h2~h6，
 * 前者會被 EnhancedArticleContent 的數字高亮改寫 DOM，後者會被目錄抓進去。
 */
export function useFrameTheme() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return {
        isDark,
        card: isDark ? 'bg-zinc-900/70 border-zinc-700/50' : 'bg-white border-zinc-200 shadow-sm',
        inset: isDark ? 'bg-black/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200',
        divider: isDark ? 'border-zinc-800' : 'border-zinc-200',
        text: isDark ? 'text-zinc-100' : 'text-zinc-900',
        sub: isDark ? 'text-zinc-400' : 'text-zinc-600',
        faint: isDark ? 'text-zinc-500' : 'text-zinc-400',
        accent: isDark ? 'text-yellow-300' : 'text-yellow-700',
        accentSoft: isDark
            ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-200'
            : 'bg-yellow-50 border-yellow-300 text-yellow-800',
        chip: isDark
            ? 'bg-zinc-800/70 border-zinc-700 text-zinc-300 hover:border-zinc-500'
            : 'bg-white border-zinc-300 text-zinc-700 hover:border-zinc-400',
        chipOn: isDark
            ? 'bg-yellow-400 border-yellow-400 text-black'
            : 'bg-yellow-400 border-yellow-500 text-black',
        button: isDark
            ? 'bg-zinc-100 text-zinc-900 hover:bg-white'
            : 'bg-zinc-900 text-white hover:bg-zinc-800',
        ghost: isDark
            ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
            : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100',
    };
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
    children: ReactNode;
}

export function InteractiveFrame({ title, kicker = '互動展示', hint, children }: InteractiveFrameProps) {
    const t = useFrameTheme();

    return (
        <MotionConfig reducedMotion="user">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`not-prose my-10 overflow-hidden rounded-xl border ${t.card}`}
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
