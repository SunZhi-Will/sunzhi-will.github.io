'use client';

import { useTheme } from '@/app/blog/ThemeProvider';

interface ActionItem {
  text: string;
  primary?: boolean;
}

interface ArticleConclusionProps {
  summary: string;
  keyTakeaways?: string[];
  nextActions?: ActionItem[];
  relatedContent?: Array<{
    title: string;
    url: string;
  }>;
  emoji?: string;
}

export function ArticleConclusion({
  summary,
  keyTakeaways = [],
  nextActions = [],
  relatedContent = [],
  emoji = "🎯"
}: ArticleConclusionProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`my-12 p-8 rounded-xl border ${
      isDark
        ? 'bg-gradient-to-br from-zinc-900/60 to-zinc-950/60 border-yellow-500/20 shadow-glow-yellow/10'
        : 'bg-gradient-to-br from-yellow-50/50 to-zinc-50 border-zinc-200 shadow-sm'
    }`}>

      {/* Summary Section */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">{emoji}</div>
        <h3 className={`text-2xl font-light mb-4 ${
          isDark ? 'text-gray-100' : 'text-gray-900'
        }`}>
          一句話總結
        </h3>
        <p className={`text-lg leading-relaxed font-semibold ${
          isDark ? 'text-yellow-300' : 'text-yellow-700'
        }`}>
          {summary}
        </p>
      </div>

      {/* Key Takeaways */}
      {keyTakeaways.length > 0 && (
        <div className="mb-8">
          <h4 className={`text-xl font-light mb-4 text-center ${
            isDark ? 'text-gray-100' : 'text-gray-900'
          }`}>
            📚 關鍵收穫
          </h4>
          <ul className="space-y-3">
            {keyTakeaways.map((takeaway, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5 ${
                  isDark
                    ? 'bg-yellow-500 text-black'
                    : 'bg-yellow-500 text-black'
                }`}>
                  {index + 1}
                </span>
                <span className={`leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {takeaway}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Actions */}
      {nextActions.length > 0 && (
        <div className="mb-8">
          <h4 className={`text-xl font-light mb-4 text-center ${
            isDark ? 'text-gray-100' : 'text-gray-900'
          }`}>
            🚀 下一步行動
          </h4>
          <div className="grid gap-3 md:grid-cols-2">
            {nextActions.map((action, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all ${
                  action.primary
                    ? (isDark
                        ? 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20'
                        : 'bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20'
                      )
                    : (isDark
                        ? 'bg-zinc-800/50 border-zinc-700/30 hover:bg-zinc-700/50'
                        : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100'
                      )
                }`}
              >
                <div className={`font-semibold ${
                  action.primary
                    ? (isDark ? 'text-yellow-300' : 'text-yellow-800')
                    : (isDark ? 'text-zinc-200' : 'text-zinc-700')
                }`}>
                  {action.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Content */}
      {relatedContent.length > 0 && (
        <div>
          <h4 className={`text-xl font-light mb-4 text-center ${
            isDark ? 'text-gray-100' : 'text-gray-900'
          }`}>
            📖 延伸閱讀
          </h4>
          <div className="grid gap-3 md:grid-cols-2">
            {relatedContent.map((content, index) => (
              <a
                key={index}
                href={content.url}
                className={`block p-4 rounded-lg border transition-all group ${
                  isDark
                    ? 'bg-gray-800/50 border-gray-700/30 hover:bg-gray-700/50 hover:border-gray-600'
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className={`font-medium group-hover:underline ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {content.title}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}