import type { Core } from '@strapi/strapi';
import { seedCategories } from './categories';
import { seedProducts } from './products';

export async function runSeed(strapi: Core.Strapi) {
  await seedCategories(strapi);
  await seedProducts(strapi);
}
