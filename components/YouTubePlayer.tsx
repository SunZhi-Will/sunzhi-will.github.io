import { memo, useEffect } from "react";
import { createPortal } from 'react-dom';
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
    video?: { src: string; alt?: string; type?: 'youtube' | 'video' };
    isOpen: boolean;
    onClose: () => void;
}) => {
    useEffect(() => {
        if (isOpen) {
            // 防止背景滾動
            document.body.style.overflow = 'hidden';
            // ESC 鍵關閉
            const handleEscapeKey = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    onClose();
                }
            };
            document.addEventListener('keydown', handleEscapeKey);

            return () => {
                document.body.style.overflow = '';
                document.removeEventListener('keydown', handleEscapeKey);
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen || !video) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const modalContent = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
            onClick={handleBackdropClick}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999
            }}
        >
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-black rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 p-3 text-white hover:text-red-400 transition-colors z-10 bg-black/50 rounded-full backdrop-blur-sm"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="aspect-video w-full h-full">
                    {video.type === 'video' ? (
                        <video
                            src={video.src}
                            controls
                            autoPlay
                            className="w-full h-full object-contain bg-black"
                            title={video.alt || ''}
                        >
                            您的瀏覽器不支援影片播放。
                        </video>
                    ) : (
                        <YouTubePlayer src={video.src} title={video.alt || ''} />
                    )}
                </div>
            </div>
        </div>
    );

    // 使用 Portal 將模態框渲染到 body 下
    if (typeof window !== 'undefined') {
        return createPortal(modalContent, document.body);
    }

    return null;
});
VideoModal.displayName = 'VideoModal';