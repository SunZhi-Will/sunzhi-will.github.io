'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

type Field = { key: string; label: string; value: string; note: string };

const EXAMPLES: { name: string; req: Field[]; res: Field[]; ok: boolean }[] = [
    {
        name: '讀取商品',
        ok: true,
        req: [
            { key: 'method', label: '方法', value: 'GET', note: '方法說明你想做什麼。GET 是「讀取」，不會改動資料。' },
            { key: 'path', label: '網址', value: '/api/products', note: '網址指出你要找的是哪一種資料，這裡是商品列表。' },
            { key: 'head', label: '標頭', value: 'Accept: application/json', note: '標頭是附帶的說明，例如「我希望收到 JSON 格式」。' },
        ],
        res: [
            { key: 'status', label: '狀態碼', value: '200 OK', note: '狀態碼用數字告訴你結果。200 代表成功。' },
            { key: 'body', label: '內容', value: '[{ "id": 1, "name": "耳機" }, ...]', note: '內容是後端真正回傳的資料，前端拿到之後把它畫成畫面。' },
        ],
    },
    {
        name: '登入',
        ok: true,
        req: [
            { key: 'method', label: '方法', value: 'POST', note: 'POST 是「送出資料」，這裡要把帳號密碼交給後端檢查。' },
            { key: 'path', label: '網址', value: '/api/login', note: '網址指出這次是要登入。' },
            { key: 'body', label: '內容', value: '{ "email": "...", "password": "..." }', note: '內容是你要送出的資料。這也是為什麼後端不能無條件相信它，一定要驗證。' },
        ],
        res: [
            { key: 'status', label: '狀態碼', value: '200 OK', note: '帳號密碼正確，登入成功。' },
            { key: 'body', label: '內容', value: '{ "token": "...", "name": "Sun" }', note: '後端回傳一張通行證，之後前端帶著它，後端才知道你是誰。' },
        ],
    },
    {
        name: '刪除使用者（沒權限）',
        ok: false,
        req: [
            { key: 'method', label: '方法', value: 'DELETE', note: 'DELETE 是「刪除」，是危險的操作。' },
            { key: 'path', label: '網址', value: '/api/users/123', note: '網址指出要刪的是 123 號使用者。' },
            { key: 'head', label: '標頭', value: 'Authorization: Bearer ...', note: '標頭裡帶著通行證，後端靠它辨認你是誰、有什麼權限。' },
        ],
        res: [
            { key: 'status', label: '狀態碼', value: '403 Forbidden', note: '403 代表「我知道你是誰，但你沒有權限」。真正的安全就是由後端做這個判斷。' },
            { key: 'body', label: '內容', value: '{ "error": "沒有刪除權限" }', note: '後端拒絕之後，只會回報原因，不會執行刪除。' },
        ],
    },
];

/** 一次 HTTP 請求與回應長什麼樣：點每一欄看它的意思 */
export function HttpAnatomy() {
    const t = useFrameTheme();
    const [ex, setEx] = useState(0);
    const [sel, setSel] = useState<string | null>(null);
    const [phase, setPhase] = useState(0); // 0 只看到請求，1 回應飛回來
    const data = EXAMPLES[ex];

    useEffect(() => {
        setPhase(0);
        setSel(null);
        const timer = setTimeout(() => setPhase(1), 1000);
        return () => clearTimeout(timer);
    }, [ex]);

    const all = [...data.req, ...data.res];
    const picked = all.find((f) => f.key + f.value === sel);

    const Card = ({ title, fields, kind }: { title: string; fields: Field[]; kind: 'req' | 'res' }) => (
        <div className={`flex-1 rounded-lg border-2 bg-surface p-3 ${kind === 'req' ? 'border-brand/60' : data.ok ? 'border-success/60' : 'border-danger/60'}`}>
            <div className={`mb-2 text-xs font-black tracking-widest ${kind === 'req' ? 'text-brand-text' : data.ok ? 'text-success-text' : 'text-danger-text'}`}>{title}</div>
            <div className="space-y-1.5">
                {fields.map((f) => {
                    const id = f.key + f.value;
                    return (
                        <button
                            key={id}
                            type="button"
                            aria-pressed={sel === id}
                            onClick={() => setSel(id)}
                            className={`w-full rounded-md border px-2.5 py-1.5 text-left transition-colors ${sel === id ? t.chipOn : t.chip}`}
                        >
                            <span className="block text-[10px] font-semibold opacity-70">{f.label}</span>
                            <span className="block break-all font-mono text-[11px] font-bold leading-snug sm:text-xs">{f.value}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <InteractiveFrame title="HTTP 請求與回應，長什麼樣子？" hint="選一種情境，再點任何一個欄位，看它是做什麼的。">
            <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((e, i) => (
                    <button key={e.name} type="button" aria-pressed={ex === i} onClick={() => setEx(i)} className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${ex === i ? t.chipOn : t.chip}`}>
                        {e.name}
                    </button>
                ))}
            </div>

            <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
                <motion.div key={`req-${ex}`} className="flex flex-1" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 18 }}>
                    <Card title="請求（前端 → 後端）" fields={data.req} kind="req" />
                </motion.div>
                <div aria-hidden="true" className={`text-center text-lg ${t.faint}`}>
                    <span className="md:hidden">↓</span>
                    <span className="hidden md:inline">⇄</span>
                </div>
                <motion.div
                    key={`res-${ex}`}
                    className="flex flex-1"
                    initial={{ opacity: 0, x: 40 }}
                    animate={phase ? { opacity: 1, x: 0 } : { opacity: 0.15, x: 40 }}
                    transition={{ type: 'spring', stiffness: 160, damping: 18 }}
                >
                    <Card title="回應（後端 → 前端）" fields={data.res} kind="res" />
                </motion.div>
            </div>

            <Verdict id={sel ?? `idle-${ex}`}>
                {picked ? (
                    <>
                        <strong>{picked.label}：</strong>
                        {picked.note}
                    </>
                ) : (
                    <>前端發出請求，後端回傳回應。這一來一往，就是前後端溝通的全部。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
