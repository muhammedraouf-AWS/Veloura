import { factories } from '@strapi/strapi';
import type { Core } from '@strapi/strapi';

export default factories.createCoreController('api::order.order', ({ strapi }: { strapi: Core.Strapi }) => ({

  // create — injects user from JWT context (API layer strips users-permissions relations)
  async create(ctx) {
    if (!ctx.state.user) return ctx.unauthorized('Authentication required.');

    const { data } = ctx.request.body as { data: Record<string, unknown> };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const order = await (strapi.documents('api::order.order') as any).create({
      data: { ...data, user: ctx.state.user.id },
    });

    return { data: order };
  },

  // find — always scopes to authenticated user (API layer strips user relation filters)
  async find(ctx) {
    if (!ctx.state.user) return ctx.unauthorized('Authentication required.');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryFilters = (ctx.query?.filters ?? {}) as Record<string, any>;
    const filters: Record<string, unknown> = {
      user: { id: ctx.state.user.id },
    };

    // Allow orderNumber filter so the detail page lookup works through the same endpoint
    if (queryFilters['orderNumber']) {
      filters['orderNumber'] = queryFilters['orderNumber'];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orders = await (strapi.documents('api::order.order') as any).findMany({
      filters,
      sort: ['createdAt:desc'],
      populate: {
        items: {
          fields: ['id', 'quantity', 'unitPrice', 'totalPrice', 'productSnapshot'],
        },
      },
    });

    return { data: orders };
  },

}));
