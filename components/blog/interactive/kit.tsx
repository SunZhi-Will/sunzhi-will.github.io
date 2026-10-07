'use client'

import type { ComponentType, CSSProperties, ReactNode, SVGProps } from 'react';
import { motion } from 'framer-motion';
import { Icon, type IconName } from './icons';

/**
 * 文章互動元件共用的版面零件。
 * 顏色全部用設計 token，深淺色自動切換。
 */

type Logo = ComponentType<SVGProps<SVGSVGElement>>;

const DOTS: CSSProperties = {
    backgroundImage: 'radial-gradient(rgb(var(--color-fg) / 0.08) 1px, transparent 1px)',
    backgroundSize: '18px 18px',
};

/** 帶點點底紋的展示區，放圖表與插圖 */
export function Stage({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={`relative overflow-hidden rounded-xl border border-line bg-surface-sunken ${className}`} style={DOTS}>
            {children}
        </div>
    );
}

/** 像編輯器或瀏覽器的視窗外框 */
export function Window({
    title,
    logo: L,
    icon,
    right,
    children,
    className = '',
    tone = 'default',
}: {
    title: ReactNode;
    logo?: Logo;
    icon?: IconName;
    right?: ReactNode;
    children: ReactNode;
    className?: string;
    tone?: 'default' | 'danger' | 'success' | 'brand';
}) {
    const ring =
        tone === 'danger' ? 'border-danger/60' : tone === 'success' ? 'border-success/60' : tone === 'brand' ? 'border-brand/70' : 'border-line-strong';
    return (
        <div className={`overflow-hidden rounded-xl border bg-surface shadow-card transition-colors ${ring} ${className}`}>
            <div className="flex h-9 items-center gap-2 border-b border-line bg-surface-raised px-3">
                <span aria-hidden="true" className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </span>
                <span className="flex min-w-0 flex-1 items-center justify-center gap-1.5 truncate font-mono text-[11px] font-semibold text-fg-body">
                    {L && <L className="h-3.5 w-3.5 shrink-0 rounded-[2px] text-fg" />}
                    {icon && <Icon name={icon} className="h-3.5 w-3.5 shrink-0" />}
                    {title}
                </span>
                <span className="flex min-w-[42px] justify-end">{right}</span>
            </div>
            {children}
        </div>
    );
}

/** 分段切換鈕，選中的底色會滑過去 */
export function Segmented<T extends string>({
    id,
    options,
    value,
    onChange,
    label,
}: {
    id: string;
    options: { value: T; label: ReactNode; logo?: Logo }[];
    value: T;
    onChange: (v: T) => void;
    label: string;
}) {
    return (
        <div role="group" aria-label={label} className="inline-flex max-w-full flex-wrap rounded-full border border-line bg-surface-sunken p-1">
            {options.map((o) => {
                const on = o.value === value;
                const L = o.logo;
                return (
                    <button
                        key={o.value}
                        type="button"
                        aria-pressed={on}
                        onClick={() => onChange(o.value)}
                        className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${on ? 'text-canvas' : 'text-fg-body hover:text-fg'}`}
                    >
                        {on && <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-full bg-fg shadow-card" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
                        {L && <L className="relative h-3.5 w-3.5 rounded-[2px]" />}
                        <span className="relative">{o.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

/** 對話頭像 */
export function Avatar({ who }: { who: 'ai' | 'me' | 'peer' }) {
    if (who === 'ai')
        return (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-info text-canvas shadow-card">
                <Icon name="robot" className="h-4 w-4" />
            </span>
        );
    if (who === 'peer')
        return (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success text-canvas shadow-card">
                <Icon name="chat" className="h-4 w-4" />
            </span>
        );
    return (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fg text-canvas shadow-card">
            <Icon name="user" className="h-4 w-4" />
        </span>
    );
}

/** 對話泡泡：AI 與同事在左邊，自己在右邊 */
export function Bubble({ who, children, tone }: { who: 'ai' | 'me' | 'peer'; children: ReactNode; tone?: 'danger' | 'success' }) {
    const mine = who === 'me';
    const color =
        tone === 'danger'
            ? 'bg-danger/15 text-danger-text border-danger/40'
            : tone === 'success'
              ? 'bg-success/15 text-success-text border-success/40'
              : mine
                ? 'bg-fg text-canvas border-fg'
                : 'bg-surface text-fg border-line';
    return (
        <motion.div initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 360, damping: 28 }} className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
            <Avatar who={who} />
            <div className={`max-w-[82%] rounded-2xl border px-3.5 py-2 text-sm leading-relaxed shadow-card ${mine ? 'rounded-br-md' : 'rounded-bl-md'} ${color}`}>{children}</div>
        </motion.div>
    );
}

/** 有標籤與數值的橫條 */
export function Meter({ label, value, max = 100, tone = 'brand', suffix = '' }: { label: ReactNode; value: number; max?: number; tone?: 'brand' | 'success' | 'danger' | 'warning' | 'info'; suffix?: string }) {
    const bar = { brand: 'bg-brand', success: 'bg-success', danger: 'bg-danger', warning: 'bg-warning', info: 'bg-info' }[tone];
    return (
        <div>
            <div className="mb-1.5 flex items-baseline justify-between gap-2 text-xs font-bold text-fg">
                <span>{label}</span>
                <span className="tabular-nums">
                    {value}
                    {suffix}
                </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-fg/10">
                <motion.div className={`h-full rounded-full ${bar}`} initial={false} animate={{ width: `${Math.min(100, (value / max) * 100)}%` }} transition={{ type: 'spring', stiffness: 110, damping: 18 }} />
            </div>
        </div>
    );
}

/** 小標籤 */
export function Eyebrow({ children }: { children: ReactNode }) {
    return <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-text">{children}</div>;
}
