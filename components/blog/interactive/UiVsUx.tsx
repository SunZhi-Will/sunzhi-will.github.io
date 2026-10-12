'use client'

import { useState } from 'react';
import { Icon, type IconName } from './icons';
import { Meter, Segmented, Stage } from './kit';
import { InteractiveFrame, Verdict } from './InteractiveFrame';
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
    const done = Math.round(STEPS.reduce((acc, s, i) => acc * ((fixed.includes(i) ? 97 : s.rate) / 100), 1) * 100);

    return (
        <InteractiveFrame title="UI 跟 UX 差在哪裡？" kicker="互動展示" hint="UI 是畫面本身；UX 是使用者操作的整個過程。切換兩個視角，各點一點。">
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
                    <div className="rounded-xl border border-line bg-surface-sunken p-4">
                        <div className="text-xs font-bold text-brand-text">點左邊的區塊，看 UI 在管什麼</div>
                        <div className="mt-2 text-lg font-black text-fg">{UI_NOTES[region].name}</div>
                        <ul className="mt-2 flex list-none flex-col gap-1.5 p-0">
                            {UI_NOTES[region].items.map((t) => (
                                <li key={t} className="flex items-center gap-2 text-sm text-fg-body">
                                    <Icon name="eye" className="h-4 w-4 shrink-0 text-brand-text" />
                                    {t}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <Stage className="p-3 sm:p-4">
                        <div className="grid gap-2 sm:grid-cols-5">
                            {STEPS.map((s, i) => {
                                const ok = fixed.includes(i);
                                return (
                                    <button
                                        key={s.name}
                                        type="button"
                                        aria-pressed={ok}
                                        onClick={() => toggle(i)}
                                        className={`flex flex-col gap-1.5 rounded-xl border p-3 text-left transition-colors ${ok ? 'border-success/50 bg-success/10' : 'border-danger/40 bg-danger/10'}`}
                                    >
                                        <span className="flex items-center gap-1.5 text-xs font-black text-fg">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-fg text-[11px] text-canvas">{i + 1}</span>
                                            {s.name}
                                        </span>
                                        <span className="text-xs leading-snug text-fg-body">{ok ? s.fix : s.problem}</span>
                                        <Icon name={s.icon} className={`h-4 w-4 ${ok ? 'text-success-text' : 'text-danger-text'}`} />
                                    </button>
                                );
                            })}
                        </div>
                    </Stage>
                    <Meter label="從進站走到報名成功的人" value={done} suffix="%" tone={done > 80 ? 'success' : done > 55 ? 'warning' : 'danger'} />
                </div>
            )}

            <Verdict id={view + fixed.length}>
                {view === 'ui' ? (
                    <>
                        餐廳的菜單、桌椅與裝潢是 UI。<strong>畫面再漂亮，也只是 UX 的一部分。</strong>
                    </>
                ) : (
                    <>
                        UX 是從進門、找座位、點餐到結帳的整段過程。點每一關把問題修掉，看有多少人能走到最後。已改善 {fixed.length} / {STEPS.length} 關。
                    </>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
