import { type PlatformProxy } from 'wrangler';
import type { KVNamespace as CloudflareKV } from '@cloudflare/workers-types';
import {
  init as initLD,
  type LDClient,
} from '@launchdarkly/cloudflare-server-sdk';
import { BasicLogger } from '@launchdarkly/js-sdk-common';

type GetLoadContextArgs = {
  request: Request;
  context: {
    cloudflare: Omit<PlatformProxy<Env>, 'dispose' | 'caches' | 'cf'> & {
      caches: PlatformProxy<Env>['caches'] | CacheStorage;
      cf: Request['cf'];
    };
    ldClient?: LDClient;
  };
};

declare module '@remix-run/cloudflare' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AppLoadContext extends ReturnType<typeof getLoadContext> {
    // This will merge the result of `getLoadContext` into the `AppLoadContext`
  }
}

export async function getLoadContext({ context }: GetLoadContextArgs) {
  const env = context.cloudflare.env;
  const ldClient = initLD(env.LD_CLIENT_SIDE_ID, env.LD_KV as CloudflareKV, {
    sendEvents: true,
    logger: new BasicLogger({ level: 'debug' }),
  });
  await ldClient.waitForInitialization();

  return {
    env,
    cf: context.cloudflare.cf,
    ctx: context.cloudflare.ctx,
    cache: context.cloudflare.caches,
    ldClient,
  };
}
