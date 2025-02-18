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
import { TechIcon } from '@/components/TechIcon';
import { NavDot } from '@/components/NavDot';
import { ProjectMedia } from '@/components/ProjectMedia';
import { Lang } from '@/types';
import { translations } from '@/data/translations';

// 在 CSS 中添加樣式
const breakpointColumnsObj = {
  default: 2,
  992: 1
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

      <GradientBackground />
      <ParticlesBackground />

      {/* Hero Section */}
      <div id="home" className="relative overflow-hidden">
        <header className="container mx-auto px-4 py-24 text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-40 h-40 mx-auto mb-8">
              <Image
                src="/profile.jpg"
                alt="Sun's profile"
                width={160}
                height={160}
                className="rounded-full mx-auto border-4 border-blue-400/50 shadow-lg shadow-blue-500/30"
                priority
              />
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-pulse"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500">
              {translations[lang].hero.title}
            </h1>
            <p className="text-xl text-blue-200 mb-10">
              {translations[lang].hero.subtitle}
            </p>

            <div className="flex justify-center gap-6">
              <GlowingButton
                href="https://github.com/SunZhi-Will"
                className="bg-gradient-to-r from-purple-600 to-indigo-800 border border-purple-400/30 shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:shadow-[0_0_25px_rgba(147,51,234,0.7)]"
              >
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                  alt="GitHub"
                  width={20}
                  height={20}
                  className="[filter:invert(1)]"
                />
                GitHub
              </GlowingButton>
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
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
              {translations[lang].projects.title}
            </h2>
            <div className="mt-2 w-24 h-1 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full" />
          </div>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="max-w-5xl mx-auto flex -ml-8 w-auto"
            columnClassName="pl-8 bg-clip-padding"
          >
            {projects.map((project) => (
              <motion.div
                key={project.title}
                whileHover={{ scale: 1.02 }}
                className="mb-8 transform transition-all duration-300"
              >
                <Card className="bg-blue-950/40 backdrop-blur-md border border-blue-500/20 
                              shadow-lg hover:shadow-blue-500/30 transition-all duration-300 overflow-hidden">
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
                        bg-gradient-to-r from-blue-500/30 to-blue-600/30
                        backdrop-blur-md 
                        border border-blue-400/20
                        rounded-full 
                        text-sm font-medium
                        text-blue-100
                        shadow-lg shadow-blue-500/20
                        flex items-center gap-2
                      ">
                        {/* 根據類別添加對應圖標 */}
                        {project.category === "AI 開發" && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                          </svg>
                        )}
                        {project.category === "演講分享" && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2zm0-4H6V5h2v2zm4 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z" />
                          </svg>
                        )}
                        {project.category === "企業應用" && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z" />
                          </svg>
                        )}
                        {project.category === "遊戲開發" && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
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

      {/* 右側即時聯絡按鈕 */}
      <div className="fixed right-8 bottom-8 z-50 flex flex-col gap-4">
        {/* <motion.a
          href="https://line.me/ti/p/sun055676"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-green-500/50 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.365 9.863c.349 0 .63.285.631.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.285.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
        </motion.a> */}

        <motion.a
          href="mailto:sun055676@gmail.com"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </motion.a>
      </div>
    </div>
  );
}
