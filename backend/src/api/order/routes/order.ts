import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::order.order', {
  config: {
    find:    { policies: ['global::user-scope'] },
    findOne: { policies: ['global::user-scope'] },
  },
});
