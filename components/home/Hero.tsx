'use client'

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Magnetic } from '@/components/motion/Magnetic';
import { SplitText } from '@/components/motion/SplitText';
import { EASE_OUT } from '@/components/motion/ease';
import { scrollToSection } from '@/lib/use-site-lang';
import { translations } from '@/data/translations';
import { homeCopy } from '@/data/translations/home';
import type { Lang } from '@/types';

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/SunZhi-Will' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sunzhi-will' },
  { label: 'Threads', href: 'https://www.threads.net/@bing_sunzhi' },
];

// 職稱輪播：每隔幾秒由下往上換一個
function RoleRotator({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || roles.length < 2) return;
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % roles.length), 2600);
    return () => clearInterval(timer);
  }, [roles.length, reduceMotion]);

  return (
    <span className="relative inline-flex h-[1.4em] overflow-hidden align-bottom">
      <span className="sr-only">{roles.join('、')}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={roles[index % roles.length]}
          aria-hidden="true"
          className="inline-block whitespace-nowrap text-white"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          {roles[index % roles.length]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: EASE_OUT, delay },
});

// 去背大頭像：背後一個淺色圓形光盤讓黑西裝與深色背景分開，人像由下往上浮出，下緣漸隱
function Portrait({ alt, status }: { alt: string; status: string }) {
  return (
    <div className="relative order-1 w-64 sm:w-72 lg:order-2 lg:w-[460px]">
      <div
        aria-hidden="true"
        className="absolute -inset-12 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(250,204,21,0.12),transparent)]"
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-[5%] top-[12%] aspect-square rounded-full bg-[radial-gradient(circle_at_50%_28%,#52525b_0%,#27272a_55%,#18181b_100%)] ring-1 ring-white/10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: EASE_OUT }}
      />
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.2 }}
      >
        <Image
          src="/profile-cutout.png"
          alt={alt}
          width={460}
          height={460}
          sizes="(min-width: 1024px) 460px, 288px"
          className="h-auto w-full drop-shadow-[0_0_1px_rgba(255,255,255,0.45)] [mask-image:linear-gradient(to_bottom,black_84%,transparent)]"
          priority
        />
      </motion.div>
      <motion.div
        className="absolute bottom-[6%] left-0 flex items-center gap-2.5 rounded-full border border-white/10 bg-[#141416]/85 px-3.5 py-1.5 backdrop-blur-xl lg:left-2"
        {...fadeUp(0.9)}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-status-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-xs font-medium text-zinc-200">{status}</span>
      </motion.div>
    </div>
  );
}

export function Hero({ lang }: { lang: Lang }) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  // 往下捲時首屏內容淡出並微微後退，讓下一區塊像是蓋上來
  // 偏好減少動態時把終點設成與起點相同，等於不動。style 屬性本身不分支，避免 hydration 前後不一致
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, reduceMotion ? 1 : 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -90]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 0.95]);

  const t = translations[lang];
  const copy = homeCopy[lang];
  const roles = t.hero.subtitle.split('|').map((role) => role.trim()).filter(Boolean);

  const goToProjects = (e: MouseEvent) => {
    e.preventDefault();
    scrollToSection('projects');
  };

  return (
    <section id="home" ref={ref} className="relative flex min-h-[100svh] flex-col px-5 pb-8 pt-28 md:px-10 md:pt-32">
      <motion.div
        className="mx-auto flex w-full max-w-6xl flex-1 items-center"
        style={{ opacity, y, scale }}
      >
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <Portrait alt={`${copy.hero.name} ${copy.hero.alias}`} status={t.about.services.available} />
          <div className="order-2 min-w-0 lg:order-1">
        <h1 key={lang}>
          <motion.span className="block text-lg text-zinc-200 md:text-2xl" {...fadeUp(0.25)}>
            {copy.hero.greeting}
          </motion.span>
          <span className="mt-1 block text-[clamp(3rem,10vw,7rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-white">
            <SplitText text={copy.hero.name} immediate delay={0.3} stagger={0.06} />
          </span>
        </h1>

        <motion.p className="mt-6 text-xl text-zinc-200 md:mt-8 md:text-3xl" {...fadeUp(0.75)}>
          <RoleRotator key={lang} roles={roles} />
        </motion.p>

        <motion.p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-200 md:text-lg" {...fadeUp(0.85)}>
          {copy.hero.tagline}
        </motion.p>

        <motion.div className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-4" {...fadeUp(0.95)}>
          <Magnetic>
            <a
              href="#projects"
              onClick={goToProjects}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition-colors duration-300 hover:bg-yellow-400"
            >
              {t.nav.projects}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
            </a>
          </Magnetic>
          <Link
            href="/blog"
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-zinc-200 transition-colors duration-300 hover:border-white/40 hover:text-white"
          >
            {t.nav.blog}
          </Link>
          <Link
            href="/links"
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-zinc-200 transition-colors duration-300 hover:border-white/40 hover:text-white"
          >
            {t.nav.links}
          </Link>
          <a
            href="https://sunkoro.com"
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw ml-2 text-sm font-medium text-zinc-200 hover:text-yellow-400"
          >
            {t.footer.courseWebsite} <span aria-hidden="true">↗</span>
          </a>
        </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div className="mx-auto mt-10 w-full max-w-6xl" style={{ opacity }}>
      <motion.div
        className="flex items-end justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
      >
        <a
          href="#about"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('about');
          }}
          className="group flex items-center gap-3"
        >
          <span className="relative block h-10 w-px overflow-hidden bg-white/15">
            <span className="animate-scroll-cue absolute inset-0 bg-yellow-400" />
          </span>
          <span className="eyebrow transition-colors duration-200 group-hover:text-yellow-400">{t.hero.scrollDown}</span>
        </a>
        <ul className="flex items-center gap-5">
          {SOCIALS.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="eyebrow link-draw hover:text-yellow-400"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
      </motion.div>
    </section>
  );
}
