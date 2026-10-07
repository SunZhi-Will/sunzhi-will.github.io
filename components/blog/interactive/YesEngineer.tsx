'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './icons';
import { Bubble, Stage } from './kit';
import { InteractiveFrame, Verdict } from './InteractiveFrame';

const PROPOSALS = [
    { ai: '我發現目前架構有問題，建議重構整個專案。', files: 14, ask: '哪裡有問題？只改那一塊可以嗎？', reply: '可以。問題在登入檢查寫了兩份，合併成一份就好，只動 2 個檔案。', smallFiles: 2 },
    { ai: '我建議導入新的 State Management。', files: 22, ask: '目前的資料流哪裡不夠用？', reply: '其實還夠用。只有一個頁面比較亂，整理那一頁就行。', smallFiles: 1 },
    { ai: '我建議把資料庫換掉。', files: 38, ask: '換掉會影響哪些功能？', reply: '會動到全部的查詢，資料也要搬。如果只是查詢慢，加一個索引就能改善。', smallFiles: 1 },
    { ai: '要不要順便把架構全部重寫？', files: 90, ask: '重寫後要怎麼確認功能還是對的？', reply: '需要補一整套測試。建議先不重寫，把現有功能的測試補起來再說。', smallFiles: 0 },
];

type Choice = 'yes' | 'ask';

function Ring({ value, label, sub, tone }: { value: number; label: string; sub: string; tone: string }) {
    const r = 34;
    const c = 2 * Math.PI * r;
    return (
        <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 84 84" className="h-12 w-12 shrink-0 -rotate-90 sm:h-[64px] sm:w-[64px]">
                <circle cx="42" cy="42" r={r} fill="none" className="stroke-fg/10" strokeWidth="10" />
                <motion.circle cx="42" cy="42" r={r} fill="none" className={tone} strokeWidth="10" strokeLinecap="round" strokeDasharray={c} initial={false} animate={{ strokeDashoffset: c * (1 - value / 100) }} transition={{ type: 'spring', stiffness: 90, damping: 18 }} />
            </svg>
            <div className="min-w-0">
                <div className="text-lg font-black tabular-nums leading-tight text-fg sm:text-xl">{sub}</div>
                <div className="text-[11px] font-bold leading-tight text-fg-body sm:text-xs">{label}</div>
            </div>
        </div>
    );
}

