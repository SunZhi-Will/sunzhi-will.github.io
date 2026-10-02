'use client'

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { VideoModal } from '@/components/YouTubePlayer';
import { EASE_OUT } from '@/components/motion/ease';
import type { MediaContent } from '@/types';

interface MediaCarouselProps {
  media?: MediaContent[];
  title: string;
  labels: { play: string; prev: string; next: string };
}

const youtubeThumbnail = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

// 詳情彈窗內的媒體輪播：圖片直接顯示，影片點擊後另開播放視窗
export function MediaCarousel({ media, title, labels }: MediaCarouselProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [video, setVideo] = useState<{ src: string; alt?: string; type: 'youtube' | 'video' }>();

  if (!media || media.length === 0) return null;

  const total = media.length;
  const current = media[Math.min(index, total - 1)];

  const goTo = (next: number) => {
    const wrapped = (next + total) % total;
    setDirection(next > index ? 1 : -1);
    setIndex(wrapped);
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={index}
          custom={direction}
          className="absolute inset-0"
          initial={{ x: `${direction * 100}%`, opacity: 0 }}
          animate={{ x: '0%', opacity: 1 }}
          exit={{ x: `${direction * -100}%`, opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          {current.type === 'image' ? (
            <Image
              src={current.src}
              alt={current.alt || title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 640px"
            />
          ) : (
            <button
              type="button"
              className="group relative h-full w-full"
              onClick={() => setVideo({ src: current.src, alt: current.alt, type: current.type as 'youtube' | 'video' })}
              aria-label={`${labels.play}: ${current.alt || title}`}
            >
              {current.type === 'youtube' ? (
                <Image
                  src={youtubeThumbnail(current.src)}
                  alt={current.alt || title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 640px"
                />
              ) : (
                <video src={current.src} className="h-full w-full object-contain" muted preload="metadata" />
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-300 group-hover:bg-black/35">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-zinc-950 transition-transform duration-300 group-hover:scale-110">
                  <svg className="ml-0.5 h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </button>
          )}
        </motion.div>
      </AnimatePresence>

      {total > 1 && (
        <>
          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
            {media.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`${i + 1} / ${total}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
              />
            ))}
          </div>
          {[-1, 1].map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => goTo(index + step)}
              aria-label={step < 0 ? labels.prev : labels.next}
              className={`absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-black/80 ${step < 0 ? 'left-3' : 'right-3'}`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d={step < 0 ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
              </svg>
            </button>
          ))}
        </>
      )}

      {video && <VideoModal video={video} isOpen onClose={() => setVideo(undefined)} />}
    </div>
  );
}
