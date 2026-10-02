'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowPathIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const IMAGE_BASE = '/blog/2026-10-02-inspiration-vs-plagiarism';

// 其他遊戲的截圖取自各自的官方 Steam 商店頁或官方網站
const SHOTS = [
    { file: 'lineup-cube-world.jpg', game: 'Cube World', mine: false },
    { file: 'lineup-veloren.jpg', game: 'Veloren', mine: false },
    { file: 'lineup-trove.jpg', game: 'Trove', mine: false },
    { file: 'lineup-portal-knights.jpg', game: 'Portal Knights', mine: false },
    { file: 'lineup-staxel.jpg', game: 'Staxel', mine: false },
    { file: 'lineup-stonehearth.jpg', game: 'Stonehearth', mine: false },
    { file: 'lineup-fangjie-1.jpg', game: '方界', mine: true },
    { file: 'lineup-fangjie-2.jpg', game: '方界', mine: true },
];

const MINE_COUNT = SHOTS.filter((shot) => shot.mine).length;

function shuffled() {
    const list = [...SHOTS];
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
}

/** 把幾款方塊風格遊戲的截圖打亂，讓讀者猜哪兩張是《方界》 */
export function VoxelLineup() {
    const t = useFrameTheme();
    const [shots, setShots] = useState(shuffled);
    const [picked, setPicked] = useState<string[]>([]);
    const [revealed, setRevealed] = useState(false);

    const toggle = (file: string) => {
        if (revealed) return;
        setPicked((prev) => {
            if (prev.includes(file)) return prev.filter((f) => f !== file);
            // 選滿之後再點，換掉最早選的那張
            return [...prev, file].slice(-MINE_COUNT);
        });
    };

    const restart = () => {
        setShots(shuffled());
        setPicked([]);
        setRevealed(false);
    };

    const hits = shots.filter((shot) => shot.mine && picked.includes(shot.file)).length;

    return (
        <InteractiveFrame
            title="這裡面只有兩張是《方界》"
            kicker="視覺直覺測試"
            hint="八張截圖來自七款不同的遊戲，順序是打亂的。點選你覺得是《方界》的兩張，再按揭曉。"
        >
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {shots.map((shot, index) => {
                    const isPicked = picked.includes(shot.file);
                    const dimmed = revealed && !shot.mine && !isPicked;
                    return (
                        <motion.button
                            key={shot.file}
                            layout
                            type="button"
                            aria-pressed={isPicked}
                            aria-label={revealed ? shot.game : `第 ${index + 1} 張截圖`}
                            onClick={() => toggle(shot.file)}
                            whileHover={revealed ? undefined : { y: -3 }}
                            whileTap={revealed ? undefined : { scale: 0.97 }}
                            animate={{ opacity: dimmed ? 0.55 : 1 }}
                            transition={{ layout: { type: 'spring', stiffness: 260, damping: 26 } }}
                            className={`relative aspect-video overflow-hidden rounded-md border-2 bg-black bg-cover bg-center ${
                                revealed && shot.mine
                                    ? 'border-yellow-400'
                                    : isPicked
                                        ? revealed ? 'border-red-400' : 'border-yellow-400'
                                        : t.isDark ? 'border-zinc-800' : 'border-zinc-200'
                            } ${revealed ? 'cursor-default' : ''}`}
                            style={{ backgroundImage: `url(${IMAGE_BASE}/${shot.file})` }}
                        >
                            <AnimatePresence>
                                {isPicked && (
                                    <motion.span
                                        key="pick"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                                        className={`absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full ${
                                            revealed && !shot.mine ? 'bg-red-500 text-white' : 'bg-yellow-400 text-black'
                                        }`}
                                    >
                                        {revealed && !shot.mine ? <XMarkIcon className="h-4 w-4" /> : <CheckIcon className="h-4 w-4" />}
                                    </motion.span>
                                )}
                                {revealed && (
                                    <motion.span
                                        key="name"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05 * index }}
                                        className={`absolute inset-x-0 bottom-0 px-2 py-1 text-left text-xs font-semibold ${
                                            shot.mine ? 'bg-yellow-400 text-black' : 'bg-black/75 text-white'
                                        }`}
                                    >
                                        {shot.game}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </div>

            <div className="flex gap-2">
                {revealed ? (
                    <button
                        type="button"
                        onClick={restart}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${t.ghost}`}
                    >
                        <ArrowPathIcon className="h-4 w-4" />
                        重新洗牌再猜一次
                    </button>
                ) : (
                    <motion.button
                        type="button"
                        onClick={() => setRevealed(true)}
                        disabled={picked.length < MINE_COUNT}
                        whileTap={{ scale: 0.97 }}
                        className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-40 ${t.button}`}
                    >
                        {picked.length < MINE_COUNT ? `已選 ${picked.length} / ${MINE_COUNT} 張` : '揭曉'}
                    </motion.button>
                )}
            </div>

            {revealed && (
                <Verdict id={`result-${hits}`}>
                    你猜中 {hits} / {MINE_COUNT} 張。不管猜中幾張，這八張圖都是方塊角色加方塊世界。這種美術語言本來就不是哪一款遊戲獨有的，所以第一眼「很像」很容易發生。
                </Verdict>
            )}

            <div className={`text-[11px] leading-relaxed ${t.faint}`}>
                其他遊戲的截圖取自各自的官方 Steam 商店頁或官方網站，著作權屬各開發者所有，此處僅供比較說明。
            </div>
        </InteractiveFrame>
    );
}
