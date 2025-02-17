import { memo } from "react";
import Iframe from 'react-iframe'

// 添加 YouTube 組件
export const YouTubePlayer = memo(({ src, title }: { src: string; title: string }) => {
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

// 添加影片彈跳視窗組件
export const VideoModal = memo(({
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