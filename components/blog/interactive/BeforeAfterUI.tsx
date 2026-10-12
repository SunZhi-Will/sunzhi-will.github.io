'use client'

import { useEffect, useState } from 'react';
import { animate, motion, useReducedMotion } from 'framer-motion';
import { Icon } from './icons';
import { Note, Stage } from './kit';
import { InteractiveFrame } from './InteractiveFrame';
import { ALL_BAD, ALL_GOOD, EventMock } from './uiMock';

const DIFFS = ['標題縮小一階', '資訊拆成標籤', '主按鈕用強調色', '卡片有固定間距'];

/** 同一頁的前後對照：拖動分隔線，左邊是 AI 第一版，右邊是調整之後 */
export function BeforeAfterUI() {
    const [pos, setPos] = useState(50);
    const [touched, setTouched] = useState(false);
    const reduce = useReducedMotion();

    // 進場時把手自己左右晃一下，提示可以拖
    useEffect(() => {
        if (touched || reduce) return;
        const controls = animate(50, [50, 70, 30, 50], { duration: 2.2, delay: 0.8, ease: 'easeInOut', onUpdate: setPos });
        return () => controls.stop();
    }, [touched, reduce]);

    // 「調整之後」露出越多，亮起的改善點越多
    const shown = Math.round(((100 - pos) / 100) * DIFFS.length);

    return (
        <InteractiveFrame title="功能都有，但哪裡不對勁？" kicker="修改前後" hint="需求全部完成了。拖動中間的分隔線比較看看。">
            <Stage className="p-3 sm:p-5">
                <div className="relative grid select-none">
                    <div style={{ gridArea: '1 / 1' }}>
                        <EventMock fix={ALL_BAD} className="h-full" />
                    </div>
                    <div style={{ gridArea: '1 / 1', clipPath: `inset(0 0 0 ${pos}%)` }}>
                        <EventMock fix={ALL_GOOD} className="h-full" />
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-brand" style={{ left: `${pos}%` }}>
                        <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-brand-on shadow-pop">
                            <Icon name="loop" className="h-4 w-4" />
                        </span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={pos}
                        aria-label="前後對照分隔線"
                        onChange={(e) => {
                            setTouched(true);
                            setPos(+e.target.value);
                        }}
                        onPointerDown={() => setTouched(true)}
                        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
                    />
                </div>
                <div className="mt-3 flex justify-between text-[11px] font-bold tracking-[0.12em] text-fg">
                    <span>AI 第一版</span>
                    <span>調整之後</span>
                </div>
            </Stage>
            <div className="flex flex-wrap gap-2">
                {DIFFS.map((d, i) => {
                    const on = i < shown;
                    return (
                        <motion.span
                            key={d}
                            animate={{ opacity: on ? 1 : 0.35 }}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${on ? 'bg-success/15 text-success-text' : 'bg-fg/5 text-fg-body'}`}
                        >
                            <Icon name="check" className="h-3.5 w-3.5" />
                            {d}
                        </motion.span>
                    );
                })}
            </div>
            <Note id="ba">
                功能一個都沒多，也沒少。<strong className="text-fg">能用不等於好用</strong>，差別全在順序、輕重與留白。
            </Note>
        </InteractiveFrame>
    );
}
