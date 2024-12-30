import { createRequestHandler, type ServerBuild } from 'react-router';
import * as build from 'build/server';
import { getLoadContext } from './load-context';
import type { ExecutionContext } from '@cloudflare/workers-types';

/**
 * Worker entry point following Cloudflare Workers syntax.
 *
 * The `env` and `ctx` parameters are required by the Cloudflare Workers runtime,
 * even if they are not directly used in this function. Do not remove them.
 *
 * @param request - The incoming request.
 * @param env - Environment bindings (required by Worker syntax).
 * @param ctx - Execution context (required by Worker syntax).
 * @returns Promise<Response>
 */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    try {
      /**
       * @return Request handler for Cloudflare Worker proxy.
       */
      return await createRequestHandler(build as unknown as ServerBuild)(
        request,
        getLoadContext({
          request,
          context: {
            cloudflare: {
              /**
               * Match Wrangler's `getPlatformProxy` return type.
               * @see {https://developers.cloudflare.com/workers/wrangler/api/#getplatformproxy}
               */
              cf: request.cf,
              ctx: {
                waitUntil: ctx.waitUntil.bind(ctx),
                passThroughOnException: ctx.passThroughOnException.bind(ctx),
              },
              // @ts-expect-error TypeScript `CacheStorage` wonky.
              caches,
              env,
            },
          },
        }),
      );
    } catch (error) {
      console.error(error);
      return new Response('Internal Error', { status: 500 });
    }
  },
};
