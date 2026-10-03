'use client'

import Link from 'next/link';
import { useTheme } from '../blog/ThemeProvider';
import { Callout } from '@/components/blog/Callout';

// 數值與 app/tokens.css 一致，改了要兩邊一起改
interface Swatch {
    token: string;
    tw: string;
    use: string;
    dark: string;
    light: string;
    // 線條本身是半透明色，不包 rgb()
    raw?: boolean;
}

const GROUPS: Array<{ title: string; note: string; swatches: Swatch[] }> = [
    {
        title: '品牌',
        note: '全站唯一的裝飾用彩色。只用在連結、強調、進度、清單符號與章節記號。',
        swatches: [
            { token: 'brand', tw: 'bg-brand', use: '色塊、線條、符號', dark: '#facc15', light: '#d97706' },
            { token: 'brand-text', tw: 'text-brand-text', use: '當文字用的強調色', dark: '#fde047', light: '#b45309' },
            { token: 'on-brand', tw: 'text-brand-on', use: '品牌色上的文字', dark: '#0a0a0a', light: '#1c1917' },
        ],
    },
    {
        title: '操作',
        note: '主要按鈕。深色主題是黃色按鈕，淺色主題是深色按鈕，因為黃底在白底上不夠清楚。',
        swatches: [
            { token: 'action', tw: 'bg-action', use: '主要按鈕底色', dark: '#facc15', light: '#1c1917' },
            { token: 'on-action', tw: 'text-action-on', use: '主要按鈕文字', dark: '#0a0a0a', light: '#ffffff' },
        ],
    },
    {
        title: '表面',
        note: '由下往上疊四層。深色靠明度分層，淺色靠陰影分層。',
        swatches: [
            { token: 'canvas', tw: 'bg-canvas', use: '頁面底色', dark: '#0a0a0a', light: '#faf9f7' },
            { token: 'surface', tw: 'bg-surface', use: '卡片', dark: '#111113', light: '#ffffff' },
            { token: 'surface-raised', tw: 'bg-surface-raised', use: '滑過、彈出層、輸入框', dark: '#1a1a1d', light: '#f5f5f4' },
            { token: 'surface-sunken', tw: 'bg-surface-sunken', use: '程式碼、引言、表頭', dark: '#161619', light: '#f3f1ed' },
        ],
    },
    {
        title: '文字',
        note: '三個層級。黑底不用灰字，所以深色主題的次要文字與內文同色，層次靠字級與字重。',
        swatches: [
            { token: 'fg', tw: 'text-fg', use: '標題、粗體', dark: '#fafafa', light: '#1c1917' },
            { token: 'fg-body', tw: 'text-fg-body', use: '內文', dark: '#e4e4e7', light: '#292524' },
            { token: 'fg-muted', tw: 'text-fg-muted', use: '日期、說明、圖說', dark: '#e4e4e7', light: '#57534e' },
        ],
    },
    {
        title: '線條',
        note: '本身就是半透明色，疊在任何表面上都自然。不能再加透明度。',
        swatches: [
            { token: 'line', tw: 'border-line', use: '一般分隔線', dark: '白 10%', light: '黑 10%', raw: true },
            { token: 'line-strong', tw: 'border-line-strong', use: '外框、滑過、H1 底線', dark: '白 22%', light: '黑 22%', raw: true },
        ],
    },
    {
        title: '狀態',
        note: '只在需要表達好壞時出現，不拿來裝飾或分類文章。「注意」用橘色，避開品牌的黃。',
        swatches: [
            { token: 'info', tw: 'bg-info', use: '資訊', dark: '#38bdf8', light: '#0284c7' },
            { token: 'success', tw: 'bg-success', use: '成功', dark: '#34d399', light: '#059669' },
            { token: 'warning', tw: 'bg-warning', use: '注意', dark: '#fb923c', light: '#ea580c' },
            { token: 'danger', tw: 'bg-danger', use: '錯誤', dark: '#f87171', light: '#dc2626' },
        ],
    },
];

const HEADINGS = [
    { tag: 'h1', size: '28 → 36px', weight: 800, mark: '最粗，底下一條實線' },
    { tag: 'h2', size: '24 → 30px', weight: 700, mark: '上方一條強調色短線' },
    { tag: 'h3', size: '20 → 23px', weight: 700, mark: '粗體，沒有記號' },
    { tag: 'h4', size: '18 → 19px', weight: 600, mark: '中粗' },
    { tag: 'h5', size: '16 → 17px', weight: 600, mark: '與內文同大，用強調色' },
    { tag: 'h6', size: '13px', weight: 500, mark: '等寬、全大寫' },
] as const;

