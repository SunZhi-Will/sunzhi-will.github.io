'use client'

import type { CSSProperties, ReactNode } from 'react';
import { Icon } from './icons';

/**
 * 「活動報名頁」的樣機，UI/UX 文章裡所有圖解共用。
 * 它畫的是一個網站，所以用固定色而不是設計 token；外框由各元件的 Stage 提供。
 */

export interface MockFix {
    hierarchy: boolean;
    spacing: boolean;
    contrast: boolean;
    cta: boolean;
    feedback: boolean;
}

export const ALL_BAD: MockFix = { hierarchy: false, spacing: false, contrast: false, cta: false, feedback: false };
export const ALL_GOOD: MockFix = { hierarchy: true, spacing: true, contrast: true, cta: true, feedback: true };

export type Region = 'title' | 'info' | 'cards' | 'cta';

interface EventMockProps {
    fix?: MockFix;
    accent?: string;
    radius?: number;
    /** 只在 spacing 修好時使用，單位 px */
    gap?: number;
    dark?: boolean;
    /** 任何 CSS background 值 */
    bg?: string;
    mobile?: boolean;
    /** 只畫標題、資訊與按鈕，用在並排比較時 */
    compact?: boolean;
    focus?: Region | null;
    onFocus?: (r: Region) => void;
    sent?: 'idle' | 'sending' | 'done';
    onCta?: () => void;
    className?: string;
}

const CARDS = [
    { t: '主題分享', d: '三場短講' },
    { t: '動手實作', d: '帶電腦參加' },
    { t: '自由交流', d: '認識新朋友' },
];

