import Image from 'next/image';
import Link from 'next/link';
import type { Category, StrapiEntity } from '@/types';

type Props = {
  category: StrapiEntity<Category>;
};

export function CategoryCard({ category }: Props) {
  const { name, slug, description, image } = category;

  const imageUrl =
    image?.formats?.large?.url ??
    image?.formats?.medium?.url ??
    image?.formats?.small?.url ??
    image?.url ??
    null;

  return (
    <Link href={`/categories/${slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-[oklch(0.88_0.02_310/0.15)]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={image?.alternativeText ?? name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[oklch(0.88_0.04_310/0.2)]" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.18_0.04_280/0.75)] via-[oklch(0.18_0.04_280/0.15)] to-transparent transition-opacity duration-300 group-hover:from-[oklch(0.35_0.12_310/0.8)]" />

        {/* Name */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-heading text-[oklch(0.97_0.01_60)] text-2xl leading-tight mb-1">
            {name}
          </h3>
          {description && (
            <p className="text-[oklch(0.97_0.01_60/0.7)] text-xs font-sans leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {description}
            </p>
          )}
          <span className="inline-block mt-2 text-[10px] tracking-[0.2em] uppercase font-sans text-[oklch(0.97_0.01_60/0.6)] group-hover:text-[oklch(0.97_0.01_60)] transition-colors duration-200">
            Shop now →
          </span>
        </div>
      </div>
    </Link>
  );
}
