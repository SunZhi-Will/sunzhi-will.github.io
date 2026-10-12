'use client'

import { useState } from 'react';
import { Bubble, Stage } from './kit';
import { InteractiveFrame, Verdict } from './InteractiveFrame';
import { ALL_GOOD, EventMock, type Region } from './uiMock';

const LESSONS: Record<Region, { name: string; learn: string; ask: string }> = {
    title: {
        name: '資訊層級',
        learn: '主標題最大，副標題小一階，一眼知道這頁在講什麼。',
        ask: '請分析它的標題與副標題的字級比例與位置，說明為什麼使用者一眼就能抓到重點。',
    },
    info: {
        name: '資訊整理',
        learn: '日期、地點、費用拆成短標籤，掃一眼就能讀完。',
        ask: '請整理它如何呈現活動資訊，並用同樣的方式整理我的活動日期、地點與費用。',
    },
    cards: {
        name: '留白與卡片',
        learn: '三張卡片等寬、等高、間距固定，內容不多但不擁擠。',
        ask: '請分析它的卡片留白、圓角與排列方式，提供適合我內容的原創版本。',
    },
    cta: {
        name: '按鈕位置',
        learn: '主要按鈕只有一個，顏色最強，次要按鈕退到旁邊。',
        ask: '請觀察它的按鈕層級與位置，讓我的報名按鈕也有清楚的主次。',
    },
};

/** 參考的重點是「它為什麼好看」，不是整個複製 */
export function ReferenceDissect() {
    const [region, setRegion] = useState<Region>('title');
    const l = LESSONS[region];

    return (
        <InteractiveFrame title="拆解一個你喜歡的網站" kicker="互動展示" hint="假設這是你喜歡的參考網站。點它的每個區塊，看看可以學到什麼，以及怎麼請 AI 協助分析。">
            <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
                <Stage className="p-3 sm:p-4">
                    <EventMock fix={ALL_GOOD} dark accent="#facc15" radius={14} focus={region} onFocus={setRegion} />
                </Stage>
                <div className="flex flex-col gap-2.5">
                    <div className="rounded-xl border border-line bg-surface-sunken p-3.5">
                        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-text">可以學到的</div>
                        <div className="mt-1 text-base font-black text-fg">{l.name}</div>
                        <div className="mt-1 text-sm leading-relaxed text-fg-body">{l.learn}</div>
                    </div>
                    <Bubble who="me">{l.ask}</Bubble>
                </div>
            </div>
            <Verdict id={region}>
                當你開始能說出「它哪裡讓我覺得好看」，就已經在<strong>練習設計判斷</strong>了。記得只學方法，不要複製內容。
            </Verdict>
        </InteractiveFrame>
    );
}
