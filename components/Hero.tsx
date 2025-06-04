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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <GlowingButton
                  href="/links"
                  className="bg-gradient-to-r from-green-600 to-emerald-800 border border-green-400/30 
                            shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:shadow-[0_0_25px_rgba(34,197,94,0.7)]
                            group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 
                                transition-transform duration-300" />
                  <div className="relative flex items-center gap-2">
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
                    </svg>
                    <span>{translations[lang].nav.links}</span>
                  </div>
                </GlowingButton>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* 向下滾動提示 */}
        <motion.div
          className="mt-16 mb-8"
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

      {/* 背景裝飾 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-blue-800/10 to-transparent" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500/10 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
      </div>
    </div>
  );
}; 