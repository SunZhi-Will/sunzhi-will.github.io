'use client'

import { useState } from 'react';
import { Icon } from './icons';
import { Note } from './kit';
import { InteractiveFrame } from './InteractiveFrame';

const ITEMS = [
    { t: '活動名稱與日期', now: true, why: '寫錯整個頁面都要重來' },
    { t: '網站的主要目的', now: true, why: '決定哪些功能該做、哪些不用' },
    { t: '一定要有的功能', now: true, why: '會影響資料與整體結構' },
    { t: '目標使用者是誰', now: true, why: '決定語氣、版面與資訊多寡' },
    { t: '卡片陰影要深還淺', now: false, why: '畫面出來看一眼就能決定' },
    { t: '按鈕圓角幾 px', now: false, why: '細節，之後一次調整就好' },
    { t: '標題要不要加動畫', now: false, why: '先有內容，再決定是否需要' },
    { t: '主色是哪一種藍', now: false, why: '看到成品比憑空想像容易' },
];

/** 規格不是越詳細越好：哪些要先定、哪些做出來再調 */
export function DecideNow() {
    const [ans, setAns] = useState<Record<number, boolean>>({});
    const answered = Object.keys(ans).length;
    const correct = ITEMS.filter((it, i) => ans[i] === it.now).length;
    const done = answered === ITEMS.length;

    return (
        <InteractiveFrame title="現在就要決定，還是做出來再調？" kicker="分類練習" hint="活動報名網站要開始做了。每一項是「現在一定要先講清楚」，還是「看到畫面再調」？">
            <div className="grid gap-2">
                {ITEMS.map((it, i) => {
                    const a = ans[i];
                    const has = a !== undefined;
                    const ok = has && a === it.now;
                    return (
                        <div
                            key={it.t}
                            className={`flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2 transition-colors ${!has ? 'border-line' : ok ? 'border-success/50 bg-success/10' : 'border-danger/40 bg-danger/10'}`}
                        >
                            <span className="min-w-0 flex-1 text-sm font-bold text-fg">
                                {it.t}
                                {has && <span className="mt-0.5 block text-xs font-normal leading-snug text-fg-body">{it.now ? '現在先定：' : '之後再調：'}{it.why}</span>}
                            </span>
                            {has && <Icon name={ok ? 'check' : 'x'} className={`h-4 w-4 shrink-0 ${ok ? 'text-success-text' : 'text-danger-text'}`} />}
                            <span className="flex gap-1.5">
                                {[true, false].map((v) => (
                                    <button
                                        key={String(v)}
                                        type="button"
                                        aria-pressed={a === v}
                                        onClick={() => setAns({ ...ans, [i]: v })}
                                        className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${a === v ? 'border-fg bg-fg text-canvas' : 'border-line-strong text-fg hover:bg-surface-raised'}`}
                                    >
                                        {v ? '現在定' : '之後調'}
                                    </button>
                                ))}
                            </span>
                        </div>
                    );
                })}
            </div>
            <Note id={done ? 'done' : answered}>
                {done ? (
                    <>
                        答對 {correct} / {ITEMS.length}。這就是 MVP 的思考方式：<strong>先做出夠小、能確認方向的版本</strong>，再靠回饋決定下一步。但 MVP 不等於隨便做。
                    </>
                ) : (
                    <>已分類 {answered} / {ITEMS.length}。</>
                )}
            </Note>
        </InteractiveFrame>
    );
}
