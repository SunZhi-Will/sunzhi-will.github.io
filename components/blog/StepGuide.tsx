'use client';

import { ReactNode } from 'react';
import { useTheme } from '@/app/blog/ThemeProvider';

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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="my-8">
      {title && (
        <h3 className={`text-xl font-light mb-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          {title}
        </h3>
      )}

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`relative p-6 rounded-lg border ${
              isDark
                ? 'bg-gray-800/50 border-gray-700/30'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            {/* Step Number */}
            <div className="flex items-center mb-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                isDark
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-600 text-white'
              }`}>
                {index + 1}
              </div>
              <h4 className={`ml-4 text-lg font-medium ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>
                {step.title}
                {step.duration && (
                  <span className={`ml-2 text-sm font-normal ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    ({step.duration})
                  </span>
                )}
              </h4>
            </div>

            {/* Description */}
            <div className={`mb-4 leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {step.description}
            </div>

            {/* Code Block */}
            {step.code && (
              <div className={`mt-4 p-4 rounded-lg font-mono text-sm ${
                isDark
                  ? 'bg-gray-900 border border-gray-700'
                  : 'bg-gray-100 border border-gray-300'
              }`}>
                <pre className="whitespace-pre-wrap overflow-x-auto">
                  <code className={isDark ? 'text-gray-300' : 'text-gray-800'}>
                    {step.code}
                  </code>
                </pre>
              </div>
            )}

            {/* Tip */}
            {step.tip && (
              <div className={`mt-4 p-3 rounded-md text-sm ${
                isDark
                  ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-200'
                  : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
              }`}>
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