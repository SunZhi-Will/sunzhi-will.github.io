import type { MediaContent } from '@/types';

// 專案與活動共用的展示資料形狀，讓兩者能共用卡片與詳情彈窗
export type ShowcaseItem = {
  title: string;
  description: string;
  category: string;
  achievements?: string[];
  technologies?: string[];
  media?: MediaContent[];
  link?: string;
  links?: { ios?: string; android?: string };
  demo?: string;
  buttonText?: string;
  startYear?: number;
};

// 「Vozmira - AI 短影音生成平台」拆成名稱與一句話說明；沒有分隔符時用分類當說明
export function splitShowcaseTitle(item: ShowcaseItem) {
  const [name, ...rest] = item.title.split(' - ');
  return { name, tagline: rest.join(' - ') || item.category };
}

// 卡片封面：優先取第一張圖片，其次用 YouTube 縮圖
export function coverOf(item: ShowcaseItem): { src: string; alt: string } | undefined {
  const media = item.media ?? [];
  const image = media.find((m) => m.type === 'image');
  if (image) return { src: image.src, alt: image.alt || item.title };
  const youtube = media.find((m) => m.type === 'youtube');
  if (youtube) return { src: `https://img.youtube.com/vi/${youtube.src}/hqdefault.jpg`, alt: youtube.alt || item.title };
  return undefined;
}
