'use client'

import { C, Card, Hand, Mark, Strike, Title, css as s, d } from './slide';

/** 以前卡在「不會寫」，被紅筆劃掉；現在卡在「不知道怎麼變好」 */
export function SlideThenNow() {
    return (
        <Card tone="desk" tag="門檻移動了" n={6}>
            <Title>
                卡住的地方，<span style={{ color: C.goldLight }}>換了一個</span>
            </Title>
            <div className="flex flex-col gap-7 sm:gap-9">
                <div className={s.rise} style={d(0.4)}>
                    <div className={`${s.mono} mb-2 text-xs tracking-[0.18em]`} style={{ color: C.nightSub }}>
                        以前
                    </div>
                    <div className="text-xl font-black sm:text-3xl">
                        <Strike delay={1.2} color="#f87171">
                            我不會寫這個功能。
                        </Strike>
                    </div>
                    <Hand delay={1.8} color="#4ade80" className="mt-2 text-lg sm:text-xl">
                        AI 幫你寫好了
                    </Hand>
                </div>
                <div className={s.rise} style={d(2.3)}>
                    <div className={`${s.mono} mb-2 text-xs tracking-[0.18em]`} style={{ color: C.goldLight }}>
                        現在
                    </div>
                    <div className="text-xl font-black leading-snug sm:text-3xl">
                        我知道要做什麼，但<Mark delay={3} color="rgba(232, 184, 74, 0.42)">不知道怎麼讓它變好</Mark>。
                    </div>
                </div>
            </div>
            <Hand delay={3.8} color={C.goldLight} className="text-right text-lg sm:text-2xl">
                AI 搬走了第一道牆，第二道要靠判斷。
            </Hand>
        </Card>
    );
}
