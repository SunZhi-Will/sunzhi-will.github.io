'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ParticlesBackground from '@/components/ParticlesBackground';
import Link from 'next/link';

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
    icon: string;
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
                icon: '💻',
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
                icon: '🎓',
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
                icon: '💻',
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
                icon: '🎓',
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
    const [lang, setLang] = useState<Lang>('zh-TW');

    useEffect(() => {
        const browserLang = navigator.language;
        setLang(browserLang.includes('zh') ? 'zh-TW' : 'en');
        document.title = browserLang.includes('zh')
            ? `服務費用 | ${STUDIO_NAME}`
            : `Service Pricing | ${STUDIO_NAME}`;
    }, []);

    const t = content[lang];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100 relative">
            <ParticlesBackground />

            <div className="relative z-10">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-700/50">
                    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                        <Link
                            href="/"
                            className="text-slate-300 hover:text-white text-sm transition-colors flex items-center gap-1"
                        >
                            {t.back}
                        </Link>
                        <span className="text-slate-200 font-semibold text-sm tracking-wide">{STUDIO_NAME}</span>
                        <button
                            onClick={() => setLang(lang === 'zh-TW' ? 'en' : 'zh-TW')}
                            className="text-xs px-3 py-1.5 rounded-full border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 transition-all"
                        >
                            {lang === 'zh-TW' ? 'EN' : '中文'}
                        </button>
                    </div>
                </header>

                {/* Hero */}
                <section className="py-16 sm:py-24 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4 border border-slate-600/60 px-3 py-1 rounded-full">
                            {STUDIO_NAME}
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-200 via-white to-slate-300 bg-clip-text text-transparent mb-4">
                            {t.pageTitle}
                        </h1>
                        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                            {t.pageSubtitle}
                        </p>
                    </motion.div>
                </section>

                {/* Services */}
                <main className="container mx-auto px-4 pb-16 space-y-20">
                    {t.services.map((service, sIdx) => (
                        <motion.section
                            key={service.id}
                            id={service.id}
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.55, delay: sIdx * 0.1 }}
                        >
                            {/* Section header */}
                            <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl" role="img" aria-label={service.title}>{service.icon}</span>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h2 className="text-2xl sm:text-3xl font-bold text-white">{service.title}</h2>
                                            {service.badge && (
                                                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                    {service.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-400 text-sm mt-0.5">{service.subtitle}</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-3xl">
                                {service.description}
                            </p>

                            {/* Pricing cards */}
                            <div className={`grid gap-5 ${service.tiers.length === 4
                                ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
                                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                                }`}>
                                {service.tiers.map((tier, tIdx) => (
                                    <motion.div
                                        key={tier.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: tIdx * 0.08 }}
                                        className={`relative rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${tier.highlight
                                            ? 'bg-gradient-to-br from-slate-700/70 to-slate-800/80 border-slate-400/50 shadow-lg shadow-slate-500/10'
                                            : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/60'
                                            }`}
                                    >
                                        {tier.highlight && (
                                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-slate-400 to-slate-300 text-slate-900 shadow">
                                                {lang === 'zh-TW' ? '最熱門' : 'Most Popular'}
                                            </span>
                                        )}

                                        {/* Tier name & price */}
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">{tier.name}</h3>
                                            <div className="flex items-baseline gap-1 flex-wrap">
                                                <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-slate-200 to-white bg-clip-text text-transparent">
                                                    {t.currency} {tier.price}
                                                </span>
                                                <span className="text-slate-400 text-sm">{tier.unit}</span>
                                            </div>
                                            <p className="text-slate-400 text-xs mt-1 leading-relaxed">{tier.description}</p>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-px bg-slate-700/60" />

                                        {/* Features */}
                                        <ul className="space-y-2 flex-1">
                                            {tier.features.map((feat, fIdx) => (
                                                <li key={fIdx} className="flex items-start gap-2 text-sm text-slate-200">
                                                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span className="leading-snug">{feat}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Note */}
                                        {tier.note && (
                                            <p className="text-xs text-slate-400 italic border-t border-slate-700/50 pt-3">
                                                ＊ {tier.note}
                                            </p>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    ))}

                    {/* Disclaimer */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center text-slate-500 text-xs max-w-2xl mx-auto"
                    >
                        {t.disclaimer}
                    </motion.p>
                </main>

                {/* Contact & Payment section */}
                <section className="border-t border-slate-700/50 bg-slate-950/60 backdrop-blur-sm">
                    <div className="container mx-auto px-4 py-12">
                        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {/* Contact */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-3"
                            >
                                <div className="flex items-center gap-2 text-slate-300 font-semibold">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {t.contactLabel}
                                </div>
                                <a
                                    href={`mailto:${CONTACT_EMAIL}`}
                                    className="inline-block text-yellow-300 hover:text-yellow-200 underline underline-offset-4 font-mono text-sm transition-colors"
                                >
                                    {CONTACT_EMAIL}
                                </a>
                                <p className="text-slate-400 text-xs leading-relaxed">{t.contactNote}</p>
                            </motion.div>

                            {/* Payment */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-3"
                            >
                                <div className="flex items-center gap-2 text-slate-300 font-semibold">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    {t.paymentNote}
                                </div>
                                <p className="text-slate-300 text-xs leading-relaxed">{t.paymentNoteDetail}</p>
                            </motion.div>
                        </div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-10 text-center space-y-3"
                        >
                            <a
                                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(lang === 'zh-TW' ? '[SunCodeStudio] 服務詢問' : '[SunCodeStudio] Service Inquiry')}`}
                                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-500 hover:to-slate-400 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-slate-500/30 hover:scale-105"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {t.cta}
                            </a>
                            <p className="text-slate-500 text-xs">{t.ctaNote}</p>
                        </motion.div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-6 text-center border-t border-slate-800">
                    <p className="text-slate-600 text-xs">
                        © {new Date().getFullYear()} {STUDIO_NAME} · 謝上智 ·&nbsp;
                        <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-slate-400 transition-colors">
                            {CONTACT_EMAIL}
                        </a>
                    </p>
                </footer>
            </div>
        </div>
    );
}
