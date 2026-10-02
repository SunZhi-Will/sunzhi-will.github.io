'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import QRCode from 'qrcode';
import { Backdrop } from '@/components/home/Backdrop';
import { LogoIcon } from '@/components/LogoIcon';
import { SplitText } from '@/components/motion/SplitText';
import { EASE_OUT } from '@/components/motion/ease';
import { useSiteLang } from '@/lib/use-site-lang';

type LinkItem = {
  id: string;
  title: string;
  url: string;
  icon?: string;
  description?: string;
  badge?: string;
};

export default function LinksPage() {
  const [lang, setLang] = useSiteLang();
  const [showQR, setShowQR] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    setCurrentUrl(window.location.href);
    // 與首頁共用深色版面的捲軸與底色
    document.documentElement.classList.add('site-dark');
    return () => document.documentElement.classList.remove('site-dark');
  }, []);

  useEffect(() => {
    if (currentUrl && showQR) {
      QRCode.toDataURL(currentUrl, {
        width: 220,
        margin: 2,
        color: { dark: '#18181b', light: '#ffffff' }
      })
        .then((url: string) => setQrCodeUrl(url))
        .catch((err: Error) => console.error(err));
    }
  }, [currentUrl, showQR]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const links: LinkItem[] = [
    {
      id: 'portfolio',
      title: lang === 'zh-TW' ? '個人網站' : 'Portfolio',
      url: '/',
      icon: '/icons/home.svg',
      description: lang === 'zh-TW' ? '作品集 · 技術能力 · 專案展示' : 'Projects · Skills · Portfolio',
    },
    {
      id: 'sunkoro',
      title: 'Sunkoro 上課囉',
      url: 'https://sunkoro.com',
      icon: '/icons/website.svg',
      description: lang === 'zh-TW' ? 'Unity · AI · LINE BOT 課程平台' : 'Unity · AI · LINE BOT Course Platform',
      badge: lang === 'zh-TW' ? '課程' : 'Courses',
    },
    {
      id: 'github',
      title: 'GitHub',
      url: 'https://github.com/SunZhi-Will',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      description: lang === 'zh-TW' ? '開源專案 · 程式碼 · 貢獻紀錄' : 'Open Source · Code · Contributions',
    },
    {
      id: 'linkedin',
      title: 'LinkedIn',
      url: 'https://www.linkedin.com/in/sunzhi-will',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-plain.svg',
      description: lang === 'zh-TW' ? '專業履歷 · 職涯連結 · 工作經歷' : 'Resume · Professional Network',
    },
    {
      id: 'instagram',
      title: 'Instagram',
      url: 'https://www.instagram.com/bing_sunzhi',
      icon: '/icons/instagram-color.svg',
      description: lang === 'zh-TW' ? '生活記錄 · 作品展示 · 日常分享' : 'Life · Work · Daily Shares',
    },
    {
      id: 'threads',
      title: 'Threads',
      url: 'https://www.threads.net/@bing_sunzhi',
      icon: '/icons/threads.svg',
      description: lang === 'zh-TW' ? '日常思考 · 技術觀點 · 即時動態' : 'Thoughts · Tech Takes · Updates',
    },
    {
      id: 'line',
      title: lang === 'zh-TW' ? 'LINE 社群' : 'LINE Community',
      url: 'https://line.me/ti/g2/b47YJlzPu89JxQ5yOu1r2hvupywQvXNUlGn4wA',
      icon: '/icons/line-white.svg',
      description: lang === 'zh-TW' ? '技術交流群 · 密碼：SunAI' : 'Tech Community · Password: SunAI',
      badge: 'SunAI',
    },
    {
      id: 'youtube',
      title: 'YouTube',
      url: 'https://www.youtube.com/@suncodestudio',
      icon: '/icons/youtube.svg',
      description: lang === 'zh-TW' ? '教學影片 · 技術分享 · 實作示範' : 'Tutorials · Tech Sharing · Demos',
    },
    {
      id: 'medium',
      title: 'Medium',
      url: 'https://medium.com/@sun055676',
      icon: '/icons/medium.svg',
      description: lang === 'zh-TW' ? '技術文章 · 學習心得 · 深度解析' : 'Tech Articles · Insights · Analysis',
    },
    {
      id: 'email',
      title: 'Email',
      url: 'mailto:sun055676@gmail.com',
      icon: '/icons/mail.svg',
      description: 'sun055676@gmail.com',
    },
  ];

  const isExternal = (url: string) => url.startsWith('http') || url.startsWith('mailto');
  const zh = lang === 'zh-TW';

  const controlClass =
    'flex h-9 items-center justify-center rounded-full border border-white/10 bg-[#141416]/80 text-zinc-200 backdrop-blur-xl transition-colors duration-200 hover:border-white/30 hover:text-white';

  return (
    <MotionConfig reducedMotion="user">
      <main className="site relative isolate min-h-screen antialiased [overflow-x:clip]">
        <Backdrop />

        {/* 頂部控制列 */}
        <motion.div
          className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 pt-4"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <Link href="/" className={`${controlClass} group gap-2 px-3.5`} aria-label={zh ? '回首頁' : 'Back to home'}>
            <LogoIcon className="h-5 w-5 text-zinc-100 transition-transform duration-500 group-hover:rotate-180" />
            <span className="text-sm font-semibold text-zinc-100">Sun</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode((prev) => (prev === 'list' ? 'grid' : 'list'))}
              className={`${controlClass} w-9`}
              aria-label={viewMode === 'list' ? (zh ? '切換至網格模式' : 'Switch to grid') : (zh ? '切換至列表模式' : 'Switch to list')}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.svg
                  key={viewMode}
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
                >
                  {viewMode === 'list' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </motion.svg>
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={() => setShowQR(true)}
              className={`${controlClass} w-9`}
              aria-label={zh ? '顯示 QR 碼' : 'Show QR code'}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setLang(zh ? 'en' : 'zh-TW')}
              className={`${controlClass} font-geist-mono px-3.5 text-xs`}
              aria-label={zh ? 'Switch to English' : '切換為中文'}
            >
              {zh ? 'EN' : '中'}
            </button>
          </div>
        </motion.div>

        {/* QR 碼彈窗 */}
        <AnimatePresence>
          {showQR && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => { if (e.target === e.currentTarget) setShowQR(false); }}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="qr-title"
                initial={{ scale: 0.94, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.94, opacity: 0, y: 24 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="mx-4 w-full max-w-xs rounded-[28px] border border-white/10 bg-[#111113] p-6 shadow-2xl"
              >
                <div className="mb-5 flex items-center justify-between">
                  <h3 id="qr-title" className="text-base font-semibold text-white">
                    {zh ? '掃描分享此頁面' : 'Scan to share'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowQR(false)}
                    aria-label={zh ? '關閉' : 'Close'}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-200 transition-colors duration-200 hover:border-white/30 hover:text-white"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-center rounded-2xl bg-white p-4">
                  {qrCodeUrl ? (
                    <Image src={qrCodeUrl} alt="QR Code" width={200} height={200} className="rounded-md" />
                  ) : (
                    <div className="flex h-[200px] w-[200px] items-center justify-center">
                      <motion.div
                        className="h-8 w-8 rounded-full border-2 border-zinc-900 border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4">
                  <p className="flex-1 truncate text-xs text-zinc-200">{currentUrl}</p>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-200 ${
                      copySuccess ? 'border-emerald-400/40 text-emerald-300' : 'border-white/15 text-zinc-200 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    <span aria-live="polite">
                      {copySuccess ? (zh ? '已複製' : 'Copied') : (zh ? '複製' : 'Copy')}
                    </span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 主內容 */}
        <div className={`relative mx-auto px-5 pb-16 pt-28 transition-[max-width] duration-500 ${viewMode === 'grid' ? 'max-w-2xl' : 'max-w-xl'}`}>
          {/* 個人資料 */}
          <div className="mb-12">
            <motion.div
              className="relative h-20 w-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
            >
              <div className="h-full w-full overflow-hidden rounded-full ring-1 ring-white/15">
                <Image src="/profile.jpg" alt="Sun Zhi" width={160} height={160} className="h-full w-full object-cover" priority />
              </div>
              <span className="absolute bottom-1 right-1 flex h-3 w-3">
                <span className="animate-status-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#0a0a0a]" />
              </span>
            </motion.div>

            <h1 key={lang} className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              <SplitText text={zh ? '謝上智 Sun' : 'Sun Zhi'} immediate delay={0.15} stagger={0.05} />
            </h1>
            <motion.p
              className="mt-3 text-base text-zinc-200"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.4 }}
            >
              {zh ? '軟體工程師 · AI 開發者 · 講師' : 'Software Engineer · AI Developer · Instructor'}
            </motion.p>
            <motion.p
              className="eyebrow mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.55 }}
            >
              {['Unity', 'AI', 'Next.js', 'LINE BOT'].join(' / ')}
            </motion.p>
          </div>

          {/* 連結：清單模式是細線分隔的列，網格模式是兩欄方格 */}
          <motion.ul layout className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'border-b border-white/10'}>
            {links.map((link, index) => (
              <motion.li
                key={link.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.5 + index * 0.05, layout: { duration: 0.5, ease: EASE_OUT } }}
              >
                <a
                  href={link.url}
                  target={isExternal(link.url) ? '_blank' : '_self'}
                  rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`group relative flex w-full transition-colors duration-300 ${
                    viewMode === 'list'
                      ? 'items-center gap-4 border-t border-white/10 px-2 py-4 hover:bg-white/[0.03]'
                      : 'h-full flex-col gap-4 rounded-2xl border border-white/10 p-5 hover:border-white/25 hover:bg-white/[0.03]'
                  }`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition-colors duration-300 group-hover:border-yellow-400/40 group-hover:bg-yellow-400/10">
                    {link.icon && (
                      <Image
                        src={link.icon}
                        alt=""
                        width={20}
                        height={20}
                        className="h-5 w-5 object-contain opacity-80 brightness-0 invert transition-opacity duration-300 group-hover:opacity-100"
                      />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-base font-medium text-zinc-100 transition-colors duration-200 group-hover:text-yellow-400">{link.title}</span>
                      {link.badge && (
                        <span className="shrink-0 whitespace-nowrap rounded-full border border-yellow-400/30 px-2 py-0.5 text-[10px] font-medium text-yellow-400/90">
                          {link.badge}
                        </span>
                      )}
                    </span>
                    {link.description && (
                      <span className={`mt-0.5 block text-sm text-zinc-200 ${viewMode === 'list' ? 'truncate' : 'line-clamp-2'}`}>{link.description}</span>
                    )}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`text-zinc-200 transition-all duration-300 group-hover:translate-x-1 group-hover:text-yellow-400 ${
                      viewMode === 'grid' ? 'absolute right-5 top-5' : ''
                    }`}
                  >
                    {isExternal(link.url) ? '↗' : '→'}
                  </span>
                </a>
              </motion.li>
            ))}
          </motion.ul>

          <motion.footer
            className="mt-12 flex items-center justify-between text-sm text-zinc-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <span className="eyebrow">Sun · {new Date().getFullYear()}</span>
            <span className="flex items-center gap-5">
              <Link href="/blog" className="link-draw text-zinc-200 hover:text-white">{zh ? '部落格' : 'Blog'}</Link>
              <Link href="/pricing" className="link-draw text-zinc-200 hover:text-white">{zh ? '服務費用' : 'Pricing'}</Link>
            </span>
          </motion.footer>
        </div>
      </main>
    </MotionConfig>
  );
}
