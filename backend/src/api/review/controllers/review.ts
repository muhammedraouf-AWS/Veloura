import { factories } from '@strapi/strapi';
import type { Core } from '@strapi/strapi';

export default factories.createCoreController('api::review.review', ({ strapi }: { strapi: Core.Strapi }) => ({
  async create(ctx) {
    if (!ctx.state.user) return ctx.unauthorized('Authentication required.');

    const { data } = ctx.request.body as { data: Record<string, unknown> };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const review = await (strapi.documents('api::review.review') as any).create({
      data: {
        ...data,
        user: ctx.state.user.id,
        isApproved: false,
        isVerified: false,
      },
    });

    return { data: review };
  },
}));
