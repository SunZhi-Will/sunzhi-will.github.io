import { ReactNode } from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  LightBulbIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface CalloutProps {
  type?: 'info' | 'success' | 'warning' | 'error' | 'tip';
  title?: string;
  children: ReactNode;
  emoji?: string;
}

// 顏色只用 app/tokens.css 的狀態色與品牌色，深淺色自動切換
const STYLES = {
  info: { box: 'border-info/30 bg-info/[0.07]', bar: 'bg-info', title: 'text-info-text', icon: 'text-info', Icon: InformationCircleIcon },
  success: { box: 'border-success/30 bg-success/[0.07]', bar: 'bg-success', title: 'text-success-text', icon: 'text-success', Icon: CheckCircleIcon },
  warning: { box: 'border-warning/30 bg-warning/[0.07]', bar: 'bg-warning', title: 'text-warning-text', icon: 'text-warning', Icon: ExclamationTriangleIcon },
  error: { box: 'border-danger/30 bg-danger/[0.07]', bar: 'bg-danger', title: 'text-danger-text', icon: 'text-danger', Icon: XCircleIcon },
  tip: { box: 'border-brand/30 bg-brand/[0.07]', bar: 'bg-brand', title: 'text-brand-text', icon: 'text-brand', Icon: LightBulbIcon },
};

export function Callout({ type = 'info', title, children, emoji }: CalloutProps) {
  const style = STYLES[type] ?? STYLES.info;
  const { Icon } = style;

  return (
    <aside className={`not-prose relative my-8 overflow-hidden rounded-lg border py-4 pl-5 pr-4 ${style.box}`}>
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 ${style.bar}`} />
      <div className="flex items-start gap-3">
        {emoji ? (
          <span className="mt-0.5 flex-shrink-0 text-lg leading-none" aria-hidden="true">{emoji}</span>
        ) : (
          <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${style.icon}`} aria-hidden="true" />
        )}
        <div className="min-w-0 flex-1 text-fg-body">
          {title && <div className={`mb-1.5 font-semibold ${style.title}`}>{title}</div>}
          {/* globals.css 的 .prose p 會套到這裡的段落，用 ! 蓋掉它的間距與行高 */}
          <div className="text-[0.9375rem] leading-relaxed [&_a]:font-medium [&_a]:text-brand-text [&_a]:underline [&_a]:underline-offset-2 [&_p]:!m-0 [&_p]:!leading-relaxed [&_p+p]:!mt-2 [&_strong]:font-semibold [&_strong]:text-fg">
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
}
