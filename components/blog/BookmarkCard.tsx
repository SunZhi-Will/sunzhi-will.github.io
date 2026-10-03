'use client';

import { ReactNode } from 'react';
import Image from 'next/image';

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

export function BookmarkCard(props: BookmarkCardProps) {
  const { href, title, description, icon, thumbnail, children } = props;
  // 明確忽略 author 和 publisher，保持向後相容
  void props.author;
  void props.publisher;

  // 顏色來自 app/tokens.css，深淺色自動切換
  return (
    <figure className={`kg-card kg-bookmark-card my-8`}>
      <a
        className="kg-bookmark-container block rounded-lg border transition-all border-line bg-surface hover:bg-surface-raised hover:border-brand/50"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="kg-bookmark-content p-6">
          <div className="kg-bookmark-title text-lg font-semibold mb-3 leading-tight">
            {title}
          </div>

          {description && (
            <div className="kg-bookmark-description mb-4 text-sm leading-relaxed text-fg-muted">
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