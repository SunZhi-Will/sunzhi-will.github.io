'use client'

import { useState } from 'react';
import { Note, Slider, Stage } from './kit';
import { InteractiveFrame } from './InteractiveFrame';
import { ALL_BAD, ALL_GOOD, EventMock } from './uiMock';

/** 瞇眼測試：把畫面模糊，還認得出來的就是最重要的東西 */
export function SquintTest() {
    const [blur, setBlur] = useState(0);
    const strong = blur >= 5;

    return (
        <InteractiveFrame title="瞇起眼睛看一下" kicker="瞇眼測試" hint="設計師常用的小技巧：把畫面看模糊，還看得出來的，才是真正突出的地方。">
            <Stage className="p-3 sm:p-5">
                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                    {[
                        { fix: ALL_BAD, name: '修改前' },
                        { fix: ALL_GOOD, name: '修改後' },
                    ].map((m) => (
                        <div key={m.name} className="flex flex-col items-center gap-2">
                            <div className="w-full transition-[filter] duration-200" style={{ filter: `blur(${blur}px)` }}>
                                <EventMock mobile compact fix={m.fix} />
                            </div>
                            <span className="text-[11px] font-bold tracking-[0.12em] text-fg">{m.name}</span>
                        </div>
                    ))}
                </div>
            </Stage>
            <Slider label="瞇眼程度" value={blur} min={0} max={8} step={0.5} onChange={setBlur} display={blur === 0 ? '睜開' : `${blur}px`} />
            <Note id={strong ? 's' : 'w'}>
                {strong ? (
                    <>
                        左邊只剩一大塊標題；右邊還看得到<strong className="text-fg">標題、資訊與藍色按鈕</strong>三個層次。
                    </>
                ) : (
                    <>把滑桿往右拉，看兩邊模糊之後各剩下什麼。</>
                )}
            </Note>
        </InteractiveFrame>
    );
}
