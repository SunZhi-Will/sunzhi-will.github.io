'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon, MagnifyingGlassPlusIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { InteractiveFrame, useFrameTheme } from './InteractiveFrame';
import { Lightbox } from './Lightbox';

const IMAGE_BASE = '/blog/2026-10-02-inspiration-vs-plagiarism';

interface Shot {
    /** 檔名；沒有圖的那一邊留空，改顯示 note */
    file?: string;
    note: string;
}

interface Pair {
    /** 同一列有多組對照時，用來區分每一組 */
    label?: string;
    cubeWorld: Shot;
    fangjie: Shot;
}

interface Row {
    item: string;
    /** 這一列附上的東西，顯示在表頭 */
    attached: string;
    compare: string[];
    pairs: Pair[];
}

// Cube World 的圖取自官方 Steam 商店頁的截圖與宣傳影片；
// 《方界》的圖是專案內的實機截圖與試玩版宣傳片畫面
const ROWS: Row[] = [
    {
        item: '角色',
        attached: '截圖',
        compare: ['頭身比例', '臉型五官', '手腳尺寸', '髮型服裝', '配色材質', '種族特徵'],
        pairs: [
            {
                cubeWorld: { file: 'compare-cw-character.webp', note: '官方截圖中的玩家角色' },
                fangjie: { file: 'compare-fj-character.webp', note: '目前的角色三視圖' },
            },
        ],
    },
    {
        item: 'UI',
        attached: ' 2 組截圖',
        compare: ['版面配置', '圖示', '邊框', '字體', '顏色', '動效'],
        pairs: [
            {
                label: '遊戲中的主畫面',
                cubeWorld: { file: 'compare-cw-ui.webp', note: '村莊裡的遊戲畫面' },
                fangjie: { file: 'compare-fj-ui.webp', note: '城鎮裡的遊戲畫面' },
            },
            {
                label: '裝備與背包',
                cubeWorld: { file: 'compare-cw-gear.webp', note: '裝備欄與商人介面' },
                fangjie: { file: 'compare-fj-gear.webp', note: '裝備與背包介面' },
            },
        ],
    },
    {
        item: '創角',
        attached: '截圖',
        compare: ['流程', '可調選項', '介面排版', '預覽方式'],
        pairs: [
            {
                cubeWorld: { file: 'compare-cw-creator.webp', note: '建立角色畫面（官方影片）' },
                fangjie: { file: 'compare-fj-creator.webp', note: '建立角色畫面' },
            },
        ],
    },
    {
        item: '地圖',
        attached: '截圖',
        compare: ['地形生成', '生態分區', '地標', '地圖呈現方式'],
        pairs: [
            {
                cubeWorld: { file: 'compare-cw-map.webp', note: '世界地圖（官方影片）' },
                fangjie: { file: 'compare-fj-map.webp', note: '世界地圖畫面' },
            },
        ],
    },
    {
        item: '滑翔翼',
        attached: '截圖',
        compare: ['模型比例', '貼圖配色', '展開動畫', '角色姿勢'],
        pairs: [
            {
                cubeWorld: { file: 'compare-cw-glider.webp', note: '滑翔翼飛行中（官方影片）' },
                fangjie: { file: 'compare-fj-glider.webp', note: '滑翔翼飛行中（試玩版宣傳片，局部放大）' },
            },
        ],
    },
    {
        item: 'Boss',
        attached: '截圖',
        compare: ['造型', '招式', '機制', '場地'],
        pairs: [
            {
                cubeWorld: { file: 'compare-cw-boss.webp', note: '官方截圖中的大型敵人' },
                fangjie: { file: 'compare-fj-boss.webp', note: '區域 Boss「雷角巨獸」' },
            },
        ],
    },
    {
        item: '技能',
        attached: '截圖',
        compare: ['效果', '特效', '圖示', '施放方式'],
        pairs: [
            {
                cubeWorld: { file: 'compare-cw-skill.webp', note: '法師施放火焰法術（官方影片）' },
                fangjie: { file: 'compare-fj-skill.webp', note: '法師施放火焰法術（試玩版宣傳片）' },
            },
        ],
    },
    {
        item: '職業',
        attached: '說明',
        compare: ['定位', '技能組', '資源機制', '成長路線'],
        pairs: [
            {
                cubeWorld: { note: '官方商店頁列出四種職業：Warrior、Ranger、Mage、Rogue' },
                fangjie: { file: 'compare-fj-class.webp', note: '六種職業：戰士、法師、遊俠、槍手、忍者、死靈法師（圖為技能樹）' },
            },
        ],
    },
    {
        item: '動畫',
        attached: '影片片段',
        compare: ['走跑跳', '攻擊', '受擊', '待機'],
        pairs: [
            {
                cubeWorld: { file: 'compare-cw-motion.webp', note: '法師戰鬥，約 3 秒（官方影片）' },
                fangjie: { file: 'compare-fj-motion.webp', note: '法師戰鬥，約 3 秒（試玩版宣傳片）' },
            },
        ],
    },
];

const MARKS = ['只有概念像', '具體表達也像', '明顯不同'] as const;
type Mark = (typeof MARKS)[number];

