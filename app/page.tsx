'use client'

import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { About } from '@/components/home/About';
import { Activities } from '@/components/home/Activities';
import { Backdrop } from '@/components/home/Backdrop';
import { Contact } from '@/components/home/Contact';
import { Hero } from '@/components/home/Hero';
import { SiteNav } from '@/components/home/SiteNav';
import { Skills } from '@/components/home/Skills';
import { Work } from '@/components/home/Work';
import { useSiteLang } from '@/lib/use-site-lang';

export default function Home() {
  const [lang, setLang] = useSiteLang();

  useEffect(() => {
    document.title = lang === 'zh-TW'
      ? '謝上智 - 軟體工程師 | AI 開發者'
      : 'Sun Zhi - Software Engineer | AI Developer';
  }, [lang]);

  // 讓瀏覽器的捲軸、過度捲動露出的底色都跟著深色版面
  useEffect(() => {
    document.documentElement.classList.add('site-dark');
    return () => document.documentElement.classList.remove('site-dark');
  }, []);

  return (
    // reducedMotion="user"：訪客開啟「減少動態效果」時，位移與縮放動畫自動停用，只保留淡入
    <MotionConfig reducedMotion="user">
      <div className="site relative isolate min-h-screen [overflow-x:clip]">
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-950"
        >
          {lang === 'zh-TW' ? '跳到主要內容' : 'Skip to content'}
        </a>
        <Backdrop />
        <SiteNav lang={lang} setLang={setLang} />
        <main>
          <Hero lang={lang} />
          <About lang={lang} />
          <Work lang={lang} />
          <Skills lang={lang} />
          <Activities lang={lang} />
        </main>
        <Contact lang={lang} />
      </div>
    </MotionConfig>
  );
}
