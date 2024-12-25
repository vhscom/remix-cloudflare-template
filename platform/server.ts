import { createRequestHandler } from '@remix-run/cloudflare';
import type { ServerBuild } from '@remix-run/cloudflare';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore This file won’t exist if it hasn’t yet been built
import * as build from 'build/server'; // eslint-disable-line import/no-unresolved
import { getLoadContext } from './load-context';
import type {
  ExecutionContext,
  ExportedHandler,
} from '@cloudflare/workers-types';

const handleRemixRequest = createRequestHandler(
  build as unknown as ServerBuild,
);

export default {
  // @ts-expect-error Expect native Request and Cloudflare to differ.
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    try {
      const loadContext = getLoadContext({
        request,
        context: {
          cloudflare: {
            // This object matches the return value from Wrangler's
            // `getPlatformProxy` used during development via Remix's
            // `cloudflareDevProxyVitePlugin`:
            // https://developers.cloudflare.com/workers/wrangler/api/#getplatformproxy
            cf: request.cf,
            ctx: {
              waitUntil: ctx.waitUntil.bind(ctx),
              passThroughOnException: ctx.passThroughOnException.bind(ctx),
            },
            caches,
            env,
          },
        },
      });
      return await handleRemixRequest(request, loadContext);
    } catch (error) {
      console.error(error);
      return new Response('Internal Error', { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;
