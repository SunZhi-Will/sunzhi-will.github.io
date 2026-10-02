'use client'

import { useEffect, useState } from 'react';
import { animate, motion } from 'framer-motion';
import { HeartIcon, PlusIcon } from '@heroicons/react/24/solid';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const ASPECTS = [
    { key: 'position', label: '位置', same: true },
    { key: 'color', label: '顏色', same: true },
    { key: 'size', label: '長度比例', same: false },
    { key: 'icon', label: '圖示', same: false },
    { key: 'frame', label: '邊框', same: false },
    { key: 'font', label: '字體', same: false },
    { key: 'anim', label: '動畫', same: false },
];

const ALL = ASPECTS.map((aspect) => aspect.key);
const SAME_ONLY = ASPECTS.filter((aspect) => aspect.same).map((aspect) => aspect.key);

function Screen({ name, children }: { name: string; children: React.ReactNode }) {
    return (
        <div className="relative h-28 overflow-hidden rounded-lg border border-black/20 bg-gradient-to-b from-sky-500 to-sky-300 sm:h-32">
            <div className="absolute inset-x-0 bottom-0 h-8 bg-emerald-600" />
            <div className="absolute bottom-6 right-6 h-6 w-6 rounded-[3px] bg-emerald-700" />
            <div className="absolute bottom-2 right-2 rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-medium text-white">
                {name}
            </div>
            <div className="absolute left-2 top-2">{children}</div>
        </div>
    );
}

function AnimatedPercent({ value }: { value: number }) {
    const [shown, setShown] = useState(value);

    useEffect(() => {
        const controls = animate(shown, value, {
            duration: 0.5,
            ease: 'easeOut',
            onUpdate: (latest) => setShown(Math.round(latest)),
        });
        return () => controls.stop();
        // 只在目標值改變時重新啟動動畫
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return <span className="tabular-nums">{shown}</span>;
}

/** 同一組畫面，納入計算的項目不同，算出來的「相似度」就不同 */
export function HudCompare() {
    const t = useFrameTheme();
    const [counted, setCounted] = useState<string[]>(SAME_ONLY);

    const toggle = (key: string) =>
        setCounted((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

    const included = ASPECTS.filter((aspect) => counted.includes(aspect.key));
    const sameCount = included.filter((aspect) => aspect.same).length;
    const percent = included.length === 0 ? 0 : Math.round((sameCount / included.length) * 100);

    return (
        <InteractiveFrame
            title="「九成像」是哪九成？"
            hint="兩款遊戲的血條都在左上角，也都是紅色。選擇你要把哪些項目算進去。"
        >
            <div className="grid grid-cols-2 gap-3">
                <Screen name="遊戲 A">
                    <div className="flex items-center gap-1.5">
                        <HeartIcon className="h-4 w-4 text-red-500 drop-shadow" />
                        <div className="h-2.5 w-20 overflow-hidden rounded-full bg-black/40 sm:w-24">
                            <div className="h-full w-[86%] rounded-full bg-gradient-to-b from-red-400 to-red-600" />
                        </div>
                    </div>
                    <div className="mt-0.5 pl-5 text-[10px] font-medium text-white drop-shadow">86 / 100</div>
                </Screen>
                <Screen name="遊戲 B">
                    <div className="flex items-center gap-1">
                        <span className="flex h-5 w-5 items-center justify-center rounded-[2px] border-2 border-black bg-white">
                            <PlusIcon className="h-3 w-3 text-red-600" />
                        </span>
                        <div className="flex h-5 w-12 gap-[2px] rounded-[2px] border-2 border-black bg-black p-[1px] sm:w-14">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <motion.span
                                    key={i}
                                    className={`flex-1 ${i < 4 ? 'bg-red-500' : 'bg-zinc-700'}`}
                                    animate={i === 3 ? { opacity: [1, 0.35, 1] } : undefined}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                            ))}
                        </div>
                        <span className="font-mono text-[10px] font-bold text-white drop-shadow">HP 86</span>
                    </div>
                </Screen>
            </div>

            <div className="flex flex-wrap gap-2">
                {ASPECTS.map((aspect) => {
                    const on = counted.includes(aspect.key);
                    return (
                        <motion.button
                            key={aspect.key}
                            type="button"
                            aria-pressed={on}
                            onClick={() => toggle(aspect.key)}
                            whileTap={{ scale: 0.94 }}
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${on ? t.chipOn : t.chip}`}
                        >
                            {aspect.label}
                            {on && <span className="ml-1.5 opacity-70">{aspect.same ? '相同' : '不同'}</span>}
                        </motion.button>
                    );
                })}
            </div>

            <div className={`flex flex-wrap items-center gap-x-5 gap-y-3 rounded-lg border px-4 py-3 ${t.inset}`}>
                <div className={`text-4xl font-bold leading-none ${t.accent}`}>
                    <AnimatedPercent value={percent} />
                    <span className="text-2xl">%</span>
                </div>
                <div className={`min-w-[10rem] flex-1 text-xs leading-relaxed ${t.sub}`}>
                    <div>「相似度」＝ 相同的項目 ÷ 算進去的項目</div>
                    <div className="tabular-nums">
                        ＝ {sameCount} ÷ {included.length}
                    </div>
                </div>
                <div className="flex basis-full gap-2 sm:basis-auto">
                    <button
                        type="button"
                        onClick={() => setCounted(SAME_ONLY)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${t.ghost}`}
                    >
                        只算像的
                    </button>
                    <button
                        type="button"
                        onClick={() => setCounted(ALL)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${t.ghost}`}
                    >
                        全部都算
                    </button>
                </div>
            </div>

            <Verdict id={included.length === 0 ? 'none' : 'some'}>
                {included.length === 0
                    ? '什麼都不算，就什麼都說不了。'
                    : '畫面完全沒變，數字卻跟著你選的項目跑。所以「九成像」要先講清楚：是哪九成？'}
            </Verdict>
        </InteractiveFrame>
    );
}
