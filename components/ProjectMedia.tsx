import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MediaContent } from "@/types";
import { VideoModal } from "@/components/YouTubePlayer";

// 更新 ProjectMedia 組件
export const ProjectMedia = ({
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
    const [selectedVideo, setSelectedVideo] = useState<{ src: string; alt?: string; type: 'youtube' | 'video' }>();
    const [direction, setDirection] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    if (!media || media.length === 0) return null;

    // 將所有媒體內容合併到一個陣列中
    const allMedia = media;
    const totalSlides = allMedia.length;

    const handleSlideChange = (index: number) => {
        setDirection(index > currentSlide ? 1 : -1);
        onSlideChange(index);
    };

    const handlePrevSlide = () => {
        const newIndex = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
        handleSlideChange(newIndex);
    };

    const handleNextSlide = () => {
        const newIndex = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
        handleSlideChange(newIndex);
    };

    // 處理影片播放
    const handleVideoClick = (mediaItem: MediaContent) => {
        if (mediaItem.type === 'youtube' || mediaItem.type === 'video') {
            setSelectedVideo({
                src: mediaItem.src,
                alt: mediaItem.alt,
                type: mediaItem.type
            });
        }
    };

    // 取得縮略圖 URL (對於 YouTube 影片)
    const getVideoThumbnail = (src: string, type: string) => {
        if (type === 'youtube') {
            return `https://img.youtube.com/vi/${src}/hqdefault.jpg`;
        }
        return null; // 本地影片需要其他方式處理縮略圖
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
                            {(() => {
                                const currentMedia = allMedia[currentSlide];

                                if (currentMedia.type === 'image') {
                                    return (
                                        <Image
                                            src={currentMedia.src}
                                            alt={currentMedia.alt || title}
                                            fill
                                            className="object-contain"
                                            priority
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    );
                                } else if (currentMedia.type === 'youtube') {
                                    const thumbnailUrl = getVideoThumbnail(currentMedia.src, currentMedia.type);
                                    return (
                                        <div className="relative w-full h-full cursor-pointer group" onClick={() => handleVideoClick(currentMedia)}>
                                            <Image
                                                src={thumbnailUrl || '/placeholder-video.jpg'}
                                                alt={currentMedia.alt || title}
                                                fill
                                                className="object-contain"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                            {/* YouTube 播放按鈕 */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 bg-red-600/90 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-all duration-300 group-hover:scale-110">
                                                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                } else if (currentMedia.type === 'video') {
                                    return (
                                        <div className="relative w-full h-full cursor-pointer group" onClick={() => handleVideoClick(currentMedia)}>
                                            {/* 本地影片預覽 */}
                                            <video
                                                src={currentMedia.src}
                                                className="w-full h-full object-contain bg-gray-900"
                                                muted
                                                preload="metadata"
                                                poster=""
                                            />
                                            {/* 播放按鈕覆蓋層 */}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all duration-300">
                                                <div className="w-16 h-16 bg-purple-600/90 rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-all duration-300 group-hover:scale-110 shadow-2xl">
                                                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            {/* 影片標題覆蓋層 */}
                                            <div className="absolute bottom-2 left-2 right-2">
                                                <div className="bg-black/60 backdrop-blur-sm rounded px-2 py-1">
                                                    <div className="text-white text-xs font-medium truncate">
                                                        {currentMedia.alt || title}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })()}
                        </motion.div>
                    </div>

                    {/* 左右箭頭 - 只在 hover 時顯示 */}
                    {totalSlides > 1 && (
                        <>
                            <motion.button
                                onClick={handlePrevSlide}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all z-10"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: isHovered ? 1 : 0,
                                    scale: isHovered ? 1 : 0.8
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </motion.button>
                            <motion.button
                                onClick={handleNextSlide}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all z-10"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: isHovered ? 1 : 0,
                                    scale: isHovered ? 1 : 0.8
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </motion.button>
                        </>
                    )}
                </div>

                {/* 輪播指示器 */}
                {totalSlides > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center p-2 z-10">
                        <div className="flex gap-2">
                            {allMedia.map((media, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSlideChange(idx)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentSlide
                                        ? 'bg-blue-400 scale-125'
                                        : 'bg-blue-400/40 hover:bg-blue-400/60'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 影片播放視窗 */}
            {selectedVideo && (
                <VideoModal
                    video={selectedVideo}
                    isOpen={!!selectedVideo}
                    onClose={() => setSelectedVideo(undefined)}
                />
            )}
        </>
    );
};