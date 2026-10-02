'use client'

import { useCallback, useEffect, useState } from 'react';
import type { Lang } from '@/types';

const STORAGE_KEY = 'site-lang';

const isLang = (value: string | null): value is Lang => value === 'zh-TW' || value === 'en';

// 語言偏好：優先用訪客上次的選擇，否則依瀏覽器語言。首頁、連結頁、報價頁共用
export function useSiteLang(): [Lang, (lang: Lang) => void] {
  const [lang, setLangState] = useState<Lang>('zh-TW');

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      // 無痕模式或停用儲存時略過
    }
    setLangState(isLang(saved) ? saved : navigator.language.includes('zh') ? 'zh-TW' : 'en');
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh-TW' ? 'zh-Hant-TW' : 'en';
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // 同上
    }
  }, []);

  return [lang, setLang];
}

// 捲動到指定區塊。有 Lenis 時交給它處理，動畫才不會和原生平滑捲動打架
export function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) return;

  if (window.__lenis) {
    window.__lenis.scrollTo(element, { offset: id === 'home' ? 0 : -72 });
  } else {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
