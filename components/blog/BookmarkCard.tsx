'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { useTheme } from '@/app/blog/ThemeProvider';

interface BookmarkCardProps {
  href: string;
  title: string;
  description: string;
  author?: string;
  publisher?: string;
  icon?: string;
  thumbnail?: string;
  children?: ReactNode;
}

export function BookmarkCard({
  href,
  title,
  description,
  author,
  publisher,
  icon,
  thumbnail,
  children
}: BookmarkCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <figure className={`kg-card kg-bookmark-card my-8`}>
      <a
        className={`kg-bookmark-container block rounded-lg border transition-all ${
          isDark
            ? 'border-gray-700/50 bg-gray-800/50 hover:bg-gray-700/50'
            : 'border-gray-200 bg-white hover:bg-gray-50'
        }`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="kg-bookmark-content p-6">
          <div className="kg-bookmark-title text-lg font-semibold mb-3 leading-tight">
            {title}
          </div>

          {description && (
            <div className={`kg-bookmark-description mb-4 text-sm leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {description}
            </div>
          )}

          {(author || publisher || icon) && (
            <div className="kg-bookmark-metadata flex items-center space-x-3">
              {icon && (
                <img
                  className="kg-bookmark-icon w-5 h-5 rounded-full flex-shrink-0"
                  src={icon}
                  alt=""
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}

              {author && (
                <span className={`kg-bookmark-author text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {author}
                </span>
              )}

              {publisher && (
                <>
                  {author && <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>•</span>}
                  <span className={`kg-bookmark-publisher text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {publisher}
                  </span>
                </>
              )}
            </div>
          )}

          {children}
        </div>

        {thumbnail && (
          <div className="kg-bookmark-thumbnail">
            <img
              src={thumbnail}
              alt=""
              className="w-full h-48 object-cover rounded-r-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </a>
    </figure>
  );
}