/** 逐項比較表：展開可看兩邊的實際截圖與「到底要比什麼」，結論由讀者自己填 */
export function ComparisonMatrix() {
    const t = useFrameTheme();
    const [open, setOpen] = useState<string | null>('角色');
    const [marks, setMarks] = useState<Record<string, Mark>>({});
    const [zoomed, setZoomed] = useState<{ src: string; label: string } | null>(null);

    const renderShot = (game: string, shot: Shot) => {
        const src = shot.file ? `${IMAGE_BASE}/${shot.file}` : null;
        const label = `${game}：${shot.note}`;

        return (
            <div key={game} className="min-w-0">
                {src ? (
                    // 用背景圖而不是 <img>，避免被文章的圖片放大功能重複綁定
                    <motion.button
                        type="button"
                        onClick={() => setZoomed({ src, label })}
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.99 }}
                        aria-label={`放大檢視 ${label}`}
                        className={`group relative block aspect-video w-full overflow-hidden rounded-md border bg-black bg-cover bg-center ${t.divider}`}
                        style={{ backgroundImage: `url(${src})` }}
                    >
                        <span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                            {game}
                        </span>
                        <span className="absolute bottom-2 right-2 rounded bg-black/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
                            <MagnifyingGlassPlusIcon className="h-4 w-4" />
                        </span>
                    </motion.button>
                ) : (
                    <div className={`flex aspect-video w-full flex-col items-center justify-center gap-1.5 rounded-md border border-dashed px-3 text-center ${t.divider} ${t.faint}`}>
                        <PhotoIcon className="h-5 w-5" />
                        <span className="text-[11px] font-semibold">{game}</span>
                    </div>
                )}
                <div className={`mt-1.5 text-xs leading-snug ${t.sub}`}>{shot.note}</div>
            </div>
        );
    };

    const filled = Object.keys(marks).length;

    const mark = (item: string, value: Mark) =>
        setMarks((prev) => {
            if (prev[item] === value) {
                const next = { ...prev };
                delete next[item];
                return next;
            }
            return { ...prev, [item]: value };
        });

    return (
        <InteractiveFrame
            title="我一直想看到的那張表"
            hint="點任一列展開，兩邊的實際畫面都放上去了，點圖可以放大。結論留給你自己填。"
        >
            <div className={`overflow-hidden rounded-lg border ${t.divider}`}>
                <div className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b px-3 py-2 text-[11px] font-medium sm:px-4 ${t.divider} ${t.faint}`}>
                    <span>項目</span>
                    <span>要拿出來的東西</span>
                    <span className="w-24 text-right">結論</span>
                </div>
                {ROWS.map((row, index) => {
                    const isOpen = open === row.item;
                    const value = marks[row.item];
                    return (
                        <motion.div
                            key={row.item}
                            initial={{ opacity: 0, x: -12 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.04 }}
                            className={index < ROWS.length - 1 ? `border-b ${t.divider}` : ''}
                        >
                            <button
                                type="button"
                                aria-expanded={isOpen}
                                onClick={() => setOpen(isOpen ? null : row.item)}
                                className={`grid w-full grid-cols-[1fr_auto_auto] items-center gap-3 px-3 py-2.5 text-left transition-colors sm:px-4 ${
                                    t.isDark ? 'hover:bg-white/5' : 'hover:bg-black/[0.03]'
                                }`}
                            >
                                <span className={`flex items-center gap-2 text-sm font-semibold ${t.text}`}>
                                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className={t.faint}>
                                        <ChevronDownIcon className="h-4 w-4" />
                                    </motion.span>
                                    {row.item}
                                </span>
                                <span className={`text-xs ${t.accent}`}>已附{row.attached}</span>
                                <span className="w-24 text-right">
                                    <AnimatePresence mode="wait" initial={false}>
                                        <motion.span
                                            key={value ?? 'empty'}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.15 }}
                                            className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                                                value ? t.accentSoft : `border-dashed ${t.divider} ${t.faint}`
                                            }`}
                                        >
                                            {value ?? '？'}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                            </button>
                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className={`space-y-3 border-t px-3 py-3 sm:px-4 ${t.divider} ${t.inset}`}>
                                            {row.pairs.map((pair, pairIndex) => (
                                                <div key={pairIndex} className="space-y-2">
                                                    {pair.label && (
                                                        <div className={`text-xs font-semibold ${t.text}`}>{pair.label}</div>
                                                    )}
                                                    <div className="grid gap-3 sm:grid-cols-2">
                                                        {renderShot('Cube World', pair.cubeWorld)}
                                                        {renderShot('方界', pair.fangjie)}
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <span className={`mr-1 text-xs ${t.sub}`}>要比的是</span>
                                                {row.compare.map((label, i) => (
                                                    <motion.span
                                                        key={label}
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.08 + i * 0.04 }}
                                                        className={`rounded border px-2 py-0.5 text-xs ${t.chip}`}
                                                    >
                                                        {label}
                                                    </motion.span>
                                                ))}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <span className={`mr-1 text-xs ${t.sub}`}>比完之後</span>
                                                {MARKS.map((option) => (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        aria-pressed={value === option}
                                                        onClick={() => mark(row.item, option)}
                                                        className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                                                            value === option ? t.chipOn : t.chip
                                                        }`}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            <div className={`flex items-center gap-3 text-xs ${t.sub}`}>
                <div className={`h-1.5 flex-1 overflow-hidden rounded-full ${t.isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                    <motion.div
                        className="h-full rounded-full bg-yellow-400"
                        animate={{ width: `${(filled / ROWS.length) * 100}%` }}
                    />
                </div>
                <span className="shrink-0 tabular-nums">
                    {filled === 0 ? '結論欄到現在都還是空的' : `已填 ${filled} / ${ROWS.length} 項`}
                </span>
            </div>

            <div className={`text-[11px] leading-relaxed ${t.faint}`}>
                Cube World 的畫面取自官方 Steam 商店頁的截圖與宣傳影片，著作權屬 Picroma 所有，此處僅供比較說明。《方界》的畫面是作者自己的實機截圖與試玩版宣傳片。
            </div>

            <Lightbox image={zoomed} onClose={() => setZoomed(null)} />
        </InteractiveFrame>
    );
}
