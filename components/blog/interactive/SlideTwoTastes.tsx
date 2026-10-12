'use client'

import { C, Card, Hand, Mark, Sheet, Sticky, Strike, Title, css as s, d } from './slide';

/** 同一句「我要好看的網站」，兩個人腦中的畫面完全不同 */
export function SlideTwoTastes() {
    return (
        <Card tag="「好看」很模糊" n={4}>
            <Title>
                同一句「好看」，<Mark delay={0.5}>兩個畫面</Mark>
            </Title>
            <div className="grid grid-cols-2 gap-4 sm:gap-8">
                <Person who="小安" rot={-2.5} color={C.note} delay={0.4} caption="留白多、字少、乾淨">
                    <div className="flex h-full flex-col justify-center gap-2 bg-white px-4">
                        <div className="h-2.5 w-1/2 rounded-sm" style={{ background: C.ink }} />
                        <div className="h-1.5 w-3/4 rounded-full bg-[#d6d3cc]" />
                        <div className="mt-1 h-4 w-12 rounded-sm" style={{ background: C.blue }} />
                    </div>
                </Person>
                <Person who="阿凱" rot={2} color={C.notePink} delay={0.9} caption="光影、動畫、立體感">
                    <div className="relative h-full overflow-hidden" style={{ background: 'linear-gradient(135deg,#1e1b4b,#4c1d95 60%,#be185d)' }}>
                        <span className="absolute left-[12%] top-[22%] h-9 w-9 rounded-full bg-[#f472b6] blur-md" />
                        <span className="absolute left-[44%] top-[14%] h-9 w-9 rounded-full bg-[#22d3ee] blur-md" />
                        <span className="absolute left-[72%] top-[30%] h-9 w-9 rounded-full bg-[#E8B84A] blur-md" />
                        <div className="absolute bottom-3 left-3 h-2.5 w-1/2 rounded-sm bg-white/90" />
                    </div>
                </Person>
            </div>
            <div className={`${s.rise} text-center text-lg font-black sm:text-2xl`} style={d(2.6)}>
                <Strike delay={3.1}>再好看一點</Strike>
                <span className="mx-2">→</span>
                <Mark delay={3.5}>哪裡不好、想變成什麼</Mark>
            </div>
        </Card>
    );
}

function Person({ who, rot, color, delay, caption, children }: { who: string; rot: number; color: string; delay: number; caption: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-3">
            <Sticky rot={rot} color={color} delay={delay} className="text-lg sm:text-2xl">
                我要好看的網站。
                <div className="mt-1 text-right text-sm sm:text-base">— {who}</div>
            </Sticky>
            <Sheet delay={delay + 0.6} anim="pop" style={{ overflow: 'hidden' }}>
                <div className="h-[80px] sm:h-[110px]">{children}</div>
            </Sheet>
            <Hand delay={delay + 1.1} className="text-center text-base sm:text-lg" color={C.ink2}>
                {who}想的是：{caption}
            </Hand>
        </div>
    );
}