const RULES = [
    '元件只寫語意名稱（text-fg-body、bg-surface、border-line），不要寫 isDark ? ... : ...。',
    '深色只用 zinc 一個灰階家族，淺色只用 stone，不再出現 gray、slate。',
    '黑底不用灰字：深色主題的文字最暗到 zinc-200。',
    '品牌色是唯一的裝飾色，同一個畫面不要出現第二個彩色。',
    '狀態色只用在提示框、表單驗證這類需要表達好壞的地方。',
    '要淡的底色用透明度：bg-info/10、border-brand/30。line 本身是半透明，不能再加。',
    '標題相鄰兩級至少差 2px，而且每一級都有字級以外的辨識記號。',
    '數值只改 app/tokens.css 一個地方，這一頁與 docs/uiux-redesign-2026.md 跟著更新。',
];

function SectionTitle({ index, title, children }: { index: string; title: string; children?: React.ReactNode }) {
    return (
        <div className="mb-8 border-t border-line pt-10">
            <div className="font-geist-mono text-xs uppercase tracking-[0.12em] text-brand-text">{index}</div>
            <h2 className="mt-2 text-h2 text-fg">{title}</h2>
            {children && <div className="mt-3 max-w-2xl text-fg-body">{children}</div>}
        </div>
    );
}

