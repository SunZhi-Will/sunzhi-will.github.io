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

          {icon && (
            <div className="kg-bookmark-metadata flex items-center space-x-3">
              <Image
                className="kg-bookmark-icon rounded-full flex-shrink-0"
                src={icon}
                alt=""
                width={20}
                height={20}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {children}
        </div>

        {thumbnail && (
          <div className="kg-bookmark-thumbnail relative h-48 w-full">
            <Image
              src={thumbnail}
              alt=""
              fill
              className="object-cover rounded-r-lg"
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