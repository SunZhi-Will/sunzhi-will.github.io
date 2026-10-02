'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const REFLEXES = [
    { see: '高難度動作 RPG', say: '類魂。' },
    { see: '種田＋居民好感度', say: '星露谷。' },
    { see: '生存建造＋方塊', say: 'Minecraft。' },
    { see: '開放世界、滑翔、爬牆', say: '薩爾達。' },
    { see: 'Voxel RPG', say: 'Cube World？' },
];

/** 「這不就 XXX？」：點卡片翻出大腦的第一個聯想 */
export function GenreReflex() {
    const t = useFrameTheme();
    const [flipped, setFlipped] = useState<boolean[]>(() => REFLEXES.map(() => false));

    const flippedCount = flipped.filter(Boolean).length;
    const allFlipped = flippedCount === REFLEXES.length;

    const toggle = (index: number) =>
        setFlipped((prev) => prev.map((value, i) => (i === index ? !value : value)));

    return (
        <InteractiveFrame
            title="「這不就 XXX？」"
            hint="點一下卡片，看看大腦的第一個反應是什麼。"
        >
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                {REFLEXES.map((item, index) => {
                    const on = flipped[index];
                    return (
                        <motion.button
                            key={item.see}
                            type="button"
                            aria-pressed={on}
                            onClick={() => toggle(index)}
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.96 }}
                            className={`relative flex h-24 flex-col items-center justify-center overflow-hidden rounded-lg border px-2 text-center transition-colors ${
                                on ? t.accentSoft : t.chip
                            } ${index === REFLEXES.length - 1 ? 'col-span-2 sm:col-span-1' : ''}`}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {on ? (
                                    <motion.span
                                        key="say"
                                        initial={{ opacity: 0, y: 14, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -14 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-base font-bold"
                                    >
                                        「{item.say}」
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="see"
                                        initial={{ opacity: 0, y: 14 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -14 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-1"
                                    >
                                        <span className={`block text-[11px] ${t.faint}`}>看到</span>
                                        <span className="block text-sm font-medium leading-snug">{item.see}</span>
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </div>

            {allFlipped ? (
                <Verdict id="done">
                    這些都只是<strong>聯想</strong>：拿已知的東西去理解新的東西。從「讓我想到它」到「所以你抄它」，中間還少了很多步。
                </Verdict>
            ) : (
                <div className={`text-xs ${t.faint}`}>
                    已翻開 {flippedCount} / {REFLEXES.length}
                </div>
            )}
        </InteractiveFrame>
    );
}
