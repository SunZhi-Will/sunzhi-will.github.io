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
    const [selectedVideo, setSelectedVideo] = useState<MediaContent>();
    const [direction, setDirection] = useState(0);

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
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </motion.div>
                    </div>

                    {/* 左右箭頭 */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevSlide}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all z-10"
                            >
                                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={handleNextSlide}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all z-10"
                            >
                                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>

                {/* 輪播指示器和影片按鈕 */}
                <div className="absolute bottom-4 left-0 right-0 flex flex-wrap justify-center items-center gap-2 sm:gap-3 p-2 z-10">
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
                            className="px-2 sm:px-3 py-1 bg-red-600/80 hover:bg-red-600 rounded-full text-xs text-white 
                         flex items-center gap-1 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" />
                            </svg>
                            <span className="hidden sm:inline">影片</span> {idx + 1}
                        </motion.button>
                    ))}
                </div>
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