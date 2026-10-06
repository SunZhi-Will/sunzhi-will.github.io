'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const STEPS = [
    { name: '打包', text: '執行 npm run build，React 專案被打包成三個普通檔案。它們跟圖片、HTML 沒什麼不同。' },
    { name: '放上伺服器', text: '把檔案放到 Nginx、Cloudflare Pages 或 Netlify。伺服器只負責「收著」，沒有任何程式在跑。' },
    { name: '使用者打開網站', text: '有人在瀏覽器輸入網址，瀏覽器向伺服器要檔案。' },
    { name: '瀏覽器下載', text: '伺服器把檔案傳出去，然後就沒事了。接下來的工作交給瀏覽器。' },
    { name: 'React 開始執行', text: 'React 在使用者的瀏覽器裡跑起來。真正執行它的地方，是你的手機或電腦，不是伺服器。' },
];

const FILES = ['index.html', 'app.js', 'style.css'];

/** React 打包後：檔案放在哪，和程式在哪執行，是兩件事 */
export function BuildAndRun() {
    const t = useFrameTheme();
    const [step, setStep] = useState(0);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        if (!playing) return;
        if (step >= STEPS.length - 1) {
            setPlaying(false);
            return;
        }
        const timer = setTimeout(() => setStep((s) => s + 1), 1800);
        return () => clearTimeout(timer);
    }, [playing, step]);

    const downloaded = step >= 3;
    const running = step === 4;
    const filesVisible = step >= 1;

    const pick = (index: number) => {
        setPlaying(false);
        setStep(index);
    };

    return (
        <InteractiveFrame title="React 打包之後，到底是誰在執行它？" hint="按播放，看檔案從伺服器搬到瀏覽器。">
            <div className="space-y-3">
                {/* 伺服器 */}
                <div className={`relative h-[112px] overflow-hidden rounded-lg border-2 border-dashed px-3 py-2 ${running ? 'border-line' : 'border-brand/50'} bg-surface-sunken`}>
                    <div className="flex items-center justify-between text-xs font-semibold">
                        <span className={`flex items-center gap-1.5 ${t.text}`}><Icon name="building" className="h-4 w-4" />伺服器</span>
                        <motion.span
                            key={String(running)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`rounded-full px-2 py-0.5 ${running ? 'bg-fg/10 text-fg-body' : 'bg-brand/15 text-brand-text'}`}
                        >
                            {running ? '沒有程式在跑' : '只是存放檔案'}
                        </motion.span>
                    </div>
                    <div className="mt-3 flex gap-2">
                        {FILES.map((file, i) => (
                            <motion.span
                                key={file}
                                initial={false}
                                animate={
                                    filesVisible
                                        ? { opacity: downloaded ? 0.35 : 1, scale: 1, y: 0 }
                                        : { opacity: step === 0 ? 1 : 0, scale: step === 0 ? 1 : 0.6, y: 0 }
                                }
                                transition={{ type: 'spring', stiffness: 220, damping: 18, delay: i * 0.08 }}
                                className="rounded-md border border-line-strong bg-surface px-2 py-1 font-mono text-[11px] text-fg"
                            >
                                <Icon name="doc" className="mr-1 inline h-3 w-3 align-text-bottom" />{file}
                            </motion.span>
                        ))}
                    </div>
                </div>

                {/* 搬運中的箭頭 */}
                <div className="relative flex h-8 items-center justify-center" aria-hidden="true">
                    <motion.div
                        className="flex gap-1 text-lg text-brand-text"
                        initial={false}
                        animate={step === 3 ? { opacity: 1, y: [0, 10, 0] } : { opacity: step === 2 ? 0.5 : 0.15 }}
                        transition={step === 3 ? { duration: 0.9, repeat: Infinity } : { duration: 0.3 }}
                    >
                        <Icon name="down" className="h-5 w-5" /><Icon name="down" className="h-5 w-5" /><Icon name="down" className="h-5 w-5" />
                    </motion.div>
                </div>

                {/* 瀏覽器 */}
                <div className={`relative h-[176px] overflow-hidden rounded-lg border ${running ? 'border-success' : 'border-line-strong'} bg-surface`}>
                    <div className="flex items-center gap-1.5 border-b border-line bg-surface-raised px-3 py-1.5">
                        <span className="h-2 w-2 rounded-full bg-danger" />
                        <span className="h-2 w-2 rounded-full bg-warning" />
                        <span className="h-2 w-2 rounded-full bg-success" />
                        <span className={`ml-2 flex-1 truncate rounded bg-surface-sunken px-2 py-0.5 font-mono text-[11px] ${t.faint}`}>
                            {step >= 2 ? 'https://my-app.example.com' : '（還沒有人打開）'}
                        </span>
                    </div>
                    <div className="relative px-3 py-3">
                        <div className="mb-3 flex items-center justify-between gap-2 text-xs font-semibold">
                            <span className={`flex items-center gap-1.5 ${t.text}`}><Icon name="phone" className="h-4 w-4" />使用者的瀏覽器</span>
                            <motion.span
                                key={String(running)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`rounded-full px-2 py-0.5 ${running ? 'bg-success/15 text-success-text' : 'bg-fg/10 text-fg-body'}`}
                            >
                                {running ? 'React 執行中' : downloaded ? '收到檔案' : '等待中'}
                            </motion.span>
                        </div>
                        <div className="flex gap-2">
                            {FILES.map((file, i) => (
                                <motion.span
                                    key={file}
                                    initial={false}
                                    animate={downloaded ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -26, scale: 0.7 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 16, delay: downloaded ? i * 0.12 : 0 }}
                                    className="rounded-md border border-line-strong bg-surface-sunken px-2 py-1 font-mono text-[11px] text-fg"
                                >
                                    <Icon name="doc" className="mr-1 inline h-3 w-3 align-text-bottom" />{file}
                                </motion.span>
                            ))}
                        </div>
                        {/* React 啟動後出現的小畫面 */}
                        <motion.div
                            initial={false}
                            animate={running ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                            className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg border border-success/40 bg-success/10 px-3 py-2"
                        >
                            <motion.span animate={running ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="flex">
                                <Icon name="react" className="h-6 w-6 text-success" />
                            </motion.span>
                            <span className="text-xs font-semibold text-success-text">畫面長出來了</span>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
                {STEPS.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-1">
                        <button
                            type="button"
                            aria-pressed={step === index}
                            onClick={() => pick(index)}
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                                step === index ? t.chipOn : index < step ? t.accentSoft : t.chip
                            }`}
                        >
                            {item.name}
                        </button>
                        {index < STEPS.length - 1 && (
                            <span aria-hidden="true" className={`text-xs ${index < step ? t.accent : t.faint}`}>
                                →
                            </span>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => {
                        if (step >= STEPS.length - 1) setStep(0);
                        setPlaying((p) => !p);
                    }}
                    className={`ml-auto rounded-full px-3.5 py-1.5 text-xs font-semibold ${t.button}`}
                >
                    {playing ? '暫停' : step >= STEPS.length - 1 ? '重播' : '播放'}
                </button>
            </div>

            <Verdict id={step}>{STEPS[step].text}</Verdict>
        </InteractiveFrame>
    );
}
