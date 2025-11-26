'use client'

import { motion } from "framer-motion";
import Image from "next/image";
import { GlowingButton } from '@/components/GlowingButton';
import { Lang } from '@/types';
import { translations } from '@/data/translations';

interface HeroProps {
  lang: Lang;
  typedSubtitle: string;
  scrollToSection: (id: string) => void;
}

export const Hero = ({ lang, typedSubtitle, scrollToSection }: HeroProps) => {
  return (
    <div id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-center justify-center gap-8 lg:gap-12 xl:gap-16">
            {/* 左邊：個人照片 */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              className="flex-shrink-0"
            >
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 group">
              {/* 背景光暈效果 */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-400 via-gray-300 to-slate-200 opacity-40 blur-2xl group-hover:opacity-60 transition-opacity duration-500"></div>
              
              {/* 照片容器 - Pokemon 卡片風格閃光效果 */}
              <div className="relative w-full h-full rounded-full overflow-hidden 
                            border-4 border-slate-400/60 shadow-2xl shadow-slate-400/40
                            transition-all duration-300 group-hover:scale-105 group-hover:border-slate-300/80
                            ring-4 ring-slate-400/20
                            bg-slate-900/20 backdrop-blur-sm
                            card-shine card-holographic card-gloss">
                {/* 彩虹光澤層 */}
                <div className="absolute inset-0 rounded-full 
                              bg-gradient-to-br 
                              from-slate-300/30 via-gray-200/20 to-slate-400/30
                              opacity-0 group-hover:opacity-100 
                              transition-opacity duration-500
                              pointer-events-none z-[8]"
                      style={{ mixBlendMode: 'overlay' }}></div>
                
                {/* 照片 */}
                <div className="relative w-full h-full z-[2]">
                  <Image
                    src="/profile.jpg"
                    alt="Sun's profile"
                    width={256}
                    height={256}
                    className="w-full h-full object-cover object-center
                             transition-transform duration-300 group-hover:scale-110"
                    priority
                    style={{
                      mixBlendMode: 'normal',
                    }}
                  />
                </div>
                
                {/* 額外光澤層 */}
                <div className="absolute inset-0 rounded-full 
                              bg-gradient-to-tr from-transparent via-white/20 to-transparent
                              opacity-0 group-hover:opacity-100
                              transition-opacity duration-500
                              pointer-events-none z-[12]"></div>
              </div>
              
              {/* 發光效果 - 銀色系 */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-400/20 via-gray-300/20 to-slate-200/20 pointer-events-none z-[1]" />
              
              {/* 裝飾性圓環 */}
              <div 
                className="absolute -inset-4 rounded-full border-2 border-dashed border-slate-400/30 
                           group-hover:border-slate-300/50 transition-colors duration-300
                           animate-spin-slow pointer-events-none z-0"
              />
            </div>
          </motion.div>

            {/* 右邊：介紹和連結 */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-1 text-center lg:text-left max-w-2xl"
            >
            {/* 標題 */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 lg:mb-6 gradient-text
                         tracking-tight"
            >
              {translations[lang].hero.title}
            </motion.h1>

            {/* 打字機效果的副標題 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative mb-8 lg:mb-10"
              key={lang}
            >
              <p className="text-base sm:text-lg md:text-xl text-slate-100 relative min-h-[2em] font-light leading-relaxed">
                <span className="bg-gradient-to-r from-slate-200 via-gray-200 to-slate-100 bg-clip-text text-transparent">
                  {typedSubtitle}
                </span>
                <span className="absolute -right-4 top-0 w-0.5 h-full bg-gradient-to-b from-slate-400 to-gray-300 animate-blink shadow-glow" />
              </p>
            </motion.div>

            {/* 互動按鈕組 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center lg:justify-start gap-4 sm:gap-6"
            >
              {/* <motion.div
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
              </motion.div> */}

              {/* LinkedIn 按鈕 */}
              {/* <motion.div
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
              </motion.div> */}

              {/* 個人連結集合按鈕 */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <GlowingButton
                  href="/links"
                  className="bg-gradient-to-r from-slate-500 via-gray-400 to-slate-300 
                            border border-slate-400/50 
                            shadow-[0_0_20px_rgba(148,163,184,0.4)] hover:shadow-[0_0_30px_rgba(148,163,184,0.6)]
                            group relative overflow-hidden glow-button
                            backdrop-blur-sm !px-0 !py-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent 
                                translate-x-[-100%] group-hover:translate-x-[100%] 
                                transition-transform duration-700" />
                  <div className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium">
                    <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
                    </svg>
                    <span>{translations[lang].nav.links}</span>
                  </div>
                </GlowingButton>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

        {/* 向下滾動提示 */}
        <motion.div
          className="mt-12 lg:mt-16 mb-8 flex justify-center"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <div
            className="inline-flex flex-col items-center text-slate-300/70 hover:text-slate-200 
                       transition-colors duration-300 cursor-pointer px-4 py-2"
            onClick={() => scrollToSection('about')}
          >
            <span className="text-sm mb-1">{translations[lang].hero.scrollDown}</span>
            <svg
              className="w-5 h-5 animate-bounce"
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

      {/* 背景裝飾 - 優化性能，減少動畫 */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-20 w-80 h-80 bg-slate-400/12 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute top-40 right-20 w-72 h-72 bg-gray-400/12 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>
    </div>
  );
}; 