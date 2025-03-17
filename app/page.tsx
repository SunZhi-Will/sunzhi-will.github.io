'use client'

import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@nextui-org/react";
import { useInView } from "react-intersection-observer";
import ParticlesBackground from '@/components/ParticlesBackground';
import GradientBackground from '@/components/GradientBackground';
import { useState, useEffect, useMemo } from "react";
import Masonry from 'react-masonry-css';
import { GlowingButton } from '@/components/GlowingButton';
import { NavDot } from '@/components/NavDot';
import { ProjectMedia } from '@/components/ProjectMedia';
import { Lang } from '@/types';
import { translations } from '@/data/translations';
import Head from 'next/head';
import { TechStackGrid } from '@/components/TechStackGrid';
import FloatingButtons from '@/components/FloatingButtons';

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

  useEffect(() => {
    document.title = lang === 'zh-TW'
      ? "謝上智 - 軟體工程師 | AI 開發者"
      : "Sun Zhi - Software Engineer | AI Developer";
  }, [lang]);

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

  // 在其他 useState 宣告附近添加
  const [currentSlides, setCurrentSlides] = useState<Record<string, number>>({});

  // 添加狀態來控制按鈕顯示
  const [showSocialButtons, setShowSocialButtons] = useState(false);

  const [showScrollDown, setShowScrollDown] = useState(true);

  // 監聽滾動事件
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // 當滾動超過 100px 時隱藏
      setShowScrollDown(scrollPosition < 100);
      // 當滾動超過首頁區塊時顯示社交按鈕
      setShowSocialButtons(scrollPosition > window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 將 LanguageToggle 組件移到這裡
  const LanguageToggle = () => (
    <button
      onClick={() => setLang(prev => prev === 'zh-TW' ? 'en' : 'zh-TW')}
      className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-full 
                 bg-primary-light/20 text-primary hover:bg-primary-light/30 
                 transition-all duration-300"
    >
      {lang === 'zh-TW' ? 'EN' : '中文'}
    </button>
  );

  const typedSubtitle = useTypewriter(translations[lang].hero.subtitle, 50);

  return (
    <div className="min-h-screen relative">
      <Head>
        <title>{lang === 'zh-TW' ? '謝上智 - 軟體工程師 | AI 開發者' : 'Sun Zhi - Software Engineer | AI Developer'}</title>
      </Head>

      {/* 背景層 */}
      <div className="fixed inset-0 z-0">
        <GradientBackground />
        <ParticlesBackground />
      </div>

      {/* 內容層 */}
      <div className="relative z-10">
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

        <FloatingButtons show={showSocialButtons} />

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
                    className="rounded-full mx-auto border-4 border-primary/50 shadow-lg shadow-primary/30
                               transition-transform duration-300 group-hover:scale-105"
                    priority
                  />
                  {/* 發光效果 */}
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
                  {/* 裝飾性圓環 */}
                  <div className="absolute -inset-4 rounded-full border-2 border-dashed border-primary/30 
                                 animate-[spin_20s_linear_infinite]" />
                  <div className="absolute -inset-8 rounded-full border-2 border-dashed border-primary/20 
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
                             from-primary via-primary to-primary-dark"
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
                  <p className="text-xl text-text mb-10 relative min-h-[2em]">
                    <span>{typedSubtitle}</span>
                    <span className="absolute -right-4 top-0 w-1 h-full bg-primary animate-blink" />
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
                      className="bg-gradient-to-r from-[#6e40c9] to-[#4c2889] border border-[#6e40c9]/30 
                                shadow-[0_0_15px_rgba(110,64,201,0.5)] hover:shadow-[0_0_25px_rgba(110,64,201,0.7)]
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
                      className="bg-gradient-to-r from-[#0077b5] to-[#0a66c2] border border-[#0077b5]/30 
                                shadow-[0_0_15px_rgba(0,119,181,0.5)] hover:shadow-[0_0_25px_rgba(0,119,181,0.7)]
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
              className={`mt-16 mb-8 transition-all duration-500 ${showScrollDown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div
                className="inline-flex flex-col items-center text-primary hover:text-primary-dark
                           transition-all duration-300 cursor-pointer px-6 py-3
                           bg-gradient-to-b from-primary/10 to-transparent
                           rounded-2xl hover:from-primary/20
                           group"
                onClick={() => scrollToSection('about')}
              >
                <span className="text-base font-medium mb-2 group-hover:scale-105 transition-transform">
                  {translations[lang].hero.scrollDown}
                </span>
                <div className="relative">
                  <svg
                    className="w-6 h-6 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  {/* 發光效果 */}
                  <div className="absolute -inset-2 bg-primary/20 blur-md rounded-full animate-pulse" />
                </div>
              </div>
            </motion.div>
          </header>
        </div>

        {/* About Section */}
        <motion.section
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          id="about"
          className="py-12 sm:py-24 relative"
        >
          <div className="container mx-auto px-4">
            <Card className="bg-bg-secondary backdrop-blur-md border border-primary/20 shadow-xl">
              <div className="p-4 sm:p-8">
                <div className="flex flex-col items-center mb-6 sm:mb-8">
                  <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-primary via-primary-dark to-primary bg-clip-text text-transparent">
                    {translations[lang].about.title}
                  </h2>
                  <div className="mt-2 w-24 h-1 bg-gradient-to-br from-primary via-primary-dark to-primary rounded-full" />
                </div>
                <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
                  <p className={`text-text text-base sm:text-lg leading-relaxed ${lang === 'zh-TW' ? 'text-justify' : ''}`}>
                    {aboutContent.intro}
                  </p>

                  {/* 工作經驗時間線 */}
                  <div className="space-y-4">
                    {aboutContent.experiences
                      .filter((exp: { period?: string }) => exp.period)
                      .map((exp, index) => (
                        <motion.div
                          key={exp.title}
                          initial={{ x: -50, opacity: 0 }}
                          animate={inView ? { x: 0, opacity: 1 } : {}}
                          transition={{ delay: index * 0.2 }}
                          className="relative pl-6 sm:pl-8 pb-6 sm:pb-8 last:pb-0"
                        >
                          {/* 時間線 */}
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/20">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 sm:w-3 h-2 sm:h-3 
                                           rounded-full bg-primary shadow-[0_0_8px_rgba(253,184,19,0.5)]" />
                          </div>

                          <div className="bg-bg-accent rounded-lg p-4 sm:p-6 border border-primary/10">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                              <h3 className="text-base sm:text-lg font-bold text-primary">{exp.title}</h3>
                              <span className="text-primary-dark text-sm">{exp.period}</span>
                            </div>
                            <p className={`text-text mb-4 text-sm sm:text-base ${lang === 'zh-TW' ? 'text-justify' : ''}`}>
                              {exp.description}
                            </p>
                            <ul className="space-y-2">
                              {exp.achievements.map((achievement, i) => (
                                <li key={i} className={`flex items-start sm:items-center text-sm sm:text-base text-text ${lang === 'zh-TW' ? 'text-justify' : ''}`}>
                                  <span className="text-primary mr-2 mt-1 sm:mt-0">•</span>
                                  <span>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      ))}
                  </div>

                  {/* 教學與顧問服務 */}
                  <div className="mt-8 sm:mt-12">
                    <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">
                      {translations[lang].about.services.title}
                    </h3>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={inView ? { y: 0, opacity: 1 } : {}}
                      className="bg-bg-accent rounded-lg p-6 border border-primary/10"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xl font-bold text-primary">
                          {translations[lang].about.services.title}
                        </h4>
                        <span className="px-4 py-2 bg-gradient-to-r from-primary to-primary-dark 
                                       rounded-full text-sm font-semibold text-white 
                                       shadow-[0_0_15px_rgba(253,184,19,0.6)] border border-primary
                                       animate-[pulse_2s_ease-in-out_infinite]
                                       hover:scale-105 transition-transform duration-300">
                          {translations[lang].about.services.available}
                        </span>
                      </div>

                      <p className="text-text mb-6">
                        {translations[lang].about.services.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {translations[lang].services.items.map((service, index) => (
                          <div key={index} className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg">
                            <span className="text-primary">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                              </svg>
                            </span>
                            <div>
                              <span className="text-text font-medium">{service.title}</span>
                              <p className="text-text/70 text-sm mt-1">{service.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <h4 className="text-lg font-semibold text-primary mb-4">
                        {translations[lang].about.teaching.title}
                      </h4>
                      <p className="text-text mb-6">
                        {translations[lang].about.teaching.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {translations[lang].teaching.courses.map((course, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg">
                            <span className="text-primary">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </span>
                            <span className="text-text">{course}</span>
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
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-br from-primary via-primary-dark to-primary bg-clip-text text-transparent">
                {translations[lang].skills.title}
              </h2>
              <div className="mt-2 w-24 h-1 bg-gradient-to-br from-primary via-primary-dark to-primary rounded-full" />
            </div>
            <TechStackGrid
              techStacks={techStacks}
              translations={{
                title: translations[lang].skills.title,
                categories: {
                  all: translations[lang].categories.all
                }
              }}
              showTitle={false}
            />
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 relative">
          <div className="container mx-auto px-4 flex flex-col items-center">
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-br from-primary via-primary-dark to-primary bg-clip-text text-transparent">
                {translations[lang].projects.title}
              </h2>
              <div className="mt-2 w-24 h-1 bg-gradient-to-br from-primary via-primary-dark to-primary rounded-full" />
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
                  className="mb-8 w-full"
                >
                  <Card className="bg-bg-secondary backdrop-blur-md border border-primary/20 
                                shadow-xl hover:shadow-primary/10 transition-all duration-300">
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
                          bg-gradient-to-r from-primary/70 to-primary-dark/70
                          backdrop-blur-md 
                          border border-primary/20
                          rounded-full 
                          text-sm font-medium
                          text-white
                          shadow-lg shadow-primary/20
                          flex items-center gap-2
                        ">
                          {/* 根據類別添加對應圖標 */}
                          {(project.category === "AI 開發" || project.category === "AI Development") && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-4 h-4" fill="currentColor"><path d="M192-384q-40 0-68-28t-28-68q0-40 28-68t68-28v-72q0-29.7 21.15-50.85Q234.3-720 264-720h120q0-40 28-68t68-28q40 0 68 28t28 68h120q29.7 0 50.85 21.15Q768-677.7 768-648v72q40 0 68 28t28 68q0 40-28 68t-68 28v168q0 29.7-21.16 50.85Q725.68-144 695.96-144H263.72Q234-144 213-165.15T192-216v-168Zm168-72q20 0 34-14t14-34q0-20-14-34t-34-14q-20 0-34 14t-14 34q0 20 14 34t34 14Zm228 0q20 0 34-14t14-34q0-20-14-34t-34-14q-20 0-34 14t-14 34q0 20 14 34t34 14ZM336-312h288v-72H336v72Zm-72 96h432v-432H264v432Zm216-216Z" /></svg>
                          )}
                          {(project.category === "演講分享" || project.category === "Speaking") && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-4 h-4" fill="currentColor"><path d="M240-384h336v-72H240v72Zm0-132h480v-72H240v72Zm0-132h480v-72H240v72ZM96-96v-696q0-29.7 21.15-50.85Q138.3-864 168-864h624q29.7 0 50.85 21.15Q864-821.7 864-792v480q0 29.7-21.15 50.85Q821.7-240 792-240H240L96-96Zm114-216h582v-480H168v522l42-42Zm-42 0v-480 480Z" /></svg>
                          )}
                          {(project.category === "企業應用" || project.category === "Enterprise Solutions") && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z" />
                            </svg>
                          )}
                          {(project.category === "遊戲開發" || project.category === "Game Development") && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 -960 960 960" fill="currentColor"><path d="M182-200q-51 0-79-35.5T82-322l42-300q9-60 53.5-99T282-760h396q60 0 104.5 39t53.5 99l42 300q7 51-21 86.5T778-200q-21 0-39-7.5T706-230l-90-90H344l-90 90q-15 15-33 22.5t-39 7.5Zm16-86 114-114h336l114 114q2 2 16 6 11 0 17.5-6.5T800-304l-44-308q-4-29-26-48.5T678-680H282q-30 0-52 19.5T204-612l-44 308q-2 11 4.5 17.5T182-280q2 0 16-6Zm482-154q17 0 28.5-11.5T720-480q0-17-11.5-28.5T680-520q-17 0-28.5 11.5T640-480q0 17 11.5 28.5T680-440Zm-80-120q17 0 28.5-11.5T640-600q0-17-11.5-28.5T600-640q-17 0-28.5 11.5T560-600q0 17 11.5 28.5T600-560ZM310-440h60v-70h70v-60h-70v-70h-60v70h-70v60h70v70Zm170-40Z" /></svg>
                          )}
                          {project.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                      <h3 className="text-2xl font-bold text-primary">
                        {project.title}
                      </h3>
                      <p className="text-text">{project.description}</p>

                      {/* 成就列表 */}
                      {project.achievements && (
                        <div>
                          <h4 className="text-primary font-semibold mb-2">
                            {translations[lang].projects.mainAchievements}
                          </h4>
                          <ul className="space-y-1">
                            {project.achievements.map((achievement, i) => (
                              <li key={i} className="flex items-center text-text text-sm">
                                <span className="text-primary mr-2">▹</span>
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
                                  className="px-2 py-1 bg-primary/10 rounded-md text-xs text-text"
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
                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
                                  ${project.title.includes("LexiTechly")
                                    ? "bg-gradient-to-r from-[#1967d2]/90 to-[#4285f4]/90 hover:from-[#1967d2] hover:to-[#4285f4] text-white"
                                    : "bg-primary/20 text-primary hover:bg-primary/30"}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {project.title.includes("LexiTechly") ? (
                                  <Image
                                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg"
                                    alt="Chrome"
                                    width={16}
                                    height={16}
                                    className="group-hover:rotate-12 transition-transform duration-300"
                                  />
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                )}
                                {project.buttonText || translations[lang].projects.viewProject}
                              </motion.a>
                            )}

                            {/* App Store 連結 */}
                            {project.links?.ios && (
                              <motion.a
                                href={project.links.ios}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 rounded-full 
                                         bg-gradient-to-r from-[#000000]/90 to-[#1a1a1a]/90 
                                         hover:from-[#000000] hover:to-[#1a1a1a]
                                         text-white transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Image
                                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg"
                                  alt="App Store"
                                  width={16}
                                  height={16}
                                  className="[filter:invert(1)] group-hover:rotate-12 transition-transform duration-300"
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
                                className="flex items-center gap-2 px-4 py-2 rounded-full 
                                         bg-gradient-to-r from-[#34a853]/90 to-[#4285f4]/90
                                         hover:from-[#34a853] hover:to-[#4285f4]
                                         text-white transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Image
                                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg"
                                  alt="Play Store"
                                  width={16}
                                  height={16}
                                  className="group-hover:rotate-12 transition-transform duration-300"
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
            <p className="text-text">
              {translations[lang].footer.portfolio}
            </p>
            <a
              href="https://sites.google.com/view/shangzhistime"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-text/70 hover:text-text transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              {translations[lang].footer.oldWebsite}
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
