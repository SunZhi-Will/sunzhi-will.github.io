'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { Stage } from './kit';
import { InteractiveFrame, Verdict } from './InteractiveFrame';
import { ALL_GOOD, EventMock } from './uiMock';

const VERSIONS = [
    { id: 'A', name: '簡約專業', note: '大量留白，一個強調色', accent: '#1d4ed8', radius: 8, bg: '#ffffff', dark: false, fit: '想讓人快速理解並報名' },
    { id: 'B', name: '活潑社群', note: '暖色、大圓角，親切', accent: '#ea580c', radius: 20, bg: '#fff7ed', dark: false, fit: '想營造輕鬆、好相處的氛圍' },
    { id: 'C', name: '科技感', note: '深色背景、亮色重點', accent: '#22d3ee', radius: 4, bg: '#0b1020', dark: true, fit: '想強調技術與未來感' },
];

/** 先比三個方向的首頁區塊，不要一次把三套完整網站都做完 */
export function VersionPicker() {
    const [pick, setPick] = useState<string | null>(null);
    const chosen = VERSIONS.find((v) => v.id === pick);

    return (
        <InteractiveFrame title="先比方向，再決定要做哪一套" kicker="互動展示" hint="同樣的內容，三種視覺方向。點一個你比較喜歡的，看看它適合什麼情境。">
            <div className="grid gap-3 md:grid-cols-3">
                {VERSIONS.map((v) => {
                    const on = pick === v.id;
                    return (
                        <motion.button
                            key={v.id}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setPick(v.id)}
                            whileHover={{ y: -3 }}
                            className={`flex flex-col gap-2 rounded-xl border-2 p-2.5 text-left transition-colors ${on ? 'border-brand bg-brand/10' : 'border-line hover:border-line-strong'}`}
                        >
                            <Stage className="p-2">
                                <EventMock mobile compact fix={ALL_GOOD} accent={v.accent} radius={v.radius} bg={v.bg} dark={v.dark} />
                            </Stage>
                            <span className="flex items-center gap-1.5 px-1 text-sm font-black text-fg">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-fg text-[11px] text-canvas">{v.id}</span>
                                {v.name}
                                {on && <Icon name="check" className="ml-auto h-4 w-4 text-brand-text" />}
                            </span>
                            <span className="px-1 text-xs leading-snug text-fg-body">{v.note}</span>
                        </motion.button>
                    );
                })}
            </div>
            <Verdict id={pick ?? 'none'}>
                {chosen ? (
                    <>
                        選 {chosen.id}：{chosen.name}，適合「{chosen.fit}」。<strong>比較過，才知道自己真正想要什麼。</strong>
                    </>
                ) : (
                    <>與其一直修改同一版卻不知道想要什麼，不如先看幾個明確不同的方向。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
