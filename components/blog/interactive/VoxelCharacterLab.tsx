'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { InteractiveFrame, useFrameTheme } from './InteractiveFrame';

const PALETTES = [
    { name: '荒漠', skin: '#f2c79b', body: '#d97706', limb: '#7c2d12', eye: '#1c1917' },
    { name: '森林', skin: '#d9f2c4', body: '#15803d', limb: '#14532d', eye: '#052e16' },
    { name: '深海', skin: '#c7e3ff', body: '#2563eb', limb: '#1e3a8a', eye: '#0b1437' },
    { name: '虛空', skin: '#e9d5ff', body: '#7e22ce', limb: '#3b0764', eye: '#1e0b36' },
];

const STAGE = { width: 220, height: 232, ground: 214 };
const TORSO = { width: 52, height: 50 };
const SPRING = { type: 'spring', stiffness: 220, damping: 20 } as const;

const blockShadow = 'inset -5px -5px 0 rgba(0,0,0,0.2), inset 4px 4px 0 rgba(255,255,255,0.22)';

interface BlockProps {
    left: number;
    top: number;
    width: number;
    height: number;
    color: string;
    bob?: number;
    children?: React.ReactNode;
}

function Block({ left, top, width, height, color, bob = 0, children }: BlockProps) {
    return (
        <motion.div
            className="absolute"
            initial={false}
            animate={{ left, top, width, height }}
            transition={SPRING}
        >
            <motion.div
                className="relative h-full w-full rounded-[3px]"
                style={{ boxShadow: blockShadow }}
                initial={false}
                animate={{ backgroundColor: color, y: bob ? [0, -bob, 0] : 0 }}
                transition={{
                    backgroundColor: { duration: 0.4 },
                    y: bob ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 },
                }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}

/** 同一個「四肢浮空」概念，調不同旋鈕會長出完全不同的角色 */
export function VoxelCharacterLab() {
    const t = useFrameTheme();
    const [floating, setFloating] = useState(true);
    const [head, setHead] = useState(72);
    const [limb, setLimb] = useState(1.1);
    const [palette, setPalette] = useState(0);

    const colors = PALETTES[palette];
    const cx = STAGE.width / 2;
    const gap = floating ? 9 : 0;

    const footW = 20 * limb;
    const footH = 14 * limb;
    const hand = 18 * limb;
    const footTop = STAGE.ground - footH;
    const torsoTop = footTop - gap - TORSO.height;
    const headTop = torsoTop - 3 - head;
    const handTop = torsoTop + 12;

    const randomize = () => {
        setHead(56 + Math.round(Math.random() * 40));
        setLimb(0.8 + Math.round(Math.random() * 8) / 10);
        setPalette((p) => (p + 1 + Math.floor(Math.random() * (PALETTES.length - 1))) % PALETTES.length);
    };

    const ratio = (head / (TORSO.height + footH)).toFixed(2);

    return (
        <InteractiveFrame
            title="同一個概念，可以長成很多種角色"
            hint="「四肢浮空」在這裡只是一個開關。真正決定角色長成誰的，是其他所有旋鈕。"
        >
            <div className="grid gap-4 sm:grid-cols-[minmax(0,240px)_1fr]">
                <div
                    className={`relative mx-auto w-full max-w-[240px] overflow-hidden rounded-lg border ${t.inset}`}
                    style={{ height: STAGE.height }}
                >
                    <div
                        className="absolute inset-x-0 bottom-0 h-[18px]"
                        style={{ background: t.isDark ? 'rgba(250,204,21,0.12)' : 'rgba(202,138,4,0.14)' }}
                    />
                    <div className="absolute left-1/2 top-0 h-full -translate-x-1/2" style={{ width: STAGE.width }}>
                        <Block left={cx - head / 2} top={headTop} width={head} height={head} color={colors.skin}>
                            <span
                                className="absolute rounded-[2px]"
                                style={{ left: '22%', top: '42%', width: '14%', height: '18%', background: colors.eye }}
                            />
                            <span
                                className="absolute rounded-[2px]"
                                style={{ right: '22%', top: '42%', width: '14%', height: '18%', background: colors.eye }}
                            />
                        </Block>
                        <Block
                            left={cx - TORSO.width / 2}
                            top={torsoTop}
                            width={TORSO.width}
                            height={TORSO.height}
                            color={colors.body}
                        />
                        <Block
                            left={cx - TORSO.width / 2 - gap * 1.3 - hand}
                            top={handTop}
                            width={hand}
                            height={hand}
                            color={colors.skin}
                            bob={floating ? 5 : 0}
                        />
                        <Block
                            left={cx + TORSO.width / 2 + gap * 1.3}
                            top={handTop}
                            width={hand}
                            height={hand}
                            color={colors.skin}
                            bob={floating ? 5 : 0}
                        />
                        <Block left={cx - 14 - footW / 2} top={footTop} width={footW} height={footH} color={colors.limb} />
                        <Block left={cx + 14 - footW / 2} top={footTop} width={footW} height={footH} color={colors.limb} />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className={`mb-2 text-xs font-medium ${t.sub}`}>概念（只有一個開關）</div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={floating}
                            onClick={() => setFloating((v) => !v)}
                            className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                                floating ? t.accentSoft : t.chip
                            }`}
                        >
                            <span>四肢與軀幹分離</span>
                            <span
                                className={`flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 ${
                                    floating ? 'justify-end bg-yellow-400' : t.isDark ? 'justify-start bg-zinc-600' : 'justify-start bg-zinc-300'
                                }`}
                            >
                                <motion.span layout transition={SPRING} className="h-4 w-4 rounded-full bg-white shadow" />
                            </span>
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div className={`text-xs font-medium ${t.sub}`}>具體表達（每一個都是設計選擇）</div>
                        <label className={`block text-sm ${t.text}`}>
                            <span className="flex justify-between">
                                <span>頭身比</span>
                                <span className={`tabular-nums ${t.sub}`}>{ratio}</span>
                            </span>
                            <input
                                type="range"
                                min={56}
                                max={96}
                                value={head}
                                onChange={(e) => setHead(Number(e.target.value))}
                                className="mt-1 w-full accent-yellow-400"
                            />
                        </label>
                        <label className={`block text-sm ${t.text}`}>
                            <span className="flex justify-between">
                                <span>手腳尺寸</span>
                                <span className={`tabular-nums ${t.sub}`}>×{limb.toFixed(1)}</span>
                            </span>
                            <input
                                type="range"
                                min={0.8}
                                max={1.6}
                                step={0.1}
                                value={limb}
                                onChange={(e) => setLimb(Number(e.target.value))}
                                className="mt-1 w-full accent-yellow-400"
                            />
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                            {PALETTES.map((p, i) => (
                                <button
                                    key={p.name}
                                    type="button"
                                    aria-pressed={palette === i}
                                    onClick={() => setPalette(i)}
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                                        palette === i ? t.chipOn : t.chip
                                    }`}
                                >
                                    <span className="h-2.5 w-2.5 rounded-[2px]" style={{ background: p.body }} />
                                    {p.name}
                                </button>
                            ))}
                            <motion.button
                                type="button"
                                onClick={randomize}
                                whileTap={{ scale: 0.94 }}
                                className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${t.button}`}
                            >
                                <SparklesIcon className="h-3.5 w-3.5" />
                                隨機一隻
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </InteractiveFrame>
    );
}
