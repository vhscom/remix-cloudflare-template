import type { PlatformProxy } from 'wrangler';
import type {
  IncomingRequestCfProperties,
  CacheStorage,
} from '@cloudflare/workers-types';

type GetLoadContextArgs = {
  request: Request;
  context: {
    cloudflare: Omit<
      PlatformProxy<Env, IncomingRequestCfProperties>,
      'dispose' | 'caches' | 'cf'
    > & {
      caches:
        | PlatformProxy<Env, IncomingRequestCfProperties>['caches']
        | CacheStorage;
      cf: Request['cf'];
    };
  };
};

declare module 'react-router' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AppLoadContext extends ReturnType<typeof getLoadContext> {
    // Merge result of `getLoadContext` into `AppLoadContext`
  }
}

export function getLoadContext({ context }: GetLoadContextArgs) {
  return context;
}
