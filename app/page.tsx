'use client'

import { useInView } from "react-intersection-observer";
import ParticlesBackground from '@/components/ParticlesBackground';
import GradientBackground from '@/components/GradientBackground';
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Lang } from '@/types';
import { translations } from '@/data/translations';
import Head from 'next/head';
import { TechStackGrid } from '@/components/TechStackGrid';
import FloatingButtons from '@/components/FloatingButtons';
import { Activities } from '@/components/Activities';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Projects } from '@/components/Projects';
import { Footer } from '@/components/Footer';
import { DynamicIslandNav } from '@/components/DynamicIslandNav';

const useTypewriter = (text: string, speed: number = 100) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    setDisplayText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return displayText;
};

export default function Home() {
  const [aboutRef, aboutInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [projectsRef, projectsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [lang, setLang] = useState<Lang>('zh-TW');

  useEffect(() => {
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

  const projects = useMemo(() => translations[lang].projects.items, [lang]);

  const initialSlides = useMemo(() => {
    if (projects && projects.length > 0) {
      return projects.reduce((acc, project) => ({
        ...acc,
        [project.title]: 0
      }), {});
    }
    return {};
  }, [projects]);

  const [currentSlides, setCurrentSlides] = useState<Record<string, number>>(initialSlides);

  useEffect(() => {
    if (Object.keys(currentSlides).length === 0 && projects && projects.length > 0) {
      const newSlides = projects.reduce((acc, project) => ({
        ...acc,
        [project.title]: 0
      }), {});
      setCurrentSlides(newSlides);
    }
  }, [projects, currentSlides]);

  const [activeSection, setActiveSection] = useState('home');

  const sections = useMemo(() => [
    { id: 'home' as keyof typeof translations[typeof lang]['nav'], name: '首頁' },
    { id: 'about' as keyof typeof translations[typeof lang]['nav'], name: '關於我' },
    { id: 'skills' as keyof typeof translations[typeof lang]['nav'], name: '技術能力' },
    { id: 'activities' as keyof typeof translations[typeof lang]['nav'], name: '活動分享' },
    { id: 'projects' as keyof typeof translations[typeof lang]['nav'], name: '專案作品' },
  ], []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

  const [showSocialButtons, setShowSocialButtons] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowSocialButtons(scrollPosition > window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const typedSubtitle = useTypewriter(translations[lang].hero.subtitle, 50);

  return (
    <div className="min-h-screen text-white">
      <Head>
        <title>{lang === 'zh-TW' ? '謝上智 - 軟體工程師 | AI 開發者' : 'Sun Zhi - Software Engineer | AI Developer'}</title>
      </Head>
      {/* 動態島導覽列 */}
      <DynamicIslandNav
        lang={lang}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        setLang={setLang}
      />

      <FloatingButtons show={showSocialButtons} />

      <GradientBackground />
      <ParticlesBackground />

      <Hero
        lang={lang}
        typedSubtitle={typedSubtitle}
        scrollToSection={scrollToSection}
      />

      <About
        ref={aboutRef}
        lang={lang}
        aboutInView={aboutInView}
      />

      {/* Tech Stack Section */}
      <section id="skills" className="py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <TechStackGrid
            techStacks={techStacks}
            translations={{
              title: translations[lang].skills.title,
              categories: {
                all: translations[lang].categories.all
              }
            }}
          />
        </div>
      </section>

      <Activities
        lang={lang}
        currentSlides={currentSlides}
        setCurrentSlides={setCurrentSlides}
      />

      <Projects
        ref={projectsRef}
        lang={lang}
        projectsInView={projectsInView}
        currentSlides={currentSlides}
        setCurrentSlides={setCurrentSlides}
      />

      <Footer lang={lang} />
    </div>
  );
}
