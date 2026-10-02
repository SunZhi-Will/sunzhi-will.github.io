'use client'

import { useEffect } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import Link from 'next/link';
import { Backdrop } from '@/components/home/Backdrop';
import { LogoIcon } from '@/components/LogoIcon';
import { Magnetic } from '@/components/motion/Magnetic';
import { Reveal } from '@/components/motion/Reveal';
import { Spotlight } from '@/components/motion/Spotlight';
import { SplitText } from '@/components/motion/SplitText';
import { EASE_OUT } from '@/components/motion/ease';
import { useSiteLang } from '@/lib/use-site-lang';

type Lang = 'zh-TW' | 'en';

const CONTACT_EMAIL = 'sun055676@gmail.com';
const STUDIO_NAME = 'SunCodeStudio';

interface PricingTier {
    name: string;
    price: string;
    unit: string;
    description: string;
    features: string[];
    highlight?: boolean;
    note?: string;
}

interface ServiceSection {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    tiers: PricingTier[];
    badge?: string;
}

const content: Record<Lang, {
    pageTitle: string;
    pageSubtitle: string;
    contactLabel: string;
    contactNote: string;
    paymentNote: string;
    paymentNoteDetail: string;
    currency: string;
    back: string;
    cta: string;
    ctaNote: string;
    disclaimer: string;
    services: ServiceSection[];
}> = {
    'zh-TW': {
        pageTitle: '服務費用',
        pageSubtitle: '透明定價，量身規劃，讓每一分預算都創造最大價值',
        contactLabel: '聯絡信箱',
        contactNote: '所有費用以新台幣 (TWD) 計價，實際報價依專案需求討論確定。',
        paymentNote: '付款方式',
        paymentNoteDetail: '接受信用卡、ATM 轉帳等付款方式，收款透過綠界科技 (ECPay) 金流服務處理，安全有保障。',
        currency: 'NT$',
        back: '← 回首頁',
        cta: '立即聯繫洽談',
        ctaNote: '填寫需求後，通常在 1–2 個工作天內回覆報價。',
        disclaimer: '以上為參考報價，實際金額依專案規模、複雜度及時程協商決定。',
        services: [
            {
                id: 'project',
                badge: '可接受委託',
                title: '軟體專案接案',
                subtitle: 'Custom Software Development',
                description: '從需求分析、UI/UX 設計到系統上線，提供全流程客製化開發服務，包含網頁前後端、資料庫設計與第三方 API 串接。',
                tiers: [
                    {
                        name: '小型專案',
                        price: '10,000 – 30,000',
                        unit: '/ 專案',
                        description: '適合靜態官網、Landing Page、簡單表單系統',
                        features: [
                            '響應式網頁設計 (RWD)',
                            '基本 SEO 優化',
                            '聯絡表單 / 預約功能',
                            '交付原始碼 + 部署協助',
                            '7 天免費修改',
                        ],
                    },
                    {
                        name: '時薪計費',
                        price: '1,000 – 1,500',
                        unit: '/ 小時',
                        description: '適合功能修改、Bug 修復、技術諮詢或短期協作',
                        features: [
                            '彈性按時計費',
                            '每月結算或預付點數',
                            '適合持續維護需求',
                            '需求紀錄與工時報告',
                        ],
                    },
                ],
            },
            {
                id: 'teaching',
                title: '軟體教學顧問',
                subtitle: 'Software Teaching & Consulting',
                description: '結合業界實務經驗的程式設計教學，涵蓋 Unity、Web 開發等主題，適合個人進修、企業培訓或學生專案指導。',
                tiers: [
                    {
                        name: '個人家教',
                        price: '800 – 1,200',
                        unit: '/ 小時',
                        description: '一對一線上或面授，依學習目標客製進度',
                        features: [
                            '課前需求訪談與課程規劃',
                            '課後學習資源與筆記提供',
                            '可錄影留存複習',
                            '涵蓋：Python、C#、JavaScript、Unity、LINE Bot',
                        ],
                    },
                    {
                        name: '企業 / 團體工作坊',
                        price: '15,000 起',
                        unit: '/ 場次',
                        description: '半天或全天工作坊，適合企業技術升級或校園活動',
                        highlight: true,
                        features: [
                            '場次前問卷調查需求',
                            '客製化簡報與實作教材',
                            '10 人以內小班制（超過另議）',
                            '主題：LINE Bot 開發、Unity 遊戲開發、Web 前後端實作',
                            '可提供出席證明',
                        ],
                    },
                    {
                        name: '學生專案指導',
                        price: '500 – 800',
                        unit: '/ 小時',
                        description: '畢業專題、競賽作品、系所課程專案技術指導',
                        features: [
                            '架構規劃與技術建議',
                            'Code Review 與重構指導',
                            'Demo 準備與簡報輔導',
                            '學校、競賽專案優先排程',
                        ],
                        note: '學生身分可享優惠，歡迎詢問',
                    },
                ],
            },
        ],
    },
    'en': {
        pageTitle: 'Service Pricing',
        pageSubtitle: 'Transparent pricing, tailored to your needs',
        contactLabel: 'Contact Email',
        contactNote: 'All prices are in New Taiwan Dollar (TWD). Final quotes depend on project requirements.',
        paymentNote: 'Payment Methods',
        paymentNoteDetail: 'Credit card, ATM transfer, and more are accepted via ECPay secure payment gateway.',
        currency: 'NT$',
        back: '← Back to Home',
        cta: 'Get in Touch',
        ctaNote: 'I typically respond within 1–2 business days.',
        disclaimer: 'Prices above are estimates. Final amounts are determined by project scope, complexity, and timeline.',
        services: [
            {
                id: 'project',
                badge: 'Available for Hire',
                title: 'Software Development',
                subtitle: 'Custom Software Development',
                description: 'Full-cycle custom development from requirements analysis to deployment, including front-end, back-end, database design, and third-party API integration.',
                tiers: [
                    {
                        name: 'Small Project',
                        price: '10,000 – 30,000',
                        unit: '/ project',
                        description: 'Static sites, landing pages, simple form systems',
                        features: [
                            'Responsive Web Design (RWD)',
                            'Basic SEO optimization',
                            'Contact form / booking feature',
                            'Source code delivery + deployment help',
                            '7-day free revisions',
                        ],
                    },
                    {
                        name: 'Medium Project',
                        price: '30,000 – 80,000',
                        unit: '/ project',
                        description: 'Admin dashboards, e-commerce, membership platforms, LINE Bots',
                        highlight: true,
                        features: [
                            'Database design & API development',
                            'Authentication / role management',
                            'LINE Bot / third-party API integration',
                            'Admin interface',
                            '14-day free maintenance',
                        ],
                    },
                    {
                        name: 'Large Projects',
                        price: 'From 80,000',
                        unit: '/ project',
                        description: 'SaaS platforms, enterprise systems, complex web applications',
                        features: [
                            'System architecture & tech stack planning',
                            'Complex backend & business logic development',
                            'CI/CD pipeline setup',
                            'Performance & security audit',
                            'Long-term maintenance negotiable',
                        ],
                        note: 'Milestone-based pricing available',
                    },
                    {
                        name: 'Hourly Rate',
                        price: '1,000 – 1,500',
                        unit: '/ hour',
                        description: 'Feature modifications, bug fixes, tech consulting, short-term collaboration',
                        features: [
                            'Flexible hourly billing',
                            'Monthly settlement or prepaid credits',
                            'Suitable for ongoing maintenance',
                            'Work logs and reports provided',
                        ],
                    },
                ],
            },
            {
                id: 'teaching',
                title: 'Teaching & Consulting',
                subtitle: 'Software Teaching & Consulting',
                description: 'Industry-practice-based programming instruction covering Unity, web development, and system integration for individuals, enterprises, or student project guidance.',
                tiers: [
                    {
                        name: 'Private Tutoring',
                        price: '800 – 1,200',
                        unit: '/ hour',
                        description: 'One-on-one online or in-person, customized to your goals',
                        features: [
                            'Pre-lesson needs assessment',
                            'Post-lesson notes & resources',
                            'Session recording available',
                            'Topics: Python, C#, JavaScript, Unity, LINE Bot',
                        ],
                    },
                    {
                        name: 'Corporate / Group Workshop',
                        price: 'From 15,000',
                        unit: '/ session',
                        description: 'Half-day or full-day workshops for corporate training or campus events',
                        highlight: true,
                        features: [
                            'Pre-workshop survey',
                            'Custom slides & hands-on materials',
                            'Up to 10 participants (more negotiable)',
                            'Topics: LINE Bot development, Unity, Web front-end & back-end',
                            'Attendance certificate available',
                        ],
                    },
                    {
                        name: 'Student Project Mentoring',
                        price: '500 – 800',
                        unit: '/ hour',
                        description: 'Guidance for graduation projects, competitions, or coursework',
                        features: [
                            'Architecture planning & tech recommendations',
                            'Code review & refactoring guidance',
                            'Demo prep & presentation coaching',
                            'Priority scheduling for student projects',
                        ],
                        note: 'Student discounts available, feel free to ask',
                    },
                ],
            },
        ],
    },
};

