'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon, type IconName } from './icons';
import { Window } from './kit';
import { TypeScriptLogo } from './logos';
import { InteractiveFrame, Verdict } from './InteractiveFrame';

const STEPS: { name: string; icon: IconName; text: string }[] = [
    { name: '看訊息', icon: 'warn', text: '「Cannot read properties of undefined」：有人想讀一個不存在的東西的屬性。這句話已經說出問題的形狀。' },
    { name: '找檔案', icon: 'folder', text: '錯誤指向 UserCard.tsx，不是整個專案。範圍一下縮小到一個檔案。' },
    { name: '找行數', icon: 'pin', text: '第 12 行的 user.profile.name。user 或 user.profile 是 undefined。' },
    { name: '剛剛改了什麼', icon: 'clock', text: '剛剛的修改把 await 拿掉了，user 變成一個「還沒拿到結果」的東西，所以讀不到 profile。補回 await 就好，只動一行。' },
];

const CODE = [
    { n: 8, text: 'async function UserCard({ id }) {' },
    { n: 9, text: '  // 剛剛的修改在下一行' },
    { n: 10, text: '  const user = getUser(id)' },
    { n: 11, text: '  return (' },
    { n: 12, text: '    <div>{user.profile.name}</div>' },
    { n: 13, text: '  )' },
];

/** 出錯不要急著叫 AI 重寫：先定位四件事 */
export function DebugTrace() {
    const [step, setStep] = useState(-1);
    const [rewrite, setRewrite] = useState(false);

    const pick = (i: number) => {
        setStep(i);
        setRewrite(false);
    };

    return (
        <InteractiveFrame title="出錯了，先看這四件事" kicker="Debug 練習" hint="依序點四個步驟，把錯誤一步一步縮小。也可以先試試「全部重寫」。">
            <Window
                title="Terminal"
                icon="code"
                tone="danger"
                right={
                    <button
                        type="button"
                        onClick={() => {
                            setRewrite(true);
                            setStep(-1);
                        }}
                        className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-black transition-colors ${rewrite ? 'border-danger bg-danger text-canvas' : 'border-danger/60 text-danger-text hover:bg-danger/10'}`}
                    >
                        全部重寫
                    </button>
                }
            >
                <div className="px-3 py-2.5 font-mono text-[11px] leading-relaxed sm:px-4 sm:py-3 sm:text-[13px]">
                    <motion.div animate={{ backgroundColor: step === 0 ? 'rgb(var(--color-danger) / 0.18)' : 'rgb(var(--color-danger) / 0)' }} className="rounded px-1 font-bold text-danger-text">
                        TypeError: Cannot read properties of undefined (reading &apos;name&apos;)
                    </motion.div>
                    <div className="px-1 text-fg">
                        {'    at UserCard ('}
                        <motion.span animate={{ backgroundColor: step === 1 ? 'rgb(var(--color-brand) / 0.35)' : 'rgb(var(--color-brand) / 0)' }} className="rounded px-0.5 font-bold">
                            src/components/UserCard.tsx
                        </motion.span>
                        :
                        <motion.span animate={{ backgroundColor: step === 2 ? 'rgb(var(--color-brand) / 0.35)' : 'rgb(var(--color-brand) / 0)' }} className="rounded px-0.5 font-bold">
                            12
                        </motion.span>
                        {':30)'}
                    </div>
                </div>
            </Window>

            <Window title="UserCard.tsx" logo={TypeScriptLogo} tone={step === 3 ? 'success' : 'default'}>
                <div className="py-1.5 font-mono text-[12px] leading-6 sm:py-2 sm:text-[13px] sm:leading-7">
                    {CODE.map((c) => {
                        const hot = (c.n === 12 && step === 2) || (c.n === 10 && step === 3);
                        const fixed = step === 3 && c.n === 10;
                        return (
                            <div key={c.n} className={`relative flex whitespace-pre px-3 transition-colors ${hot ? (fixed ? 'bg-success/15' : 'bg-brand/20') : ''}`}>
                                {hot && <span className={`absolute inset-y-0 left-0 w-1 ${fixed ? 'bg-success' : 'bg-brand'}`} />}
                                <span className="mr-4 w-5 select-none text-right text-fg-body">{c.n}</span>
                                {fixed ? (
                                    <span className="text-fg">
                                        {'  const user = '}
                                        <motion.span initial={{ opacity: 0, scale: 1.6 }} animate={{ opacity: 1, scale: 1 }} className="inline-block rounded bg-success px-1 font-bold text-canvas">
                                            await
                                        </motion.span>
                                        {' getUser(id)'}
                                    </span>
                                ) : (
                                    <span className={c.n === 9 ? 'text-fg-body' : 'text-fg'}>{c.text}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Window>

            <div className="flex items-center">
                <div className="flex flex-1 items-center">
                    {STEPS.map((s, i) => (
                        <div key={s.name} className="flex flex-1 items-center last:flex-none">
                            <button type="button" aria-pressed={step === i} onClick={() => pick(i)} className="group flex flex-col items-center gap-1">
                                <span className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${step === i ? 'border-brand bg-brand text-brand-on' : i < step ? 'border-success bg-success text-canvas' : 'border-line-strong bg-surface text-fg group-hover:border-brand'}`}>
                                    {i < step ? <Icon name="check" className="h-4 w-4" /> : <Icon name={s.icon} className="h-4 w-4" />}
                                </span>
                                <span className={`whitespace-nowrap text-[11px] font-bold ${step === i ? 'text-brand-text' : 'text-fg'}`}>{s.name}</span>
                            </button>
                            {i < STEPS.length - 1 && <span className={`mx-1 mb-5 h-0.5 flex-1 rounded-full ${i < step ? 'bg-success' : 'bg-fg/15'}`} />}
                        </div>
                    ))}
                </div>
            </div>

            <Verdict id={`${step}-${rewrite}`}>
                    {rewrite ? (
                        <>
                            AI 重寫了 6 個檔案，這個錯誤不見了，換成另一個更看不懂的錯誤。<strong>你還是不知道當初到底是哪裡壞掉。</strong>
                        </>
                    ) : step >= 0 ? (
                        <>
                            <strong>{STEPS[step].name}：</strong>
                            {STEPS[step].text}
                        </>
                    ) : (
                        <>錯誤訊息不是在罵你，它是在告訴你哪個檔案、第幾行、出了什麼事。</>
                    )}
            </Verdict>
        </InteractiveFrame>
    );
}