export function EventMock({
    fix = ALL_GOOD,
    accent = '#2563eb',
    radius = 10,
    gap,
    dark = false,
    bg,
    mobile = false,
    compact = false,
    focus = null,
    onFocus,
    sent = 'idle',
    onCta,
    className = '',
}: EventMockProps) {
    const ink = dark ? '#f4f4f5' : '#111827';
    const body = dark ? '#d4d4d8' : '#374151';
    const faint = fix.contrast ? body : dark ? '#52525b' : '#c7cbd3';
    const line = dark ? 'rgba(255,255,255,0.14)' : 'rgba(17,24,39,0.12)';
    const panel = dark ? 'rgba(255,255,255,0.06)' : '#f3f4f6';
    const g = fix.spacing ? (gap ?? 14) : 2;
    const pad = fix.spacing ? 14 : 6;

    const wrap = (id: Region, children: ReactNode, style?: CSSProperties) => {
        const on = focus === id;
        const base: CSSProperties = {
            ...style,
            outline: on ? `2px solid ${accent}` : onFocus ? '2px dashed transparent' : 'none',
            outlineOffset: 3,
            borderRadius: 6,
            cursor: onFocus ? 'pointer' : 'default',
            transition: 'outline-color .2s',
        };
        if (!onFocus) return <div style={base}>{children}</div>;
        return (
            <div
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={`選取${{ title: '標題', info: '活動資訊', cards: '特色卡片', cta: '報名按鈕' }[id]}`}
                onClick={() => onFocus(id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onFocus(id)}
                style={base}
            >
                {children}
            </div>
        );
    };

    const ctaLabel = fix.feedback && sent === 'sending' ? '送出中…' : fix.feedback && sent === 'done' ? '報名成功' : '立即報名';

    return (
        <div
            className={`mx-auto w-full overflow-hidden text-left ${className}`}
            style={{
                maxWidth: mobile ? 200 : 460,
                background: bg ?? (dark ? '#0b0f1a' : '#ffffff'),
                color: ink,
                borderRadius: radius + 2,
                border: `1px solid ${line}`,
                padding: pad + 4,
                fontFamily: 'ui-sans-serif, system-ui, "Noto Sans TC", sans-serif',
                lineHeight: 1.45,
            }}
        >
            <div className="flex items-center justify-between" style={{ marginBottom: fix.spacing ? 12 : 4, fontSize: 10, color: faint }}>
                <span style={{ fontWeight: 800, color: ink }}>AI 交流會</span>
                <span>活動 · 講者 · 常見問題</span>
            </div>

            {wrap(
                'title',
                <>
                    {fix.hierarchy && <div style={{ fontSize: 10, fontWeight: 700, color: accent, letterSpacing: '0.08em', marginBottom: 2 }}>10 月 18 日 · 免費</div>}
                    <div style={{ fontSize: fix.hierarchy ? (mobile ? 16 : 21) : mobile ? 24 : 32, fontWeight: 800, lineHeight: fix.hierarchy ? 1.2 : 1.05 }}>
                        AI 技術交流活動 報名
                    </div>
                    {fix.hierarchy && <div style={{ fontSize: 11, color: body, marginTop: 4 }}>給對 AI 有興趣的人，不需要程式背景。</div>}
                </>,
                { marginBottom: g + 4 },
            )}

            {wrap(
                'info',
                fix.hierarchy ? (
                    <div className="flex flex-wrap" style={{ gap: 6 }}>
                        {['10/18 14:00', '台北 信義區', '免費參加'].map((t) => (
                            <span key={t} style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: panel, color: ink }}>
                                {t}
                            </span>
                        ))}
                    </div>
                ) : (
                    <div style={{ fontSize: 9.5, color: faint }}>
                        活動時間 2026/10/18 14:00 地點 台北市信義區 費用 免費 適合對象 對 AI 有興趣的人 名額 80 人 注意事項 請自備筆電 主辦單位 AI 技術交流社群
                    </div>
                ),
                { marginBottom: g + 4 },
            )}

            {!compact &&
                wrap(
                'cards',
                <div className="grid" style={{ gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)', gap: g }}>
                    {CARDS.map((c) => (
                        <div
                            key={c.t}
                            style={{
                                padding: fix.spacing ? 10 : 4,
                                borderRadius: radius,
                                background: fix.spacing ? panel : 'transparent',
                                border: fix.spacing ? 'none' : `1px solid ${line}`,
                            }}
                        >
                            <div style={{ fontSize: 11.5, fontWeight: 700 }}>{c.t}</div>
                            <div style={{ fontSize: 10, color: faint }}>{c.d}</div>
                        </div>
                    ))}
                </div>,
                { marginBottom: g + 6 },
            )}

            {wrap(
                'cta',
                <div className="flex flex-wrap items-center" style={{ gap: 8 }}>
                    <span
                        role={onCta ? 'button' : undefined}
                        tabIndex={onCta && !onFocus ? 0 : undefined}
                        onClick={onCta}
                        onKeyDown={onCta ? (e) => (e.key === 'Enter' || e.key === ' ') && onCta() : undefined}
                        style={{
                            fontSize: fix.cta ? 12.5 : 10,
                            fontWeight: 700,
                            padding: fix.cta ? '8px 16px' : '3px 8px',
                            borderRadius: radius,
                            cursor: onCta ? 'pointer' : 'inherit',
                            background: fix.cta ? (sent === 'done' && fix.feedback ? '#16a34a' : accent) : '#9ca3af',
                            color: '#ffffff',
                            transition: 'background .25s',
                        }}
                    >
                        {ctaLabel}
                    </span>
                    <span
                        style={{
                            fontSize: fix.cta ? 11 : 10,
                            fontWeight: fix.cta ? 600 : 400,
                            padding: fix.cta ? '7px 12px' : '3px 8px',
                            borderRadius: radius,
                            border: fix.cta ? `1px solid ${line}` : 'none',
                            background: fix.cta ? 'transparent' : '#9ca3af',
                            color: fix.cta ? body : '#ffffff',
                        }}
                    >
                        了解更多
                    </span>
                </div>,
            )}
        </div>
    );
}

/** 小標示：好或壞 */
export function Mark({ ok }: { ok: boolean }) {
    return ok ? <Icon name="check" className="h-4 w-4 shrink-0 text-success-text" /> : <Icon name="x" className="h-4 w-4 shrink-0 text-danger-text" />;
}
