'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { InteractiveFrame, Verdict, useFrameTheme } from './InteractiveFrame';

const BRANCHES = [
    { name: '畫面怎麼產生', icon: 'photo' as const, items: ['SSR', 'Server Components'] },
    { name: '程式怎麼上線', icon: 'rocket' as const, items: ['Serverless', 'Docker', 'Nginx', 'CDN'] },
    { name: '溝通與安全', icon: 'lock' as const, items: ['CORS', 'Authentication', 'Authorization'] },
];

const INFO: Record<string, string> = {
    SSR: '伺服器先把網頁內容組好再送出，讀者更快看到內容。',
    'Server Components': 'Next.js 的元件可以只在伺服器上執行，不必把程式碼送到瀏覽器。',
    Serverless: '不自己管伺服器，程式在需要時由平台啟動，跑完就結束。',
    Docker: '把程式連同執行環境一起打包成容器，換一台機器也跑得一樣。',
    Nginx: '常見的網頁伺服器與反向代理，負責把請求交給正確的程式。',
    CDN: '把靜態檔案複製到世界各地的節點，讓使用者從最近的地方下載。',
    CORS: '瀏覽器對「跨來源請求」的限制機制。它不是用來判斷資料安不安全的。',
    Authentication: '驗證「你是誰」，例如登入。',
    Authorization: '決定「你能做什麼」，例如能不能刪除使用者。',
};

const TOTAL = Object.keys(INFO).length;

/** 學完基本觀念之後，下一步可以往哪裡走 */
export function LearningRoadmap() {
    const t = useFrameTheme();
    const [sel, setSel] = useState<string | null>(null);
    const [seen, setSeen] = useState<string[]>([]);

    const pick = (name: string) => {
        setSel(name);
        setSeen((s) => (s.includes(name) ? s : [...s, name]));
    };

    return (
        <InteractiveFrame title="接下來可以往哪裡學" kicker="學習地圖" hint="不用第一天就全部懂。想到哪一個，就點開看看。">
            <div className="flex flex-col items-center">
                <motion.div
                    animate={{ boxShadow: ['0 0 0 0 rgba(250,204,21,0.5)', '0 0 0 14px rgba(250,204,21,0)'] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="rounded-full bg-brand px-5 py-2 text-sm font-black text-brand-on"
                >
                    <Icon name="pin" className="mr-1.5 inline h-4 w-4 align-text-bottom" />你在這裡：前端、後端、API
                </motion.div>
                <div aria-hidden="true" className="h-5 w-0.5 bg-line-strong" />
                <div aria-hidden="true" className="hidden h-0.5 w-[66%] bg-line-strong md:block" />
            </div>

            <div className="grid gap-3 md:grid-cols-3">
                {BRANCHES.map((b, bi) => (
                    <motion.div
                        key={b.name}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: bi * 0.1 }}
                        className={`rounded-lg border p-3 ${t.inset}`}
                    >
                        <div className={`mb-2 flex items-center gap-1.5 text-sm font-bold ${t.text}`}>
                            <Icon name={b.icon} className="h-5 w-5 text-brand-text" />
                            {b.name}
                        </div>
                        <div className="relative space-y-2 border-l-2 border-line-strong pl-4">
                            {b.items.map((name) => {
                                const visited = seen.includes(name);
                                return (
                                    <div key={name} className="relative">
                                        <span aria-hidden="true" className={`absolute -left-[21px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 ${visited ? 'border-success bg-success' : 'border-line-strong bg-surface'}`} />
                                        <motion.button
                                            type="button"
                                            aria-pressed={sel === name}
                                            onClick={() => pick(name)}
                                            whileHover={{ x: 3 }}
                                            whileTap={{ scale: 0.96 }}
                                            className={`w-full rounded-md border px-2.5 py-1.5 text-left text-xs font-semibold transition-colors ${sel === name ? t.chipOn : t.chip}`}
                                        >
                                            {name}
                                            {visited && sel !== name && <Icon name="check" className="float-right mt-0.5 h-3.5 w-3.5 text-success-text" />}
                                        </motion.button>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-fg/10">
                    <motion.div className="h-full rounded-full bg-brand" initial={false} animate={{ width: `${(seen.length / TOTAL) * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
                </div>
                <span className={`text-xs font-semibold ${t.sub}`}>
                    已看過 {seen.length} / {TOTAL}
                </span>
            </div>

            <Verdict id={sel ?? 'idle'}>
                {sel ? (
                    <>
                        <strong>{sel}：</strong>
                        {INFO[sel]}
                    </>
                ) : (
                    <>這九個名詞，等基本觀念熟了再慢慢學就好。</>
                )}
            </Verdict>
        </InteractiveFrame>
    );
}
