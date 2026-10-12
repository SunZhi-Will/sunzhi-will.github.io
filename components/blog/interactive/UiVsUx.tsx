'use client'

import { useState } from 'react';
import { Icon, type IconName } from './icons';
import { motion } from 'framer-motion';
import { Note, Segmented, Stage } from './kit';
import { InteractiveFrame } from './InteractiveFrame';
import { ALL_GOOD, EventMock, type Region } from './uiMock';

const UI_NOTES: Record<Region, { name: string; items: string[] }> = {
    title: { name: '標題', items: ['字體與字級', '字重與顏色', '和下方內容的距離'] },
    info: { name: '活動資訊', items: ['標籤的底色與圓角', '資訊的排列順序', '文字與背景的對比'] },
    cards: { name: '特色卡片', items: ['卡片的圓角與邊框', '卡片之間的間距', '圖片與文字的排版'] },
    cta: { name: '報名按鈕', items: ['按鈕的顏色與大小', '滑過與按下的外觀', '主要與次要的區別'] },
};

const STEPS: { icon: IconName; name: string; problem: string; fix: string; rate: number }[] = [
    { icon: 'globe', name: '進入網站', problem: '手機上載入很慢，頁面一直跳動', fix: '圖片縮小，版面先佔好位置', rate: 88 },
    { icon: 'search', name: '找到報名', problem: '報名按鈕藏在頁面最下面', fix: '首屏就放主要按鈕', rate: 72 },
    { icon: 'edit', name: '填寫表單', problem: '欄位很多，也看不出哪些必填', fix: '只留必要欄位，標明必填', rate: 65 },
    { icon: 'bolt', name: '按下送出', problem: '填錯 Email 才跳出一行紅字', fix: '填的時候就提示哪裡有問題', rate: 80 },
    { icon: 'check', name: '確認成功', problem: '按完沒有任何反應，不知道成功沒', fix: '顯示「報名成功」與下一步', rate: 70 },
];

type View = 'ui' | 'ux';

/** UI 是看得到摸得到的；UX 是從進門到結帳的整段過程 */
export function UiVsUx() {
    const [view, setView] = useState<View>('ui');
    const [region, setRegion] = useState<Region>('cta');
    const [fixed, setFixed] = useState<number[]>([]);

    const toggle = (i: number) => setFixed((f) => (f.includes(i) ? f.filter((x) => x !== i) : [...f, i]));
    // 每一關剩下多少人：沒修好就照流失率掉人，修好後只掉 3%
    const remain = STEPS.reduce<number[]>((acc, s, i) => [...acc, acc[acc.length - 1] * ((fixed.includes(i) ? 97 : s.rate) / 100)], [100]).slice(1);
    const done = Math.round(remain[remain.length - 1]);

    return (
        <InteractiveFrame title="UI 跟 UX 差在哪裡？" kicker="互動展示" hint="UI 是畫面本身，UX 是操作的整個過程。切換兩個視角。">
            <Segmented
                id="uivsux"
                label="視角"
                value={view}
                onChange={setView}
                options={[
                    { value: 'ui', label: 'UI：畫面' },
                    { value: 'ux', label: 'UX：過程' },
                ]}
            />

            {view === 'ui' ? (
                <div className="grid gap-4 md:grid-cols-[1.35fr_1fr]">
                    <Stage className="p-3 sm:p-4">
                        <EventMock fix={ALL_GOOD} focus={region} onFocus={setRegion} />
                    </Stage>
                    <div className="flex flex-col justify-center px-1">
                        <div className="text-xs font-bold text-brand-text">點畫面上的區塊</div>
                        <div className="mt-1 text-2xl font-black text-fg">{UI_NOTES[region].name}</div>
                        <div className="mt-3 flex flex-col gap-2">
                            {UI_NOTES[region].items.map((t) => (
                                <div key={t} className="flex items-center gap-2 text-sm text-fg-body">
                                    <Icon name="eye" className="h-4 w-4 shrink-0 text-brand-text" />
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <Stage className="space-y-1.5 p-3 sm:p-5">
                    {STEPS.map((st, i) => {
                        const ok = fixed.includes(i);
                        const w = remain[i];
                        return (
                            <button key={st.name} type="button" aria-pressed={ok} onClick={() => toggle(i)} className="group grid w-full grid-cols-[4.5rem_1fr_2.5rem] items-center gap-3 text-left sm:grid-cols-[5.5rem_1fr_3rem]">
                                <span className="flex items-center gap-1.5 text-xs font-bold text-fg">
                                    <Icon name={ok ? 'check' : st.icon} className={`h-3.5 w-3.5 shrink-0 ${ok ? 'text-success-text' : 'text-fg-muted'}`} />
                                    {st.name}
                                </span>
                                <span className="relative block h-8">
                                    <motion.span
                                        className={`absolute inset-y-0 left-0 flex items-center overflow-hidden whitespace-nowrap rounded-md px-2.5 text-[11px] font-bold ${ok ? 'bg-success/25 text-success-text' : 'bg-fg/10 text-fg-body group-hover:bg-fg/15'}`}
                                        initial={false}
                                        animate={{ width: `${w}%` }}
                                        transition={{ type: 'spring', stiffness: 140, damping: 20 }}
                                    >
                                        {ok ? st.fix : st.problem}
                                    </motion.span>
                                </span>
                                <span className="text-right text-xs font-black tabular-nums text-fg">{Math.round(w)}</span>
                            </button>
                        );
                    })}
                    <div className="pt-2 text-[11px] font-bold tracking-[0.12em] text-fg-body">100 人進站，每一關剩下的人數。點任一關把問題修掉。</div>
                </Stage>
            )}

            <Note id={view}>
                {view === 'ui' ? (
                    <>
                        UI 是菜單、桌椅與裝潢。<strong className="text-fg">畫面再漂亮，也只是 UX 的一部分。</strong>
                    </>
                ) : (
                    <>
                        UX 是從進門到結帳的整段過程。現在 100 人裡有 <strong className="text-fg">{done} 人</strong>報名成功。
                    </>
                )}
            </Note>
        </InteractiveFrame>
    );
}
