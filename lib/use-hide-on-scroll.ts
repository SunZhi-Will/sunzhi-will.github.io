'use client'

import { useEffect, useState } from 'react';

/**
 * 往下捲時回傳 true（收起導覽列），往上捲或回到頂端時回傳 false。
 * 用在部落格的浮動導覽列，避免閱讀時一直蓋住內文。
 */
export function useHideOnScroll(threshold = 160): boolean {
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        let lastY = window.scrollY;
        let ticking = false;

        const update = () => {
            const y = window.scrollY;
            // 小幅抖動不反應，避免導覽列閃爍
            if (Math.abs(y - lastY) > 6) {
                setHidden(y > lastY && y > threshold);
                lastY = y;
            }
            ticking = false;
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [threshold]);

    return hidden;
}
