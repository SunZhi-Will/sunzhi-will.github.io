'use client'

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface LightboxProps {
    /** 要放大的圖；null 代表關閉 */
    image: { src: string; label: string } | null;
    onClose: () => void;
    /** 有提供才會出現左右切換，鍵盤方向鍵也會生效 */
    onPrev?: () => void;
    onNext?: () => void;
    /** 顯示在圖片下方的操作列，例如「選這張」 */
    children?: ReactNode;
}

/**
 * 互動元件共用的圖片放大檢視。
 * 掛在 body 上，所以不受文章 .prose 樣式與圖片放大功能影響。
 */
export function Lightbox({ image, onClose, onPrev, onNext, children }: LightboxProps) {
    const open = image !== null;

    useEffect(() => {
        if (!open) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
            if (event.key === 'ArrowLeft') onPrev?.();
            if (event.key === 'ArrowRight') onNext?.();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose, onPrev, onNext]);

    if (typeof document === 'undefined') return null;

    const arrow = 'absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25';

    return createPortal(
        <AnimatePresence>
            {image && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    role="dialog"
                    aria-modal="true"
                    aria-label={image.label}
                    className="fixed inset-0 z-[70] flex cursor-zoom-out flex-col items-center justify-center gap-3 bg-black/90 p-4 backdrop-blur-sm"
                >
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="關閉"
                        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                    {onPrev && (
                        <button
                            type="button"
                            aria-label="上一張"
                            onClick={(event) => {
                                event.stopPropagation();
                                onPrev();
                            }}
                            className={`${arrow} left-3`}
                        >
                            <ChevronLeftIcon className="h-6 w-6" />
                        </button>
                    )}
                    {onNext && (
                        <button
                            type="button"
                            aria-label="下一張"
                            onClick={(event) => {
                                event.stopPropagation();
                                onNext();
                            }}
                            className={`${arrow} right-3`}
                        >
                            <ChevronRightIcon className="h-6 w-6" />
                        </button>
                    )}

                    <motion.img
                        key={image.src}
                        src={image.src}
                        alt={image.label}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="max-h-[78vh] max-w-full rounded-lg object-contain"
                    />
                    <div className="text-sm text-white/80">{image.label}</div>
                    {children && (
                        <div className="cursor-default" onClick={(event) => event.stopPropagation()}>
                            {children}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>,
        document.body,
    );
}
