'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon, type IconName } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

type Tone = 'run' | 'file' | 'alive' | 'managed';

const TONES: Record<Tone, { label: string; badge: string }> = {
    run: { label: '在瀏覽器執行', badge: 'bg-info/15 text-info-text border-info/40' },
    file: { label: '只是檔案', badge: 'bg-fg/10 text-fg-body border-line-strong' },
    alive: { label: '必須一直活著', badge: 'bg-warning/15 text-warning-text border-warning/40' },
    managed: { label: '平台幫你顧', badge: 'bg-success/15 text-success-text border-success/40' },
};

const SCENARIOS: {
    id: string;
    name: string;
    nodes: { icon: IconName; name: string; tone: Tone }[];
    pm2: 'no' | 'maybe';
    answer: string;
}[] = [
    {
        id: 'spa',
        name: 'React SPA',
        nodes: [
            { icon: 'globe' as const, name: '瀏覽器裡的 React', tone: 'run' },
            { icon: 'box' as const, name: '靜態檔案（Nginx、Pages、S3）', tone: 'file' },
        ],
        pm2: 'no',
        answer: '打包後只是一堆檔案，放哪裡都行。沒有程序需要被顧，所以通常不需要 PM2。',
    },
    {
        id: 'node',
        name: 'Node.js 後端',
        nodes: [
            { icon: 'globe' as const, name: '瀏覽器裡的 React', tone: 'run' },
            { icon: 'cog' as const, name: 'Node.js 後端程序', tone: 'alive' },
            { icon: 'db' as const, name: '資料庫', tone: 'alive' },
        ],
        pm2: 'maybe',
        answer: '後端是一支必須一直活著的程式，自己架在伺服器上時，常會用 PM2 幫它顧著、掛了就重啟。',
    },
    {
        id: 'next',
        name: 'Next.js SSR（自架 VPS）',
        nodes: [
            { icon: 'globe' as const, name: '瀏覽器', tone: 'run' },
            { icon: 'next' as const, name: 'Next.js Server（next start）', tone: 'alive' },
            { icon: 'db' as const, name: '資料庫或 API', tone: 'alive' },
        ],
        pm2: 'maybe',
        answer: 'SSR 需要一個 Server 一直在回應請求。自己架在 VPS 上，就得有人顧著它，PM2 是常見選擇。',
    },
    {
        id: 'vercel',
        name: 'Vercel、Cloudflare',
        nodes: [
            { icon: 'globe' as const, name: '瀏覽器', tone: 'run' },
            { icon: 'cloud' as const, name: '平台上的 Server', tone: 'managed' },
            { icon: 'db' as const, name: '託管的資料庫', tone: 'managed' },
        ],
        pm2: 'no',
        answer: 'Server 還是存在，只是平台幫你管掉了。你看不到 PM2，不代表沒有伺服器。',
    },
];

/** 選一種部署方式，看誰要一直活著、要不要 PM2 */
export function DeployPicker() {
    const t = useFrameTheme();
    const [id, setId] = useState('spa');
    const scenario = SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];

    return (
        <InteractiveFrame title="你的專案，需要 PM2 嗎？" hint="選一種部署方式，看看是誰一直在跑。">
            <div className="flex flex-wrap gap-2">
                {SCENARIOS.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        aria-pressed={id === item.id}
                        onClick={() => setId(item.id)}
                        className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${id === item.id ? t.chipOn : t.chip}`}
                    >
                        {item.name}
                    </button>
                ))}
            </div>

            <div className={`rounded-lg border p-3 sm:p-4 ${t.inset}`}>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={scenario.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="flex flex-col items-stretch gap-2 md:flex-row md:items-center"
                    >
                        {scenario.nodes.map((node, i) => (
                            <div key={node.name} className="flex flex-col items-stretch gap-2 md:flex-1 md:flex-row md:items-center">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 260, damping: 18 }}
                                    className="flex-1 rounded-lg border border-line bg-surface p-3 text-center"
                                >
                                    <motion.div
                                        className="text-2xl"
                                        animate={node.tone === 'alive' ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                                        transition={{ duration: 1.6, repeat: node.tone === 'alive' ? Infinity : 0 }}
                                    >
                                        <Icon name={node.icon} className="mx-auto h-7 w-7 text-fg" />
                                    </motion.div>
                                    <div className={`mt-1 text-[13px] font-semibold leading-snug ${t.text}`}>{node.name}</div>
                                    <span className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold ${TONES[node.tone].badge}`}>
                                        {TONES[node.tone].label}
                                    </span>
                                </motion.div>
                                {i < scenario.nodes.length - 1 && (
                                    <span aria-hidden="true" className={`text-center text-lg ${t.faint}`}>
                                        <span className="md:hidden">↓</span>
                                        <span className="hidden md:inline">→</span>
                                    </span>
                                )}
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex items-center gap-3">
                <span className={`text-sm ${t.sub}`}>需要自己用 PM2 嗎？</span>
                <motion.span
                    key={scenario.id}
                    initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className={`rounded-md border-2 px-3 py-1 text-sm font-black tracking-wider ${
                        scenario.pm2 === 'no' ? 'border-success text-success-text' : 'border-warning text-warning-text'
                    }`}
                >
                    {scenario.pm2 === 'no' ? '通常不用' : '可能會用'}
                </motion.span>
            </div>

            <Verdict id={scenario.id}>{scenario.answer}</Verdict>
        </InteractiveFrame>
    );
}
