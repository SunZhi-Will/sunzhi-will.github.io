'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Segmented, Stage } from './kit';
import { InteractiveFrame, Verdict } from './InteractiveFrame';
import { ALL_BAD, ALL_GOOD, EventMock, Mark } from './uiMock';

const POINTS = [
    { bad: '標題太大，把活動時間擠到畫面下方', good: '標題縮小一階，日期與地點一眼就看到' },
    { bad: '資訊全部擠成一段小字', good: '日期、地點、費用拆成三個標籤' },
    { bad: '所有按鈕都是同一個灰色', good: '主要按鈕用強調色，次要按鈕退後' },
    { bad: '卡片貼在一起，沒有呼吸空間', good: '卡片有固定間距與一致的圓角' },
];

/** 功能完成、好看、好用是三件事：同一頁切換前後 */
export function BeforeAfterUI() {
    const [after, setAfter] = useState(false);

    return (
        <InteractiveFrame title="功能都有，但哪裡不對勁？" kicker="修改前後" hint="這個活動報名頁的需求全部完成了：有介紹、有時間、有表單、按鈕也能點。切換看看差在哪裡。">
            <Segmented
                id="ba-ui"
                label="修改前後"
                value={after ? 'after' : 'before'}
                onChange={(v) => setAfter(v === 'after')}
                options={[
                    { value: 'before', label: 'AI 第一版' },
                    { value: 'after', label: '調整之後' },
                ]}
            />
            <div className="grid gap-4 md:grid-cols-[1.35fr_1fr]">
                <Stage className="p-3 sm:p-4">
                    <EventMock fix={after ? ALL_GOOD : ALL_BAD} />
                </Stage>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                    {POINTS.map((p) => (
                        <motion.li
                            key={p.bad}
                            layout
                            className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm leading-snug text-fg ${after ? 'border-success/40 bg-success/10' : 'border-danger/40 bg-danger/10'}`}
                        >
                            <Mark ok={after} />
                            <span>{after ? p.good : p.bad}</span>
                        </motion.li>
                    ))}
                </ul>
            </div>
            <Verdict id={after ? 'a' : 'b'}>
                {after ? (
                    <>
                        功能一個都沒有多，也沒有少。差別全在<strong>資訊的順序、顏色的輕重與留白</strong>。
                    </>
                ) : (
                    <>
                        需求「有活動介紹、有表單、有按鈕」都達成了，但<strong>能用不等於好用</strong>。
                    </>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
