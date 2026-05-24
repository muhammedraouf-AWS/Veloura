import { writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import type { Core } from '@strapi/strapi';

// Curated Unsplash fragrance/perfume photos — one per product slug
const PRODUCT_IMAGES: Record<string, { url: string; alt: string }> = {
  'rose-eternelle': {
    url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80&fm=jpg',
    alt: 'Rose Éternelle — Bulgarian rose fragrance bottle',
  },
  'iris-nocturne': {
    url: 'https://images.unsplash.com/photo-1592945403407-9caf930b6e3b?w=800&q=80&fm=jpg',
    alt: 'Iris Nocturne — powdery iris perfume bottle',
  },
  'noir-absolu': {
    url: 'https://images.unsplash.com/photo-1547997062-a90f71beb72f?w=800&q=80&fm=jpg',
    alt: 'Noir Absolu — dark leather fragrance bottle',
  },
  'cedre-blanc': {
    url: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=800&q=80&fm=jpg',
    alt: 'Cèdre Blanc — white cedar cologne bottle',
  },
  'sable-dore': {
    url: 'https://images.unsplash.com/photo-1590156562745-5a6a2c0e0de7?w=800&q=80&fm=jpg',
    alt: 'Sable Doré — warm musk perfume bottle',
  },
  'the-vert-celeste': {
    url: 'https://images.unsplash.com/photo-1588776814546-1ffedda8b57e?w=800&q=80&fm=jpg',
    alt: 'Thé Vert Céleste — green tea fragrance bottle',
  },
  'oud-majestique': {
    url: 'https://images.unsplash.com/photo-1600612253971-51a8a9a51a16?w=800&q=80&fm=jpg',
    alt: 'Oud Majestique — royal oud perfume bottle',
  },
  'ambre-persan': {
    url: 'https://images.unsplash.com/photo-1613521140020-42ba6b43a72b?w=800&q=80&fm=jpg',
    alt: 'Ambre Persan — Persian amber perfume bottle',
  },
  'amalfi-lumiere': {
    url: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&q=80&fm=jpg',
    alt: 'Amalfi Lumière — citrus cologne bottle',
  },
  'pivoine-sauvage': {
    url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80&fm=jpg',
    alt: 'Pivoine Sauvage — wild peony perfume bottle',
  },
  'vetiver-terreux': {
    url: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=80&fm=jpg',
    alt: 'Vétiver Terreux — earthy vetiver perfume bottle',
  },
};

async function downloadToTmp(imageUrl: string, slug: string): Promise<{ path: string; type: string; size: number }> {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${imageUrl}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get('content-type') ?? 'image/jpeg';
  const ext = contentType.includes('png') ? 'png' : 'jpg';
  const tmpPath = join(tmpdir(), `veloura-${slug}-${Date.now()}.${ext}`);

  await writeFile(tmpPath, buffer);
  return { path: tmpPath, type: contentType, size: buffer.length };
}

export async function seedImages(strapi: Core.Strapi) {
  console.log('🌱 Seeding product images...');

  const uploadService = strapi.plugin('upload').service('upload');

  for (const [slug, { url, alt }] of Object.entries(PRODUCT_IMAGES)) {
    const product = await strapi.documents('api::product.product').findFirst({
      filters: { slug },
      populate: { images: true },
    });

    if (!product) {
      console.log(`  ↩ Skipped: product "${slug}" not found`);
      continue;
    }

    if (product.images && (product.images as unknown[]).length > 0) {
      console.log(`  ↩ Skipped: "${slug}" already has images`);
      continue;
    }

    try {
      const { path, type, size } = await downloadToTmp(url, slug);
      const fileName = `${slug}.jpg`;

      const [uploaded] = await uploadService.upload({
        data: {
          fileInfo: {
            name: fileName,
            alternativeText: alt,
            caption: '',
          },
        },
        files: {
          name: fileName,
          type,
          size,
          path,
        },
      });

      await strapi.documents('api::product.product').update({
        documentId: product.documentId,
        data: { images: [uploaded.id] },
        status: 'published',
      });

      console.log(`  ✅ Image seeded: "${slug}"`);
    } catch (err) {
      console.warn(`  ⚠ Failed for "${slug}":`, (err as Error).message);
    }
  }

  console.log('🌱 Product images done.');
}
