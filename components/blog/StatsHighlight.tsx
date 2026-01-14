'use client';

import { useTheme } from '@/app/blog/ThemeProvider';

interface StatItem {
  value: string;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
  change?: string;
}

interface StatsHighlightProps {
  title?: string;
  stats: StatItem[];
  layout?: 'grid' | 'row';
}

export function StatsHighlight({ title, stats, layout = 'grid' }: StatsHighlightProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const gridCols = stats.length <= 2 ? 'grid-cols-1 md:grid-cols-2' :
                   stats.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
                   'grid-cols-2 md:grid-cols-4';

  return (
    <div className="my-8">
      {title && (
        <h3 className={`text-xl font-light mb-6 text-center ${
          isDark ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {title}
        </h3>
      )}

      <div className={`${layout === 'grid' ? `grid ${gridCols} gap-4` : 'flex flex-wrap gap-4 justify-center'}`}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg text-center border ${
              isDark
                ? 'bg-gray-800/50 border-gray-700/30'
                : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            <div className={`text-3xl font-bold mb-2 ${
              isDark ? 'text-purple-400' : 'text-purple-600'
            }`}>
              {stat.value}
            </div>

            <div className={`text-sm mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {stat.label}
            </div>

            {stat.change && (
              <div className={`text-xs flex items-center justify-center space-x-1 ${
                stat.trend === 'up' ? (isDark ? 'text-green-400' : 'text-green-600') :
                stat.trend === 'down' ? (isDark ? 'text-red-400' : 'text-red-600') :
                (isDark ? 'text-gray-400' : 'text-gray-600')
              }`}>
                <span>
                  {stat.trend === 'up' && '↗'}
                  {stat.trend === 'down' && '↘'}
                  {stat.trend === 'neutral' && '→'}
                </span>
                <span>{stat.change}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}