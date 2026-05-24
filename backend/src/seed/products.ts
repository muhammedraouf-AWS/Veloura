import type { Core } from '@strapi/strapi';

const products = [
  // ── Women's Fragrances ─────────────────────────────────────────────────────
  {
    category: 'womens-fragrances',
    title: 'Rose Éternelle',
    slug: 'rose-eternelle',
    shortDescription: 'A timeless Bulgarian rose soliflore with a velvety musk dry-down.',
    description:
      '<p>Rose Éternelle opens with a burst of fresh Bulgarian rose absolute, heart of rose centifolia and a whisper of violet leaf. The dry-down settles into warm white musk and light sandalwood — intimate, feminine, unforgettable.</p>',
    price: 149,
    compareAtPrice: 179,
    sku: 'VEL-RE-001',
    inventory: 80,
    isFeatured: true,
    isActive: true,
    tags: ['floral', 'rose', 'feminine', 'bestseller'],
    variants: [
      { name: '30 ml EDP', sku: 'VEL-RE-001-30', price: 89, inventory: 30, options: { size: '30ml', concentration: 'EDP' } },
      { name: '50 ml EDP', sku: 'VEL-RE-001-50', price: 149, inventory: 30, options: { size: '50ml', concentration: 'EDP' } },
      { name: '100 ml EDP', sku: 'VEL-RE-001-100', price: 199, inventory: 20, options: { size: '100ml', concentration: 'EDP' } },
    ],
  },
  {
    category: 'womens-fragrances',
    title: 'Iris Nocturne',
    slug: 'iris-nocturne',
    shortDescription: 'Powdery iris root wrapped in violet and warm amber — for quiet evenings.',
    description:
      '<p>Iris Nocturne is a study in elegance. Cold iris root absolute opens the composition, softened by violet petals and a heart of orris butter. The base is a warm embrace of ambergris and benzoin.</p>',
    price: 189,
    compareAtPrice: null,
    sku: 'VEL-IN-002',
    inventory: 50,
    isFeatured: true,
    isActive: true,
    tags: ['powdery', 'iris', 'feminine', 'evening'],
    variants: [
      { name: '50 ml EDP', sku: 'VEL-IN-002-50', price: 189, inventory: 25, options: { size: '50ml', concentration: 'EDP' } },
      { name: '100 ml EDP', sku: 'VEL-IN-002-100', price: 259, inventory: 25, options: { size: '100ml', concentration: 'EDP' } },
    ],
  },

  // ── Men's Fragrances ───────────────────────────────────────────────────────
  {
    category: 'mens-fragrances',
    title: 'Noir Absolu',
    slug: 'noir-absolu',
    shortDescription: 'Dark leather, vetiver, and smoked woods — commanding and modern.',
    description:
      '<p>Noir Absolu opens with black pepper and cardamom on a heart of fine leather and labdanum. The dry-down is a rich curtain of Haitian vetiver, smoked cedar, and dark patchouli.</p>',
    price: 169,
    compareAtPrice: 199,
    sku: 'VEL-NA-003',
    inventory: 60,
    isFeatured: true,
    isActive: true,
    tags: ['leather', 'woody', 'dark', 'masculine', 'bestseller'],
    variants: [
      { name: '50 ml EDP', sku: 'VEL-NA-003-50', price: 169, inventory: 30, options: { size: '50ml', concentration: 'EDP' } },
      { name: '100 ml EDP', sku: 'VEL-NA-003-100', price: 229, inventory: 30, options: { size: '100ml', concentration: 'EDP' } },
    ],
  },
  {
    category: 'mens-fragrances',
    title: 'Cèdre Blanc',
    slug: 'cedre-blanc',
    shortDescription: 'Clean white cedar and crisp marine air — effortless daytime sophistication.',
    description:
      '<p>Cèdre Blanc is built around Atlas cedar and white woods brightened by bergamot and sea salt. A minimal, precise fragrance for the man who needs nothing more.</p>',
    price: 139,
    compareAtPrice: null,
    sku: 'VEL-CB-004',
    inventory: 70,
    isFeatured: false,
    isActive: true,
    tags: ['woody', 'fresh', 'cedar', 'masculine'],
    variants: [
      { name: '50 ml EDT', sku: 'VEL-CB-004-50', price: 139, inventory: 40, options: { size: '50ml', concentration: 'EDT' } },
      { name: '100 ml EDT', sku: 'VEL-CB-004-100', price: 189, inventory: 30, options: { size: '100ml', concentration: 'EDT' } },
    ],
  },

  // ── Unisex ─────────────────────────────────────────────────────────────────
  {
    category: 'unisex',
    title: 'Sable Doré',
    slug: 'sable-dore',
    shortDescription: 'Sun-warmed skin, golden musks, and a trail of soft vanilla — completely addictive.',
    description:
      '<p>Sable Doré is the warmth of sand after sunset. Tonka bean and heliotrope open the fragrance; the heart is sandalwood and skin musks; vanilla bourbon and benzoin close it in effortless sensuality.</p>',
    price: 159,
    compareAtPrice: 189,
    sku: 'VEL-SD-005',
    inventory: 90,
    isFeatured: true,
    isActive: true,
    tags: ['musk', 'vanilla', 'warm', 'unisex', 'bestseller'],
    variants: [
      { name: '30 ml EDP', sku: 'VEL-SD-005-30', price: 99, inventory: 30, options: { size: '30ml', concentration: 'EDP' } },
      { name: '50 ml EDP', sku: 'VEL-SD-005-50', price: 159, inventory: 35, options: { size: '50ml', concentration: 'EDP' } },
      { name: '100 ml EDP', sku: 'VEL-SD-005-100', price: 219, inventory: 25, options: { size: '100ml', concentration: 'EDP' } },
    ],
  },
  {
    category: 'unisex',
    title: 'Thé Vert Céleste',
    slug: 'the-vert-celeste',
    shortDescription: 'Japanese green tea, yuzu, and white peony — light and luminous.',
    description:
      '<p>A morning-in-a-bottle. Green tea absolute leads, sharpened by yuzu and grapefruit. White peony and jasmine sambac soften the heart; clean musks and a whisper of driftwood close the composition.</p>',
    price: 129,
    compareAtPrice: null,
    sku: 'VEL-TVC-006',
    inventory: 100,
    isFeatured: false,
    isActive: true,
    tags: ['fresh', 'green', 'tea', 'unisex', 'light'],
    variants: [
      { name: '50 ml EDT', sku: 'VEL-TVC-006-50', price: 129, inventory: 50, options: { size: '50ml', concentration: 'EDT' } },
      { name: '100 ml EDT', sku: 'VEL-TVC-006-100', price: 179, inventory: 50, options: { size: '100ml', concentration: 'EDT' } },
    ],
  },

  // ── Oud & Oriental ─────────────────────────────────────────────────────────
  {
    category: 'oud-oriental',
    title: 'Oud Majestique',
    slug: 'oud-majestique',
    shortDescription: 'Authentic Hindi oud with rose attar and saffron — a royal composition.',
    description:
      '<p>Oud Majestique is built around rare Hindi oud oil aged for fifteen years. Rose de Taif attar and saffron absolute deepen the opening; the dry-down is all incense, castoreum, and labdanum resin.</p>',
    price: 349,
    compareAtPrice: 399,
    sku: 'VEL-OM-007',
    inventory: 30,
    isFeatured: true,
    isActive: true,
    tags: ['oud', 'oriental', 'rose', 'saffron', 'luxury'],
    variants: [
      { name: '50 ml EDP', sku: 'VEL-OM-007-50', price: 349, inventory: 15, options: { size: '50ml', concentration: 'EDP' } },
      { name: '100 ml EDP', sku: 'VEL-OM-007-100', price: 499, inventory: 15, options: { size: '100ml', concentration: 'EDP' } },
    ],
  },
  {
    category: 'oud-oriental',
    title: 'Ambre Persan',
    slug: 'ambre-persan',
    shortDescription: 'Persian amber, benzoin, and warm spices — enveloping and opulent.',
    description:
      '<p>Ambre Persan begins with cinnamon bark and clove, moves through a rich amber accord made from benzoin, labdanum, and styrax, and finishes with dark vanilla and frankincense smoke.</p>',
    price: 219,
    compareAtPrice: null,
    sku: 'VEL-AP-008',
    inventory: 45,
    isFeatured: false,
    isActive: true,
    tags: ['amber', 'oriental', 'spicy', 'warm'],
    variants: [
      { name: '50 ml EDP', sku: 'VEL-AP-008-50', price: 219, inventory: 25, options: { size: '50ml', concentration: 'EDP' } },
      { name: '100 ml EDP', sku: 'VEL-AP-008-100', price: 299, inventory: 20, options: { size: '100ml', concentration: 'EDP' } },
    ],
  },

  // ── Fresh & Citrus ─────────────────────────────────────────────────────────
  {
    category: 'fresh-citrus',
    title: 'Amalfi Lumière',
    slug: 'amalfi-lumiere',
    shortDescription: 'Sicilian lemon, sea spray, and neroli — Mediterranean light in a bottle.',
    description:
      '<p>Amalfi Lumière captures the golden light of the Italian coast. Sicilian bergamot and lemon open bright and sharp; neroli and petitgrain add floral depth; driftwood and salt musks anchor the composition.</p>',
    price: 119,
    compareAtPrice: 139,
    sku: 'VEL-AL-009',
    inventory: 120,
    isFeatured: false,
    isActive: true,
    tags: ['citrus', 'fresh', 'marine', 'summer'],
    variants: [
      { name: '50 ml EDT', sku: 'VEL-AL-009-50', price: 119, inventory: 60, options: { size: '50ml', concentration: 'EDT' } },
      { name: '100 ml EDT', sku: 'VEL-AL-009-100', price: 159, inventory: 60, options: { size: '100ml', concentration: 'EDT' } },
    ],
  },

  // ── Floral ─────────────────────────────────────────────────────────────────
  {
    category: 'floral',
    title: 'Pivoine Sauvage',
    slug: 'pivoine-sauvage',
    shortDescription: 'Wild peony in full bloom — lush, dewy, and effortlessly romantic.',
    description:
      '<p>Pivoine Sauvage opens with crushed peony petals and wet green leaves. The heart unfolds into rose de mai and magnolia; the base is light musk and cedarwood, keeping everything airy and feminine.</p>',
    price: 135,
    compareAtPrice: null,
    sku: 'VEL-PS-010',
    inventory: 75,
    isFeatured: false,
    isActive: true,
    tags: ['floral', 'peony', 'feminine', 'romantic'],
    variants: [
      { name: '50 ml EDP', sku: 'VEL-PS-010-50', price: 135, inventory: 40, options: { size: '50ml', concentration: 'EDP' } },
      { name: '100 ml EDP', sku: 'VEL-PS-010-100', price: 185, inventory: 35, options: { size: '100ml', concentration: 'EDP' } },
    ],
  },

  // ── Woody & Earthy ─────────────────────────────────────────────────────────
  {
    category: 'woody-earthy',
    title: 'Vétiver Terreux',
    slug: 'vetiver-terreux',
    shortDescription: 'Raw Haitian vetiver, damp earth, and smoky guaiac wood — rooted and primal.',
    description:
      '<p>Vétiver Terreux is an uncompromising exploration of the earth. Haitian vetiver absolute anchors the composition; oakmoss and violet leaf add a forest floor facet; guaiac wood and birch tar close with quiet smoke.</p>',
    price: 155,
    compareAtPrice: null,
    sku: 'VEL-VT-011',
    inventory: 55,
    isFeatured: false,
    isActive: true,
    tags: ['woody', 'vetiver', 'earthy', 'unisex'],
    variants: [
      { name: '50 ml EDP', sku: 'VEL-VT-011-50', price: 155, inventory: 30, options: { size: '50ml', concentration: 'EDP' } },
      { name: '100 ml EDP', sku: 'VEL-VT-011-100', price: 215, inventory: 25, options: { size: '100ml', concentration: 'EDP' } },
    ],
  },
];

export async function seedProducts(strapi: Core.Strapi) {
  console.log('🌱 Seeding products...');

  for (const p of products) {
    const existing = await strapi.documents('api::product.product').findFirst({
      filters: { slug: p.slug },
    });

    if (existing) {
      console.log(`  ↩ Skipped: "${p.title}" already exists`);
      continue;
    }

    // Resolve category documentId
    const category = await strapi.documents('api::category.category').findFirst({
      filters: { slug: p.category },
    });

    if (!category) {
      console.warn(`  ⚠ Category "${p.category}" not found — skipping "${p.title}"`);
      continue;
    }

    const { variants, category: _cat, ...productData } = p;

    const created = await strapi.documents('api::product.product').create({
      data: {
        ...productData,
        category: category.documentId,
      },
      status: 'published',
    });

    // Create variants
    for (const v of variants) {
      await strapi.documents('api::product-variant.product-variant').create({
        data: {
          ...v,
          product: created.documentId,
        },
      });
    }

    console.log(`  ✅ Created: "${p.title}" with ${variants.length} variant(s)`);
  }

  console.log('🌱 Products seeded.');
}
