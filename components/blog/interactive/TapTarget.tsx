'use client'

import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Note, Slider, Stage } from './kit';
import { InteractiveFrame } from './InteractiveFrame';

// 手機畫面 375px 寬，畫成 300 個單位
const K = 0.8;
const FINGER = 44;
const GAP = 8;
const LABELS = ['收藏', '報名', '分享'];

/** 手指不是滑鼠：按鈕太小就會點到隔壁 */
export function TapTarget() {
    const [size, setSize] = useState(24);
    const ref = useRef<SVGSVGElement>(null);
    const inView = useInView(ref);
    const reduce = useReducedMotion();
    const pulse = inView && !reduce;
    const s = size * K;
    const gap = GAP * K;
    const total = s * 3 + gap * 2;
    const x0 = 160 - total / 2;
    const cy = 190;
    const cx = x0 + s * 1.5 + gap;
    const r = (FINGER * K) / 2;
    const hitsNeighbor = FINGER / 2 > size / 2 + GAP;
    const ok = size >= 44;

    return (
        <InteractiveFrame title="手指比滑鼠粗很多" kicker="手機操作" hint="電腦上用滑鼠點得很準，手機上是用手指。調整按鈕大小，看手指壓下去會碰到哪些按鈕。">
            <Stage className="flex justify-center p-4 sm:p-6">
                <svg ref={ref} viewBox="0 0 320 300" className="block w-full" style={{ maxWidth: 340 }} role="img" aria-label={`按鈕 ${size}px，${hitsNeighbor ? '會碰到隔壁按鈕' : '不會碰到隔壁'}`}>
                    <rect x="10" y="10" width="300" height="280" rx="28" fill="#ffffff" stroke="#d4d4d8" strokeWidth="2" />
                    <rect x="30" y="44" width="150" height="14" rx="4" fill="#111827" />
                    <rect x="30" y="68" width="230" height="5" rx="2.5" fill="#c7cbd3" />
                    <rect x="30" y="80" width="180" height="5" rx="2.5" fill="#c7cbd3" />
                    {LABELS.map((l, i) => {
                        const x = x0 + i * (s + gap);
                        const mid = i === 1;
                        const touched = !mid && hitsNeighbor;
                        return (
                            <motion.rect
                                key={l}
                                initial={false}
                                animate={{ x, y: cy - s / 2, width: s, height: s }}
                                transition={{ type: 'spring', stiffness: 240, damping: 26 }}
                                rx={Math.min(10, s / 4)}
                                fill={mid ? '#2563eb' : touched ? '#ef4444' : '#e5e7eb'}
                            />
                        );
                    })}
                    <motion.circle
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill="#f59e0b"
                        fillOpacity="0.35"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        animate={pulse ? { scale: [1, 0.86, 1] } : { scale: 1 }}
                        transition={pulse ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
                        style={{ originX: `${cx}px`, originY: `${cy}px` }}
                    />
                    <text x="160" y="258" textAnchor="middle" className="text-[12px] font-bold" fill="#374151">
                        橘色圓 = 指腹大約 44px
                    </text>
                </svg>
            </Stage>
            <Slider label="按鈕大小" value={size} min={16} max={56} onChange={setSize} display={`${size}px`} />
            <Note id={hitsNeighbor ? 'h' : ok ? 'ok' : 'm'}>
                {hitsNeighbor ? (
                    <>
                        <strong className="text-fg">想按報名，卻會連隔壁一起碰到。</strong>電腦上看起來剛好的小按鈕，到手機上就容易點錯。
                    </>
                ) : ok ? (
                    <>44px 以上，手指可以穩穩按到。這也是 Apple 建議的最小點擊範圍。</>
                ) : (
                    <>不會碰到隔壁了，但還是小於 44px，按起來要特別瞄準。</>
                )}
            </Note>
        </InteractiveFrame>
    );
}
