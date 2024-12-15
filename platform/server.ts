import { createRequestHandler } from '@remix-run/cloudflare';
import type { ServerBuild, EntryContext } from '@remix-run/cloudflare';
import * as build from 'build/server';

export default {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async fetch(request: Request, env: Env, ctx: EntryContext) {
    try {
      const handler = createRequestHandler(build as unknown as ServerBuild);
      return await handler(request, { env });
    } catch (error) {
      console.error(error);
      return new Response('Internal Error', { status: 500 });
    }
  },
};
