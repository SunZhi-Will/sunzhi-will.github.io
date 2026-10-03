'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

interface GliderLook {
    shape: 'delta' | 'foil';
    color: string;
    stripes: boolean;
    streamers: boolean;
    pose: 'grip' | 'hang';
    motion: 'sway' | 'bob';
}

const REFERENCE: GliderLook = {
    shape: 'delta',
    color: '#f59e0b',
    stripes: true,
    streamers: true,
    pose: 'grip',
    motion: 'sway',
};

const OWN: GliderLook = {
    shape: 'foil',
    color: '#14b8a6',
    stripes: false,
    streamers: false,
    pose: 'hang',
    motion: 'bob',
};

const TRAITS: { key: keyof GliderLook; label: string }[] = [
    { key: 'shape', label: '模型外型' },
    { key: 'stripes', label: '貼圖花紋' },
    { key: 'color', label: '配色' },
    { key: 'streamers', label: '特殊裝飾' },
    { key: 'pose', label: '角色姿勢' },
    { key: 'motion', label: '飛行動畫' },
];

const MESSAGES = [
    '共同點只剩「都能滑翔」。這是玩法概念，很多遊戲都有。',
    '有一兩個地方像了。可以拿出來討論，但還說不上什麼。',
    '相似的已經不只是概念，開始進入「具體表達」的比對。',
    '幾乎是把同一支滑翔翼重做一次。這時候就不能只說「大家都有滑翔翼」了。',
];

function Glider({ look, stroke }: { look: GliderLook; stroke: string }) {
    const delta = look.shape === 'delta';
    const tips = delta ? [8, 152] : [22, 138];
    const tipY = delta ? 58 : 60;

    return (
        <motion.svg
            viewBox="0 0 160 124"
            className="h-auto w-full"
            animate={look.motion === 'sway' ? { rotate: [-4, 4, -4], y: 0 } : { rotate: 0, y: [0, -7, 0] }}
            transition={{ duration: look.motion === 'sway' ? 3.2 : 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
            <line x1="56" y1="52" x2="80" y2="78" stroke={stroke} strokeWidth="1" opacity="0.6" />
            <line x1="104" y1="52" x2="80" y2="78" stroke={stroke} strokeWidth="1" opacity="0.6" />

            <AnimatePresence mode="wait" initial={false}>
                <motion.g
                    key={look.shape}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.2 }}
                    style={{ transformOrigin: '80px 46px' }}
                >
                    {delta ? (
                        <motion.polygon points="80,18 152,58 80,46 8,58" animate={{ fill: look.color }} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
                    ) : (
                        <motion.path d="M22 56 Q80 6 138 56 L138 64 Q80 22 22 64 Z" animate={{ fill: look.color }} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
                    )}
                    <motion.g animate={{ opacity: look.stripes ? 0.55 : 0 }} stroke={stroke} strokeWidth="2">
                        {delta ? (
                            <>
                                <line x1="80" y1="20" x2="118" y2="51" />
                                <line x1="80" y1="20" x2="42" y2="51" />
                                <line x1="80" y1="20" x2="80" y2="45" />
                            </>
                        ) : (
                            <>
                                <line x1="51" y1="38" x2="51" y2="48" />
                                <line x1="80" y1="32" x2="80" y2="42" />
                                <line x1="109" y1="38" x2="109" y2="48" />
                            </>
                        )}
                    </motion.g>
                </motion.g>
            </AnimatePresence>

            <motion.g animate={{ opacity: look.streamers ? 1 : 0 }} fill="#ef4444">
                <polygon points={`${tips[0]},${tipY} ${tips[0] - 5},${tipY + 14} ${tips[0] + 4},${tipY + 9}`} />
                <polygon points={`${tips[1]},${tipY} ${tips[1] + 5},${tipY + 14} ${tips[1] - 4},${tipY + 9}`} />
            </motion.g>

            <rect x="75" y="78" width="10" height="10" rx="1.5" fill={stroke} />
            <rect x="74" y="89" width="12" height="14" rx="1.5" fill={stroke} opacity="0.8" />
            <rect x="74.5" y="104" width="4.5" height="9" rx="1" fill={stroke} opacity="0.65" />
            <rect x="81" y="104" width="4.5" height="9" rx="1" fill={stroke} opacity="0.65" />
            {[
                { x1: 74, grip: { x2: 63, y2: 77 }, hang: { x2: 69, y2: 103 } },
                { x1: 86, grip: { x2: 97, y2: 77 }, hang: { x2: 91, y2: 103 } },
            ].map((arm) => (
                <motion.line
                    key={arm.x1}
                    x1={arm.x1}
                    y1="91"
                    initial={arm[look.pose]}
                    animate={arm[look.pose]}
                    stroke={stroke}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            ))}
        </motion.svg>
    );
}

/** 一項一項把滑翔翼「照著做」，看相似程度怎麼從概念滑向具體表達 */
export function GliderSpectrum() {
    const t = useFrameTheme();
    const [copied, setCopied] = useState<Set<keyof GliderLook>>(() => new Set());

    const toggle = (key: keyof GliderLook) =>
        setCopied((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });

    const mine = Object.fromEntries(
        (Object.keys(OWN) as (keyof GliderLook)[]).map((key) => [key, copied.has(key) ? REFERENCE[key] : OWN[key]]),
    ) as unknown as GliderLook;

    const count = copied.size;
    const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : 3;
    // 線條跟著外層的 text-fg-body 走
    const stroke = 'currentColor';

    return (
        <InteractiveFrame
            title="兩款遊戲都有滑翔翼，然後呢？"
            hint="點下面的項目，讓右邊的滑翔翼一項一項「照著左邊做」。"
        >
            <div className="grid grid-cols-2 gap-3">
                {[
                    { name: '被參考的滑翔翼', look: REFERENCE },
                    { name: '我的滑翔翼', look: mine },
                ].map((side) => (
                    <div key={side.name} className={`rounded-lg border px-2 pb-2 pt-3 ${t.inset}`}>
                        <div className="mx-auto max-w-[190px] text-fg-body">
                            <Glider look={side.look} stroke={stroke} />
                        </div>
                        <div className={`mt-1 text-center text-xs font-medium ${t.sub}`}>{side.name}</div>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap gap-2">
                {TRAITS.map((trait) => {
                    const on = copied.has(trait.key);
                    return (
                        <motion.button
                            key={trait.key}
                            type="button"
                            aria-pressed={on}
                            onClick={() => toggle(trait.key)}
                            whileTap={{ scale: 0.94 }}
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${on ? t.chipOn : t.chip}`}
                        >
                            {on ? '✓ ' : '+ '}
                            {trait.label}
                        </motion.button>
                    );
                })}
            </div>

            <div>
                <div className="relative h-2.5 rounded-full bg-gradient-to-r from-zinc-400/40 via-yellow-400 to-red-500">
                    <motion.span
                        className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 shadow border-canvas bg-fg"
                        animate={{ left: `${4 + (count / TRAITS.length) * 92}%` }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    />
                </div>
                <div className={`mt-2 flex justify-between text-[11px] ${t.faint}`}>
                    <span>只有概念相同</span>
                    <span className="hidden sm:inline">中間沒有一條畫得出來的線</span>
                    <span>具體表達高度相似</span>
                </div>
            </div>

            <Verdict id={level}>{MESSAGES[level]}</Verdict>
        </InteractiveFrame>
    );
}
