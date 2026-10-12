'use client'

import { useEffect, useRef, useState } from 'react';
import { Icon, type IconName } from './icons';
import { Meter, Stage } from './kit';
import { InteractiveFrame, Verdict } from './InteractiveFrame';
import { ALL_BAD, EventMock, type MockFix } from './uiMock';

const CHECKS: { key: keyof MockFix; icon: IconName; name: string; tip: string }[] = [
    { key: 'hierarchy', icon: 'flag', name: '重要資訊明顯', tip: '日期、地點、費用不用找。' },
    { key: 'spacing', icon: 'box', name: '適當留白', tip: '不是每個地方都要塞滿。' },
    { key: 'contrast', icon: 'eye', name: '文字清楚', tip: '文字與背景不要太接近。' },
    { key: 'cta', icon: 'bolt', name: '主要操作突出', tip: '一眼就知道下一步按哪裡。' },
    { key: 'feedback', icon: 'chat', name: '操作後有回應', tip: '按下去之後會告訴你發生什麼事。' },
];

/** 好看之外，還要讓人看得懂：五個檢查點逐一補上 */
export function FiveChecks() {
    const [fix, setFix] = useState<MockFix>({ ...ALL_BAD });
    const [mobile, setMobile] = useState(false);
    const [sent, setSent] = useState<'idle' | 'sending' | 'done'>('idle');
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    useEffect(() => () => clearTimeout(timer.current), []);

    const count = CHECKS.filter((c) => fix[c.key]).length;

    const send = () => {
        if (sent === 'sending') return;
        if (sent === 'done') return setSent('idle');
        setSent('sending');
        timer.current = setTimeout(() => setSent('done'), 900);
    };

    return (
        <InteractiveFrame title="做完之後的五個檢查" kicker="互動展示" hint="一項一項補上，看畫面怎麼變。也可以切到手機寬度，最後試按一次報名。">
            <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
                <div className="flex flex-col gap-2">
                    {CHECKS.map((c) => {
                        const on = fix[c.key];
                        return (
                            <button
                                key={c.key}
                                type="button"
                                aria-pressed={on}
                                onClick={() => setFix({ ...fix, [c.key]: !on })}
                                className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-colors ${on ? 'border-success/50 bg-success/10' : 'border-dashed border-brand/60 hover:bg-brand/10'}`}
                            >
                                <Icon name={on ? 'check' : c.icon} className={`h-4 w-4 shrink-0 ${on ? 'text-success-text' : 'text-brand-text'}`} />
                                <span className="min-w-0">
                                    <span className="block text-sm font-black text-fg">{c.name}</span>
                                    <span className="block text-xs leading-snug text-fg-body">{c.tip}</span>
                                </span>
                            </button>
                        );
                    })}
                    <button
                        type="button"
                        aria-pressed={mobile}
                        onClick={() => setMobile(!mobile)}
                        className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-sm font-black text-fg transition-colors ${mobile ? 'border-brand bg-brand/15' : 'border-line hover:border-line-strong'}`}
                    >
                        <Icon name={mobile ? 'phone' : 'monitor'} className="h-4 w-4 text-brand-text" />
                        {mobile ? '手機寬度' : '電腦寬度'}（點擊切換）
                    </button>
                </div>
                <div className="flex flex-col gap-3">
                    <Stage className="p-3 sm:p-4">
                        <EventMock fix={fix} mobile={mobile} sent={sent} onCta={send} />
                    </Stage>
                    <Meter label="好用程度" value={count * 20} suffix="%" tone={count >= 4 ? 'success' : count >= 2 ? 'warning' : 'danger'} />
                </div>
            </div>
            <Verdict id={count}>
                {count === 5 ? (
                    <>
                        五項都補上了。<strong>最後還是要自己拿手機，從頭操作一遍。</strong>
                    </>
                ) : (
                    <>這些細節加起來，才是完整的使用體驗。還剩 {5 - count} 項沒補。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
