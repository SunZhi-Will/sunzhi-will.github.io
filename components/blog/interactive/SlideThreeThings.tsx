'use client'

import { C, Card, Hand, Stamp, Title, css as s, d } from './slide';

const ITEMS = [
    { n: 1, name: '能用', desc: '功能都做完了，按鈕按得下去', ai: true },
    { n: 2, name: '好看', desc: '顏色、字的大小、留白', ai: false },
    { n: 3, name: '好用', desc: '找得到、按得到、知道成功了', ai: false },
];

/** 能用、好看、好用：AI 蓋章的只有第一張 */
export function SlideThreeThings() {
    return (
        <Card tone="desk" tag="第一個觀念" n={2}>
            <Title>
                三件事，<span style={{ color: C.goldLight }}>不是同一件</span>
            </Title>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-start">
                {ITEMS.map((it, i) => (
                    <div
                        key={it.n}
                        className={`${s.rise} relative flex min-h-[150px] flex-col rounded-md p-4 sm:min-h-[190px] ${i === 1 ? 'sm:mt-6' : ''}`}
                        style={{ ...d(0.4 + i * 0.25), background: C.night2, border: '1px solid #3a3326' }}
                    >
                        <div className={`${s.mono} text-3xl font-bold`} style={{ color: C.goldLight }}>
                            {it.n}
                        </div>
                        <div className="mt-auto text-2xl font-black">{it.name}</div>
                        <div className="mt-1 text-sm font-bold leading-relaxed" style={{ color: C.nightSub }}>
                            {it.desc}
                        </div>
                        <div className="absolute right-3 top-3">
                            {it.ai ? (
                                <Stamp color="#4ade80" rot={-10} delay={1.5} className="text-sm sm:text-base">
                                    AI 做到了
                                </Stamp>
                            ) : (
                                <Hand delay={1.9 + i * 0.25} color={C.goldLight} className="text-base sm:text-lg" anim="pop">
                                    要你說清楚
                                </Hand>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className={`${s.rise} rounded-md px-4 py-3 text-center text-base font-black sm:text-lg`} style={{ ...d(2.6), background: C.goldLight, color: C.ink }}>
                沒說清楚的那兩件，AI 只能自己猜
            </div>
        </Card>
    );
}
