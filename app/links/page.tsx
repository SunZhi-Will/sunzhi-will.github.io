'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Lang } from '@/types';
import QRCode from 'qrcode';

type LinkItem = {
  id: string;
  title: string;
  url: string;
  icon?: string;
  gradient: string;
  accentColor: string;
  description?: string;
  badge?: string;
};

export default function LinksPage() {
  const [lang, setLang] = useState<Lang>('zh-TW');
  const [showQR, setShowQR] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    const browserLang = navigator.language;
    setLang(browserLang.includes('zh') ? 'zh-TW' : 'en');
    setCurrentUrl(window.location.href);
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
      gradient: 'from-violet-600 to-purple-700',
      accentColor: '#7c3aed',
      description: lang === 'zh-TW' ? '作品集 · 技術能力 · 專案展示' : 'Projects · Skills · Portfolio',
    },
    {
      id: 'sunkoro',
      title: 'Sunkoro 上課囉',
      url: 'https://sunkoro.com',
      icon: '/icons/website.svg',
      gradient: 'from-amber-500 to-orange-600',
      accentColor: '#f59e0b',
      description: lang === 'zh-TW' ? 'Unity · AI · LINE BOT 課程平台' : 'Unity · AI · LINE BOT Course Platform',
      badge: lang === 'zh-TW' ? '🎓 課程' : '🎓 Courses',
    },
    {
      id: 'github',
      title: 'GitHub',
      url: 'https://github.com/SunZhi-Will',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      gradient: 'from-zinc-700 to-zinc-900',
      accentColor: '#52525b',
      description: lang === 'zh-TW' ? '開源專案 · 程式碼 · 貢獻紀錄' : 'Open Source · Code · Contributions',
    },
    {
      id: 'linkedin',
      title: 'LinkedIn',
      url: 'https://www.linkedin.com/in/sunzhi-will',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg',
      gradient: 'from-blue-600 to-blue-800',
      accentColor: '#2563eb',
      description: lang === 'zh-TW' ? '專業履歷 · 職涯連結 · 工作經歷' : 'Resume · Professional Network',
    },
    {
      id: 'instagram',
      title: 'Instagram',
      url: 'https://www.instagram.com/bing_sunzhi',
      icon: '/icons/instagram-color.svg',
      gradient: 'from-pink-500 via-rose-500 to-orange-400',
      accentColor: '#ec4899',
      description: lang === 'zh-TW' ? '生活記錄 · 作品展示 · 日常分享' : 'Life · Work · Daily Shares',
    },
    {
      id: 'threads',
      title: 'Threads',
      url: 'https://www.threads.net/@bing_sunzhi',
      icon: '/icons/threads.svg',
      gradient: 'from-neutral-700 to-neutral-900',
      accentColor: '#404040',
      description: lang === 'zh-TW' ? '日常思考 · 技術觀點 · 即時動態' : 'Thoughts · Tech Takes · Updates',
    },
    {
      id: 'line',
      title: lang === 'zh-TW' ? 'LINE 社群' : 'LINE Community',
      url: 'https://line.me/ti/g2/b47YJlzPu89JxQ5yOu1r2hvupywQvXNUlGn4wA',
      icon: '/icons/line-white.svg',
      gradient: 'from-green-500 to-green-700',
      accentColor: '#16a34a',
      description: lang === 'zh-TW' ? '技術交流群 · 密碼：SunAI' : 'Tech Community · Password: SunAI',
      badge: lang === 'zh-TW' ? '🔑 SunAI' : '🔑 SunAI',
    },
    {
      id: 'youtube',
      title: 'YouTube',
      url: 'https://www.youtube.com/@suncodestudio',
      icon: '/icons/youtube.svg',
      gradient: 'from-red-600 to-red-800',
      accentColor: '#dc2626',
      description: lang === 'zh-TW' ? '教學影片 · 技術分享 · 實作示範' : 'Tutorials · Tech Sharing · Demos',
    },
    {
      id: 'medium',
      title: 'Medium',
      url: 'https://medium.com/@sun055676',
      icon: '/icons/medium.svg',
      gradient: 'from-teal-600 to-cyan-700',
      accentColor: '#0d9488',
      description: lang === 'zh-TW' ? '技術文章 · 學習心得 · 深度解析' : 'Tech Articles · Insights · Analysis',
    },
    {
      id: 'email',
      title: 'Email',
      url: 'mailto:sun055676@gmail.com',
      icon: '/icons/mail.svg',
      gradient: 'from-amber-600 to-yellow-700',
      accentColor: '#d97706',
      description: 'sun055676@gmail.com',
    },
  ];

  const isIconInverted = (link: LinkItem) =>
    ['github', 'email', 'youtube', 'medium'].includes(link.id);

  return (
    <main
      className="min-h-screen antialiased relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #09090b 0%, #18181b 40%, #0f172a 100%)' }}
    >
      {/* 背景裝飾光暈 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
        <div className="absolute top-[40%] left-[50%] w-[30vw] h-[30vw] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
        {/* 細網格背景 */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
      </div>

      {/* 右上角控制列 */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {/* 網格/列表切換 */}
        <motion.button
          onClick={() => setViewMode(prev => prev === 'list' ? 'grid' : 'list')}
          className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300"
          style={{ background: 'rgba(39,39,42,0.9)', border: '1px solid rgba(63,63,70,0.6)', backdropFilter: 'blur(12px)' }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          title={viewMode === 'list' ? (lang === 'zh-TW' ? '切換至網格模式' : 'Switch to Grid') : (lang === 'zh-TW' ? '切換至列表模式' : 'Switch to List')}
        >
          <AnimatePresence mode="wait" initial={false}>
            {viewMode === 'list' ? (
              <motion.svg key="grid" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </motion.svg>
            ) : (
              <motion.svg key="list" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>

        {/* QR 碼按鈕 */}
        <motion.button
          onClick={() => setShowQR(true)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300"
          style={{ background: 'rgba(39,39,42,0.9)', border: '1px solid rgba(63,63,70,0.6)', backdropFilter: 'blur(12px)' }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          title={lang === 'zh-TW' ? '顯示 QR 碼' : 'Show QR Code'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </motion.button>

        {/* 語言切換 */}
        <motion.button
          onClick={() => setLang(prev => prev === 'zh-TW' ? 'en' : 'zh-TW')}
          className="px-3 h-9 rounded-full text-xs font-medium text-zinc-300 hover:text-white transition-all duration-300"
          style={{ background: 'rgba(39,39,42,0.9)', border: '1px solid rgba(63,63,70,0.6)', backdropFilter: 'blur(12px)' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {lang === 'zh-TW' ? 'EN' : '中文'}
        </motion.button>
      </div>

      {/* QR 碼彈窗 */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowQR(false); }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="p-6 rounded-2xl max-w-xs w-full mx-4 shadow-2xl"
              style={{ background: '#18181b', border: '1px solid rgba(63,63,70,0.8)' }}
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-base font-semibold text-white">
                  {lang === 'zh-TW' ? '掃描分享此頁面' : 'Scan to Share'}
                </h3>
                <motion.button
                  onClick={() => setShowQR(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <div className="bg-white p-4 rounded-xl flex items-center justify-center">
                {qrCodeUrl ? (
                  <Image src={qrCodeUrl} alt="QR Code" width={200} height={200} className="rounded-md" />
                ) : (
                  <div className="w-[200px] h-[200px] flex items-center justify-center">
                    <motion.div
                      className="w-8 h-8 border-4 border-amber-500 rounded-full border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-800">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-zinc-500 truncate flex-1">{currentUrl}</p>
                  <motion.button
                    onClick={copyToClipboard}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                    style={{
                      background: copySuccess ? 'rgba(34,197,94,0.15)' : 'rgba(63,63,70,0.5)',
                      color: copySuccess ? '#4ade80' : '#a1a1aa',
                      border: `1px solid ${copySuccess ? 'rgba(34,197,94,0.3)' : 'rgba(63,63,70,0.5)'}`
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copySuccess
                      ? (lang === 'zh-TW' ? '✓ 已複製' : '✓ Copied')
                      : (lang === 'zh-TW' ? '複製' : 'Copy')}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主內容 */}
      <div className={`relative z-10 mx-auto px-4 py-12 pb-16 transition-all duration-300 ${viewMode === 'grid' ? 'max-w-2xl' : 'max-w-lg'}`}>

        {/* 個人資料區 */}
        <motion.div
          className="flex flex-col items-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 頭像 */}
          <div className="relative mb-5">
            <div className="absolute inset-0 rounded-full blur-2xl opacity-40"
              style={{ background: 'radial-gradient(circle, #f59e0b, #7c3aed)', transform: 'scale(1.3)' }} />
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="w-24 h-24 rounded-full overflow-hidden relative"
                style={{ border: '2px solid rgba(250,204,21,0.4)', boxShadow: '0 0 30px rgba(250,204,21,0.15)' }}>
                <Image
                  src="/profile.jpg"
                  alt="Sun Zhi"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover object-center"
                  priority
                />
              </div>
              {/* 狀態指示器 */}
              <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: '#18181b', border: '2px solid #18181b' }}>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              </div>
            </motion.div>
          </div>

          {/* 名稱和標題 */}
          <motion.h1
            className="text-2xl font-bold text-white mb-1 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {lang === 'zh-TW' ? '謝上智 Sun' : 'Sun Zhi'}
          </motion.h1>
          <motion.p
            className="text-sm text-zinc-400 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {lang === 'zh-TW' ? '軟體工程師 · AI 開發者 · 講師' : 'Software Engineer · AI Developer · Instructor'}
          </motion.p>

          {/* 標籤列 */}
          <motion.div
            className="flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {['Unity', 'AI', 'Next.js', 'LINE BOT'].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium text-zinc-300"
                style={{ background: 'rgba(39,39,42,0.8)', border: '1px solid rgba(63,63,70,0.6)' }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* 連結列表/網格 */}
        <motion.div
          layout
          className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}
        >
          <AnimatePresence mode="popLayout">
            {links.map((link, index) => (
              <motion.div
                key={link.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.05 + index * 0.04, duration: 0.35 }}
              >
                {viewMode === 'list' ? (
                  /* ── 列表模式 ── */
                  <motion.a
                    href={link.url}
                    target={link.url.startsWith('http') || link.url.startsWith('mailto') ? '_blank' : '_self'}
                    rel={link.url.startsWith('http') ? 'noopener noreferrer' : ''}
                    onHoverStart={() => setActiveLink(link.id)}
                    onHoverEnd={() => setActiveLink(null)}
                    whileHover={{ scale: 1.015, y: -2 }}
                    whileTap={{ scale: 0.985 }}
                    className="flex items-center gap-4 p-4 rounded-2xl w-full relative overflow-hidden group"
                    style={{
                      background: 'rgba(24,24,27,0.8)',
                      border: '1px solid rgba(63,63,70,0.5)',
                      backdropFilter: 'blur(12px)',
                      boxShadow: activeLink === link.id
                        ? `0 8px 30px ${link.accentColor}25, 0 0 0 1px ${link.accentColor}30`
                        : '0 2px 8px rgba(0,0,0,0.3)',
                      borderColor: activeLink === link.id ? `${link.accentColor}40` : 'rgba(63,63,70,0.5)',
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `linear-gradient(135deg, ${link.accentColor}08 0%, transparent 60%)` }}
                    />
                    <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-br ${link.gradient} shadow-lg relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/10 pointer-events-none" />
                      {link.icon && (
                        <Image src={link.icon} alt={link.title} width={26} height={26}
                          className={`relative z-10 object-contain ${isIconInverted(link) ? 'invert' : ''}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-white leading-tight">{link.title}</span>
                        {link.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                            style={{ background: `${link.accentColor}20`, color: link.accentColor, border: `1px solid ${link.accentColor}30` }}>
                            {link.badge}
                          </span>
                        )}
                      </div>
                      {link.description && (
                        <p className="text-xs text-zinc-500 truncate leading-tight">{link.description}</p>
                      )}
                    </div>
                    <motion.div
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(63,63,70,0.4)', color: '#71717a' }}
                      animate={activeLink === link.id ? { x: [0, 3, 0], color: link.accentColor } : { x: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </motion.a>
                ) : (
                  /* ── 網格模式 ── */
                  <motion.a
                    href={link.url}
                    target={link.url.startsWith('http') || link.url.startsWith('mailto') ? '_blank' : '_self'}
                    rel={link.url.startsWith('http') ? 'noopener noreferrer' : ''}
                    onHoverStart={() => setActiveLink(link.id)}
                    onHoverEnd={() => setActiveLink(null)}
                    whileHover={{ scale: 1.04, y: -3 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex flex-col items-center gap-3 p-5 rounded-2xl w-full relative overflow-hidden group"
                    style={{
                      background: 'rgba(24,24,27,0.8)',
                      border: '1px solid rgba(63,63,70,0.5)',
                      backdropFilter: 'blur(12px)',
                      boxShadow: activeLink === link.id
                        ? `0 8px 30px ${link.accentColor}30, 0 0 0 1px ${link.accentColor}35`
                        : '0 2px 8px rgba(0,0,0,0.3)',
                      borderColor: activeLink === link.id ? `${link.accentColor}50` : 'rgba(63,63,70,0.5)',
                    }}
                  >
                    {/* 網格懸停光暈 */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `radial-gradient(circle at 50% 40%, ${link.accentColor}12 0%, transparent 70%)` }}
                    />
                    {/* 頂部漸層條 */}
                    <div
                      className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(90deg, transparent, ${link.accentColor}, transparent)` }}
                    />
                    {/* 圖示 */}
                    <div className={`w-14 h-14 flex-shrink-0 rounded-2xl flex items-center justify-center bg-gradient-to-br ${link.gradient} shadow-lg relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/10 pointer-events-none" />
                      {link.icon && (
                        <Image src={link.icon} alt={link.title} width={30} height={30}
                          className={`relative z-10 object-contain ${isIconInverted(link) ? 'invert' : ''}`} />
                      )}
                    </div>
                    {/* 文字 */}
                    <div className="text-center w-full">
                      <p className="text-sm font-semibold text-white leading-tight mb-0.5">{link.title}</p>
                      {link.badge && (
                        <span className="inline-block text-[9px] px-1.5 py-0.5 rounded-full font-medium mb-1"
                          style={{ background: `${link.accentColor}20`, color: link.accentColor, border: `1px solid ${link.accentColor}30` }}>
                          {link.badge}
                        </span>
                      )}
                      {link.description && (
                        <p className="text-[10px] text-zinc-500 leading-tight line-clamp-2">{link.description}</p>
                      )}
                    </div>
                  </motion.a>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* 底部 Footer */}
        <motion.footer
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-xs text-zinc-500">SUN · 2025</span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>
          <p className="text-xs text-zinc-500">
            {lang === 'zh-TW' ? '謝上智 · 軟體工程師 · AI 開發者' : 'Sun Zhi · Software Engineer · AI Developer'}
          </p>
        </motion.footer>
      </div>
    </main>
  );
}