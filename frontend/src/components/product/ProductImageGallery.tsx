'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { StrapiMedia } from '@/types';

type Props = {
  images: StrapiMedia[];
  title: string;
  isFeatured?: boolean;
};

export function ProductImageGallery({ images, title, isFeatured }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const active = images[activeIndex];
  const mainUrl =
    active?.formats?.large?.url ??
    active?.formats?.medium?.url ??
    active?.url ??
    null;

  return (
    <div className="sticky top-8">
      {/* Main image */}
      <div className="relative aspect-[3/4] bg-[oklch(0.93_0.01_60)] overflow-hidden">
        {mainUrl ? (
          <Image
            key={mainUrl}
            src={mainUrl}
            alt={active?.alternativeText ?? title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading text-[oklch(0.45_0.08_310/0.2)] text-2xl tracking-widest uppercase">
              Veloura
            </span>
          </div>
        )}

        {isFeatured && (
          <div className="absolute top-4 left-4">
            <span className="bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 font-sans">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails — only when there's more than one image */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.map((img, i) => {
            const thumbUrl =
              img.formats?.thumbnail?.url ??
              img.formats?.small?.url ??
              img.url;
            const isActive = i === activeIndex;

            return (
              <button
                key={img.id}
                onClick={() => setActiveIndex(i)}
                aria-label={`View image ${i + 1}`}
                className={`relative w-16 aspect-square overflow-hidden flex-shrink-0 transition-all duration-200 ${
                  isActive
                    ? 'ring-2 ring-[oklch(0.35_0.12_310)] ring-offset-1'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={thumbUrl}
                  alt={img.alternativeText ?? `${title} ${i + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
