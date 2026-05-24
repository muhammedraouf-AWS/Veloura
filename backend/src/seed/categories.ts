import type { Core } from '@strapi/strapi';

const categories = [
  {
    name: "Women's Fragrances",
    slug: 'womens-fragrances',
    description: 'Elegant, feminine scents ranging from delicate florals to rich orientals.',
  },
  {
    name: "Men's Fragrances",
    slug: 'mens-fragrances',
    description: 'Bold and refined fragrances crafted for the modern man.',
  },
  {
    name: 'Unisex',
    slug: 'unisex',
    description: 'Boundary-free fragrances that belong to everyone.',
  },
  {
    name: 'Oud & Oriental',
    slug: 'oud-oriental',
    description: 'Rich, resinous, and deeply complex scents rooted in Middle Eastern tradition.',
  },
  {
    name: 'Fresh & Citrus',
    slug: 'fresh-citrus',
    description: 'Light, energising fragrances built on zesty citrus and aquatic notes.',
  },
  {
    name: 'Floral',
    slug: 'floral',
    description: 'The timeless beauty of flowers — from single-note roses to lush bouquets.',
  },
  {
    name: 'Woody & Earthy',
    slug: 'woody-earthy',
    description: 'Grounding, warm fragrances anchored in sandalwood, cedar, and vetiver.',
  },
  {
    name: 'Gift Sets',
    slug: 'gift-sets',
    description: 'Curated collections and travel sets — the perfect fragrance gift.',
  },
];

export async function seedCategories(strapi: Core.Strapi) {
  console.log('🌱 Seeding categories...');

  for (const cat of categories) {
    const existing = await strapi.documents('api::category.category').findFirst({
      filters: { slug: cat.slug },
    });

    if (existing) {
      console.log(`  ↩ Skipped: "${cat.name}" already exists`);
      continue;
    }

    await strapi.documents('api::category.category').create({
      data: cat,
      status: 'published',
    });

    console.log(`  ✅ Created: "${cat.name}"`);
  }

  console.log('🌱 Categories seeded.');
}
