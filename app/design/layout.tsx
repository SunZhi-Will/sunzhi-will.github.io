import type { Metadata } from 'next';
import { ThemeProvider } from '../blog/ThemeProvider';
import '../blog/blog.css';

// 設計規範頁：給自己與協作者對照用，不列入 sitemap、不讓搜尋引擎收錄
export const metadata: Metadata = {
    title: '設計規範',
    robots: { index: false, follow: false },
};

export default function DesignLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            {/* .blog-root 讓頁面在主題載入前與部落格一樣先用深色 */}
            <div className="blog-root">{children}</div>
        </ThemeProvider>
    );
}
