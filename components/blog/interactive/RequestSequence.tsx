'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const CENTERS = [16.67, 50, 83.33];

type Step = { from: number; to: number; label: string; kind: 'req' | 'res' | 'note' | 'dead' };

const SCENARIOS: { name: string; steps: Step[]; say: string; nodeDead?: boolean }[] = [
    {
        name: '載入商品列表',
        steps: [
            { from: 0, to: 1, label: 'GET /api/products', kind: 'req' },
            { from: 1, to: 2, label: 'SELECT * FROM products', kind: 'req' },
            { from: 2, to: 1, label: '20 筆資料', kind: 'res' },
            { from: 1, to: 0, label: 'JSON 回應', kind: 'res' },
            { from: 0, to: 0, label: 'React 把資料畫成商品列表', kind: 'note' },
        ],
        say: '請求從瀏覽器出發，經過 Node.js 後端，到資料庫拿資料，再原路送回。React 只負責最後把資料畫出來。',
    },
    {
        name: '登入',
        steps: [
            { from: 0, to: 1, label: 'POST /api/login', kind: 'req' },
            { from: 1, to: 2, label: '找這個 Email', kind: 'req' },
            { from: 2, to: 1, label: '帳號資料', kind: 'res' },
            { from: 1, to: 1, label: '比對密碼、檢查權限', kind: 'note' },
            { from: 1, to: 0, label: '200 登入成功', kind: 'res' },
            { from: 0, to: 0, label: '畫面換成「歡迎回來」', kind: 'note' },
        ],
        say: '密碼比對和權限檢查都在後端完成。前端只負責送出資料、顯示結果。',
    },
    {
        name: 'Node 後端當機了',
        nodeDead: true,
        steps: [
            { from: 0, to: 1, label: 'GET /api/products', kind: 'req' },
            { from: 1, to: 1, label: '程序已死，沒有人回應', kind: 'dead' },
            { from: 0, to: 0, label: '等不到回應，畫面顯示載入失敗', kind: 'dead' },
        ],
        say: '這就是後端必須一直活著的原因。React 檔案本身沒壞，但沒有人回應 API，網站就是壞的。這時就輪到 PM2 出場。',
    },
];

const LANES = [
    { icon: 'phone' as const, name: '瀏覽器', tag: 'React 在這裡跑', tone: 'bg-info/15 text-info-text' },
    { icon: 'cog' as const, name: 'Node.js', tag: '要一直活著', tone: 'bg-warning/15 text-warning-text' },
    { icon: 'db' as const, name: 'MySQL', tag: '也要一直活著', tone: 'bg-warning/15 text-warning-text' },
];

/** 一次請求在瀏覽器、後端、資料庫之間怎麼走（時序圖） */
export function RequestSequence() {
    const t = useFrameTheme();
    const [sc, setSc] = useState(0);
    const [shown, setShown] = useState(0);
    const data = SCENARIOS[sc];

    useEffect(() => {
        setShown(0);
    }, [sc]);

    useEffect(() => {
        if (shown >= data.steps.length) return;
        const timer = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 400 : 900);
        return () => clearTimeout(timer);
    }, [shown, data.steps.length, sc]);

    const finished = shown >= data.steps.length;

    return (
        <InteractiveFrame title="最簡單的情況：一次請求怎麼走" hint="選一個情境，看請求在三個角色之間往返。">
            <div className="flex flex-wrap items-center gap-2">
                {SCENARIOS.map((s, i) => (
                    <button
                        key={s.name}
                        type="button"
                        aria-pressed={sc === i}
                        onClick={() => (sc === i ? setShown(0) : setSc(i))}
                        className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${sc === i ? t.chipOn : t.chip}`}
                    >
                        {s.name}
                    </button>
                ))}
            </div>

            <div className={`rounded-lg border px-2 pb-3 pt-3 sm:px-4 ${t.inset}`}>
                <div className="grid grid-cols-3 gap-2">
                    {LANES.map((l, i) => {
                        const dead = data.nodeDead && i === 1 && shown >= 2;
                        return (
                            <div key={l.name} className="text-center">
                                <motion.div
                                    animate={dead ? { x: [0, -5, 5, -3, 3, 0] } : { x: 0 }}
                                    className={`rounded-lg border-2 bg-surface py-2 ${dead ? 'border-danger' : 'border-line'}`}
                                >
                                    <Icon name={dead ? 'dead' : l.icon} className={`mx-auto h-6 w-6 ${dead ? 'text-danger' : 'text-fg'}`} />
                                    <div className={`text-xs font-bold ${t.text}`}>{l.name}</div>
                                </motion.div>
                                <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${dead ? 'bg-danger/15 text-danger-text' : l.tone}`}>{dead ? '已當機' : l.tag}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="relative mt-2" style={{ height: data.steps.length * 46 + 8 }}>
                    {CENTERS.map((c, i) => (
                        <span
                            key={i}
                            aria-hidden="true"
                            className={`absolute bottom-0 top-0 border-l-2 border-dashed ${data.nodeDead && i === 1 && shown >= 2 ? 'border-danger/60' : 'border-line-strong'}`}
                            style={{ left: `${c}%` }}
                        />
                    ))}
                    {data.steps.map((s, i) => {
                        if (i >= shown) return null;
                        const a = CENTERS[s.from];
                        const b = CENTERS[s.to];
                        const self = s.from === s.to;
                        const right = b > a;
                        const color = s.kind === 'req' ? 'bg-brand' : s.kind === 'res' ? 'bg-success' : '';
                        return (
                            <div key={`${sc}-${i}`} className="absolute left-0 right-0" style={{ top: i * 46 + 4, height: 42 }}>
                                {self ? (
                                    <div className="absolute top-1 -translate-x-1/2" style={{ left: `${a}%`, width: 'min(46%, 190px)' }}>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.85 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={`rounded-md border px-2 py-1.5 text-center text-[11px] font-semibold leading-tight ${
                                                s.kind === 'dead' ? 'border-danger/60 bg-danger/15 text-danger-text' : 'border-line-strong bg-surface text-fg'
                                            }`}
                                        >
                                            {s.label}
                                        </motion.div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="absolute text-center text-[11px] font-semibold leading-tight text-fg" style={{ left: `${Math.min(a, b)}%`, width: `${Math.abs(b - a)}%`, top: 2 }}>
                                            {s.label}
                                        </div>
                                        <motion.div
                                            className={`absolute h-[3px] rounded-full ${color}`}
                                            style={{ left: `${Math.min(a, b)}%`, width: `${Math.abs(b - a)}%`, top: 28, transformOrigin: right ? 'left' : 'right' }}
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 0.5, ease: 'easeOut' }}
                                        />
                                        <motion.span
                                            className={`absolute h-0 w-0 border-y-[6px] border-y-transparent ${s.kind === 'req' ? 'text-brand' : 'text-success'} ${right ? 'border-l-[10px] border-l-current' : 'border-r-[10px] border-r-current'}`}
                                            style={{ left: `${b}%`, top: 24, marginLeft: right ? -10 : 0 }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.45 }}
                                            aria-hidden="true"
                                        />
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button type="button" onClick={() => setShown(0)} className={`rounded-full px-4 py-2 text-sm font-semibold ${t.button}`}>
                    {finished ? '重播' : '播放中…'}
                </button>
                <span className={`text-xs ${t.faint}`}>
                    {Math.min(shown, data.steps.length)} / {data.steps.length}
                </span>
            </div>

            <Verdict id={sc + String(finished)}>{finished ? data.say : <>請求一步一步往下走…</>}</Verdict>
        </InteractiveFrame>
    );
}
