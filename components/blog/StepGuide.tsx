'use client';

import { ReactNode } from 'react';

interface Step {
  title: string;
  description: ReactNode;
  code?: string;
  tip?: string;
  duration?: string;
}

interface StepGuideProps {
  steps: Step[];
  title?: string;
}

export function StepGuide({ steps, title }: StepGuideProps) {
  // 顏色來自 app/tokens.css，深淺色自動切換
  return (
    <div className="not-prose my-8">
      {title && (
        <h3 className="text-xl font-light mb-6 text-fg">
          {title}
        </h3>
      )}

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative p-6 rounded-lg border bg-surface-raised border-line"
          >
            {/* Step Number */}
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-brand text-brand-on">
                {index + 1}
              </div>
              <h4 className="ml-4 text-lg font-medium text-fg">
                {step.title}
                {step.duration && (
                  <span className="ml-2 text-sm font-normal text-fg-muted">
                    ({step.duration})
                  </span>
                )}
              </h4>
            </div>

            {/* Description */}
            <div className="mb-4 leading-relaxed text-fg-body">
              {step.description}
            </div>

            {/* Code Block */}
            {step.code && (
              <div className="mt-4 p-4 rounded-lg font-mono text-sm bg-surface-sunken border border-line">
                <pre className="whitespace-pre-wrap overflow-x-auto">
                  <code className="text-fg-body">
                    {step.code}
                  </code>
                </pre>
              </div>
            )}

            {/* Tip */}
            {step.tip && (
              <div className="mt-4 p-3 rounded-md text-sm bg-brand/10 border border-brand/25 text-brand-text">
                <div className="flex items-start space-x-2">
                  <span className="text-base mt-0.5">💡</span>
                  <span>{step.tip}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}