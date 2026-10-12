'use client'

import type { ReactNode } from 'react';
import { C, Card, Mark, Sheet, Stamp, Title, css as s, d } from './slide';

const ROWS: { item: string; rule: string; demo: ReactNode }[] = [
    {
        item: '主要顏色',
        rule: '一個主色＋一個強調色',
        demo: (
            <>
                <Dot c="#1d4ed8" />
                <Dot c="#3b82f6" />
            </>
        ),
    },
    {
        item: '背景',
        rule: '白色、淺灰色',
        demo: (
            <>
                <Dot c="#ffffff" />
                <Dot c="#f3f4f6" />
            </>
        ),
    },
    {
        item: '標題',
        rule: '三種大小，一眼分層',
        demo: (
            <span className="flex items-end gap-1 font-black leading-none">
                <span className="text-lg">A</span>
                <span className="text-sm">A</span>
                <span className="text-[10px]">A</span>
            </span>
        ),
    },
    { item: '按鈕', rule: '同一種圓角和顏色', demo: <span className="block h-5 w-12 rounded-md" style={{ background: '#1d4ed8' }} /> },
    {
        item: '卡片',
        rule: '一樣的留白與陰影',
        demo: (
            <>
                <span className="block h-5 w-7 rounded bg-white" style={{ boxShadow: '0 3px 6px rgba(60,40,10,0.3)' }} />
                <span className="block h-5 w-7 rounded bg-white" style={{ boxShadow: '0 3px 6px rgba(60,40,10,0.3)' }} />
            </>
        ),
    },
    {
        item: '間距',
        rule: '只用 8／16／24',
        demo: (
            <span className="flex items-end gap-1">
                {[6, 12, 18].map((h) => (
                    <span key={h} className="block w-2.5 rounded-sm" style={{ height: h, background: C.red }} />
                ))}
            </span>
        ),
    },
];

function Dot({ c }: { c: string }) {
    return <span className="block h-5 w-5 rounded-full" style={{ background: c, border: `1px solid ${C.line}` }} />;
}

/** 設計規則：一張規格表，一列一列寫上去，最後蓋章 */
export function SlideRulesGrid() {
    return (
        <Card tag="Design System 入門版" n={5}>
            <Title>
                先寫一張<Mark delay={0.5}>全站共用</Mark>的規則表
            </Title>
            <div className="relative mx-auto w-full" style={{ maxWidth: 560 }}>
                <Sheet delay={0.3}>
                    <div className={`${s.mono} flex items-center justify-between border-b px-4 py-2.5 text-[11px] tracking-[0.12em]`} style={{ borderColor: C.line, color: C.ink2 }}>
                        <span>設計規則 v1</span>
                        <span>活動報名網站</span>
                    </div>
                    {ROWS.map((r, i) => (
                        <div
                            key={r.item}
                            className={`${s.fill} grid grid-cols-[72px_1fr_64px] items-center gap-3 px-4 py-2.5 sm:grid-cols-[96px_1fr_80px]`}
                            style={{ ...d(0.7 + i * 0.3), borderTop: i ? `1px dashed ${C.line}` : undefined }}
                        >
                            <span className="text-sm font-black sm:text-[15px]">{r.item}</span>
                            <span className="text-[13px] font-bold sm:text-[15px]" style={{ color: C.ink2 }}>
                                {r.rule}
                            </span>
                            <span className="flex items-center justify-end gap-1.5">{r.demo}</span>
                        </div>
                    ))}
                </Sheet>
                <div className="absolute -top-5 left-[38%] sm:left-[44%]">
                    <Stamp color={C.green} rot={-6} delay={2.8}>
                        全站共用
                    </Stamp>
                </div>
            </div>
        </Card>
    );
}
