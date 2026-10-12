'use client'

import { C, Card, Hand, Mark, Sticky, Title } from './slide';

/** 收尾：兩行大字，最後貼上一張便利貼 */
export function SlideClosing() {
    return (
        <Card tag="最後" n={7}>
            <div className="flex flex-1 flex-col justify-center gap-6 sm:gap-8">
                <Title delay={0.2} size="text-[26px] sm:text-[40px]">
                    AI 可以幫你把畫面做出來，
                    <br />
                    但<Mark delay={1.1}>體驗</Mark>要你自己想清楚。
                </Title>
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <Sticky rot={-2} delay={1.9} className="max-w-[300px] text-lg sm:text-xl">
                        不要只問 AI 能不能做出網站，想想：使用者為什麼願意用它？
                    </Sticky>
                    <Hand delay={2.6} color={C.ink2} className="self-end whitespace-nowrap text-lg sm:text-xl">
                        謝上智 Sun
                    </Hand>
                </div>
            </div>
        </Card>
    );
}
