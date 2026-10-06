'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LockClosedIcon, ShieldCheckIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

type LogLine = { id: number; kind: 'req' | 'ok' | 'deny'; text: string };

let lineId = 0;

function Switch({ on, onChange, label, sub }: { on: boolean; onChange: () => void; label: string; sub: string }) {
    const t = useFrameTheme();
    return (
        <button
            type="button"
            role="switch"
            aria-checked={on}
            onClick={onChange}
            className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${on ? t.accentSoft : t.chip}`}
        >
            <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? 'bg-brand' : 'bg-line-strong'}`}>
                <motion.span
                    className="absolute top-0.5 h-5 w-5 rounded-full bg-canvas"
                    animate={{ left: on ? 22 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            </span>
            <span className="min-w-0">
                <span className="block text-sm font-semibold">{label}</span>
                <span className="block text-xs opacity-80">{sub}</span>
            </span>
        </button>
    );
}

/** 前端把按鈕藏起來，到底算不算安全？ */
export function TrustTheFrontend() {
    const t = useFrameTheme();
    const [hideButton, setHideButton] = useState(true);
    const [backendCheck, setBackendCheck] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [log, setLog] = useState<LogLine[]>([]);
    const [attacked, setAttacked] = useState<'none' | 'denied' | 'broken'>('none');

    const showButton = !hideButton;

    const send = () => {
        const base = { id: ++lineId };
        if (backendCheck) {
            setLog([
                { ...base, kind: 'req', text: 'DELETE /users/123' },
                { id: ++lineId, kind: 'deny', text: '403 Forbidden：你不是管理員，沒有刪除權限' },
            ]);
            setAttacked('denied');
        } else {
            setLog([
                { ...base, kind: 'req', text: 'DELETE /users/123' },
                { id: ++lineId, kind: 'ok', text: '200 OK：使用者 123 已刪除' },
            ]);
            setDeleted(true);
            setAttacked('broken');
        }
    };

    const reset = () => {
        setDeleted(false);
        setLog([]);
        setAttacked('none');
    };

    return (
        <InteractiveFrame
            title="藏起來的按鈕，真的安全嗎？"
            hint={
                <>
                    你現在是<strong>一般使用者</strong>，不是管理員。先看看畫面，再扮演一個懂技術的人。
                </>
            }
        >
            <div className="grid gap-4 md:grid-cols-2">
                <div className={`rounded-lg border ${t.inset}`}>
                    <div className={`flex items-center justify-between border-b px-3 py-2 text-xs font-medium ${t.divider} ${t.faint}`}>
                        <span>使用者管理（畫面）</span>
                        <span className="rounded bg-fg/10 px-1.5 py-0.5">一般使用者</span>
                    </div>
                    <div className="px-3 py-3">
                        <AnimatePresence initial={false}>
                            {!deleted && (
                                <motion.div
                                    key="row"
                                    exit={{ opacity: 0, x: 60, height: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className={`flex items-center gap-3 rounded-md border px-3 py-2.5 ${t.divider} bg-surface`}
                                >
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/20 text-brand-text"><Icon name="user" className="h-4 w-4" /></span>
                                    <span className="min-w-0 flex-1">
                                        <span className={`block text-sm font-semibold ${t.text}`}>小明</span>
                                        <span className={`block text-xs ${t.faint}`}>ID 123</span>
                                    </span>
                                    <AnimatePresence initial={false} mode="wait">
                                        {showButton ? (
                                            <motion.span
                                                key="btn"
                                                initial={{ opacity: 0, scale: 0.6 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.6 }}
                                                className="inline-flex items-center gap-1 rounded-md bg-danger/15 px-2 py-1 text-xs font-semibold text-danger-text"
                                            >
                                                <TrashIcon className="h-3.5 w-3.5" />
                                                刪除
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key="lock"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={`inline-flex items-center gap-1 text-xs ${t.faint}`}
                                            >
                                                <LockClosedIcon className="h-3.5 w-3.5" />
                                                沒有按鈕
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {deleted && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-md border border-dashed border-danger/50 px-3 py-4 text-center text-sm text-danger-text">
                                小明不見了
                            </motion.div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Switch on={hideButton} onChange={() => setHideButton((v) => !v)} label="前端：非管理員就隱藏刪除按鈕" sub="只是畫面看不到，屬於使用體驗" />
                    <Switch on={backendCheck} onChange={() => setBackendCheck((v) => !v)} label="後端：收到刪除要求先檢查權限" sub="真正的安全控制" />
                </div>
            </div>

            <div className={`overflow-hidden rounded-lg border font-mono text-xs ${t.inset}`}>
                <div className={`flex items-center justify-between border-b px-3 py-2 ${t.divider}`}>
                    <span className={t.faint}>懂技術的人：直接呼叫 API</span>
                    <span className="flex gap-2">
                        <button type="button" onClick={send} className={`rounded px-2.5 py-1 font-sans text-xs font-semibold ${t.button}`}>
                            送出 DELETE /users/123
                        </button>
                        {log.length > 0 && (
                            <button type="button" onClick={reset} className={`rounded border px-2.5 py-1 font-sans text-xs ${t.ghost}`}>
                                重來
                            </button>
                        )}
                    </span>
                </div>
                <div className="min-h-[68px] space-y-1.5 px-3 py-3">
                    <AnimatePresence initial={false}>
                        {log.map((line, i) => (
                            <motion.div
                                key={line.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.5 }}
                                className={line.kind === 'ok' ? 'text-danger-text' : line.kind === 'deny' ? 'text-success-text' : t.sub}
                            >
                                {line.kind === 'req' ? '> ' : '< '}
                                {line.text}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {log.length === 0 && <div className={t.faint}>按右上角的按鈕，假裝自己是用工具直接送出請求。</div>}
                </div>
            </div>

            <Verdict id={attacked + String(hideButton) + String(backendCheck)}>
                {attacked === 'broken' ? (
                    <>
                        按鈕明明藏起來了，小明還是被刪掉。<strong>畫面上看不到，不等於做不到。</strong>打開後端的權限檢查再試一次。
                    </>
                ) : attacked === 'denied' ? (
                    <>
                        <ShieldCheckIcon className="mr-1 inline h-4 w-4 align-text-bottom" />
                        同一個請求，這次被後端擋下來。<strong>真正的安全要放在後端。</strong>前端的隱藏只是讓畫面乾淨。
                    </>
                ) : (
                    <>前端已經把按鈕藏起來了，看起來很安全。真的是這樣嗎？按下面的按鈕試試看。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