/** 一路按 Yes 的專案，會在哪一刻失去你的掌握。一次只看一輪對話，不需要捲動 */
export function YesEngineer() {
    const [choices, setChoices] = useState<Choice[]>([]);
    // 剛做完決定、正在看回應的那一輪；null 代表在看下一個提議或最後結果
    const [showing, setShowing] = useState<number | null>(null);
    const step = choices.length;
    const done = step === PROPOSALS.length;

    const files = choices.reduce((sum, c, i) => sum + (c === 'yes' ? PROPOSALS[i].files : PROPOSALS[i].smallFiles), 0);
    const yes = choices.filter((c) => c === 'yes').length;
    const grip = Math.max(5, 100 - choices.reduce((sum, c) => sum + (c === 'yes' ? 28 : 3), 0));
    const failed = done && yes >= 3;
    const finished = done && showing === null;

    const choose = (c: Choice) => {
        setShowing(step);
        setChoices((l) => [...l, c]);
    };
    const reset = () => {
        setChoices([]);
        setShowing(null);
    };

    const scene = finished ? 'end' : showing !== null ? `answer-${showing}` : `ask-${step}`;

    return (
        <InteractiveFrame title="AI 提議，你回答 Yes 還是先問一句？" kicker="情境模擬" hint="你正在跟 AI 一起維護一個小專案。四個提議，每個都做一次決定，看儀表怎麼變。">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="rounded-xl border border-line bg-surface p-2.5 shadow-card sm:p-3">
                    <Ring value={Math.min(100, (files / 164) * 100)} sub={`${files}`} label="改動的檔案" tone="stroke-warning" />
                </div>
                <div className="rounded-xl border border-line bg-surface p-2.5 shadow-card sm:p-3">
                    <Ring value={grip} sub={`${grip}%`} label="你還掌握的程度" tone={grip > 50 ? 'stroke-success' : 'stroke-danger'} />
                </div>
            </div>

            <div className="flex items-center gap-1.5" aria-label="進度">
                {PROPOSALS.map((_, k) => {
                    const c = choices[k];
                    return (
                        <div key={k} className={`flex h-7 flex-1 items-center justify-center rounded-lg text-[11px] font-black transition-colors ${c === 'yes' ? 'bg-danger/15 text-danger-text' : c === 'ask' ? 'bg-success/15 text-success-text' : k === step ? 'border-2 border-brand text-brand-text' : 'bg-fg/5 text-fg-body'}`}>
                            {c === 'yes' ? 'Yes' : c === 'ask' ? '先問' : `提議 ${k + 1}`}
                        </div>
                    );
                })}
            </div>

            <Stage className="p-3">
                <div className="min-h-[196px] sm:min-h-[180px]">
                    <AnimatePresence mode="wait">
                        <motion.div key={scene} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-2.5">
                            {finished ? (
                                failed ? (
                                    <>
                                        <div className="mx-auto w-fit rounded-lg bg-danger px-4 py-1.5 font-mono text-sm font-black text-canvas">Build Failed</div>
                                        <Bubble who="me">怎麼辦？</Bubble>
                                        <Bubble who="ai">建議我們重構。</Bubble>
                                        <Bubble who="me" tone="danger">
                                            Yes（無限循環）
                                        </Bubble>
                                    </>
                                ) : (
                                    <>
                                        <div className="mx-auto flex w-fit items-center gap-1.5 rounded-lg bg-success px-4 py-1.5 text-sm font-black text-canvas">
                                            <Icon name="check" className="h-4 w-4" />Build 通過
                                        </div>
                                        <Bubble who="ai">四個提議都處理完了。改動不多，每一步你都知道為什麼。</Bubble>
                                    </>
                                )
                            ) : showing !== null ? (
                                <>
                                    <Bubble who="me" tone={choices[showing] === 'yes' ? 'danger' : 'success'}>
                                        {choices[showing] === 'yes' ? 'Yes' : PROPOSALS[showing].ask}
                                    </Bubble>
                                    <Bubble who="ai">{choices[showing] === 'yes' ? `好的，已修改 ${PROPOSALS[showing].files} 個檔案。` : PROPOSALS[showing].reply}</Bubble>
                                </>
                            ) : (
                                <Bubble who="ai">{PROPOSALS[step].ai}</Bubble>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </Stage>

            <div className="flex flex-wrap gap-2">
                {finished ? (
                    <button type="button" onClick={reset} className="flex w-full items-center justify-center gap-1.5 rounded-full border border-line-strong py-2 text-xs font-bold text-fg">
                        <Icon name="loop" className="h-3.5 w-3.5" />重來一次
                    </button>
                ) : showing !== null ? (
                    <button type="button" onClick={() => setShowing(null)} className="w-full rounded-full bg-fg py-2 text-xs font-bold text-canvas">
                        {done ? '看結果' : '下一個提議'} →
                    </button>
                ) : (
                    <>
                        <button type="button" onClick={() => choose('yes')} className="rounded-full border-2 border-danger/60 px-5 py-2 text-xs font-black text-danger-text hover:bg-danger/10">
                            Yes
                        </button>
                        <button type="button" onClick={() => choose('ask')} className="min-w-0 flex-1 rounded-full bg-fg px-4 py-2 text-left text-xs font-bold text-canvas">
                            {PROPOSALS[step].ask}
                        </button>
                    </>
                )}
            </div>

            <Verdict id={`${step}-${finished}-${failed}`}>
                {finished ? (
                    failed ? (
                        <>
                            <strong>Yes 工程師</strong>：AI 說什麼都 Yes，程式跑了就算了。直到 Build Failed，你連「哪裡壞掉、剛剛改了什麼」都答不出來。
                        </>
                    ) : (
                        <>
                            先問一句，往往就能把「重寫」縮成「改兩個檔案」。<strong>問題不用問得很專業，重點是不要把決定整個交出去。</strong>
                        </>
                    )
                ) : (
                    <>每個提議聽起來都很合理，這正是它危險的地方。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
