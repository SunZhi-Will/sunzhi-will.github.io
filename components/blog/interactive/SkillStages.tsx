'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon, type IconName } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const STAGES: {
    name: string;
    icon: IconName;
    goal: string;
    say: string[];
    words: string[];
    verdict: string;
}[] = [
    {
        name: '看得懂',
        icon: 'eye',
        goal: 'AI 給我的程式，我大概知道它在幹嘛。',
        say: ['幫我把這個按鈕改成藍色。', '這段是在幹嘛？'],
        words: ['變數', '函式', '條件判斷', 'Error 訊息'],
        verdict: '這個階段還不需要會寫。能把一段程式用白話講出來，就是進步。',
    },
    {
        name: '改得動',
        icon: 'edit',
        goal: '我開始知道問題大概出在哪一層。',
        say: ['這是一個 Component，我想把它拆成兩個。', '這個資料是從 API 回來的，不是寫死的。'],
        words: ['Component', 'API', 'State', 'Render'],
        verdict: '你學的已經不只是 JavaScript，而是軟體怎麼運作：資料從哪來、畫面為什麼會變。',
    },
    {
        name: '能懷疑',
        icon: 'shield',
        goal: 'AI 走錯方向的時候，我看得出來。',
        say: ['這邊的資料應該從後端拿，不該寫死在前端。', '為了這個小功能要裝三個套件？有必要嗎？'],
        words: ['架構', '權限', '相依套件', '取捨'],
        verdict: 'AI 可以產生很多選項，但最後選哪個方向，仍然是人的工作。',
    },
];

/** 三個階段：看得懂、改得動、能懷疑 */
export function SkillStages() {
    const t = useFrameTheme();
    const [i, setI] = useState(0);
    const stage = STAGES[i];

    return (
        <InteractiveFrame title="你會一階一階往上走" kicker="三個階段" hint="點每個階段，看看那時候你會對 AI 說什麼。">
            <div className="grid grid-cols-3 items-end gap-2">
                {STAGES.map((s, k) => (
                    <button
                        key={s.name}
                        type="button"
                        aria-pressed={i === k}
                        onClick={() => setI(k)}
                        className="group flex flex-col items-stretch gap-1 text-left"
                    >
                        <motion.div
                            initial={false}
                            animate={{ height: 40 + k * 22 }}
                            className={`flex items-end justify-center rounded-t-lg border-x border-t pb-1.5 transition-colors ${i === k ? 'border-brand bg-brand text-brand-on' : k <= i ? 'border-brand/40 bg-brand/15 text-brand-text' : `${t.inset} ${t.faint}`}`}
                        >
                            <Icon name={s.icon} className="h-5 w-5" />
                        </motion.div>
                        <div className={`text-center text-xs font-bold sm:text-sm ${i === k ? t.accent : t.sub}`}>{k + 1}　{s.name}</div>
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait" initial={false}>
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`min-h-[196px] space-y-3 rounded-lg border p-4 ${t.inset}`}>
                    <div className={`text-sm font-bold ${t.text}`}>{stage.goal}</div>
                    <div className="space-y-1.5">
                        <div className={`text-[11px] font-medium tracking-[0.18em] ${t.faint}`}>你可能會這樣說</div>
                        {stage.say.map((line) => (
                            <div key={line} className="inline-block max-w-full rounded-lg border border-line bg-surface px-2.5 py-1 text-xs text-fg">{line}</div>
                        ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`text-[11px] font-medium tracking-[0.18em] ${t.faint}`}>開始聽得懂的詞</span>
                        {stage.words.map((w) => (
                            <span key={w} className="rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success-text">{w}</span>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            <Verdict id={i}>{stage.verdict}</Verdict>
        </InteractiveFrame>
    );
}
