'use client'

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@nextui-org/react";
import { useInView } from "react-intersection-observer";
import ParticlesBackground from '@/components/ParticlesBackground';
import GradientBackground from '@/components/GradientBackground';
import { useState, useEffect, useMemo } from "react";
import Masonry from 'react-masonry-css';
import { GlowingButton } from '@/components/GlowingButton';
import { TechIcon } from '@/components/TechIcon';
import { NavDot } from '@/components/NavDot';
import { ProjectMedia } from '@/components/ProjectMedia';
import { Lang } from '@/types';
import { translations } from '@/data/translations';
import { AIChat } from '@/components/AIChat';

// 在 CSS 中添加樣式
const breakpointColumnsObj = {
  default: 2,
  992: 1
};

const useTypewriter = (text: string, speed: number = 100) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    setDisplayText(''); // 重置文字
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1)); // 使用 slice 而不是累加
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]); // 依賴於 text，當文字改變時重新開始

  return displayText;
};

export default function Home() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [lang, setLang] = useState<Lang>('zh-TW'); // 設定預設語言

  useEffect(() => {
    // 在瀏覽器端檢查語言
    const browserLang = navigator.language;
    setLang(browserLang.includes('zh') ? 'zh-TW' : 'en');
  }, []);

  const techStacks = useMemo(() => [
    {
      category: translations[lang].techCategories.programming,
      items: [
        { name: 'C#', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
        { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
        { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
        { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
        { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' }
      ]
    },
    {
      category: translations[lang].techCategories.framework,
      items: [
        { name: '.NET', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg' },
        { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
        { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
        { name: 'Vue.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
        { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' }
      ]
    },
    {
      category: translations[lang].techCategories.game,
      items: [
        { name: 'Unity', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg' }
      ]
    },
    {
      category: translations[lang].techCategories.ai,
      items: [
        { name: 'Azure OpenAI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },
        { name: 'Gemini', icon: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg' },
        { name: 'Computer Vision', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg' },
        { name: 'MediaPipe', icon: '/icons/mediapipe-logo.png' }
      ]
    },
    {
      category: translations[lang].techCategories.other,
      items: [
        { name: 'SQL Server', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg' },
        { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
        { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' }
      ]
    }
  ], [lang]);

  const aboutContent = useMemo(() => translations[lang].aboutContent, [lang]);
  // 在 projects 定義之前添加 useMemo
  const projects = useMemo(() => translations[lang].projects.items, [lang]);

  // 更新 useEffect
  useEffect(() => {
    // 初始化專案輪播
    const initialSlides = projects.reduce((acc, project) => ({
      ...acc,
      [project.title]: 0
    }), {});
    setCurrentSlides(initialSlides);
  }, [projects]); // 現在 projects 是 memoized 的，不會在每次渲染時改變

  // 添加當前區塊追蹤
  const [activeSection, setActiveSection] = useState('home');

  const sections = useMemo(() => [
    { id: 'home' as keyof typeof translations[typeof lang]['nav'], name: '首頁' },
    { id: 'about' as keyof typeof translations[typeof lang]['nav'], name: '關於我' },
    { id: 'skills' as keyof typeof translations[typeof lang]['nav'], name: '技術能力' },
    { id: 'projects' as keyof typeof translations[typeof lang]['nav'], name: '專案作品' }
  ], []);

  // 滾動到指定區塊
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 監聽滾動位置
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      sections.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // 添加分類過濾狀態
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 獲取所有技能
  const allSkills = techStacks.flatMap(category =>
    category.items.map(item => ({
      ...item,
      category: category.category
    }))
  );

  // 過濾技能
  const filteredSkills = selectedCategory
    ? allSkills.filter(skill => skill.category === selectedCategory)
    : allSkills;

  // 在其他 useState 宣告附近添加
  const [currentSlides, setCurrentSlides] = useState<Record<string, number>>({});

  // 添加狀態來控制按鈕顯示
  const [showSocialButtons, setShowSocialButtons] = useState(false);

  // 監聽滾動事件
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const threshold = window.innerHeight * 0.5; // 滾動超過螢幕高度的 50% 時顯示

      setShowSocialButtons(scrollPosition > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 將 LanguageToggle 組件移到這裡
  const LanguageToggle = () => (
    <button
      onClick={() => setLang(prev => prev === 'zh-TW' ? 'en' : 'zh-TW')}
      className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-full 
                 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 
                 transition-all duration-300"
    >
      {lang === 'zh-TW' ? 'EN' : '中文'}
    </button>
  );

  const typedSubtitle = useTypewriter(translations[lang].hero.subtitle, 50);

  // 添加狀態
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // 添加主按鈕控制展開/收起
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen text-white">
      <LanguageToggle />
      {/* 側邊導航 */}
      <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
        <div className="space-y-6">
          {sections.map(({ id }) => (
            <NavDot
              key={id}
              active={activeSection === id}
              name={translations[lang].nav[id]}
              onClick={() => scrollToSection(id)}
            />
          ))}
        </div>
      </nav>

      {/* 右下角按鈕組 */}
      <div className={`fixed right-8 bottom-8 z-50 transition-all duration-500
                    ${showSocialButtons ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
        {/* 主按鈕 */}
        <motion.button
          onClick={() => setIsMenuOpen(prev => !prev)}
          className={`w-12 h-12 rounded-full flex items-center justify-center
                     bg-gradient-to-r from-blue-600/90 to-blue-800/90 
                     shadow-lg hover:shadow-blue-500/50 transition-all duration-300
                     relative z-50`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </motion.button>

        {/* 花瓣式展開的按鈕組 */}
        <AnimatePresence mode="wait">
          {isMenuOpen && (
            <div className="absolute inset-0">
              {/* AI Chat 按鈕 - 左下 */}
              <motion.button
                initial={{ scale: 0, x: 6, y: 6 }}
                animate={{ scale: 1, x: -40, y: 35 }}
                exit={{
                  scale: 0,
                  x: 6,
                  y: 6,
                  transition: { duration: 0.1 }  // 確保退出動畫有足夠時間
                }}
                transition={{
                  duration: 0.1,
                  ease: [1, 1, 1, 1]
                }}
                onClick={() => {
                  setIsAIChatOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center
                           bg-gradient-to-r from-emerald-600/90 to-teal-800/90 
                           shadow-lg hover:shadow-emerald-500/50 transition-all duration-300
                           absolute"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </motion.button>

              {/* GitHub 按鈕 - 左上 */}
              <motion.a
                initial={{ scale: 0, x: 6, y: 6 }}
                animate={{ scale: 1, x: -45, y: -10 }}
                exit={{
                  scale: 0,
                  x: 6,
                  y: 6,
                  transition: { duration: 0.1 }  // 確保退出動畫有足夠時間
                }}
                transition={{
                  duration: 0.1,
                  ease: [1, 1, 1, 1]
                }}
                href="https://github.com/SunZhi-Will"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center
                           bg-gradient-to-r from-purple-600/90 to-indigo-800/90 
                           shadow-lg hover:shadow-purple-500/50 transition-all duration-300
                           absolute"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                  alt="GitHub"
                  width={20}
                  height={20}
                  className="[filter:invert(1)]"
                />
              </motion.a>

              {/* LinkedIn 按鈕 - 上方 */}
              <motion.a
                initial={{ scale: 0, x: 6, y: 6 }}
                animate={{ scale: 1, x: -10, y: -45 }}
                exit={{
                  scale: 0,
                  x: 6,
                  y: 6,
                  transition: { duration: 0.1 }  // 確保退出動畫有足夠時間
                }}
                transition={{
                  duration: 0.1,
                  ease: [1, 1, 1, 1]
                }}
                href="https://www.linkedin.com/in/sunzhi-will"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center
                           bg-gradient-to-r from-blue-600/90 to-blue-800/90 
                           shadow-lg hover:shadow-blue-500/50 transition-all duration-300
                           absolute"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                  alt="LinkedIn"
                  width={20}
                  height={20}
                />
              </motion.a>

              {/* Email 按鈕 - 右上 */}
              <motion.a
                initial={{ scale: 0, x: 6, y: 6 }}
                animate={{ scale: 1, x: 35, y: -35 }}
                exit={{
                  scale: 0,
                  x: 6,
                  y: 6,
                  transition: { duration: 0.1 }  // 確保退出動畫有足夠時間
                }}
                transition={{
                  duration: 0.1,
                  ease: [1, 1, 1, 1]
                }}
                href="mailto:sun055676@gmail.com"
                className="w-10 h-10 rounded-full flex items-center justify-center
                           bg-gradient-to-r from-blue-500/90 to-blue-600/90 
                           shadow-lg hover:shadow-blue-500/50 transition-all duration-300
                           absolute"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </motion.a>
            </div>
          )}
        </AnimatePresence>
      </div>

      <GradientBackground />
      <ParticlesBackground />

      {/* Hero Section */}
      <div id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <header className="container mx-auto px-4 py-24 text-center relative z-10 flex flex-col min-h-screen">
          <div className="flex-1 flex flex-col justify-center">
            {/* 個人照片動畫 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
            >
              <div className="relative w-40 h-40 mx-auto mb-8 group">
                <Image
                  src="/profile.jpg"
                  alt="Sun's profile"
                  width={160}
                  height={160}
                  className="rounded-full mx-auto border-4 border-blue-400/50 shadow-lg shadow-blue-500/30
                             transition-transform duration-300 group-hover:scale-105"
                  priority
                />
                {/* 發光效果 */}
                <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-pulse" />
                {/* 裝飾性圓環 */}
                <div className="absolute -inset-4 rounded-full border-2 border-dashed border-blue-400/30 
                               animate-[spin_20s_linear_infinite]" />
                <div className="absolute -inset-8 rounded-full border-2 border-dashed border-blue-400/20 
                               animate-[spin_25s_linear_infinite_reverse]" />
              </div>
            </motion.div>

            {/* 標題和副標題動畫 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <motion.h1
                className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r 
                           from-blue-300 via-blue-400 to-blue-500"
                animate={{
                  backgroundPosition: ["0%", "100%"],
                  transition: {
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}
              >
                {translations[lang].hero.title}
              </motion.h1>

              {/* 打字機效果的副標題 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative"
                key={lang}
              >
                <p className="text-xl text-blue-200 mb-10 relative min-h-[2em]">
                  <span>{typedSubtitle}</span>
                  <span className="absolute -right-4 top-0 w-1 h-full bg-blue-400 animate-blink" />
                </p>
              </motion.div>

              {/* 互動按鈕組 */}
              <div className="flex justify-center gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GlowingButton
                    href="https://github.com/SunZhi-Will"
                    className="bg-gradient-to-r from-purple-600 to-indigo-800 border border-purple-400/30 
                              shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:shadow-[0_0_25px_rgba(147,51,234,0.7)]
                              group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 
                                  transition-transform duration-300" />
                    <div className="relative flex items-center gap-2">
                      <Image
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                        alt="GitHub"
                        width={20}
                        height={20}
                        className="[filter:invert(1)] group-hover:rotate-12 transition-transform duration-300"
                      />
                      <span>GitHub</span>
                    </div>
                  </GlowingButton>
                </motion.div>

                {/* LinkedIn 按鈕 */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GlowingButton
                    href="https://www.linkedin.com/in/sunzhi-will"
                    className="bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-400/30 
                              shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.7)]
                              group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 
                                  transition-transform duration-300" />
                    <div className="relative flex items-center gap-2">
                      <Image
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                        alt="LinkedIn"
                        width={20}
                        height={20}
                        className="group-hover:rotate-12 transition-transform duration-300"
                      />
                      <span>LinkedIn</span>
                    </div>
                  </GlowingButton>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* 向下滾動提示 */}
          <motion.div
            className="mt-16 mb-8" // 增加上方間距，減少下方間距
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <div
              className="inline-flex flex-col items-center text-blue-300/70 hover:text-blue-300 
                         transition-colors duration-300 cursor-pointer px-4 py-2" // 縮小點擊範圍
              onClick={() => scrollToSection('about')}
            >
              <span className="text-sm mb-1">{translations[lang].hero.scrollDown}</span>
              <svg
                className="w-5 h-5 animate-bounce" // 稍微縮小圖標
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </motion.div>
        </header>

        {/* 背景裝飾 */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-blue-800/10 to-transparent" />
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl animate-blob" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500/10 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      {/* About Section */}
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        id="about"
        className="py-24 relative"
      >
        <div className="container mx-auto px-4">
          <Card className="bg-blue-950/40 backdrop-blur-md border border-blue-500/20 shadow-xl">
            <div className="p-8">
              <div className="flex flex-col items-center mb-8">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
                  {translations[lang].about.title}
                </h2>
                <div className="mt-2 w-24 h-1 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full" />
              </div>
              <div className="max-w-3xl mx-auto space-y-8">
                <p className="text-blue-100 text-lg leading-relaxed">
                  {aboutContent.intro}
                </p>

                {/* 工作經驗時間線 */}
                <div className="space-y-0">
                  {aboutContent.experiences
                    .filter((exp: { period?: string }) => exp.period)
                    .map((exp, index) => (
                      <motion.div
                        key={exp.title}
                        initial={{ x: -50, opacity: 0 }}
                        animate={inView ? { x: 0, opacity: 1 } : {}}
                        transition={{ delay: index * 0.2 }}
                        className="relative pl-8 pb-8 last:pb-0"
                      >
                        {/* 時間線 */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-blue-500/20">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                        </div>

                        <div className="bg-blue-900/20 rounded-lg p-6 border border-blue-500/10">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-bold text-blue-300">{exp.title}</h3>
                            <span className="text-blue-400 text-sm">{exp.period}</span>
                          </div>
                          <p className="text-blue-100 mb-4">{exp.description}</p>
                          <ul className="space-y-2">
                            {exp.achievements.map((achievement, i) => (
                              <li key={i} className="flex items-center text-blue-200">
                                <span className="text-blue-400 mr-2">•</span>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                </div>

                {/* 教學與顧問服務 */}
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-blue-300 mb-6">
                    {translations[lang].about.services.title}
                  </h3>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={inView ? { y: 0, opacity: 1 } : {}}
                    className="bg-blue-900/20 rounded-lg p-6 border border-blue-500/10"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-bold text-blue-300">
                        {translations[lang].about.services.title}
                      </h4>
                      <span className="px-3 py-1 bg-blue-500/20 rounded-full text-sm text-blue-300">
                        {translations[lang].about.services.available}
                      </span>
                    </div>

                    <p className="text-blue-200 mb-6">
                      {translations[lang].about.services.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {translations[lang].services.items.map((service, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-blue-950/40 rounded-lg">
                          <span className="text-blue-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </span>
                          <div>
                            <span className="text-blue-200 font-medium">{service.title}</span>
                            <p className="text-blue-300/70 text-sm mt-1">{service.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h4 className="text-lg font-semibold text-blue-300 mb-4">
                      {translations[lang].about.teaching.title}
                    </h4>
                    <p className="text-blue-200 mb-6">
                      {translations[lang].about.teaching.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {translations[lang].teaching.courses.map((course, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-blue-950/40 rounded-lg">
                          <span className="text-blue-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </span>
                          <span className="text-blue-200">{course}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>


              </div>
            </div>
          </Card>
        </div>
      </motion.section>

      {/* Tech Stack Section */}
      <section id="skills" className="py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
              {translations[lang].skills.title}
            </h2>
            <div className="mt-2 w-24 h-1 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full" />
          </div>

          {/* 分類過濾按鈕 */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full transition-all duration-300
                ${!selectedCategory
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'}`}
            >
              {translations[lang].categories.all}
            </button>
            {techStacks.map(category => (
              <button
                key={category.category}
                onClick={() => setSelectedCategory(category.category)}
                className={`px-4 py-2 rounded-full transition-all duration-300
                  ${selectedCategory === category.category
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'}`}
              >
                {category.category}
              </button>
            ))}
          </div>

          {/* 技能展示 */}
          <motion.div
            className="flex flex-wrap justify-center gap-6"
            layout
          >
            {filteredSkills.map((tech, index) => (
              <TechIcon
                key={tech.name}
                name={tech.name}
                icon={tech.icon}
                delay={index * 0.1}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 relative">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
              {translations[lang].projects.title}
            </h2>
            <div className="mt-2 w-24 h-1 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full" />
          </div>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid w-full max-w-5xl"
            columnClassName="my-masonry-grid_column"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="w-full"
              >
                <Card className="bg-blue-950/40 backdrop-blur-md border border-blue-500/20 
                              shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                  <div className="relative">
                    <div className="aspect-video relative overflow-hidden group">
                      <ProjectMedia
                        media={project.media}
                        title={project.title}
                        currentSlide={currentSlides[project.title] || 0}
                        onSlideChange={(index) => setCurrentSlides(prev => ({ ...prev, [project.title]: index }))}
                      />
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="
                        px-4 py-2 
                        bg-gradient-to-r from-blue-500/50 to-blue-600/5u0
                        backdrop-blur-md 
                        border border-blue-400/20
                        rounded-full 
                        text-sm font-medium
                        text-blue-100
                        shadow-lg shadow-blue-500/20
                        flex items-center gap-2
                      ">
                        {/* 根據類別添加對應圖標 */}
                        {project.category === "AI 開發" || project.category === "AI Development" && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-4 h-4" fill="currentColor"><path d="M192-384q-40 0-68-28t-28-68q0-40 28-68t68-28v-72q0-29.7 21.15-50.85Q234.3-720 264-720h120q0-40 28-68t68-28q40 0 68 28t28 68h120q29.7 0 50.85 21.15Q768-677.7 768-648v72q40 0 68 28t28 68q0 40-28 68t-68 28v168q0 29.7-21.16 50.85Q725.68-144 695.96-144H263.72Q234-144 213-165.15T192-216v-168Zm168-72q20 0 34-14t14-34q0-20-14-34t-34-14q-20 0-34 14t-14 34q0 20 14 34t34 14Zm228 0q20 0 34-14t14-34q0-20-14-34t-34-14q-20 0-34 14t-14 34q0 20 14 34t34 14ZM336-312h288v-72H336v72Zm-72 96h432v-432H264v432Zm216-216Z" /></svg>
                        )}
                        {project.category === "演講分享" || project.category === "Speaking" && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-4 h-4" fill="currentColor"><path d="M240-384h336v-72H240v72Zm0-132h480v-72H240v72Zm0-132h480v-72H240v72ZM96-96v-696q0-29.7 21.15-50.85Q138.3-864 168-864h624q29.7 0 50.85 21.15Q864-821.7 864-792v480q0 29.7-21.15 50.85Q821.7-240 792-240H240L96-96Zm114-216h582v-480H168v522l42-42Zm-42 0v-480 480Z" /></svg>
                        )}
                        {project.category === "企業應用" || project.category === "Enterprise Solutions" && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z" />
                          </svg>
                        )}
                        {project.category === "遊戲開發" || project.category === "Game Development" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 -960 960 960" fill="currentColor"><path d="M182-200q-51 0-79-35.5T82-322l42-300q9-60 53.5-99T282-760h396q60 0 104.5 39t53.5 99l42 300q7 51-21 86.5T778-200q-21 0-39-7.5T706-230l-90-90H344l-90 90q-15 15-33 22.5t-39 7.5Zm16-86 114-114h336l114 114q2 2 16 6 11 0 17.5-6.5T800-304l-44-308q-4-29-26-48.5T678-680H282q-30 0-52 19.5T204-612l-44 308q-2 11 4.5 17.5T182-280q2 0 16-6Zm482-154q17 0 28.5-11.5T720-480q0-17-11.5-28.5T680-520q-17 0-28.5 11.5T640-480q0 17 11.5 28.5T680-440Zm-80-120q17 0 28.5-11.5T640-600q0-17-11.5-28.5T600-640q-17 0-28.5 11.5T560-600q0 17 11.5 28.5T600-560ZM310-440h60v-70h70v-60h-70v-70h-60v70h-70v60h70v70Zm170-40Z" /></svg>
                        )}
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col gap-4">
                    <h3 className="text-2xl font-bold text-blue-300">
                      {project.title}
                    </h3>
                    <p className="text-blue-200">{project.description}</p>

                    {/* 成就列表 */}
                    {project.achievements && (
                      <div>
                        <h4 className="text-blue-300 font-semibold mb-2">
                          {translations[lang].projects.mainAchievements}
                        </h4>
                        <ul className="space-y-1">
                          {project.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-center text-blue-200 text-sm">
                              <span className="text-blue-400 mr-2">▹</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 技術標籤和連結區域 */}
                    {(project.technologies || project.link || project.links) && (
                      <div className="flex flex-col gap-4 mt-auto pt-4">
                        {/* 技術標籤 */}
                        {project.technologies && (
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-blue-500/10 rounded-md text-xs text-blue-200"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* 連結按鈕區域 */}
                        <div className="flex flex-wrap gap-3">
                          {/* 專案連結 */}
                          {project.link && (
                            <motion.a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-all duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              {translations[lang].projects.viewProject}
                            </motion.a>
                          )}

                          {/* App Store 連結 */}
                          {project.links?.ios && (
                            <motion.a
                              href={project.links.ios}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Image
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg"
                                alt="App Store"
                                width={16}
                                height={16}
                                className="[filter:invert(1)]"
                              />
                              App Store
                            </motion.a>
                          )}

                          {/* Play Store 連結 */}
                          {project.links?.android && (
                            <motion.a
                              href={project.links.android}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Image
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg"
                                alt="Play Store"
                                width={16}
                                height={16}
                              />
                              Play Store
                            </motion.a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </Masonry>
        </div>
      </section>

      {/* 頁尾區域 */}
      <footer className="py-8 text-center">
        <div className="container mx-auto px-4 space-y-4">
          <p className="text-blue-300">
            {translations[lang].footer.portfolio}
          </p>
          <a
            href="https://sites.google.com/view/shangzhistime"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-gray-300 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            {translations[lang].footer.oldWebsite}
          </a>
        </div>
      </footer>

      {/* 添加 AI Chat 組件 */}
      <AIChat
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        lang={lang}
      />
    </div>
  );
}
