'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const PROPOSALS = [
    { ai: '我發現目前架構有問題，建議重構整個專案。', files: 14, ask: '哪個地方有問題？只改那一塊可以嗎？', reply: '可以。問題在登入檢查寫了兩份，先合併成一份就好，只動 2 個檔案。', smallFiles: 2 },
    { ai: '我建議導入新的 State Management。', files: 22, ask: '目前的資料流哪裡不夠用？', reply: '其實還夠用。只有一個頁面比較亂，整理那一頁就行。', smallFiles: 1 },
    { ai: '我建議把資料庫換掉。', files: 38, ask: '換掉會影響哪些功能？現有資料怎麼辦？', reply: '會動到全部的查詢，資料也要搬。如果只是查詢慢，加一個索引就能改善。', smallFiles: 1 },
    { ai: '要不要順便把架構全部重寫？', files: 90, ask: '重寫之後，我要怎麼確認功能還是對的？', reply: '需要補一整套測試。建議先不重寫，把現有功能的測試補起來再說。', smallFiles: 0 },
];

type Choice = 'yes' | 'ask';

/** 一路按 Yes 的專案，會在哪一刻失去你的掌握 */
export function YesEngineer() {
    const t = useFrameTheme();
    const [choices, setChoices] = useState<Choice[]>([]);
    const step = choices.length;
    const done = step === PROPOSALS.length;

    const files = choices.reduce((sum, c, i) => sum + (c === 'yes' ? PROPOSALS[i].files : PROPOSALS[i].smallFiles), 0);
    const yes = choices.filter((c) => c === 'yes').length;
    const grip = Math.max(5, 100 - choices.reduce((sum, c) => sum + (c === 'yes' ? 28 : 4), 0));
    const failed = done && yes >= 3;

    return (
        <InteractiveFrame title="AI 提議，你回答 Yes 還是先問一句？" kicker="情境模擬" hint="你正在跟 AI 一起維護一個小專案。每個提議都做一次決定。">
            <div className="grid gap-3 sm:grid-cols-2">
                <div className={`rounded-lg border p-3 ${t.inset}`}>
                    <div className={`mb-1 flex items-baseline justify-between text-xs font-bold ${t.text}`}>
                        <span>已改動的檔案</span>
                        <span className="tabular-nums">{files}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-fg/10">
                        <motion.div className="h-full rounded-full bg-warning" initial={false} animate={{ width: `${Math.min(100, (files / 120) * 100)}%` }} transition={{ type: 'spring', stiffness: 110, damping: 18 }} />
                    </div>
                </div>
                <div className={`rounded-lg border p-3 ${t.inset}`}>
                    <div className={`mb-1 flex items-baseline justify-between text-xs font-bold ${t.text}`}>
                        <span>你還掌握的程度</span>
                        <span className="tabular-nums">{grip}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-fg/10">
                        <motion.div className={`h-full rounded-full ${grip > 50 ? 'bg-success' : 'bg-danger'}`} initial={false} animate={{ width: `${grip}%` }} transition={{ type: 'spring', stiffness: 110, damping: 18 }} />
                    </div>
                </div>
            </div>

            <div className={`min-h-[212px] space-y-2 rounded-lg border p-3 ${t.inset}`}>
                {choices.map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1.5">
                        <div className={`text-xs ${t.sub}`}>
                            <span className="mr-1.5 font-bold">AI</span>{PROPOSALS[i].ai}
                        </div>
                        <div className="text-right">
                            <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-bold ${c === 'yes' ? 'bg-danger/15 text-danger-text' : 'bg-success/15 text-success-text'}`}>
                                {c === 'yes' ? 'Yes' : PROPOSALS[i].ask}
                            </span>
                        </div>
                        {c === 'ask' && (
                            <div className={`text-xs ${t.sub}`}>
                                <span className="mr-1.5 font-bold">AI</span>{PROPOSALS[i].reply}
                            </div>
                        )}
                    </motion.div>
                ))}
                <AnimatePresence mode="wait" initial={false}>
                    {!done ? (
                        <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
                            <div className={`text-sm font-semibold ${t.text}`}>
                                <span className="mr-1.5 text-xs font-bold text-brand-text">AI</span>{PROPOSALS[step].ai}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button type="button" onClick={() => setChoices((c) => [...c, 'yes'])} className={`rounded-full border px-3.5 py-1.5 text-xs font-bold ${t.chip}`}>Yes</button>
                                <button type="button" onClick={() => setChoices((c) => [...c, 'ask'])} className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${t.button}`}>{PROPOSALS[step].ask}</button>
                            </div>
                        </motion.div>
                    ) : failed ? (
                        <motion.div key="fail" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-2">
                            <div className="rounded-md border border-danger/50 bg-danger/10 px-3 py-2 font-mono text-xs font-bold text-danger-text">Build Failed</div>
                            <div className={`text-xs ${t.sub}`}><span className="mr-1.5 font-bold">你</span>怎麼辦？</div>
                            <div className={`text-xs ${t.sub}`}><span className="mr-1.5 font-bold">AI</span>建議我們重構。</div>
                            <div className="text-right text-xs font-bold text-danger-text">Yes。（無限循環）</div>
                        </motion.div>
                    ) : (
                        <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-md border border-success/50 bg-success/10 px-3 py-2 text-xs font-bold text-success-text">
                            <Icon name="check" className="mr-1 inline h-3.5 w-3.5 align-text-bottom" />專案還在你手上，而且你知道每一步為什麼要做。
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex items-center gap-3">
                <button type="button" onClick={() => setChoices([])} className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold ${t.ghost}`}>
                    <Icon name="loop" className="mr-1 inline h-3.5 w-3.5 align-text-bottom" />重來一次
                </button>
                <span className={`text-xs ${t.sub}`}>已決定 {step} / {PROPOSALS.length}</span>
            </div>

            <Verdict id={`${step}-${failed}`}>
                {done ? (
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
