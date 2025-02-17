'use client'

import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@nextui-org/react";
import { useInView } from "react-intersection-observer";
import ParticlesBackground from './components/ParticlesBackground';
import GradientBackground from './components/GradientBackground';
import { useState, useEffect, memo, useMemo } from "react";
import Iframe from 'react-iframe'
import Masonry from 'react-masonry-css';

// 添加自定義按鈕組件
const GlowingButton = ({ href, className, children }: {
  href: string;
  className?: string;
  children: React.ReactNode
}) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`
      relative group overflow-hidden px-8 py-4 rounded-full
      flex items-center justify-center gap-2
      font-medium text-sm sm:text-base
      transition-all duration-300
      ${className}
    `}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <div className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity" />
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 animate-pulse" />
    </div>
    {children}
  </motion.a>
);

// 添加 Tech Stack 項目的圖標組件
const TechIcon = memo(({ name, icon, delay = 0 }: { name: string; icon: string; delay?: number }) => (
  <motion.div
    initial={{ scale: 0, rotate: -30 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: delay
    }}
    whileHover={{
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2 }
    }}
    className="group"
  >
    <div className="
      hex-container relative
      w-32 h-32
      bg-gradient-to-br from-blue-600/20 to-blue-900/40
      backdrop-blur-sm
      flex flex-col items-center justify-center
      transition-all duration-300
      border border-blue-500/20
      group-hover:border-blue-400/50
      group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]
      overflow-hidden
    ">
      <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Image
        src={icon}
        alt={name}
        width={48}
        height={48}
        className="mb-2 group-hover:scale-110 transition-transform filter brightness-125 contrast-125"
      />
      <p className="text-blue-200 text-sm font-medium">{name}</p>
    </div>
  </motion.div>
));
TechIcon.displayName = 'TechIcon';

