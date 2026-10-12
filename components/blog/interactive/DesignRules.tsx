'use client'

import { useState } from 'react';
import { Note, Segmented, Stage } from './kit';
import { InteractiveFrame } from './InteractiveFrame';
import { ALL_GOOD, EventMock } from './uiMock';

const COLORS = [
    { name: '深藍', hex: '#1d4ed8' },
    { name: '森林綠', hex: '#15803d' },
    { name: '莓果紫', hex: '#a21caf' },
    { name: '橘', hex: '#ea580c' },
];

const PAGES = ['首頁', '活動頁', '會員頁'];

// 沒有規則時，每個頁面各自長各自的
const DRIFT = [
    { accent: '#1d4ed8', radius: 4, gap: 6 },
    { accent: '#15803d', radius: 22, gap: 18 },
    { accent: '#a21caf', radius: 10, gap: 10 },
];

/** 一份簡單的設計規則，讓每一頁看起來屬於同一個網站 */
export function DesignRules() {
    const [ruled, setRuled] = useState(true);
    const [color, setColor] = useState(0);
    const [radius, setRadius] = useState(12);
    const [gap, setGap] = useState(14);
    const [page, setPage] = useState(0);

    return (
        <InteractiveFrame title="三個頁面，一套規則" kicker="互動展示" hint="先開著「有規則」，調整下面三個設定，看三個頁面一起變。再切到「沒有規則」，看它們各長各的。">
            <Segmented
                id="rules"
                label="規則"
                value={ruled ? 'on' : 'off'}
                onChange={(v) => setRuled(v === 'on')}
                options={[
                    { value: 'on', label: '有設計規則' },
                    { value: 'off', label: '沒有規則' },
                ]}
            />
            <div className="flex gap-1.5 sm:hidden" role="group" aria-label="頁面">
                {PAGES.map((name, i) => (
                    <button
                        key={name}
                        type="button"
                        aria-pressed={page === i}
                        onClick={() => setPage(i)}
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${page === i ? 'border-fg bg-fg text-canvas' : 'border-line-strong text-fg'}`}
                    >
                        {name}
                    </button>
                ))}
            </div>
            <Stage className="p-3 sm:p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {PAGES.map((name, i) => {
                        const d = DRIFT[i];
                        return (
                            <div key={name} className={`flex-col items-center gap-1.5 ${page === i ? 'flex' : 'hidden sm:flex'}`}>
                                <EventMock
                                    mobile
                                    fix={ALL_GOOD}
                                    accent={ruled ? COLORS[color].hex : d.accent}
                                    radius={ruled ? radius : d.radius}
                                    gap={ruled ? gap : d.gap}
                                />
                                <span className="text-xs font-bold text-fg">{name}</span>
                            </div>
                        );
                    })}
                </div>
            </Stage>
            <div className={`grid gap-3 sm:grid-cols-3 ${ruled ? '' : 'pointer-events-none opacity-40'}`}>
                <div>
                    <div className="mb-1.5 text-xs font-bold text-fg">主要顏色</div>
                    <div className="flex gap-2">
                        {COLORS.map((c, i) => (
                            <button
                                key={c.hex}
                                type="button"
                                aria-label={c.name}
                                aria-pressed={color === i}
                                onClick={() => setColor(i)}
                                className={`h-8 w-8 rounded-full border-2 transition-transform ${color === i ? 'scale-110 border-fg' : 'border-transparent'}`}
                                style={{ background: c.hex }}
                            />
                        ))}
                    </div>
                </div>
                <label className="block text-xs font-bold text-fg">
                    圓角 {radius}px
                    <input type="range" min={0} max={24} value={radius} onChange={(e) => setRadius(+e.target.value)} className="mt-2 block w-full accent-[rgb(var(--color-brand))]" />
                </label>
                <label className="block text-xs font-bold text-fg">
                    間距 {gap}px
                    <input type="range" min={6} max={24} value={gap} onChange={(e) => setGap(+e.target.value)} className="mt-2 block w-full accent-[rgb(var(--color-brand))]" />
                </label>
            </div>
            <Note id={ruled ? 'on' : 'off'}>
                {ruled ? (
                    <>
                        規則只有三個：顏色、圓角、間距。<strong>改一處，整個網站一起變。</strong>
                    </>
                ) : (
                    <>
                        每一頁單獨看都不難看，放在同一個網站就<strong>缺乏一致感</strong>。這就是需要 Design System 的原因。
                    </>
                )}
            </Note>
        </InteractiveFrame>
    );
}