export default function PricingPage() {
    const [lang, setLang] = useSiteLang();
    const zh = lang === 'zh-TW';

    useEffect(() => {
        document.title = zh ? `服務費用 | ${STUDIO_NAME}` : `Service Pricing | ${STUDIO_NAME}`;
    }, [zh]);

    // 與首頁共用深色版面的捲軸與底色
    useEffect(() => {
        document.documentElement.classList.add('site-dark');
        return () => document.documentElement.classList.remove('site-dark');
    }, []);

    const t = content[lang];
    const controlClass =
        'flex h-9 items-center justify-center rounded-full border border-white/10 bg-[#141416]/80 text-zinc-400 backdrop-blur-xl transition-colors duration-200 hover:border-white/30 hover:text-white';

    return (
        <MotionConfig reducedMotion="user">
            <div className="site relative isolate min-h-screen [overflow-x:clip]">
                <Backdrop />

                {/* 頂部控制列 */}
                <motion.header
                    className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 pt-4"
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE_OUT }}
                >
                    <Link href="/" className={`${controlClass} group gap-2 px-3.5`} aria-label={t.back.replace(/^←\s*/, '')}>
                        <LogoIcon className="h-5 w-5 text-zinc-100 transition-transform duration-500 group-hover:rotate-180" />
                        <span className="text-sm font-semibold text-zinc-100">Sun</span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setLang(zh ? 'en' : 'zh-TW')}
                        className={`${controlClass} font-geist-mono px-3.5 text-xs`}
                        aria-label={zh ? 'Switch to English' : '切換為中文'}
                    >
                        {zh ? 'EN' : '中'}
                    </button>
                </motion.header>

                {/* Hero */}
                <section className="px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-48">
                    <div className="mx-auto max-w-6xl">
                        <motion.span
                            className="eyebrow"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            {STUDIO_NAME}
                        </motion.span>
                        <h1 key={lang} className="mt-4 text-[clamp(3rem,10vw,8rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-white">
                            <SplitText text={t.pageTitle} immediate delay={0.1} stagger={0.05} />
                        </h1>
                        <motion.p
                            className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.45 }}
                        >
                            {t.pageSubtitle}
                        </motion.p>
                    </div>
                </section>

                {/* Services */}
                <main className="px-5 pb-20 md:px-10 md:pb-32">
                    <div className="mx-auto max-w-6xl space-y-24 md:space-y-36">
                        {t.services.map((service, sIdx) => (
                            <section key={service.id} id={service.id}>
                                <Reveal>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                        <span className="eyebrow">{String(sIdx + 1).padStart(2, '0')}</span>
                                        {service.badge && (
                                            <span className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-zinc-300">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-status-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                                                </span>
                                                {service.badge}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">{service.title}</h2>
                                    <p className="mt-2 text-sm text-zinc-400">{service.subtitle}</p>
                                </Reveal>
                                <motion.div
                                    className="mt-8 h-px origin-left bg-white/10"
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.1, ease: EASE_OUT }}
                                />
                                <Reveal className="mt-8 max-w-3xl text-base leading-relaxed text-zinc-300 md:text-lg">
                                    {service.description}
                                </Reveal>

                                {/* Pricing cards */}
                                <div className={`mt-10 grid gap-4 ${service.tiers.length === 4
                                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
                                    : service.tiers.length === 2
                                        ? 'grid-cols-1 sm:grid-cols-2'
                                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                                    }`}>
                                    {service.tiers.map((tier, tIdx) => (
                                        <Reveal key={tier.name} delay={tIdx * 0.08} className="h-full">
                                            <Spotlight
                                                className={`flex h-full flex-col rounded-[24px] border p-6 transition-colors duration-300 md:p-7 ${tier.highlight
                                                    ? 'border-yellow-400/40 bg-yellow-400/[0.03]'
                                                    : 'border-white/10 bg-[#111113] hover:border-white/20'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <h3 className="text-base font-semibold text-white">{tier.name}</h3>
                                                    {tier.highlight && (
                                                        <span className="rounded-full bg-yellow-400 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-950">
                                                            {zh ? '最熱門' : 'Most Popular'}
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
                                                    <span className="font-geist-mono text-xs text-zinc-400">{t.currency}</span>
                                                    <span className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{tier.price}</span>
                                                    <span className="text-sm text-zinc-400">{tier.unit}</span>
                                                </p>
                                                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{tier.description}</p>

                                                <ul className="mt-6 flex-1 space-y-2.5 border-t border-white/10 pt-6">
                                                    {tier.features.map((feat) => (
                                                        <li key={feat} className="flex items-start gap-2.5 text-sm text-zinc-300">
                                                            <svg className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400/80" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            <span className="leading-snug">{feat}</span>
                                                        </li>
                                                    ))}
                                                </ul>

                                                {tier.note && (
                                                    <p className="mt-6 border-t border-white/10 pt-4 text-xs text-zinc-400">
                                                        ＊ {tier.note}
                                                    </p>
                                                )}
                                            </Spotlight>
                                        </Reveal>
                                    ))}
                                </div>
                            </section>
                        ))}

                        <Reveal className="max-w-2xl text-sm text-zinc-400">
                            {t.disclaimer}
                        </Reveal>
                    </div>
                </main>

                {/* Contact & Payment */}
                <footer className="border-t border-white/10 px-5 pt-20 md:px-10 md:pt-32">
                    <div className="mx-auto max-w-6xl">
                        <span className="eyebrow">{t.contactLabel}</span>
                        <h2 key={lang} className="mt-4 text-[clamp(2.25rem,6.5vw,5.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
                            <SplitText text={t.cta} />
                        </h2>

                        <Reveal className="mt-10 flex flex-wrap items-center gap-4">
                            <Magnetic>
                                <a
                                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(zh ? '[SunCodeStudio] 服務詢問' : '[SunCodeStudio] Service Inquiry')}`}
                                    className="group inline-flex items-center gap-3 rounded-full bg-yellow-400 px-7 py-4 text-base font-semibold text-zinc-950 transition-colors duration-300 hover:bg-white md:text-lg"
                                >
                                    {CONTACT_EMAIL}
                                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                                </a>
                            </Magnetic>
                            <p className="text-sm text-zinc-400">{t.ctaNote}</p>
                        </Reveal>

                        <div className="mt-16 grid gap-10 border-t border-white/10 pt-10 sm:grid-cols-2 md:mt-24">
                            <Reveal>
                                <h3 className="eyebrow">{t.currency} · TWD</h3>
                                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{t.contactNote}</p>
                            </Reveal>
                            <Reveal delay={0.08}>
                                <h3 className="eyebrow">{t.paymentNote}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{t.paymentNoteDetail}</p>
                            </Reveal>
                        </div>

                        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 py-8 text-sm text-zinc-400 md:flex-row md:items-center md:justify-between">
                            <p>© {new Date().getFullYear()} {STUDIO_NAME} · 謝上智</p>
                            <nav className="flex items-center gap-6" aria-label={STUDIO_NAME}>
                                <Link href="/" className="link-draw text-zinc-400 hover:text-white">{t.back.replace(/^←\s*/, '')}</Link>
                                <Link href="/blog" className="link-draw text-zinc-400 hover:text-white">{zh ? '部落格' : 'Blog'}</Link>
                                <Link href="/links" className="link-draw text-zinc-400 hover:text-white">{zh ? '個人連結' : 'Links'}</Link>
                            </nav>
                        </div>
                    </div>
                </footer>
            </div>
        </MotionConfig>
    );
}