// 更新導航組件
const NavDot = ({ active, name, onClick }: { active: boolean; name: string; onClick: () => void }) => (
  <div className="group flex items-center gap-4 justify-end">
    <span className={`text-blue-300 text-sm transition-all duration-300
      ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
      {name}
    </span>
    <button
      onClick={onClick}
      className={`w-3 h-3 rounded-full transition-all duration-300 
        ${active ? 'bg-blue-400 scale-125' : 'bg-blue-400/40 hover:bg-blue-400/60'}`}
    />
  </div>
);

// 更新專案類型
type MediaContent = {
  type: 'image' | 'youtube';
  src: string;
  alt?: string;
};

// 更新專案類型
type Project = {
  title: string;
  description: string;
  category: string;
  achievements?: string[];
  media?: MediaContent[];  // 使用 media 替換 images
  technologies?: string[];
  link?: string;
  links?: {
    ios?: string;
    android?: string;
  };
};

// 添加 YouTube 組件
const YouTubePlayer = memo(({ src, title }: { src: string; title: string }) => {
  return (
    <Iframe
      url={`https://www.youtube.com/embed/${src}?autoplay=0`}
      title={title}
      className="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}, (prevProps, nextProps) => prevProps.src === nextProps.src);
YouTubePlayer.displayName = 'YouTubePlayer';

// 在 CSS 中添加樣式
const breakpointColumnsObj = {
  default: 2,
  992: 1
};

// 添加影片彈跳視窗組件
const VideoModal = memo(({
  video,
  isOpen,
  onClose
}: {
  video?: { src: string; alt?: string };
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="relative w-full max-w-4xl aspect-video bg-blue-950">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 text-white hover:text-blue-400 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <YouTubePlayer src={video.src} title={video.alt || ''} />
      </div>
    </div>
  );
});
VideoModal.displayName = 'VideoModal';

// 更新 ProjectMedia 組件
const ProjectMedia = ({
  media,
  title,
  currentSlide = 0,
  onSlideChange
}: {
  media?: MediaContent[];
  title: string;
  currentSlide?: number;
  onSlideChange: (index: number) => void;
}) => {
  const [selectedVideo, setSelectedVideo] = useState<MediaContent>();
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  if (!media || media.length === 0) return null;

  const images = media.filter(item => item.type === 'image');
  const videos = media.filter(item => item.type === 'youtube');

  const handleSlideChange = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    onSlideChange(index);
  };

  const handlePrevSlide = () => {
    const newIndex = currentSlide > 0 ? currentSlide - 1 : images.length - 1;
    handleSlideChange(newIndex);
  };

  const handleNextSlide = () => {
    const newIndex = currentSlide < images.length - 1 ? currentSlide + 1 : 0;
    handleSlideChange(newIndex);
  };

  return (
    <>
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-video relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-950">
            <motion.div
              key={currentSlide}
              initial={{ x: direction * 100 + '%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction * -100 + '%', opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className="relative w-full h-full"
            >
              <Image
                src={media[currentSlide].src}
                alt={media[currentSlide].alt || title}
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </div>

          {/* 左右箭頭 */}
          {images.length > 1 && isHovered && (
            <>
              <button
                onClick={handlePrevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* 輪播指示器和影片按鈕 */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSlideChange(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300
                    ${idx === currentSlide
                      ? 'bg-blue-400 scale-125'
                      : 'bg-blue-400/40 hover:bg-blue-400/60'}`}
                />
              ))}
            </div>
          )}

          {videos.map((video, idx) => (
            <motion.button
              key={idx}
              onClick={() => setSelectedVideo(video)}
              className="px-3 py-1 bg-red-600/80 hover:bg-red-600 rounded-full text-xs text-white 
                       flex items-center gap-1 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" />
              </svg>
              影片 {idx + 1}
            </motion.button>
          ))}
        </div>
      </div>

      <VideoModal
        video={selectedVideo}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(undefined)}
      />
    </>
  );
};

export default function Home() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const techStacks = [
    {
      category: "程式語言",
      items: [
        { name: 'C#', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
        { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
        { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
        { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
        { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' }
      ]
    },
    {
      category: "開發框架",
      items: [
        { name: '.NET', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg' },
        { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
        { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
        { name: 'Vue.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
        { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' }
      ]
    },
    {
      category: "遊戲開發",
      items: [
        { name: 'Unity', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg' }
      ]
    },
    {
      category: "AI 技術",
      items: [
        { name: 'Azure OpenAI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },
        { name: 'Gemini', icon: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg' },
        { name: 'Computer Vision', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg' },
        { name: 'MediaPipe', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mediapipe/mediapipe-original.svg' }
      ]
    },
    {
      category: "其他技能",
      items: [
        { name: 'SQL Server', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg' },
        { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
        { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' }
      ]
    }
  ];

  const aboutContent = {
    intro: `我是一名充滿熱情的軟體工程師，專注於 .NET、AI 應用開發與 Unity 遊戲開發。
            從 Minecraft 模組開發啟發了我的程式熱情，到現在已累積豐富的實務經驗。
            
            擅長快速掌握新技術並整合應用，將複雜的技術需求轉化為實用的解決方案。
            特別在 AI 應用整合、企業系統開發與遊戲互動體驗設計方面有深入研究。
            
            喜歡探索新技術，並樂於分享技術經驗。期待能為產業帶來更多創新應用，
            同時也能協助更多人學習與成長。`,
    experience: [
      {
        title: "英業達股份有限公司 - 軟體工程師",
        period: "2023/12 - 至今",
        description: "負責企業級應用系統開發與維護，主要使用 .NET MVC、Low Code 軟體技術。",
        achievements: [
          "開發與維護企業內部系統",
          "參與 AI 技術導入專案",
          "進行技術分享與知識交流"
        ]
      },
      {
        title: "宥倍實業股份有限公司 - 軟體工程師",
        period: "2023/2 - 2023/10",
        description: "負責多個企業應用系統的開發與維護，主要使用 .NET MVC、WinForm 技術。",
        achievements: [
          "同時管理五個專案的開發與維護",
          "快速理解並解決程式問題",
          "提升專案開發效率",
          "建立完整的專案文件",
          "優化開發流程與架構"
        ]
      },
      {
        title: "田野科技有限公司 - 遊戲工程師",
        period: "2022/4 - 2023/2",
        description: "負責開發多項影像辨識與 AR/VR 遊戲，同時管理 LINE BOT 人事系統。",
        achievements: [
          "開發多款體感互動遊戲",
          "實現 AR/VR 技術整合",
          "設計影像辨識演算法",
          "開發 LINE BOT 人事系統",
          "優化使用者體驗與效能"
        ]
      },
      {
        title: "程式教學講師",
        description: "在各大專院校和企業分享程式開發實務經驗，涵蓋多個技術領域。",
        achievements: [
          "Unity 遊戲開發實務課程",
          "Unity 結合 MediaPipe 影像辨識應用",
          "LINE BOT 開發與應用實作",
          "AI 應用開發實務分享",
          "指導學生專案開發"
        ]
      }
    ]
  };

  // 在 projects 定義之前添加 useMemo
  const projects = useMemo<Project[]>(() => [
    {
      title: "LexiTechly - 智慧英文內容分析",
      description: "使用 Google Gemini AI 分析英文網頁內容，提供 CEFR 等級評估、單字解析、AI 互動對話與語音發音功能，提升您的英文閱讀與學習體驗！",
      category: "AI 開發",
      achievements: [
        "網頁英文內容的 CEFR 等級分析",
        "全方位的詞彙、語法和主題難度評估",
        "互動式 AI 對話功能",
        "單字列表與 AI 詞彙分析",
        "支援單字和例句的語音播放",
        "無限制的本地儲存空間"
      ],
      technologies: [
        "Chrome Extension",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Google Gemini AI",
        "Speechify API",
        "IndexedDB"
      ],
      media: [
        { type: 'image' as const, src: "/projects/lexitechly/unnamed.png", alt: "LexiTechly 主介面" },
        { type: 'image' as const, src: "/projects/lexitechly/analysis.png", alt: "內容分析" },
        { type: 'image' as const, src: "/projects/lexitechly/vocabulary.png", alt: "詞彙分析" },
        { type: 'image' as const, src: "/projects/lexitechly/chat.png", alt: "AI 對話" }
      ],
      link: "https://chromewebstore.google.com/detail/lexitechly-%E6%99%BA%E6%85%A7%E8%8B%B1%E6%96%87%E5%85%A7%E5%AE%B9%E5%88%86%E6%9E%90/lnfheajgimgpheflgjgknhnppanfenmk?hl=zh-TW&authuser=0"
    },
    {
      title: "Synvize",
      description: "AI 驅動的內容生成平台，協助自動彙整資料並生成文章。",
      category: "AI 開發",
      achievements: [
        "整合 AI 模型生成內容",
        "自動化資料彙整",
        "提升內容產出效率"
      ],
      media: [
        { type: 'image' as const, src: "/projects/synvize/home.png", alt: "Synvize 首頁" },
        { type: 'image' as const, src: "/projects/synvize/edit.png", alt: "編輯介面" }
      ],
      technologies: ["Python", "React", "Gemini"],
      link: "https://synvize.com/"
    },
    {
      title: "TED × AI創新應用講座",
      description: "受邀擔任 TED 講座講師，分享 AI 技術的創新應用與未來展望",
      category: "演講分享",
      achievements: [
        "分享 AI 技術在各領域的實際應用案例",
        "探討 AI 發展趨勢與未來機會",
        "與聽眾互動討論 AI 創新想法"
      ],
      media: [
        { type: 'image' as const, src: "/projects/ted/594732_0.jpg", alt: "演講" },
        { type: 'image' as const, src: "/projects/ted/594733_0.jpg", alt: "演講" }
      ],
      technologies: ["AI 應用", "ChatGPT", "NotebookLM"]
    },
    {
      title: "工廠自動化系統",
      description: "開發工廠生產線監控與管理系統",
      category: "企業應用",
      achievements: [
        "生產數據即時監控",
        "自動化報表生成",
        "供料防呆系統"
      ],
      media: [
        { type: 'image' as const, src: "/projects/factory/594729.jpg", alt: "供料防呆系統" }
      ],
      technologies: [".NET", "SQL Server", "PHP"]
    },
    {
      title: "LINE BOT 應用系列",
      description: "開發多款實用的 LINE BOT 應用，整合企業需求與使用者體驗，打造便利的自動化服務系統。",
      category: "企業應用",
      achievements: [
        "人事管理系統：上下班打卡、請假申請與簽核、發票上傳分類存檔",
        "揪團系統：創辦活動、活動參與、即時通知",
        "虛擬貨幣追蹤：即時匯率查看、價格波動通知",
        "AI 末日文字遊戲：互動式文字冒險遊戲，結合 AI 生成內容"
      ],
      technologies: [
        "LINE Messaging API",
        "Node.js",
        "Python",
        "Azure OpenAI",
        "MongoDB",
        "Docker"
      ],
      media: [
        { type: 'image' as const, src: "/projects/linebot/hr-bot.jpg", alt: "人事管理 LINE BOT" },
      ]
    },
    {
      title: "打擊垃圾⾞",
      description: "體感格鬥遊戲，透過體感偵測玩家的揮拳與踢擊動作，實現真實的格鬥體驗",
      category: "遊戲開發",
      achievements: [
        "實現精準的體感動作偵測系統",
        "開發部位打擊判定機制",
        "設計可切換角色系統",
        "優化遊戲流程與操作體驗",
        "成功上架 iOS 和 Android 平台"
      ],
      media: [
        { type: 'image' as const, src: '/projects/games/unnamed.webp' }
      ],
      technologies: ["Unity", "Computer Vision", "動作識別", "跨平台開發"],
      links: {
        ios: "https://apps.apple.com/tw/app/%E6%89%93%E6%93%8A%E5%9E%83%E5%9C%BE%E8%BB%8A/id6444556663",
        android: "https://play.google.com/store/apps/details?id=com.FTL.BlowGame"
      }
    },
    {
      title: "垃圾車等等我",
      description: "結合體感技術的互動遊戲，參加 DIGI 展覽，完整負責程式開發。現已上架 App Store 和 Play Store",
      category: "遊戲開發",
      achievements: [
        "開發人體掃描系統",
        "設計動作行為判定邏輯",
        "實現完整遊戲流程",
        "優化展覽場域的互動體驗",
        "成功上架 iOS 和 Android 平台"
      ],
      media: [
        { type: 'image' as const, src: "/projects/games/garbage.png", alt: "垃圾車等等我遊戲畫面" },
        { type: 'youtube' as const, src: 'H3ZRj114cQ4', alt: "遊戲展示影片 1" },
        { type: 'youtube' as const, src: 'ILhiUjDvkEw', alt: "遊戲展示影片 2" },
      ],
      technologies: ["Unity", "人體識別", "互動設計", "跨平台開發"],
      links: {
        ios: "https://apps.apple.com/tw/app/%E5%9E%83%E5%9C%BE%E8%BB%8A%E7%AD%89%E7%AD%89%E6%88%91/id6444548706",
        android: "https://play.google.com/store/apps/details?id=com.FTL.GarbageTruckWaitForMe"
      }
    },
    {
      title: "VR 恐龍射擊",
      description: "VR 射擊遊戲，整合不同專案架構，實現流暢的 VR 射擊體驗",
      category: "遊戲開發",
      achievements: [
        "整合多個專案架構",
        "優化 VR 互動體驗",
        "設計怪物生成系統",
        "實現多樣化武器系統"
      ],
      media: [
        { type: 'image' as const, src: "/projects/games/hqdefault.jpg", alt: "VR 恐龍射擊遊戲畫面" },
        { type: 'youtube' as const, src: "tvRp9Dz0hQA", alt: "VR 恐龍射擊遊戲畫面" }
      ],
      technologies: ["Unity", "SteamVR", "VR 開發"]
    },
    {
      title: "Unity 影像辨識課程",
      description: "在屏東科技大學碩士班擔任 Unity 結合 MediaPipe 影像辨識課程講師，分享實務經驗與技術整合",
      category: "教學分享",
      achievements: [
        "教授 Unity 與 MediaPipe 整合技術",
        "人體姿態估測在遊戲中的應用",
        "手部追蹤與手勢識別實作",
        "指導學生專案開發",
        "分享業界實務經驗"
      ],
      technologies: ["Unity", "MediaPipe", "Computer Vision", "影像辨識", "人體姿態估測"],
      media: [
        { type: 'image' as const, src: "/projects/teaching/unity-cv.png", alt: "Unity 影像辨識課程" }
      ]
    },
  ], []);

  // 更新 useEffect
  useEffect(() => {
    // 初始化專案輪播
    const initialSlides = projects.reduce((acc, project) => ({
      ...acc,
      [project.title]: 0
    }), {});
    setCurrentSlides(initialSlides);
  }, [projects]); // 現在 projects 是 memoized 的，不會在每次渲染時改變

  // 添加當前區塊追蹤
  const [activeSection, setActiveSection] = useState('home');

  const sections = useMemo(() => [
    { id: 'home', name: '首頁' },
    { id: 'about', name: '關於我' },
    { id: 'skills', name: '技術能力' },
    { id: 'projects', name: '專案作品' }
  ], []);

  // 滾動到指定區塊
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 監聽滾動位置
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      sections.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // 添加分類過濾狀態
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 獲取所有技能
  const allSkills = techStacks.flatMap(category =>
    category.items.map(item => ({
      ...item,
      category: category.category
    }))
  );

  // 過濾技能
  const filteredSkills = selectedCategory
    ? allSkills.filter(skill => skill.category === selectedCategory)
    : allSkills;

  // 在其他 useState 宣告附近添加
  const [currentSlides, setCurrentSlides] = useState<Record<string, number>>({});

  return (
    <div className="min-h-screen text-white">
      {/* 側邊導航 */}
      <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
        <div className="space-y-6">
          {sections.map(({ id, name }) => (
            <NavDot
              key={id}
              active={activeSection === id}
              name={name}
              onClick={() => scrollToSection(id)}
            />
          ))}
        </div>
      </nav>

      <GradientBackground />
      <ParticlesBackground />

      {/* Hero Section */}
      <div id="home" className="relative overflow-hidden">
        <header className="container mx-auto px-4 py-24 text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-40 h-40 mx-auto mb-8">
              <Image
                src="/profile.jpg"
                alt="Sun's profile"
                width={160}
                height={160}
                className="rounded-full mx-auto border-4 border-blue-400/50 shadow-lg shadow-blue-500/30"
                priority
              />
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-pulse"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500">
              你好，我是謝上智
            </h1>
            <p className="text-xl text-blue-200 mb-10">
              軟體工程師 | AI 開發者 | Unity 專家
            </p>

            <div className="flex justify-center gap-6">
              <GlowingButton
                href="https://github.com/SunZhi-Will"
                className="bg-gradient-to-r from-purple-600 to-indigo-800 border border-purple-400/30 shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:shadow-[0_0_25px_rgba(147,51,234,0.7)]"
              >
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                  alt="GitHub"
                  width={20}
                  height={20}
                  className="[filter:invert(1)]"
                />
                GitHub
              </GlowingButton>
            </div>
          </motion.div>
        </header>
      </div>

      {/* About Section */}
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        id="about"
        className="py-24 relative"
      >
        <div className="container mx-auto px-4">
          <Card className="bg-blue-950/40 backdrop-blur-md border border-blue-500/20 shadow-xl">
            <div className="p-8">
              <div className="flex flex-col items-center mb-8">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
                  關於我
                </h2>
                <div className="mt-2 w-24 h-1 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full" />
              </div>
              <div className="max-w-3xl mx-auto space-y-8">
                <p className="text-blue-100 text-lg leading-relaxed">
                  {aboutContent.intro}
                </p>

                {/* 工作經驗時間線 */}
                <div className="space-y-0">
                  {aboutContent.experience
                    .filter(exp => exp.period) // 只顯示有時間的經驗
                    .map((exp, index) => (
                      <motion.div
                        key={exp.title}
                        initial={{ x: -50, opacity: 0 }}
                        animate={inView ? { x: 0, opacity: 1 } : {}}
                        transition={{ delay: index * 0.2 }}
                        className="relative pl-8 pb-8 last:pb-0"
                      >
                        {/* 時間線 */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-blue-500/20">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                        </div>

                        <div className="bg-blue-900/20 rounded-lg p-6 border border-blue-500/10">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-bold text-blue-300">{exp.title}</h3>
                            <span className="text-blue-400 text-sm">{exp.period}</span>
                          </div>
                          <p className="text-blue-100 mb-4">{exp.description}</p>
                          <ul className="space-y-2">
                            {exp.achievements.map((achievement, i) => (
                              <li key={i} className="flex items-center text-blue-200">
                                <span className="text-blue-400 mr-2">•</span>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                </div>

                {/* 教學與顧問服務 */}
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-blue-300 mb-6">教學與顧問服務</h3>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={inView ? { y: 0, opacity: 1 } : {}}
                    className="bg-blue-900/20 rounded-lg p-6 border border-blue-500/10"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-bold text-blue-300">專業服務項目</h4>
                      <span className="px-3 py-1 bg-blue-500/20 rounded-full text-sm text-blue-300">
                        可接受委託
                      </span>
                    </div>

                    <p className="text-blue-200 mb-6">
                      提供專業的技術開發與顧問服務，從需求分析到系統實現，為您打造完整的解決方案。
                      擁有豐富的實務經驗，能夠協助您快速實現想法並解決技術難題。
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-3 p-4 bg-blue-950/40 rounded-lg">
                        <span className="text-blue-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </span>
                        <div>
                          <span className="text-blue-200 font-medium">全端開發</span>
                          <p className="text-blue-300/70 text-sm mt-1">網站系統開發與維護</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-blue-950/40 rounded-lg">
                        <span className="text-blue-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </span>
                        <div>
                          <span className="text-blue-200 font-medium">VR/AR 開發</span>
                          <p className="text-blue-300/70 text-sm mt-1">互動體驗設計與開發 (須提供設備)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-blue-950/40 rounded-lg">
                        <span className="text-blue-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </span>
                        <div>
                          <span className="text-blue-200 font-medium">遊戲開發</span>
                          <p className="text-blue-300/70 text-sm mt-1">互動遊戲開發與設計</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-blue-950/40 rounded-lg">
                        <span className="text-blue-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </span>
                        <div>
                          <span className="text-blue-200 font-medium">AI 應用開發</span>
                          <p className="text-blue-300/70 text-sm mt-1">AI 應用程式開發與整合</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-blue-950/40 rounded-lg">
                        <span className="text-blue-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </span>
                        <div>
                          <span className="text-blue-200 font-medium">APP 開發</span>
                          <p className="text-blue-300/70 text-sm mt-1">行動應用程式開發與優化</p>
                        </div>
                      </div>
                    </div>

                    <h4 className="text-lg font-semibold text-blue-300 mb-4">教學課程</h4>
                    <p className="text-blue-200 mb-6">
                      在各大專院校和企業分享實務經驗，提供客製化課程內容，
                      從基礎概念到進階應用，協助學員快速掌握技術要點。
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {aboutContent.experience
                        .filter(exp => !exp.period)
                        .map(exp => exp.achievements)
                        .flat()
                        .map((course, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-blue-950/40 rounded-lg"
                          >
                            <span className="text-blue-400">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </span>
                            <span className="text-blue-200">{course}</span>
                          </div>
                        ))}
                    </div>
                  </motion.div>
                </div>


              </div>
            </div>
          </Card>
        </div>
      </motion.section>

      {/* Tech Stack Section */}
      <section id="skills" className="py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
              技術能力
            </h2>
            <div className="mt-2 w-24 h-1 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full" />
          </div>

          {/* 分類過濾按鈕 */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full transition-all duration-300
                ${!selectedCategory
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'}`}
            >
              全部
            </button>
            {techStacks.map(category => (
              <button
                key={category.category}
                onClick={() => setSelectedCategory(category.category)}
                className={`px-4 py-2 rounded-full transition-all duration-300
                  ${selectedCategory === category.category
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'}`}
              >
                {category.category}
              </button>
            ))}
          </div>

          {/* 技能展示 */}
          <motion.div
            className="flex flex-wrap justify-center gap-6"
            layout
          >
            {filteredSkills.map((tech, index) => (
              <TechIcon
                key={tech.name}
                name={tech.name}
                icon={tech.icon}
                delay={index * 0.1}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
              主要專案
            </h2>
            <div className="mt-2 w-24 h-1 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full" />
          </div>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="max-w-5xl mx-auto flex -ml-8 w-auto"
            columnClassName="pl-8 bg-clip-padding"
          >
            {projects.map((project) => (
              <motion.div
                key={project.title}
                whileHover={{ scale: 1.02 }}
                className="mb-8 transform transition-all duration-300"
              >
                <Card className="bg-blue-950/40 backdrop-blur-md border border-blue-500/20 
                              shadow-lg hover:shadow-blue-500/30 transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <div className="aspect-video relative overflow-hidden group">
                      <ProjectMedia
                        media={project.media}
                        title={project.title}
                        currentSlide={currentSlides[project.title] || 0}
                        onSlideChange={(index) => setCurrentSlides(prev => ({ ...prev, [project.title]: index }))}
                      />
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="
                        px-4 py-2 
                        bg-gradient-to-r from-blue-500/30 to-blue-600/30
                        backdrop-blur-md 
                        border border-blue-400/20
                        rounded-full 
                        text-sm font-medium
                        text-blue-100
                        shadow-lg shadow-blue-500/20
                        flex items-center gap-2
                      ">
                        {/* 根據類別添加對應圖標 */}
                        {project.category === "AI 開發" && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                          </svg>
                        )}
                        {project.category === "演講分享" && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2zm0-4H6V5h2v2zm4 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z" />
                          </svg>
                        )}
                        {project.category === "企業應用" && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z" />
                          </svg>
                        )}
                        {project.category === "遊戲開發" && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        )}
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col gap-4">
                    <h3 className="text-2xl font-bold text-blue-300">
                      {project.title}
                    </h3>
                    <p className="text-blue-200">{project.description}</p>

                    {/* 成就列表 */}
                    {project.achievements && (
                      <div>
                        <h4 className="text-blue-300 font-semibold mb-2">主要成果：</h4>
                        <ul className="space-y-1">
                          {project.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-center text-blue-200 text-sm">
                              <span className="text-blue-400 mr-2">▹</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 技術標籤和連結區域 */}
                    {(project.technologies || project.link || project.links) && (
                      <div className="flex flex-col gap-4 mt-auto pt-4">
                        {/* 技術標籤 */}
                        {project.technologies && (
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-blue-500/10 rounded-md text-xs text-blue-200"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* 連結按鈕區域 */}
                        <div className="flex flex-wrap gap-3">
                          {/* 專案連結 */}
                          {project.link && (
                            <motion.a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-all duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              查看專案
                            </motion.a>
                          )}

                          {/* App Store 連結 */}
                          {project.links?.ios && (
                            <motion.a
                              href={project.links.ios}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Image
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg"
                                alt="App Store"
                                width={16}
                                height={16}
                                className="[filter:invert(1)]"
                              />
                              App Store
                            </motion.a>
                          )}

                          {/* Play Store 連結 */}
                          {project.links?.android && (
                            <motion.a
                              href={project.links.android}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Image
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg"
                                alt="Play Store"
                                width={16}
                                height={16}
                              />
                              Play Store
                            </motion.a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </Masonry>
        </div>
      </section>

      {/* 頁尾區域 */}
      <footer className="py-8 text-center">
        <div className="container mx-auto px-4 space-y-4">
          <p className="text-blue-300">謝上智 作品集</p>
          <a
            href="https://sites.google.com/view/shangzhistime"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-gray-300 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            舊版網站
          </a>
        </div>
      </footer>

      {/* 右側即時聯絡按鈕 */}
      <div className="fixed right-8 bottom-8 z-50 flex flex-col gap-4">
        <motion.a
          href="https://line.me/ti/p/sun055676"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-green-500/50 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.365 9.863c.349 0 .63.285.631.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
        </motion.a>

        <motion.a
          href="mailto:sun055676@gmail.com"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </motion.a>
      </div>
    </div>
  );
}
