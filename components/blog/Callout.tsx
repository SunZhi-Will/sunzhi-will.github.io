'use client';

import { ReactNode } from 'react';
import { useTheme } from '@/app/blog/ThemeProvider';

interface CalloutProps {
  type?: 'info' | 'success' | 'warning' | 'error' | 'tip';
  title?: string;
  children: ReactNode;
  emoji?: string;
}

export function Callout({ type = 'info', title, children, emoji }: CalloutProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const styles = {
    info: {
      bg: isDark ? 'bg-zinc-800/40' : 'bg-zinc-100',
      border: isDark ? 'border-zinc-700/30' : 'border-zinc-200',
      icon: 'ℹ️',
      text: isDark ? 'text-zinc-200' : 'text-zinc-800',
    },
    success: {
      bg: isDark ? 'bg-green-500/10' : 'bg-green-50',
      border: isDark ? 'border-green-500/20' : 'border-green-200',
      icon: '✅',
      text: isDark ? 'text-green-200' : 'text-green-800',
    },
    warning: {
      bg: isDark ? 'bg-yellow-500/10' : 'bg-yellow-50',
      border: isDark ? 'border-yellow-500/20' : 'border-yellow-200',
      icon: '⚠️',
      text: isDark ? 'text-yellow-200' : 'text-yellow-800',
    },
    error: {
      bg: isDark ? 'bg-red-500/10' : 'bg-red-50',
      border: isDark ? 'border-red-500/20' : 'border-red-200',
      icon: '❌',
      text: isDark ? 'text-red-200' : 'text-red-800',
    },
    tip: {
      bg: isDark ? 'bg-yellow-500/10' : 'bg-yellow-50',
      border: isDark ? 'border-yellow-500/20' : 'border-yellow-200',
      icon: '💡',
      text: isDark ? 'text-yellow-200' : 'text-yellow-800',
    },
  };

  const style = styles[type];
  const displayEmoji = emoji || style.icon;

  return (
    <div className={`my-6 p-4 rounded-lg border ${style.bg} ${style.border}`}>
      <div className="flex items-start space-x-3">
        <span className="text-lg flex-shrink-0 mt-0.5">{displayEmoji}</span>
        <div className={`flex-1 ${style.text}`}>
          {title && (
            <div className="font-semibold mb-2">{title}</div>
          )}
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}