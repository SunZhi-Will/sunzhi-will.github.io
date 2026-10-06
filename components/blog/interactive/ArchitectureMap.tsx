'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const INFO: Record<string, string> = {
    HTML: '網頁的骨架，決定畫面上有哪些東西。',
    CSS: '網頁的外觀，決定顏色、大小、排版。',
    React: '用來組出畫面與互動的前端工具，跑在瀏覽器裡。',
    JavaScript: 'TypeScript 寫的程式，最後會被編譯成 JavaScript 才在瀏覽器執行。',
    'Node.js': '常見的後端執行環境之一。需要一直活著，自架時可能用 PM2 顧著。',
    '.NET': '微軟的後端平台，同樣跑在伺服器上。',
    Java: '老牌的後端語言，跑在伺服器上。',
    Go: '近年很常用的後端語言，跑在伺服器上。',
    Python: '常用在後端與資料處理，跑在伺服器上。',
    資料庫: '專門保存資料的地方。後端負責去讀寫它，前端不直接碰。',
    'HTTP / API': '前端與後端溝通的方式：前端發出請求，後端回傳結果。',
};

const FRONT = ['HTML', 'CSS', 'React', 'JavaScript'];
const BACK = ['Node.js', '.NET', 'Java', 'Go', 'Python'];

function Chip({ name, on, onClick }: { name: string; on: boolean; onClick: () => void }) {
    const t = useFrameTheme();
    return (
        <motion.button
            type="button"
            aria-pressed={on}
            onClick={onClick}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.93 }}
            className={`rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors ${on ? t.chipOn : t.chip}`}
        >
            {name}
        </motion.button>
    );
}

/** 整體地圖：什麼東西跑在使用者那邊，什麼跑在伺服器 */
export function ArchitectureMap() {
    const t = useFrameTheme();
    const [view, setView] = useState<'where' | 'who'>('where');
    const [sel, setSel] = useState('HTTP / API');

    return (
        <InteractiveFrame title="新手只要先記住這張圖" hint="點任何一個項目，看看它是什麼。也可以切換成看「誰負責什麼」。">
            <div role="group" aria-label="檢視方式" className={`inline-flex rounded-full border p-0.5 ${t.inset}`}>
                {(
                    [
                        ['where', '跑在哪裡'],
                        ['who', '負責什麼'],
                    ] as const
                ).map(([key, label]) => (
                    <button
                        key={key}
                        type="button"
                        aria-pressed={view === key}
                        onClick={() => setView(key)}
                        className={`relative rounded-full px-3.5 py-1 text-xs font-bold ${view === key ? 'text-brand-on' : t.sub}`}
                    >
                        {view === key && <motion.span layoutId="arch-pill" className="absolute inset-0 rounded-full bg-brand" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                        <span className="relative">{label}</span>
                    </button>
                ))}
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_112px_1fr]">
                {/* 使用者那邊 */}
                <div className={`rounded-lg border p-3 ${t.inset}`}>
                    <div className={`flex items-center gap-1.5 text-sm font-bold ${t.text}`}><Icon name="phone" className="h-4 w-4" />你的電腦 / 手機</div>
                    <motion.div key={view + 'f'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mb-3 mt-0.5 text-xs ${t.sub}`}>
                        {view === 'where' ? '瀏覽器（Browser）' : '前端：跟使用者互動'}
                    </motion.div>
                    <div className="flex flex-wrap gap-2">
                        {FRONT.map((n) => (
                            <Chip key={n} name={n} on={sel === n} onClick={() => setSel(n)} />
                        ))}
                    </div>
                </div>

                {/* 中間連線 */}
                <button
                    type="button"
                    aria-pressed={sel === 'HTTP / API'}
                    onClick={() => setSel('HTTP / API')}
                    className="relative flex min-h-[64px] items-center justify-center overflow-hidden rounded-lg md:min-h-0"
                >
                    <span aria-hidden="true" className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-line-strong md:hidden" />
                    <span aria-hidden="true" className="absolute left-0 top-1/2 hidden h-0.5 w-full -translate-y-1/2 bg-line-strong md:block" />
                    {[0, 1, 2].map((i) => (
                        <span key={i} aria-hidden="true">
                            <motion.span
                                className="absolute left-1/2 -ml-[5px] h-2.5 w-2.5 rounded-full bg-brand md:hidden"
                                initial={false}
                                animate={{ top: ['0%', '92%'], opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.73, ease: 'linear' }}
                            />
                            <motion.span
                                className="absolute top-1/2 -mt-[5px] hidden h-2.5 w-2.5 rounded-full bg-brand md:block"
                                initial={false}
                                animate={{ left: ['0%', '92%'], opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.73, ease: 'linear' }}
                            />
                        </span>
                    ))}
                    <span
                        className={`relative z-10 rounded-full border px-2 py-0.5 text-[11px] font-bold ${
                            sel === 'HTTP / API' ? 'border-brand bg-brand text-brand-on' : 'border-line-strong bg-surface text-fg'
                        }`}
                    >
                        HTTP / API
                    </span>
                </button>

                {/* 伺服器 */}
                <div className={`rounded-lg border p-3 ${t.inset}`}>
                    <div className={`flex items-center gap-1.5 text-sm font-bold ${t.text}`}><Icon name="building" className="h-4 w-4" />伺服器</div>
                    <motion.div key={view + 'b'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mb-3 mt-0.5 text-xs ${t.sub}`}>
                        {view === 'where' ? '後端與資料庫' : '後端：處理規則和資料'}
                    </motion.div>
                    <div className="flex flex-wrap gap-2">
                        {BACK.map((n) => (
                            <Chip key={n} name={n} on={sel === n} onClick={() => setSel(n)} />
                        ))}
                    </div>
                    <div className="my-2 text-center text-xs text-fg-muted" aria-hidden="true">
                        ↓
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Chip name="資料庫" on={sel === '資料庫'} onClick={() => setSel('資料庫')} />
                        {view === 'who' && <span className={`text-xs ${t.sub}`}>保存資料</span>}
                    </div>
                </div>
            </div>

            <Verdict id={sel}>
                <strong>{sel}：</strong>
                {INFO[sel]}
            </Verdict>
        </InteractiveFrame>
    );
}
