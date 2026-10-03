'use client';

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
  const gridCols = stats.length <= 2 ? 'grid-cols-1 md:grid-cols-2' :
                   stats.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
                   'grid-cols-2 md:grid-cols-4';

  // 顏色來自 app/tokens.css，深淺色自動切換；漲跌用狀態色
  return (
    <div className="not-prose my-8">
      {title && (
        <h3 className="text-xl font-light mb-6 text-center text-fg">
          {title}
        </h3>
      )}

      <div className={`${layout === 'grid' ? `grid ${gridCols} gap-4` : 'flex flex-wrap gap-4 justify-center'}`}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-6 rounded-lg text-center border bg-surface border-line shadow-card"
          >
            <div className="text-3xl font-bold mb-2 text-brand-text">
              {stat.value}
            </div>

            <div className="text-sm mb-2 text-fg-body">
              {stat.label}
            </div>

            {stat.change && (
              <div className={`text-xs flex items-center justify-center space-x-1 ${
                stat.trend === 'up' ? 'text-success-text' :
                stat.trend === 'down' ? 'text-danger-text' :
                'text-fg-muted'
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