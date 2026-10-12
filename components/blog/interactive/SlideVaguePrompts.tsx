'use client'

import { C, Card, Chat, Hand, Mark, Phone, Title, css as s, d } from './slide';

const VERSIONS = [
    { label: '第 1 版', bg: '#ffffff', ink: '#111827', line: '#cbd5e1', btn: '#9ca3af', rot: -3, x: '0%', y: 0, delay: 1.5 },
    { label: '第 2 版', bg: '#fdf2f8', ink: '#831843', line: '#f9a8d4', btn: '#ec4899', rot: 2.5, x: '9%', y: 22, delay: 3.3 },
    { label: '第 3 版', bg: '#0f172a', ink: '#e2e8f0', line: '#475569', btn: '#22d3ee', rot: -1, x: '18%', y: 44, delay: 5.1 },
];

/** 開場：三句模糊的要求，AI 交了三版，資訊擠在一起的問題一直沒動 */
export function SlideVaguePrompts() {
    return (
        <Card tag="常見的對話" n={1}>
            <Title>
                改了三次，<Mark delay={0.5}>問題還在原地</Mark>
            </Title>
            <div className="grid items-start gap-8 sm:grid-cols-[230px_1fr]">
                <Phone delay={0.2} className="mx-auto w-full max-w-[260px]" height={360}>
                    <Chat
                        turns={[
                            { role: 'me', text: '再好看一點。', delay: 0.6 },
                            { role: 'ai', typed: '好的，我換了配色！', delay: 1.1 },
                            { role: 'me', text: '再有科技感一點。', delay: 2.4 },
                            { role: 'ai', typed: '已改成深色科技風！', delay: 2.9 },
                            { role: 'me', text: '我想要更專業。', delay: 4.2 },
                        ]}
                        thinkingAt={4.7}
                    />
                </Phone>

                <div className="relative h-[290px] sm:h-[330px]">
                    {VERSIONS.map((v, i) => (
                        <div key={v.label} className="absolute w-[78%]" style={{ left: v.x, top: v.y, transform: `rotate(${v.rot}deg)` }}>
                            <div className={s.slideL} style={d(v.delay)}>
                                <MiniPage v={v} annotate={i === VERSIONS.length - 1} />
                            </div>
                        </div>
                    ))}
                    <div className="absolute bottom-0 right-0 w-[70%] text-right sm:bottom-2">
                        <Hand delay={6.4} color={C.red} className="text-xl sm:text-2xl" anim="rise">
                            資訊還是擠在一起
                        </Hand>
                    </div>
                </div>
            </div>
        </Card>
    );
}

/** 一張印出來的版本稿：顏色每版不同，中間那段擠成一團的資訊從沒變過 */
function MiniPage({ v, annotate }: { v: (typeof VERSIONS)[number]; annotate: boolean }) {
    return (
        <div className="rounded-md p-3 sm:p-4" style={{ background: v.bg, border: `1px solid ${C.line}`, boxShadow: '0 14px 24px -16px rgba(60,40,10,0.55)' }}>
            <div className={`${s.mono} mb-2 text-[10px] tracking-[0.12em]`} style={{ color: v.ink, opacity: 0.85 }}>
                {v.label}
            </div>
            <div className="h-4 w-3/4 rounded-sm" style={{ background: v.ink }} />
            <div className="relative mt-2 space-y-[3px] py-1">
                {[100, 94, 98, 72].map((w, i) => (
                    <div key={i} className="h-[4px] rounded-full" style={{ width: `${w}%`, background: v.line }} />
                ))}
                {annotate && (
                    // 紅筆圈起來：橢圓外框，像蓋章一樣壓上去
                    <span className={`${s.stamp} pointer-events-none absolute -inset-x-2.5 -inset-y-2.5 block`} style={{ ...d(5.9), border: `2.5px solid ${C.red}`, borderRadius: '50%', transform: 'rotate(-2deg)' }} />
                )}
            </div>
            <div className="mt-2 flex gap-1.5">
                <span className="h-3.5 w-12 rounded-sm" style={{ background: v.btn }} />
                <span className="h-3.5 w-12 rounded-sm" style={{ background: v.btn }} />
            </div>
        </div>
    );
}
