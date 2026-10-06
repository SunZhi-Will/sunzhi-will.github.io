'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const NODES = [
    { icon: 'user' as const, tech: '使用者', role: '客人' },
    { icon: 'monitor' as const, tech: '前端', role: '服務生' },
    { icon: 'mail' as const, tech: 'API', role: '點菜單' },
    { icon: 'cog' as const, tech: '後端', role: '廚房' },
    { icon: 'db' as const, tech: '資料庫', role: '食材庫' },
];

// active：目前亮起的節點；at：封包所在的節點；back：封包是不是在回程
const STEPS = [
    { active: -1, at: 0, back: false, label: '', text: '想像你在餐廳點菜。按下面的按鈕，看一次「登入」是怎麼跑完的。' },
    { active: 0, at: 0, back: false, label: '按下登入', text: '你在畫面上按下「登入」。這個動作發生在你的手機或電腦上。' },
    { active: 1, at: 1, back: false, label: 'Email、密碼', text: '前端收到點擊，把 Email 和密碼包起來。就像服務生把你點的菜寫成單子。' },
    { active: 2, at: 2, back: false, label: 'POST /login', text: '單子透過 API 送出去。API 是前端和後端約好的「點菜格式」。' },
    { active: 3, at: 3, back: false, label: '驗證中', text: '後端開始處理：帳號存在嗎？密碼正確嗎？這個人有什麼權限？' },
    { active: 4, at: 4, back: false, label: '查帳號', text: '需要資料的時候，後端再去資料庫翻出來。' },
    { active: 3, at: 3, back: true, label: '登入成功', text: '後端把結果整理好，準備送回去。' },
    { active: 1, at: 1, back: true, label: '歡迎回來', text: '結果沿著原路回到前端，前端負責把畫面換成「歡迎回來」。' },
    { active: 0, at: 0, back: true, label: '', text: '你看到了登入後的畫面。整個過程你只碰到前端，廚房裡發生什麼事你看不到。' },
];

/** 用餐廳比喻，一步一步跑完一次登入 */
export function RestaurantOrder() {
    const t = useFrameTheme();
    const [step, setStep] = useState(0);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        if (!playing) return;
        if (step >= STEPS.length - 1) {
            setPlaying(false);
            return;
        }
        const timer = setTimeout(() => setStep((s) => s + 1), 1700);
        return () => clearTimeout(timer);
    }, [playing, step]);

    const current = STEPS[step];
    const finished = step === STEPS.length - 1;

    const start = () => {
        setStep(1);
        setPlaying(true);
    };

    return (
        <InteractiveFrame title="按下「登入」之後，到底發生了什麼事" hint="按「送出訂單」自動播放，也可以用下一步慢慢看。">
            <div className={`rounded-lg border px-2 pb-5 pt-4 sm:px-4 ${t.inset}`}>
                <div className="relative grid grid-cols-5">
                    {/* 底下的軌道與移動的封包 */}
                    <div aria-hidden="true" className="absolute left-[10%] right-[10%] top-[26px] h-[3px] rounded-full bg-line-strong" />
                    <motion.div
                        aria-hidden="true"
                        className="absolute left-[10%] top-[26px] h-[3px] rounded-full bg-brand"
                        initial={false}
                        animate={{ width: `${current.at * 20}%`, opacity: step === 0 ? 0 : 1 }}
                        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                    />
                    {NODES.map((node, index) => {
                        const on = current.active === index;
                        return (
                            <div key={node.tech} className="relative flex flex-col items-center text-center">
                                <motion.div
                                    animate={on ? { scale: 1.18, y: -2 } : { scale: 1, y: 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 16 }}
                                    className={`flex h-[54px] w-[54px] items-center justify-center rounded-full border-2 text-2xl transition-colors sm:h-[58px] sm:w-[58px] ${
                                        on ? 'border-brand bg-brand/20' : 'border-line-strong bg-surface'
                                    }`}
                                >
                                    <Icon name={node.icon} className="h-6 w-6" />
                                </motion.div>
                                <div className={`mt-2 text-[13px] font-semibold ${on ? t.accent : t.text}`}>{node.tech}</div>
                                <div className={`text-[11px] ${t.faint}`}>{node.role}</div>
                            </div>
                        );
                    })}
                    {/* 封包：沿著軌道移動 */}
                    {step > 0 && current.label && (
                        <motion.div
                            aria-hidden="true"
                            className="pointer-events-none absolute top-[-20px] z-10 -translate-x-1/2 whitespace-nowrap"
                            initial={false}
                            animate={{ left: `${10 + current.at * 20}%` }}
                            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                        >
                            <motion.span
                                key={current.label}
                                initial={{ opacity: 0, y: 6, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                    current.back ? 'bg-success text-canvas' : 'bg-brand text-brand-on'
                                }`}
                            >
                                {current.back ? '← ' : ''}
                                {current.label}
                                {current.back ? '' : ' →'}
                            </motion.span>
                        </motion.div>
                    )}
                </div>
            </div>

            <Verdict id={step}>{current.text}</Verdict>

            <div className="flex flex-wrap items-center gap-2">
                {step === 0 || finished ? (
                    <button type="button" onClick={start} className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${t.button}`}>
                        {finished ? '再來一次' : '送出訂單'}
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={() => setPlaying((p) => !p)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${t.button}`}
                        >
                            {playing ? '暫停' : '繼續播放'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setPlaying(false);
                                setStep((s) => Math.min(s + 1, STEPS.length - 1));
                            }}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${t.ghost}`}
                        >
                            下一步
                        </button>
                    </>
                )}
                <span className={`ml-auto text-xs ${t.faint}`}>
                    {step} / {STEPS.length - 1}
                </span>
            </div>
        </InteractiveFrame>
    );
}
