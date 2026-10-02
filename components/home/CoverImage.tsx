'use client'

import { useState } from 'react';
import Image from 'next/image';

interface CoverImageProps {
  src: string;
  alt: string;
  sizes: string;
  // 裁切時對齊的位置：網站截圖對齊頂端，活動照片置中
  position?: 'top' | 'center';
  className?: string;
}

// 封面圖：橫幅圖片裁切填滿；Logo 或直式圖片改成完整顯示，避免被切掉
export function CoverImage({ src, alt, sizes, position = 'top', className = '' }: CoverImageProps) {
  const [contain, setContain] = useState(false);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      onLoad={(e) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalHeight > 0 && naturalWidth / naturalHeight < 1.25) setContain(true);
      }}
      className={`${contain ? 'object-contain p-6' : `object-cover ${position === 'top' ? 'object-top' : 'object-center'}`} ${className}`}
    />
  );
}
