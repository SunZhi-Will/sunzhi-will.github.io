'use client'

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon, type IconName } from './icons';
import { Bubble, Note, Stage } from './kit';
import { InteractiveFrame } from './InteractiveFrame';
import { ALL_BAD, ALL_GOOD, EventMock, type MockFix } from './uiMock';

const STEPS: { icon: IconName; name: string; prompt: string; out: string; fix: MockFix }[] = [
    {
        icon: 'flag',
        name: '說目的',
        prompt: '我想做 AI 技術交流活動的報名網站，使用者是對 AI 有興趣但不一定有程式背景的人。目的是讓人了解活動並完成報名。先做畫面原型，不需要資料庫。',
        out: '先對齊目的與使用者，AI 才不會自己亂猜。',
        fix: ALL_BAD,
    },
    {
        icon: 'map',
        name: '選方向',
        prompt: '風格簡約專業，但不要像企業內部系統。先提出兩種視覺方向，說明配色、字體與排版，先不要寫完整程式。',
        out: '兩個方向並排比較，選一個。',
        fix: { ...ALL_BAD, contrast: true },
    },
    {
        icon: 'cog',
        name: '立規則',
        prompt: '根據選定的風格，建立簡單的 Design System：主要顏色、文字層級、按鈕、卡片、留白與間距。',
        out: '之後每個頁面都延續同一套規則。',
        fix: { ...ALL_BAD, contrast: true, spacing: true },
    },
    {
        icon: 'monitor',
        name: '做原型',
        prompt: '製作首頁原型：活動介紹、活動資訊與報名區塊。不要增加沒討論過的功能，也不要串接正式資料。',
        out: '可以預覽的畫面，桌面與手機都能檢查。',
        fix: { ...ALL_BAD, contrast: true, spacing: true, hierarchy: true },
    },
    {
        icon: 'edit',
        name: '給意見',
        prompt: '主標題很好，但報名按鈕不夠明顯。請改用強調色，讓活動時間與報名入口更容易找到，其餘維持原樣。',
        out: '具體指出哪裡，AI 只動那一塊。',
        fix: { ...ALL_BAD, contrast: true, spacing: true, hierarchy: true, cta: true },
    },
    {
        icon: 'check',
        name: '接功能',
        prompt: '視覺確定了，現在接報名表單、資料儲存、成功提示與錯誤處理。',
        out: '最後用手機從頭操作一次。',
        fix: ALL_GOOD,
    },
];

/** 從一句話到完成：六步流程，一步一步看畫面長出來 */
export function WorkflowSteps() {
    const [i, setI] = useState(0);
    const [playing, setPlaying] = useState(false);
    const s = STEPS[i];

    useEffect(() => {
        if (!playing) return;
        const t = setTimeout(() => {
            if (i >= STEPS.length - 1) setPlaying(false);
            else setI(i + 1);
        }, 2600);
        return () => clearTimeout(t);
    }, [playing, i]);

    return (
        <InteractiveFrame title="完全不會設計，也能一步一步來" kicker="流程播放" hint="按「播放」，或自己點步驟。看每一步你對 AI 說什麼，以及畫面發生什麼變化。">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                    type="button"
                    onClick={() => {
                        if (i >= STEPS.length - 1) setI(0);
                        setPlaying(!playing);
                    }}
                    aria-label={playing ? '暫停' : '播放'}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fg text-canvas"
                >
                    <Icon name={playing ? 'x' : 'play'} className="h-4 w-4" />
                </button>
                {STEPS.map((st, n) => (
                    <button
                        key={st.name}
                        type="button"
                        aria-pressed={n === i}
                        onClick={() => {
                            setPlaying(false);
                            setI(n);
                        }}
                        className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                            n === i ? 'border-brand bg-brand/15 text-fg' : n < i ? 'border-success/50 text-fg' : 'border-line text-fg-body hover:border-line-strong'
                        }`}
                    >
                        <Icon name={n < i ? 'check' : st.icon} className={`h-3.5 w-3.5 ${n < i ? 'text-success-text' : ''}`} />
                        {n + 1}. {st.name}
                    </button>
                ))}
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_1.1fr]">
                <div className="flex flex-col gap-2.5">
                    <AnimatePresence mode="wait">
                        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2.5">
                            <Bubble who="me">{s.prompt}</Bubble>
                            <Bubble who="ai">{s.out}</Bubble>
                        </motion.div>
                    </AnimatePresence>
                </div>
                <Stage className="p-3 sm:p-4">
                    <EventMock fix={s.fix} />
                </Stage>
            </div>
            <Note id={i}>
                第 {i + 1} 步：{s.name}。<strong>你不是叫 AI 隨機產生畫面，而是在一步一步參與設計。</strong>
            </Note>
        </InteractiveFrame>
    );
}