export default function DesignPage() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="min-h-screen bg-canvas text-fg-body transition-colors duration-300">
            <div className="mx-auto max-w-5xl px-4 pb-24 pt-10 md:px-8 md:pt-16">
                <header className="flex flex-wrap items-start justify-between gap-6 pb-12">
                    <div>
                        <Link href="/blog" className="font-geist-mono text-xs uppercase tracking-[0.12em] text-fg-muted transition-colors hover:text-brand-text">
                            ← 回部落格
                        </Link>
                        <h1 className="mt-4 text-display text-fg">設計規範</h1>
                        <p className="mt-4 max-w-2xl text-body text-fg-body">
                            全站共用的顏色分類與字級。數值寫在 <code className="rounded bg-surface-sunken px-1.5 py-0.5 text-sm text-fg">app/tokens.css</code>，
                            元件只用語意名稱，深淺色自動切換。切換右邊的主題，下面所有色塊與範例會一起改變。
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-medium text-fg shadow-card transition-colors hover:border-brand"
                    >
                        目前：{isDark ? '深色' : '淺色'}，切換成{isDark ? '淺色' : '深色'}
                    </button>
                </header>

                <SectionTitle index="01" title="顏色分類">
                    六個分類，各自只負責一件事。色塊顯示的是目前主題的實際顏色。
                </SectionTitle>

                <div className="space-y-12">
                    {GROUPS.map((group) => (
                        <section key={group.title}>
                            <h3 className="text-h4 text-fg">{group.title}</h3>
                            <p className="mt-1 max-w-2xl text-sm text-fg-muted">{group.note}</p>
                            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                                {group.swatches.map((s) => (
                                    <div key={s.token} className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
                                        <div
                                            className="h-14 border-b border-line sm:h-20"
                                            style={{
                                                background: s.raw
                                                    ? `linear-gradient(var(--color-${s.token}), var(--color-${s.token})), rgb(var(--color-surface))`
                                                    : `rgb(var(--color-${s.token}))`,
                                            }}
                                        />
                                        <div className="space-y-1 p-3.5">
                                            <div className="break-all font-geist-mono text-[13px] font-medium text-fg">{s.token}</div>
                                            <div className="text-sm text-fg-body">{s.use}</div>
                                            <div className="break-all font-geist-mono text-xs text-fg-muted">{s.tw}</div>
                                            <div className="flex flex-wrap gap-x-3 pt-1 font-geist-mono text-[11px] text-fg-muted">
                                                <span>深 {s.dark}</span>
                                                <span>淺 {s.light}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                <div className="mt-20">
                    <SectionTitle index="02" title="標題六級">
                        相鄰兩級至少差 2px，每一級還各有一個字級以外的辨識記號。字級用 clamp()，手機與桌面之間平滑縮放。
                    </SectionTitle>

                    <div className="grid gap-10 lg:grid-cols-[1fr_15rem]">
                        <div data-article-content="true" className="rounded-2xl border border-line bg-surface p-5 shadow-card md:p-8">
                            <div className="prose max-w-none">
                                <h1>一級標題：文章內大標</h1>
                                <p>內文 16 到 17px，行高 1.9。這一段用來對照標題與內文的大小差距。</p>
                                <h2>二級標題：章節</h2>
                                <p>讀者掃描文章時，看到上方的強調色短線就知道進入了新的章節。</p>
                                <h3>三級標題：小節</h3>
                                <p>比二級小一級，沒有記號，靠字級與粗體區分。</p>
                                <h4>四級標題：段落</h4>
                                <p>中粗，比三級再小一級。</p>
                                <h5>五級標題：重點</h5>
                                <p>與內文同大，用強調色標出來。</p>
                                <h6>六級標題：標籤</h6>
                                <p>等寬字體、全大寫、字距拉開，適合放在一組內容的最上面當分類。</p>
                            </div>
                        </div>
                        <dl className="space-y-4 text-sm">
                            {HEADINGS.map((h) => (
                                <div key={h.tag} className="border-b border-line pb-3">
                                    <dt className="font-geist-mono text-xs uppercase tracking-[0.12em] text-brand-text">{h.tag}</dt>
                                    <dd className="mt-1 text-fg">{h.size} · {h.weight}</dd>
                                    <dd className="text-fg-muted">{h.mark}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>

                <div className="mt-20">
                    <SectionTitle index="03" title="狀態色的用法">
                        文章裡的提示框。四個狀態色加上品牌色的「提示」，底色與外框都是同一個顏色加透明度。
                    </SectionTitle>
                    <div className="grid gap-x-6 md:grid-cols-2">
                        <Callout type="info" title="資訊">補充背景知識，讀者略過也不影響理解。</Callout>
                        <Callout type="success" title="成功">做對了、完成了、驗證通過。</Callout>
                        <Callout type="warning" title="注意">容易出錯的地方，或做之前要先知道的事。</Callout>
                        <Callout type="error" title="錯誤">不要這樣做，或做了會壞掉。</Callout>
                        <Callout type="tip" title="提示">作者的建議與小技巧，用品牌色。</Callout>
                    </div>
                </div>

                <div className="mt-20">
                    <SectionTitle index="04" title="按鈕與表面">
                        主要按鈕用操作色，次要按鈕只有外框。卡片在淺色主題有陰影，在深色主題靠表面明度。
                    </SectionTitle>
                    <div className="flex flex-wrap items-center gap-3">
                        <button type="button" className="rounded-full bg-action px-5 py-2.5 text-sm font-semibold text-action-on transition-colors hover:bg-action/90">主要按鈕</button>
                        <button type="button" className="rounded-full border border-line-strong px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-surface-raised">次要按鈕</button>
                        <button type="button" className="rounded-full px-3 py-2.5 text-sm font-medium text-brand-text transition-colors hover:text-brand">文字按鈕 →</button>
                    </div>
                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-line bg-surface p-5 shadow-card">
                            <div className="text-h6 font-geist-mono uppercase text-fg-muted">surface</div>
                            <div className="mt-2 font-semibold text-fg">卡片</div>
                            <div className="mt-1 text-sm text-fg-body">bg-surface、border-line、shadow-card</div>
                        </div>
                        <div className="rounded-xl border border-line bg-surface-raised p-5">
                            <div className="text-h6 font-geist-mono uppercase text-fg-muted">raised</div>
                            <div className="mt-2 font-semibold text-fg">滑過與彈出</div>
                            <div className="mt-1 text-sm text-fg-body">bg-surface-raised</div>
                        </div>
                        <div className="rounded-xl border border-line bg-surface-sunken p-5">
                            <div className="text-h6 font-geist-mono uppercase text-fg-muted">sunken</div>
                            <div className="mt-2 font-semibold text-fg">內嵌區塊</div>
                            <div className="mt-1 text-sm text-fg-body">bg-surface-sunken</div>
                        </div>
                    </div>
                </div>

                <div className="mt-20">
                    <SectionTitle index="05" title="使用規則" />
                    <ol className="max-w-3xl list-decimal space-y-3 pl-5 marker:text-brand">
                        {RULES.map((rule) => (
                            <li key={rule} className="pl-1 text-fg-body">{rule}</li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
}
