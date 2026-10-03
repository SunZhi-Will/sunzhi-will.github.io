'use client';

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
  // 顏色來自 app/tokens.css，深淺色自動切換
  return (
    <div className="not-prose my-12 p-8 rounded-xl border bg-gradient-to-br from-brand/[0.06] to-surface border-brand/20 shadow-card">

      {/* Summary Section */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">{emoji}</div>
        <h3 className="text-2xl font-light mb-4 text-fg">
          一句話總結
        </h3>
        <p className="text-lg leading-relaxed font-semibold text-brand-text">
          {summary}
        </p>
      </div>

      {/* Key Takeaways */}
      {keyTakeaways.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xl font-light mb-4 text-center text-fg">
            📚 關鍵收穫
          </h4>
          <ul className="space-y-3">
            {keyTakeaways.map((takeaway, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5 bg-brand text-brand-on">
                  {index + 1}
                </span>
                <span className="leading-relaxed text-fg-body">
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
          <h4 className="text-xl font-light mb-4 text-center text-fg">
            🚀 下一步行動
          </h4>
          <div className="grid gap-3 md:grid-cols-2">
            {nextActions.map((action, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all ${
                  action.primary
                    ? 'bg-brand/10 border-brand/25 hover:bg-brand/20'
                    : 'bg-fg/5 border-line hover:bg-fg/10'
                }`}
              >
                <div className={`font-semibold ${action.primary ? 'text-brand-text' : 'text-fg-body'}`}>
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
          <h4 className="text-xl font-light mb-4 text-center text-fg">
            📖 延伸閱讀
          </h4>
          <div className="grid gap-3 md:grid-cols-2">
            {relatedContent.map((content, index) => (
              <a
                key={index}
                href={content.url}
                className="block p-4 rounded-lg border transition-all group bg-surface border-line hover:bg-surface-raised hover:border-line-strong"
              >
                <div className="font-medium group-hover:underline text-fg-body">
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