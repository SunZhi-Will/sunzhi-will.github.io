'use client'

import { useState } from 'react';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const W = 560;
const H = 220;
const PAD = { l: 38, r: 14, t: 14, b: 30 };
const MONTHS = 24;

const LINES = [
    { id: 'ui', name: '某個工具的介面操作', cls: 'stroke-danger', dot: 'bg-danger', fn: (m: number) => 100 * Math.exp(-m / 5) },
    { id: 'fw', name: '某個框架的寫法教學', cls: 'stroke-warning', dot: 'bg-warning', fn: (m: number) => 100 * Math.exp(-m / 12) },
    { id: 'self', name: '自己把新東西弄懂的能力', cls: 'stroke-success', dot: 'bg-success', fn: (m: number) => 100 - m * 0.15 },
];

const x = (m: number) => PAD.l + (m / MONTHS) * (W - PAD.l - PAD.r);
const y = (v: number) => PAD.t + (1 - v / 100) * (H - PAD.t - PAD.b);

function path(fn: (m: number) => number) {
    return Array.from({ length: MONTHS + 1 }, (_, m) => `${m === 0 ? 'M' : 'L'}${x(m).toFixed(1)},${y(fn(m)).toFixed(1)}`).join(' ');
}

/** 示意圖：不同種類的知識，保鮮期差很多 */
export function SkillDecay() {
    const t = useFrameTheme();
    const [m, setM] = useState(12);

    return (
        <InteractiveFrame title="哪些知識放半年還能用？" kicker="示意圖表" hint="拖曳下面的滑桿，看過了幾個月之後，三種知識還剩多少用處。曲線是示意，不是統計。">
            <div className={`rounded-lg border p-2 sm:p-3 ${t.inset}`}>
                <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label="三種知識隨時間變得不適用的示意曲線">
                    {[0, 50, 100].map((v) => (
                        <g key={v}>
                            <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} className="stroke-line" strokeWidth="1" />
                            <text x={PAD.l - 6} y={y(v) + 4} textAnchor="end" className="fill-fg-body text-[11px]">{v}</text>
                        </g>
                    ))}
                    {[0, 6, 12, 18, 24].map((mm) => (
                        <text key={mm} x={x(mm)} y={H - 10} textAnchor={mm === MONTHS ? 'end' : 'middle'} className="fill-fg-body text-[11px]">{mm} 個月</text>
                    ))}
                    {LINES.map((l) => (
                        <path key={l.id} d={path(l.fn)} fill="none" className={l.cls} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    ))}
                    <line x1={x(m)} x2={x(m)} y1={PAD.t} y2={H - PAD.b} className="stroke-fg" strokeWidth="1.5" strokeDasharray="4 4" />
                    {LINES.map((l) => (
                        <circle key={l.id} cx={x(m)} cy={y(l.fn(m))} r="5" className={l.id === 'ui' ? 'fill-danger' : l.id === 'fw' ? 'fill-warning' : 'fill-success'} />
                    ))}
                </svg>
            </div>

            <input type="range" min={0} max={MONTHS} value={m} onChange={(e) => setM(Number(e.target.value))} aria-label="經過的月數" className="w-full accent-[rgb(var(--color-brand))]" />

            <div className="grid gap-2 sm:grid-cols-3">
                {LINES.map((l) => (
                    <div key={l.id} className={`rounded-lg border px-3 py-2 ${t.inset}`}>
                        <div className={`flex items-center gap-1.5 text-xs font-bold ${t.text}`}>
                            <span className={`h-2.5 w-2.5 rounded-full ${l.dot}`} />
                            {l.name}
                        </div>
                        <div className={`text-xl font-black tabular-nums ${t.text}`}>{Math.round(l.fn(m))}</div>
                    </div>
                ))}
            </div>

            <Verdict id={m >= 12 ? 'late' : 'early'}>
                {m >= 12 ? (
                    <>過了 {m} 個月，介面和寫法都可能換了。<strong>「遇到不知道的東西，我知道怎麼把它弄懂」</strong>幾乎沒變。工具越更新得快，這個能力越值錢。</>
                ) : (
                    <>剛學完的時候三種都很有用。把滑桿往右拉，看哪一條掉得最快。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
