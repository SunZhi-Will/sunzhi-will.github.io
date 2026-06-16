'use client'

import { Lang } from '@/types';
import { translations } from '@/data/translations';

interface FooterProps {
  lang: Lang;
}

export const Footer = ({ lang }: FooterProps) => {
  return (
    <footer className="py-12 text-center border-t border-zinc-800">
      <div className="container mx-auto px-4 space-y-6">
        <p className="text-slate-400 text-sm">
          {translations[lang].footer.portfolio}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/pricing"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-yellow-400 
                       bg-[#18181b]/50 hover:bg-[#27272a]/50 border border-[#3f3f46]/30 hover:border-yellow-500/50
                       rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
            {lang === 'zh-TW' ? '服務費用' : 'Pricing'}
          </a>
          <a
            href="/links"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-yellow-400 
                       bg-[#18181b]/50 hover:bg-[#27272a]/50 border border-[#3f3f46]/30 hover:border-yellow-500/50
                       rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
            </svg>
            {lang === 'zh-TW' ? '個人連結集合' : 'Link in Bio'}
          </a>
          <a
            href="https://sunkoro.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-yellow-400 
                       bg-[#18181b]/50 hover:bg-[#27272a]/50 border border-[#3f3f46]/30 hover:border-yellow-500/50
                       rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {translations[lang].footer.courseWebsite}
          </a>
        </div>
      </div>
    </footer>
  );
}; 