'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    // 使用 mounted 狀態來確保服務器和客戶端初始渲染一致
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState<Theme>('dark'); // 預設深色系

    useEffect(() => {
        // 確保在客戶端執行
        if (typeof window === 'undefined') return;
        
        setMounted(true);
        // 從 localStorage 讀取主題
        const savedTheme = localStorage.getItem('blog-theme') as Theme | null;
        if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
            setTheme(savedTheme);
        } else {
            // 沒有儲存過偏好時跟著系統設定。這裡不寫入 localStorage，
            // 之後訪客改了系統設定，或自己按了切換鈕，才會以新的為準
            setTheme(window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        }
    }, []);

    useEffect(() => {
        // 只有在客戶端 mounted 後才執行
        if (!mounted || typeof window === 'undefined') return;
        
        // 同時設定 class 到 document，讓 CSS 變數和 Tailwind dark: 前綴都能正確運作
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        }
    }, [theme, mounted]);

    const toggleTheme = () => {
        const next: Theme = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        // 只有訪客自己切換時才記住，否則繼續跟著系統設定
        localStorage.setItem('blog-theme', next);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    // 在預渲染時，如果 context 未定義，返回預設值
    if (context === undefined) {
        // 在靜態生成時，返回預設主題以避免錯誤
        return { theme: 'dark' as Theme, toggleTheme: () => {} };
    }
    return context;
}

