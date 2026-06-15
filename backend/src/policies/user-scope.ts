import type { Core } from '@strapi/strapi';

/**
 * Scopes find/findOne order queries to the authenticated user.
 * Applied to GET /api/orders and GET /api/orders/:id so that
 * a logged-in user can only ever read their own orders.
 */
const policy: Core.Policy = (policyContext, _config, _helpers) => {
  const ctx = policyContext as unknown as {
    state?: { user?: { id: number } };
    query: Record<string, unknown>;
  };

  if (ctx.state?.user) {
    ctx.query.filters = {
      ...(typeof ctx.query.filters === 'object' && ctx.query.filters !== null
        ? (ctx.query.filters as Record<string, unknown>)
        : {}),
      user: { id: ctx.state.user.id },
    };
  }

  return true;
};

export default policy;
