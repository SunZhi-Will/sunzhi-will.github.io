'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Lang } from '@/types';
import ParticlesBackground from '@/components/ParticlesBackground';
import QRCode from 'qrcode';

// 定義連結項目的類型
type LinkItem = {
  title: string;
  url: string;
  icon?: string;
  bgColor: string;
  description?: string;
};

export default function LinksPage() {
  const [lang, setLang] = useState<Lang>('zh-TW');
  const [showQR, setShowQR] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 在瀏覽器端檢查語言
    const browserLang = navigator.language;
    setLang(browserLang.includes('zh') ? 'zh-TW' : 'en');

    // 獲取當前頁面 URL
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (currentUrl && showQR) {
      QRCode.toDataURL(currentUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000',
          light: '#fff'
        }
      })
        .then((url: string) => {
          setQrCodeUrl(url);
        })
        .catch((err: Error) => {
          console.error(err);
        });
    }
  }, [currentUrl, showQR]);

  // 複製連結到剪貼簿
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // 定義連結項目 - 移除重複的連結
  const links: LinkItem[] = [
    {
      title: lang === 'zh-TW' ? '個人網站' : 'Portfolio',
      url: '/',
      icon: '/icons/home.svg',
      bgColor: 'from-purple-600/80 to-purple-800/80',
      description: lang === 'zh-TW' ? '探索我的作品集和技術能力' : 'Explore my portfolio and skills'
    },
    {
      title: 'GitHub',
      url: 'https://github.com/SunZhi-Will',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      bgColor: 'from-indigo-600/80 to-indigo-800/80',
      description: lang === 'zh-TW' ? '查看我的開源項目和程式碼' : 'Check out my open-source projects and code'
    },
    {
      title: 'LinkedIn',
      url: 'https://www.linkedin.com/in/sunzhi-will',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg',
      bgColor: 'from-blue-600/80 to-blue-800/80',
      description: lang === 'zh-TW' ? '與我建立專業連結' : 'Connect with me professionally'
    },
    {
      title: 'Instagram',
      url: 'https://www.instagram.com/bing_sunzhi',
      icon: '/icons/instagram-color.svg',
      bgColor: 'from-yellow-400/80 via-red-500/80 to-purple-500/80',
      description: lang === 'zh-TW' ? '查看我的生活和工作照片' : 'Check out my life and work photos'
    },
    {
      title: 'Threads',
      url: 'https://www.threads.net/@bing_sunzhi',
      icon: '/icons/threads.svg',
      bgColor: 'from-black/80 to-gray-900/80',
      description: lang === 'zh-TW' ? '關注我的日常思考和觀點' : 'Follow my daily thoughts and perspectives'
    },
    {
      title: lang === 'zh-TW' ? 'LINE 社群' : 'LINE Community',
      url: 'https://line.me/ti/g2/b47YJlzPu89JxQ5yOu1r2hvupywQvXNUlGn4wA',
      icon: '/icons/line-white.svg',
      bgColor: 'from-[#00B900]/80 to-[#00B900]/80',
      description: lang === 'zh-TW' ? '分享交流群（密碼：SunAI）' : 'Join the "Extreme Engineer Sun Community" (Password: SunAI)'
    },
    {
      title: 'YouTube',
      url: 'https://www.youtube.com/@suncodestudio',
      icon: '/icons/youtube.svg',
      bgColor: 'from-red-600/80 to-red-800/80',
      description: lang === 'zh-TW' ? '觀看我的教學視頻和分享' : 'Watch my tutorials and shares'
    },
    {
      title: 'Medium',
      url: 'https://medium.com/@sun055676',
      icon: '/icons/medium.svg',
      bgColor: 'from-teal-600/80 to-teal-800/80',
      description: lang === 'zh-TW' ? '閱讀我的技術文章和心得' : 'Read my technical articles and insights'
    },
    {
      title: 'Email',
      url: 'mailto:sun055676@gmail.com',
      icon: '/icons/mail.svg',
      bgColor: 'from-amber-600/80 to-amber-800/80',
      description: lang === 'zh-TW' ? '通過電子郵件聯繫我' : 'Contact me via email'
    },
    {
      title: lang === 'zh-TW' ? '舊版網站' : 'Old Website',
      url: 'https://sites.google.com/view/shangzhistime',
      icon: '/icons/website.svg',
      bgColor: 'from-gray-600/80 to-gray-800/80',
      description: lang === 'zh-TW' ? '瀏覽我的舊版個人網站' : 'Browse my old personal website'
    }
  ];

  // 語言切換按鈕
  const LanguageToggle = () => (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <motion.button
        onClick={() => setViewMode(prev => prev === 'list' ? 'grid' : 'list')}
        className="px-3 py-1.5 rounded-full 
                  bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 
                  backdrop-blur-sm border border-purple-400/20
                  transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={viewMode === 'list' ?
          (lang === 'zh-TW' ? '切換為網格視圖' : 'Switch to Grid View') :
          (lang === 'zh-TW' ? '切換為列表視圖' : 'Switch to List View')
        }
      >
        {viewMode === 'list' ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM14 13a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        )}
      </motion.button>
      <motion.button
        onClick={() => setLang(prev => prev === 'zh-TW' ? 'en' : 'zh-TW')}
        className="px-3 py-1.5 rounded-full 
                  bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 
                  backdrop-blur-sm border border-purple-400/20
                  transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {lang === 'zh-TW' ? 'EN' : '中文'}
      </motion.button>
    </div>
  );

  return (
    <main className="min-h-screen text-white antialiased relative overflow-hidden flex flex-col items-center" ref={containerRef}>
      <ParticlesBackground />
      <LanguageToggle />

      {/* QR 碼彈窗 */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              // 只有點擊背景時才關閉
              if (e.target === e.currentTarget) {
                setShowQR(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-purple-900/90 p-6 rounded-xl max-w-xs w-full mx-4 border border-purple-400/30 shadow-xl backdrop-blur-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-purple-200">
                  {lang === 'zh-TW' ? '掃描 QR 碼' : 'Scan QR Code'}
                </h3>
                <motion.button
                  onClick={() => setShowQR(false)}
                  className="text-purple-300 hover:text-purple-100 p-1 rounded-full hover:bg-purple-800/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              <motion.div
                className="bg-white p-3 rounded-lg flex items-center justify-center"
                whileHover={{ boxShadow: "0 0 15px rgba(147, 51, 234, 0.5)" }}
                transition={{ duration: 0.3 }}
              >
                {currentUrl && (
                  <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden flex items-center justify-center">
                    {qrCodeUrl ? (
                      <Image
                        src={qrCodeUrl}
                        alt="QR Code"
                        className="w-full h-full"
                        style={{
                          opacity: 1,
                          transition: 'opacity 0.3s'
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-white">
                        <motion.div
                          className="w-8 h-8 border-4 border-purple-500 rounded-full border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
              <p className="text-center text-purple-200 mt-4 text-sm">
                {lang === 'zh-TW' ? '分享此連結頁面' : 'Share this links page'}
              </p>
              <div className="mt-4 pt-4 border-t border-purple-700/30 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <a
                    href={currentUrl}
                    className="text-xs text-purple-300 truncate max-w-[180px]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {currentUrl}
                  </a>
                  <motion.button
                    onClick={copyToClipboard}
                    className="text-purple-300 hover:text-purple-200 transition-colors p-1 rounded-full hover:bg-purple-800/50"
                    title={lang === 'zh-TW' ? '複製連結' : 'Copy link'}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </motion.button>
                </div>
                <AnimatePresence>
                  {copySuccess && (
                    <motion.span
                      className="text-xs text-green-400 block"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {lang === 'zh-TW' ? '已複製！' : 'Copied!'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container max-w-2xl w-full mx-auto px-4 py-6 relative z-10">
        <motion.header
          className="flex flex-col items-center mb-8 sticky top-0 z-30 pt-8 pb-6 backdrop-blur-sm"
        >
          <div
            className="relative transform"
            style={{ transformOrigin: 'center center' }}
          >
            <div className="relative group">
              <Image
                src="/profile.jpg"
                alt="Sun Zhi"
                width={140}
                height={140}
                className="rounded-full border-4 border-purple-400/50 shadow-lg shadow-purple-500/30
                         group-hover:border-purple-400/70 transition-none"
                priority
              />
              <motion.div
                className="absolute -inset-2 rounded-full border-2 border-dashed border-purple-400/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 bg-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-none" />
            </div>
          </div>

          <div
            className="text-center mt-3"
            style={{ transformOrigin: 'center center' }}
          >
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">
              {lang === 'zh-TW' ? '謝上智' : 'Sun Zhi'}
            </h1>
            <p className="text-purple-200 text-base mt-1">
              {lang === 'zh-TW' ? '軟體工程師 | AI 開發者' : 'Software Engineer | AI Developer'}
            </p>
          </div>
        </motion.header>

        {/* 連結列表/網格 */}
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4' : 'space-y-3'}`}>
          {links.map((link, index) => (
            <motion.div
              key={link.url}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
              onHoverStart={() => setHoveredLink(link.url)}
              onHoverEnd={() => setHoveredLink(null)}
              className="relative group"
            >
              <motion.div
                className="absolute -inset-1.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"
                layoutId={`bg-${link.url}`}
              />
              <motion.a
                href={link.url}
                target={link.url.startsWith('http') || link.url.startsWith('mailto') ? '_blank' : '_self'}
                rel={link.url.startsWith('http') ? 'noopener noreferrer' : ''}
                className={`block p-4 rounded-xl bg-gradient-to-r ${link.bgColor} hover:shadow-lg 
                           hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm border border-white/10
                           relative z-10 h-full ${viewMode === 'grid' ? 'text-center' : ''}`}
                whileHover={{
                  y: -5,
                  boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.3)",
                  scale: 1.02
                }}
                whileTap={{ scale: 0.98 }}
              >
                {viewMode === 'grid' ? (
                  <div className="flex flex-col items-center gap-3">
                    {link.icon && (
                      <motion.div
                        className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-full p-3.5 shadow-inner
                                 group-hover:bg-white/30 transition-colors duration-300"
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        animate={hoveredLink === link.url ? {
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, 0]
                        } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <Image
                          src={link.icon}
                          alt={link.title}
                          width={28}
                          height={28}
                          className={`${link.url.includes('github') || link.icon.includes('mail.svg') || link.icon.includes('youtube.svg') || link.icon.includes('medium.svg') ? 'invert' : ''}`}
                        />
                      </motion.div>
                    )}
                    <div>
                      <h2 className="text-sm font-medium text-white mb-1">{link.title}</h2>
                      {link.description && viewMode === 'grid' && (
                        <p className="text-[10px] text-white/70 line-clamp-2">{link.description}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    {link.icon && (
                      <motion.div
                        className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white/20 rounded-full p-2.5 shadow-inner
                                 group-hover:bg-white/30 transition-colors duration-300"
                        whileHover={{ rotate: 5 }}
                        animate={hoveredLink === link.url ? {
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, 0]
                        } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <Image
                          src={link.icon}
                          alt={link.title}
                          width={22}
                          height={22}
                          className={`${link.url.includes('github') || link.icon.includes('mail.svg') || link.icon.includes('youtube.svg') || link.icon.includes('medium.svg') ? 'invert' : ''}`}
                        />
                      </motion.div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-base font-semibold text-white flex items-center">
                        {link.title}
                        {hoveredLink === link.url && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="ml-2 text-white/60 text-xs"
                          >
                            {link.url.startsWith('http') ?
                              (lang === 'zh-TW' ? '(點擊開啟)' : '(click to open)') :
                              (lang === 'zh-TW' ? '(點擊前往)' : '(click to go)')
                            }
                          </motion.span>
                        )}
                      </h2>
                      {link.description && (
                        <p className="text-xs text-white/70 mt-0.5">{link.description}</p>
                      )}
                    </div>
                    <motion.div
                      className="ml-auto"
                      animate={hoveredLink === link.url ? { x: [0, 5, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {viewMode === 'list' && (
                        <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </motion.div>
                  </div>
                )}
              </motion.a>
            </motion.div>
          ))}
        </div>

        {/* QR 碼按鈕 */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => setShowQR(true)}
            className="p-3 rounded-full bg-purple-600/30 text-purple-200 hover:bg-purple-600/50 
                      transition-all border border-purple-500/20 shadow-md hover:shadow-purple-500/30"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </motion.button>
        </motion.div>

        <footer className="mt-12 text-center text-purple-300/60 text-xs">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="mb-2">
              {lang === 'zh-TW' ? '© 2025 謝上智. 保留所有權利.' : '© 2025 Sun. All rights reserved.'}
            </p>
          </motion.div>
        </footer>
      </div>
    </main>
  );
} 