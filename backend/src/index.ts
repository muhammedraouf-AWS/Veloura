import type { Core } from '@strapi/strapi';
import { runSeed } from './seed';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    if (process.env.SEED_DB === 'true') {
      await runSeed(strapi);
    }
  },
};
