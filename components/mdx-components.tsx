import type { MDXComponents } from 'mdx/types';
import { Callout } from './blog/Callout';
import { StepGuide } from './blog/StepGuide';
import { StatsHighlight } from './blog/StatsHighlight';
import { InsightQuote } from './blog/InsightQuote';
import { ArticleConclusion } from './blog/ArticleConclusion';
import { BookmarkCard } from './blog/BookmarkCard';

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling
    // h1: ({ children }) => <h1 style={{ color: 'red' }}>{children}</h1>,
    Callout,
    StepGuide,
    StatsHighlight,
    InsightQuote,
    ArticleConclusion,
    BookmarkCard,
    ...components,
  };
}