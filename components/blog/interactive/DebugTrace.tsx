'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon, type IconName } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const STEPS: { name: string; icon: IconName; text: string }[] = [
    { name: '看訊息', icon: 'warn', text: '「Cannot read properties of undefined」：有人想讀一個不存在的東西的屬性。這句話已經說出問題的形狀。' },
    { name: '找檔案', icon: 'folder', text: '錯誤指向 UserCard.tsx，不是整個專案。範圍一下縮小到一個檔案。' },
    { name: '找行數', icon: 'pin', text: '第 12 行的 user.profile.name。user 或 user.profile 是 undefined。' },
    { name: '剛剛改了什麼', icon: 'clock', text: '剛剛的修改把 await 拿掉了。user 變成一個「還沒拿到結果」的東西，所以讀不到 profile。' },
];

const CODE = [
    { n: 8, text: 'async function UserCard({ id }) {', line: 0 },
    { n: 9, text: '  // 剛剛的修改在這一行', line: 0 },
    { n: 10, text: '  const user = getUser(id)', line: 3 },
    { n: 11, text: '  return (', line: 0 },
    { n: 12, text: '    <div>{user.profile.name}</div>', line: 2 },
    { n: 13, text: '  )', line: 0 },
];

/** 出錯不要急著叫 AI 重寫：先定位四件事 */
export function DebugTrace() {
    const t = useFrameTheme();
    const [step, setStep] = useState(-1);
    const [rewrite, setRewrite] = useState(false);

    const reveal = step >= 0;
    const fixed = step === 3;

    return (
        <InteractiveFrame title="出錯了，先看這四件事" kicker="動手玩" hint="依序點下面四個步驟，一步一步把錯誤縮小。也可以先試試「全部重寫」。">
            <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2.5 font-mono text-xs leading-relaxed text-danger-text">
                <div className={`font-bold ${step === 0 ? 'rounded bg-danger/25 px-1' : ''}`}>TypeError: Cannot read properties of undefined (reading &apos;name&apos;)</div>
                <div className={`mt-0.5 opacity-90 ${step === 1 || step === 2 ? 'rounded bg-danger/25 px-1' : ''}`}>at UserCard (src/components/UserCard.tsx:12:30)</div>
            </div>

            <div className="overflow-hidden rounded-lg border border-line bg-surface-sunken">
                <div className={`flex items-center gap-1.5 border-b px-3 py-2 text-[11px] ${t.divider} ${t.faint}`}>
                    <Icon name="doc" className="h-3.5 w-3.5" />UserCard.tsx
                </div>
                <pre className="m-0 overflow-x-auto bg-transparent py-2 font-mono text-xs leading-6 sm:text-[13px]">
                    {CODE.map((c) => {
                        const hot = (c.line === 2 && step === 2) || (c.line === 3 && step === 3);
                        return (
                            <div key={c.n} className={`flex whitespace-pre px-3 ${hot ? 'bg-brand/25' : ''}`}>
                                <span className={`mr-3 w-5 select-none text-right ${t.faint}`}>{c.n}</span>
                                <span className="text-fg">{fixed && c.n === 10 ? '  const user = await getUser(id)' : c.text}</span>
                            </div>
                        );
                    })}
                </pre>
            </div>

            <div className="flex flex-wrap gap-2">
                {STEPS.map((s, i) => (
                    <button
                        key={s.name}
                        type="button"
                        aria-pressed={step === i}
                        onClick={() => {
                            setStep(i);
                            setRewrite(false);
                        }}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${step === i ? t.chipOn : i < step ? t.accentSoft : t.chip}`}
                    >
                        {i + 1}　{s.name}
                    </button>
                ))}
                <button
                    type="button"
                    onClick={() => {
                        setRewrite(true);
                        setStep(-1);
                    }}
                    className={`ml-auto rounded-full border px-3 py-1.5 text-xs font-semibold ${rewrite ? 'border-danger bg-danger/15 text-danger-text' : t.ghost}`}
                >
                    全部重寫
                </button>
            </div>

            <Verdict id={`${step}-${rewrite}`}>
                {rewrite ? (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        AI 重寫了 6 個檔案，這個錯誤不見了，換成另一個你更看不懂的錯誤。<strong>你還是不知道當初到底是哪裡壞掉。</strong>
                    </motion.span>
                ) : reveal ? (
                    <>
                        <strong>{STEPS[step].name}：</strong>
                        {STEPS[step].text}
                        {fixed && <> 補回 await 就好，只動一行。</>}
                    </>
                ) : (
                    <>錯誤訊息不是在罵你，它是在告訴你哪個檔案、第幾行、出了什麼事。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
