'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const OUTCOMES: Record<string, { lamp: string; text: string }> = {
    'false-false': {
        lamp: '各自創作',
        text: '沒接觸過，作品也不像。兩個人各做各的。',
    },
    'true-false': {
        lamp: '受到影響',
        text: '玩過、喜歡過、被影響過，但具體表達是自己的。這是大多數創作的日常，也是我認為《方界》所在的位置。',
    },
    'false-true': {
        lamp: '先別急',
        text: '沒有接觸卻很像，可能是巧合，也可能只是同類型作品共通的慣例。',
    },
    'true-true': {
        lamp: '進入審查',
        text: '兩個條件都成立，才真的進入「是否構成抄襲」的討論。而且到這一步，仍然要看個案的質與量。',
    },
};

interface SwitchRowProps {
    label: string;
    note: string;
    on: boolean;
    onToggle: () => void;
}

function SwitchRow({ label, note, on, onToggle }: SwitchRowProps) {
    const t = useFrameTheme();

    return (
        <button
            type="button"
            role="switch"
            aria-checked={on}
            onClick={onToggle}
            className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors ${on ? t.accentSoft : t.chip}`}
        >
            <span
                className={`flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 ${
                    on ? 'justify-end bg-yellow-400' : t.isDark ? 'justify-start bg-zinc-600' : 'justify-start bg-zinc-300'
                }`}
            >
                <motion.span
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="h-5 w-5 rounded-full bg-white shadow"
                />
            </span>
            <span className="min-w-0">
                <span className="block text-sm font-semibold">{label}</span>
                <span className="block text-xs opacity-75">{note}</span>
            </span>
        </button>
    );
}

/** 「接觸」與「實質相似」兩個開關，都打開才會進入抄襲的審查 */
export function ContactGate() {
    const t = useFrameTheme();
    const [contact, setContact] = useState(true);
    const [similar, setSimilar] = useState(false);

    const outcome = OUTCOMES[`${contact}-${similar}`];
    const both = contact && similar;
    const wireOff = t.isDark ? '#3f3f46' : '#d4d4d8';

    return (
        <InteractiveFrame
            title="兩個開關，缺一不可"
            hint="第一個開關我自己就打開了：我玩過，也喜歡 Cube World。試試看切換第二個。"
        >
            <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_minmax(0,180px)]">
                <div className="space-y-3">
                    <SwitchRow
                        label="接觸"
                        note="看過、玩過、有機會參考"
                        on={contact}
                        onToggle={() => setContact((v) => !v)}
                    />
                    <SwitchRow
                        label="實質相似"
                        note="具體表達在質與量上都很接近"
                        on={similar}
                        onToggle={() => setSimilar((v) => !v)}
                    />
                </div>

                <svg viewBox="0 0 60 120" className="mx-auto hidden h-28 w-14 sm:block" aria-hidden="true">
                    <motion.path
                        d="M0 28 H24 V60 H60"
                        fill="none"
                        strokeWidth="3"
                        animate={{ stroke: contact ? '#facc15' : wireOff }}
                    />
                    <motion.path
                        d="M0 92 H24 V60"
                        fill="none"
                        strokeWidth="3"
                        animate={{ stroke: similar ? '#facc15' : wireOff }}
                    />
                    <motion.circle cx="24" cy="60" r="5" animate={{ fill: both ? '#facc15' : wireOff }} />
                </svg>

                <motion.div
                    className={`flex flex-col items-center justify-center gap-2 rounded-lg border px-3 py-4 ${t.inset}`}
                    animate={{ boxShadow: both ? '0 0 28px rgba(250, 204, 21, 0.35)' : '0 0 0px rgba(250, 204, 21, 0)' }}
                >
                    <motion.span
                        className="h-8 w-8 rounded-md"
                        animate={{
                            backgroundColor: both ? '#facc15' : contact || similar ? '#a16207' : wireOff,
                            rotate: both ? 45 : 0,
                            scale: both ? [1, 1.25, 1] : 1,
                        }}
                        transition={{ duration: 0.4 }}
                    />
                    <span className={`text-sm font-bold ${both ? t.accent : t.text}`}>{outcome.lamp}</span>
                </motion.div>
            </div>

            <Verdict id={`${contact}-${similar}`}>{outcome.text}</Verdict>
        </InteractiveFrame>
    );
}
