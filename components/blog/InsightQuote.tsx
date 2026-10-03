'use client';

import { ReactNode } from 'react';

interface InsightQuoteProps {
  content: ReactNode;
  author?: string;
  role?: string;
  type?: 'insight' | 'experience' | 'warning' | 'tip';
  emoji?: string;
}

export function InsightQuote({ content, author, role, type = 'insight', emoji }: InsightQuoteProps) {
  // 顏色來自 app/tokens.css，深淺色自動切換。提醒用狀態色，技巧用品牌色，其餘用中性表面
  const config = {
    insight: {
      bg: 'bg-surface-raised',
      border: 'border-line',
      icon: '🔍',
      title: '內行人的深度點評',
    },
    experience: {
      bg: 'bg-surface-sunken',
      border: 'border-line',
      icon: '💭',
      title: '我的親身體驗',
    },
    warning: {
      bg: 'bg-warning/10',
      border: 'border-warning/25',
      icon: '⚠️',
      title: '重要提醒',
    },
    tip: {
      bg: 'bg-brand/10',
      border: 'border-brand/25',
      icon: '💡',
      title: '實用技巧',
    },
  };

  const style = config[type];
  const displayEmoji = emoji || style.icon;

  return (
    <div className={`my-8 p-6 rounded-lg border ${style.bg} ${style.border}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-fg/10">
          {displayEmoji}
        </div>

        <div className="flex-1">
          <div className="font-semibold mb-3 text-fg">
            {style.title}
          </div>

          <div className="leading-relaxed mb-4 text-fg-body">
            {content}
          </div>

          {author && (
            <div className="text-sm border-t pt-3 border-line-strong text-fg-muted">
              {author}
              {role && <span className="ml-2">• {role}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}