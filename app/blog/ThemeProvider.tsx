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
        setMounted(true);
        // 從 localStorage 讀取主題
        const savedTheme = localStorage.getItem('blog-theme') as Theme | null;
        if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
            setTheme(savedTheme);
        } else {
            // 如果沒有保存的主題，使用預設深色
            const defaultTheme: Theme = 'dark';
            setTheme(defaultTheme);
            localStorage.setItem('blog-theme', defaultTheme);
        }
    }, []);

    useEffect(() => {
        // 只有在客戶端 mounted 後才執行
        if (!mounted) return;
        
        // 保存主題到 localStorage
        localStorage.setItem('blog-theme', theme);
        // 可以添加 class 到 document 來控制全局樣式
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
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

