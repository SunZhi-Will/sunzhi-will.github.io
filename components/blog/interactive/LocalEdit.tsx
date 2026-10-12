'use client'

import { useState } from 'react';
import { Icon } from './icons';
import { Bubble, Segmented, Stage } from './kit';
import { InteractiveFrame, Verdict } from './InteractiveFrame';
import { ALL_BAD, EventMock, type MockFix, type Region } from './uiMock';

type Mode = 'local' | 'whole';

const MAP: Partial<Record<Region, keyof MockFix>> = { title: 'hierarchy', cards: 'spacing', cta: 'cta' };


/** 局部修改：圈出哪裡有問題，其他地方原封不動 */
export function LocalEdit() {
    const [mode, setMode] = useState<Mode>('local');
    const [region, setRegion] = useState<Region>('title');
    const [fix, setFix] = useState<MockFix>({ ...ALL_BAD });
    const [lost, setLost] = useState(false);

    const reset = () => {
        setFix({ ...ALL_BAD });
        setLost(false);
    };

    const apply = () => {
        if (mode === 'whole') {
            setFix({ ...fix, hierarchy: true, spacing: true, cta: true, contrast: true });
            setLost(true);
        } else {
            const key = MAP[region];
            if (key) setFix({ ...fix, [key]: true });
        }
    };

    const LOCAL: Record<string, string> = {
        title: '標題太大，把活動時間擠到下方。請縮小並調整間距，其他區塊先不要修改。',
        cards: '特色卡片太擠。請讓卡片有一致的間距，其他區塊先不要修改。',
        cta: '報名按鈕不夠明顯。請改用強調色，其他區塊先不要修改。',
        info: '活動資訊擠成一段。請拆成標籤，其他區塊先不要修改。',
    };
    const prompt = mode === 'whole' ? '整個幫我重新設計。' : LOCAL[region];

    return (
        <InteractiveFrame title="圈出來改，不要整個重做" kicker="情境模擬" hint="先選一個區塊，再比較兩種溝通方式。每次修改之後，看看哪些地方被動到。">
            <Segmented
                id="local"
                label="溝通方式"
                value={mode}
                onChange={(v) => {
                    setMode(v);
                    reset();
                }}
                options={[
                    { value: 'local', label: '只改這一塊' },
                    { value: 'whole', label: '整個重做' },
                ]}
            />
            <div className="grid gap-4 md:grid-cols-[1.3fr_1fr]">
                <Stage className="p-3 sm:p-4">
                    <EventMock fix={fix} focus={mode === 'local' ? region : null} onFocus={mode === 'local' ? setRegion : undefined} accent={lost ? '#db2777' : '#2563eb'} radius={lost ? 0 : 10} />
                </Stage>
                <div className="flex flex-col gap-2.5">
                    <Bubble who="me">{prompt}</Bubble>
                    <div className="flex gap-2">
                        <button type="button" onClick={apply} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-fg px-3 py-2 text-xs font-bold text-canvas hover:bg-fg/90">
                            <Icon name="edit" className="h-4 w-4" />
                            交給 AI 修改
                        </button>
                        <button type="button" onClick={reset} className="rounded-xl border border-line-strong px-3 py-2 text-xs font-bold text-fg hover:bg-surface-raised">
                            重來
                        </button>
                    </div>
                    {lost && (
                        <div className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-xs leading-relaxed text-fg">
                            <div className="mb-1 flex items-center gap-1.5 font-black text-danger-text">
                                <Icon name="warn" className="h-4 w-4" />
                                被一起改掉的地方
                            </div>
                            原本滿意的配色與圓角也變了，現在得再叫 AI 改回來。
                        </div>
                    )}
                </div>
            </div>
            <Verdict id={mode + String(lost)}>
                {mode === 'local' ? (
                    <>
                        <strong>不要只說你不喜歡，要說哪個區域、為什麼。</strong>你不需要懂 CSS，也看得出哪個標題太大。
                    </>
                ) : (
                    <>整個重做很省事，但<strong>喜歡的地方也一起被改掉</strong>，功能甚至可能受到影響。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
