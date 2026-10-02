'use client'

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Magnetic } from '@/components/motion/Magnetic';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { EASE_OUT } from '@/components/motion/ease';
import { scrollToSection } from '@/lib/use-site-lang';
import { translations } from '@/data/translations';
import { homeCopy } from '@/data/translations/home';
import type { Lang } from '@/types';

const EMAIL = 'sun055676@gmail.com';

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/SunZhi-Will' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sunzhi-will' },
  { label: 'Threads', href: 'https://www.threads.net/@bing_sunzhi' },
  { label: 'Instagram', href: 'https://www.instagram.com/bing_sunzhi' },
  { label: 'YouTube', href: 'https://www.youtube.com/@suncodestudio' },
  { label: 'Medium', href: 'https://medium.com/@sun055676' },
];

export function Contact({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const copy = homeCopy[lang].contact;
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 剪貼簿不可用時直接開啟郵件程式
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  const pages = [
    { href: '/blog', label: t.nav.blog },
    { href: '/pricing', label: copy.pricing },
    { href: '/links', label: copy.links },
  ];

  return (
    <footer id="contact" className="border-t border-white/10 px-5 pt-20 md:px-10 md:pt-32">
      <div className="mx-auto max-w-6xl">
        <span className="eyebrow">{copy.label}</span>
        <h2 key={lang} className="mt-4 max-w-4xl text-[clamp(2.5rem,7.5vw,6.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
          <SplitText text={copy.title} />
        </h2>

        <Reveal className="mt-10 flex flex-wrap items-center gap-4 md:mt-14">
          <Magnetic>
            <a
              href={`mailto:${EMAIL}`}
              className="group inline-flex items-center gap-3 rounded-full bg-yellow-400 px-7 py-4 text-base font-semibold text-zinc-950 transition-colors duration-300 hover:bg-white md:text-lg"
            >
              {EMAIL}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </Magnetic>
          <button
            type="button"
            onClick={copyEmail}
            className="rounded-full border border-white/15 px-5 py-4 text-sm font-medium text-zinc-200 transition-colors duration-300 hover:border-white/40 hover:text-white"
          >
            <span aria-live="polite">{copied ? copy.copied : copy.copy}</span>
          </button>
        </Reveal>

        <Reveal className="mt-16 md:mt-24">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw text-lg font-medium text-zinc-200 hover:text-white md:text-xl"
                >
                  {social.label} <span aria-hidden="true" className="text-zinc-200">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <motion.div
          className="mt-16 h-px origin-left bg-white/10 md:mt-24"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE_OUT }}
        />

        <div className="flex flex-col gap-5 py-8 text-sm text-zinc-200 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {t.footer.portfolio}
          </p>
          <nav aria-label={copy.label} className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {pages.map((page) => (
              <Link key={page.href} href={page.href} className="link-draw text-zinc-200 hover:text-white">
                {page.label}
              </Link>
            ))}
            <a
              href="https://sunkoro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="link-draw text-zinc-200 hover:text-yellow-400"
            >
              {t.footer.courseWebsite} <span aria-hidden="true">↗</span>
            </a>
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('home');
              }}
              className="link-draw text-zinc-200 hover:text-white"
            >
              {copy.backToTop} <span aria-hidden="true">↑</span>
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
