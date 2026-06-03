import { factories } from '@strapi/strapi';
import type { Core } from '@strapi/strapi';

export default factories.createCoreController('api::order.order', ({ strapi }: { strapi: Core.Strapi }) => ({
  async create(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Authentication required.');
    }

    const { data } = ctx.request.body as { data: Record<string, unknown> };

    // Use Document Service directly — bypasses API sanitization that strips
    // plugin::users-permissions.user relations from the request body.
    // Data shape is already Zod-validated in the placeOrderAction Server Action.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const order = await (strapi.documents('api::order.order') as any).create({
      data: { ...data, user: ctx.state.user.id },
    });

    return { data: order };
  },
}));
