'use client'

import { useState } from 'react';
import { Icon } from './icons';
import { Bubble, Note, Stage } from './kit';
import { InteractiveFrame } from './InteractiveFrame';
import { ALL_BAD, ALL_GOOD, EventMock } from './uiMock';

interface Look {
    accent: string;
    radius: number;
    dark?: boolean;
    bg?: string;
}

const PROMPTS = [
    {
        id: 'pretty',
        text: '再好看一點。',
        looks: [
            { accent: '#ec4899', radius: 24, bg: 'linear-gradient(135deg,#fdf2f8,#ede9fe)' },
            { accent: '#16a34a', radius: 0, bg: '#f0fdf4' },
            { accent: '#f59e0b', radius: 14, bg: '#fffbeb' },
        ] as Look[],
    },
    {
        id: 'tech',
        text: '更有科技感一點。',
        looks: [
            { accent: '#22d3ee', radius: 4, dark: true, bg: '#020617' },
            { accent: '#a855f7', radius: 16, dark: true, bg: 'linear-gradient(135deg,#1e1b4b,#000000)' },
            { accent: '#84cc16', radius: 0, dark: true, bg: '#000000' },
        ] as Look[],
    },
    {
        id: 'specific',
        text: '標題太大，把活動時間擠到畫面下方。請縮小標題、把日期地點做成標籤，報名按鈕用強調色，其他區塊先不要動。',
        looks: [{ accent: '#2563eb', radius: 10 }] as Look[],
    },
];

/** 「再好看一點」每次都是擲骰子；說出哪裡不好才會往前走 */
export function VaguePrompt() {
    const [pick, setPick] = useState(0);
    const [rolls, setRolls] = useState<Record<string, number>>({});
    const prompt = PROMPTS[pick];
    const roll = rolls[prompt.id] ?? 0;
    const look = prompt.looks[roll % prompt.looks.length];
    const specific = prompt.id === 'specific';

    return (
        <InteractiveFrame title="同一頁，三種說法" kicker="情境模擬" hint="選一句話交給 AI。模糊的說法可以重新產生，看看結果是不是每次都不同。">
            <div className="grid gap-4 md:grid-cols-[1fr_1.1fr]">
                <div className="flex flex-col gap-2.5">
                    {PROMPTS.map((p, i) => (
                        <button
                            key={p.id}
                            type="button"
                            aria-pressed={pick === i}
                            onClick={() => setPick(i)}
                            className={`rounded-xl border px-3 py-2.5 text-left text-sm leading-snug transition-colors ${
                                pick === i ? 'border-brand bg-brand/15 font-bold text-fg' : 'border-dashed border-brand/60 text-fg hover:bg-brand/10'
                            }`}
                        >
                            {p.text}
                        </button>
                    ))}
                    <Bubble who="me">{prompt.text}</Bubble>
                    <Bubble who="ai" tone={specific ? 'success' : undefined}>
                        {specific ? '好，只動標題、資訊與按鈕，其餘維持原樣。' : '好的，我換了一個設計方向。'}
                    </Bubble>
                    {!specific && (
                        <button
                            type="button"
                            onClick={() => setRolls((r) => ({ ...r, [prompt.id]: roll + 1 }))}
                            className="flex items-center justify-center gap-1.5 rounded-xl border border-line-strong px-3 py-2 text-xs font-bold text-fg hover:bg-surface-raised"
                        >
                            <Icon name="loop" className="h-4 w-4" />
                            重新產生（第 {roll + 1} 次）
                        </button>
                    )}
                </div>
                <Stage className="p-3 sm:p-4">
                    <EventMock fix={specific ? ALL_GOOD : ALL_BAD} accent={look.accent} radius={look.radius} dark={look.dark} bg={look.bg} />
                </Stage>
            </div>
            <Note id={prompt.id + roll}>
                {specific ? (
                    <>
                        說出<strong>哪裡不好、希望變成什麼</strong>，AI 才有方向，其他地方也不會被誤傷。
                    </>
                ) : (
                    <>
                        顏色與風格換了，但<strong>資訊還是擠成一團、按鈕還是不明顯</strong>。「好看」對 AI 來說只是亂猜一個方向。
                    </>
                )}
            </Note>
        </InteractiveFrame>
    );
}
