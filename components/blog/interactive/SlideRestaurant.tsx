'use client'

import { C, Card, Mark, Sheet, Sticky, Title, css as s, d } from './slide';

const ROWS = [
    { shop: '菜單的字和排版', web: '按鈕、文字、字體', kind: 'UI' },
    { shop: '桌椅與裝潢', web: '配色、圖片、留白', kind: 'UI' },
    { shop: '找座位、點餐', web: '找到報名、填表單', kind: 'UX' },
    { shop: '結帳、離開', web: '送出、看到「報名成功」', kind: 'UX' },
] as const;

/** 餐廳比喻：一張對照表，最後一欄標出算 UI 還是 UX */
export function SlideRestaurant() {
    return (
        <Card tag="用餐廳來比喻" n={3}>
            <Title>
                UI 是裝潢，<Mark delay={0.5}>UX 是整頓飯</Mark>
            </Title>
            <div className="grid items-start gap-6 sm:grid-cols-[1fr_170px]">
                <Sheet delay={0.3}>
                    <div className={`${s.mono} grid grid-cols-[1fr_1fr_44px] gap-3 border-b px-4 py-2.5 text-[11px] tracking-[0.12em] sm:grid-cols-[1fr_1fr_54px]`} style={{ borderColor: C.line, color: C.ink2 }}>
                        <span>餐廳</span>
                        <span>網站</span>
                        <span className="text-center">算哪個</span>
                    </div>
                    {ROWS.map((r, i) => (
                        <div
                            key={r.shop}
                            className={`${s.fill} grid grid-cols-[1fr_1fr_44px] items-center gap-3 px-4 py-3 text-[13px] font-bold sm:grid-cols-[1fr_1fr_54px] sm:text-[15px]`}
                            style={{ ...d(0.7 + i * 0.35), borderTop: i ? `1px dashed ${C.line}` : undefined }}
                        >
                            <span>{r.shop}</span>
                            <span>{r.web}</span>
                            <span className="flex justify-center">
                                <span
                                    className={`${s.pop} ${s.mono} rounded-full px-2 py-0.5 text-[11px] font-bold`}
                                    style={{ ...d(2.3 + i * 0.15), border: `1.5px solid ${r.kind === 'UI' ? C.gold : C.blue}`, color: r.kind === 'UI' ? C.gold : C.blue }}
                                >
                                    {r.kind}
                                </span>
                            </span>
                        </div>
                    ))}
                </Sheet>
                <Sticky rot={3} delay={3.1} className="mx-auto w-[220px] text-xl sm:mt-10 sm:w-auto">
                    裝潢再漂亮，點餐很亂，客人也不會再來。
                </Sticky>
            </div>
        </Card>
    );
}
