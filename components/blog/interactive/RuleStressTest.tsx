'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, PlusIcon } from '@heroicons/react/24/solid';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const CASES = [
    { name: '受魂系啟發的高難度動作 RPG', copiesExpression: false },
    { name: '種田加居民好感度的農場遊戲', copiesExpression: false },
    { name: '生存建造的方塊遊戲', copiesExpression: false },
    { name: '開放世界加滑翔與攀爬', copiesExpression: false },
    { name: '自走棋類的對戰玩法', copiesExpression: false },
    { name: '把另一款遊戲的角色、圖示、地圖照著重做', copiesExpression: true },
];

/** 把一條判斷規則套到所有案例上，看它有沒有鑑別力 */
export function RuleStressTest() {
    const t = useFrameTheme();
    const [strict, setStrict] = useState(false);

    const flagged = CASES.filter((item) => !strict || item.copiesExpression).length;

    return (
        <InteractiveFrame
            title="把同一條規則套到每一款遊戲上"
            kicker="規則壓力測試"
            hint="下面每一款，都接觸過前作，也都有相似的玩法。"
        >
            <div className={`flex flex-wrap items-center gap-2 rounded-lg border px-3 py-3 text-sm ${t.inset}`}>
                <span className={`mr-1 text-xs ${t.sub}`}>規則</span>
                {['接觸過前作', '有相似的玩法'].map((condition) => (
                    <span key={condition} className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${t.chip}`}>
                        <CheckIcon className="h-3 w-3" />
                        {condition}
                    </span>
                ))}
                <motion.button
                    type="button"
                    aria-pressed={strict}
                    onClick={() => setStrict((v) => !v)}
                    whileTap={{ scale: 0.95 }}
                    animate={strict ? { scale: 1 } : { scale: [1, 1.05, 1] }}
                    transition={strict ? { duration: 0.2 } : { duration: 1.6, repeat: Infinity }}
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
                        strict ? t.chipOn : `border-dashed ${t.accentSoft}`
                    }`}
                >
                    {strict ? <CheckIcon className="h-3 w-3" /> : <PlusIcon className="h-3 w-3" />}
                    具體表達高度相似
                </motion.button>
                <span className={`text-xs font-semibold ${t.text}`}>＝ 抄襲</span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
                {CASES.map((item, index) => {
                    const hit = !strict || item.copiesExpression;
                    return (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className={`relative flex min-h-[58px] items-center overflow-hidden rounded-lg border py-2.5 pl-3 pr-20 text-sm leading-snug ${t.inset} ${t.text}`}
                        >
                            {item.name}
                            <AnimatePresence initial={false}>
                                {hit ? (
                                    <motion.span
                                        key="hit"
                                        initial={{ opacity: 0, scale: 2.2, rotate: -24 }}
                                        animate={{ opacity: 1, scale: 1, rotate: -8 }}
                                        exit={{ opacity: 0, scale: 0.6 }}
                                        transition={{ type: 'spring', stiffness: 420, damping: 20, delay: index * 0.05 }}
                                        className="absolute right-3 rounded border-2 border-red-500 px-1.5 py-0.5 text-xs font-black tracking-widest text-red-500"
                                    >
                                        抄襲
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="clear"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={`absolute right-3 text-xs ${t.faint}`}
                                    >
                                        不成立
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            <Verdict id={String(strict)}>
                {strict ? (
                    <>
                        補上這個條件，只剩 {flagged} 款被判成抄襲，規則才開始有鑑別力。而補上去的，正好就是需要<strong>拿證據逐項比</strong>的那一個。
                    </>
                ) : (
                    <>
                        {flagged} 款全部中獎。照這條規則，大半個遊戲業都是抄襲，代表規則本身少了條件。按一下虛線的那顆試試看。
                    </>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
