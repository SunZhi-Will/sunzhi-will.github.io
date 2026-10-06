'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

type Result = 'pass' | 'fail';

const CHECKS = [
    { icon: 'user' as const, name: '帳號存在嗎？' },
    { icon: 'key' as const, name: '密碼正確嗎？' },
    { icon: 'shield' as const, name: '有什麼權限？' },
    { icon: 'db' as const, name: '去資料庫找資料' },
];

const SCENARIOS: { name: string; results: Result[]; outcome: string; ok: boolean }[] = [
    { name: '正確登入', results: ['pass', 'pass', 'pass', 'pass'], outcome: '登入成功，回傳會員資料給前端', ok: true },
    { name: '密碼打錯', results: ['pass', 'fail'], outcome: '拒絕：密碼不正確', ok: false },
    { name: '帳號不存在', results: ['fail'], outcome: '拒絕：找不到這個帳號', ok: false },
    { name: '沒有後台權限', results: ['pass', 'pass', 'fail'], outcome: '拒絕：這個身分不能進後台', ok: false },
];

/** 後端收到登入請求後，一關一關檢查 */
export function LoginChecks() {
    const t = useFrameTheme();
    const [scenario, setScenario] = useState(0);
    const [step, setStep] = useState(0); // 已經檢查完幾關
    const data = SCENARIOS[scenario];
    const total = data.results.length;

    useEffect(() => {
        setStep(0);
    }, [scenario]);

    useEffect(() => {
        if (step >= total) return;
        const timer = setTimeout(() => setStep((s) => s + 1), step === 0 ? 500 : 850);
        return () => clearTimeout(timer);
    }, [step, total, scenario]);

    const finished = step >= total;

    return (
        <InteractiveFrame title="後端收到登入請求之後，會怎麼處理？" hint="選一種情況，看請求在後端一關一關被檢查。">
            <div className="flex flex-wrap gap-2">
                {SCENARIOS.map((s, i) => (
                    <button
                        key={s.name}
                        type="button"
                        aria-pressed={scenario === i}
                        onClick={() => (scenario === i ? setStep(0) : setScenario(i))}
                        className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${scenario === i ? t.chipOn : t.chip}`}
                    >
                        {s.name}
                    </button>
                ))}
            </div>

            <div className={`rounded-lg border p-3 sm:p-4 ${t.inset}`}>
                <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
                    <div className="flex items-center justify-center rounded-lg border border-line bg-surface px-3 py-2 text-center text-xs font-semibold text-fg md:w-20">
                        <Icon name="mail" className="mr-1.5 h-4 w-4 shrink-0" />
                        收到登入請求
                    </div>
                    {CHECKS.map((c, i) => {
                        const status: 'idle' | 'active' | Result | 'skip' =
                            i < step ? (data.results[i] ?? 'skip') : i === step && step < total ? 'active' : i >= total ? 'skip' : 'idle';
                        const hardSkip = i >= total;
                        return (
                            <div key={c.name} className="flex flex-col items-stretch gap-2 md:flex-1 md:flex-row md:items-center">
                                <span aria-hidden="true" className={`text-center text-sm ${t.faint}`}>
                                    <span className="md:hidden">↓</span>
                                    <span className="hidden md:inline">→</span>
                                </span>
                                <motion.div
                                    animate={status === 'active' ? { scale: 1.06 } : status === 'fail' ? { x: [0, -6, 6, -4, 4, 0] } : { scale: 1, x: 0 }}
                                    transition={{ duration: status === 'fail' ? 0.4 : 0.25 }}
                                    className={`relative flex-1 rounded-lg border-2 px-2 py-3 text-center transition-colors ${
                                        status === 'pass'
                                            ? 'border-success bg-success/10'
                                            : status === 'fail'
                                              ? 'border-danger bg-danger/10'
                                              : status === 'active'
                                                ? 'border-brand bg-brand/15'
                                                : 'border-line bg-surface'
                                    } ${hardSkip && finished ? 'opacity-35' : ''}`}
                                >
                                    <Icon name={c.icon} className="mx-auto h-6 w-6 text-fg" />
                                    <div className={`mt-1 text-xs font-semibold leading-tight ${t.text}`}>{c.name}</div>
                                    <div className="mt-1 h-4 text-xs font-black">
                                        {status === 'pass' && <span className="inline-flex items-center gap-0.5 text-success-text">通過<Icon name="check" className="h-3 w-3" /></span>}
                                        {status === 'fail' && <span className="inline-flex items-center gap-0.5 text-danger-text">不通過<Icon name="x" className="h-3 w-3" /></span>}
                                        {status === 'skip' && finished && <span className={t.faint}>不用做了</span>}
                                        {status === 'active' && <span className="text-brand-text">檢查中…</span>}
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <motion.div
                key={scenario + String(finished)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: finished ? 1 : 0.35, y: 0 }}
                className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
                    !finished ? `${t.inset} ${t.faint}` : data.ok ? 'border-success/40 bg-success/10 text-success-text' : 'border-danger/40 bg-danger/10 text-danger-text'
                }`}
            >
                {finished ? `後端的回覆：${data.outcome}` : '後端還在處理中…'}
            </motion.div>

            <Verdict id={scenario}>
                {data.ok ? <>一關一關都通過，後端才會把資料交回前端。前端拿到結果，再決定畫面要怎麼變。</> : <>在任何一關被擋下，後面的步驟就不用做了。這就是後端在做的事：規則、權限、核心邏輯。</>}
            </Verdict>
        </InteractiveFrame>
    );
}
