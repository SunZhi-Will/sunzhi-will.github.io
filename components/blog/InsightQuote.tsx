'use client';

import { ReactNode } from 'react';
import { useTheme } from '@/app/blog/ThemeProvider';

interface InsightQuoteProps {
  content: ReactNode;
  author?: string;
  role?: string;
  type?: 'insight' | 'experience' | 'warning' | 'tip';
  emoji?: string;
}

export function InsightQuote({ content, author, role, type = 'insight', emoji }: InsightQuoteProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const config = {
    insight: {
      bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
      border: isDark ? 'border-blue-500/20' : 'border-blue-200',
      icon: '🔍',
      title: '內行人的深度點評',
    },
    experience: {
      bg: isDark ? 'bg-green-500/10' : 'bg-green-50',
      border: isDark ? 'border-green-500/20' : 'border-green-200',
      icon: '💭',
      title: '我的親身體驗',
    },
    warning: {
      bg: isDark ? 'bg-yellow-500/10' : 'bg-yellow-50',
      border: isDark ? 'border-yellow-500/20' : 'border-yellow-200',
      icon: '⚠️',
      title: '重要提醒',
    },
    tip: {
      bg: isDark ? 'bg-purple-500/10' : 'bg-purple-50',
      border: isDark ? 'border-purple-500/20' : 'border-purple-200',
      icon: '💡',
      title: '實用技巧',
    },
  };

  const style = config[type];
  const displayEmoji = emoji || style.icon;

  return (
    <div className={`my-8 p-6 rounded-lg border ${style.bg} ${style.border}`}>
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
          isDark ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          {displayEmoji}
        </div>

        <div className="flex-1">
          <div className={`font-semibold mb-3 ${
            isDark ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {style.title}
          </div>

          <div className={`leading-relaxed mb-4 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {content}
          </div>

          {author && (
            <div className={`text-sm border-t pt-3 ${
              isDark ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-600'
            }`}>
              {author}
              {role && <span className="ml-2">• {role}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}