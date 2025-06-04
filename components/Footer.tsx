'use client'

import { Lang } from '@/types';
import { translations } from '@/data/translations';

interface FooterProps {
  lang: Lang;
}

export const Footer = ({ lang }: FooterProps) => {
  return (
    <footer className="py-8 text-center">
      <div className="container mx-auto px-4 space-y-4">
        <p className="text-blue-300">
          {translations[lang].footer.portfolio}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/links"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-blue-300 hover:text-blue-200 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
            </svg>
            {lang === 'zh-TW' ? '個人連結集合' : 'Link in Bio'}
          </a>
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
      </div>
    </footer>
  );
}; 