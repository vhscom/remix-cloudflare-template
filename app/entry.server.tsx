import type { AppLoadContext, EntryContext } from '@remix-run/cloudflare';
import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import { init as initLD } from '@launchdarkly/cloudflare-server-sdk';
import type { KVNamespace as CloudflareKV } from '@cloudflare/workers-types';

const ABORT_DELAY = 5000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext,
) {
  const env = loadContext.env as Env;
  const ldClient = initLD(env.LD_CLIENT_SIDE_ID, env.LD_KV as CloudflareKV, {
    sendEvents: true,
  });
  await ldClient.waitForInitialization();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ABORT_DELAY);

  const body = await renderToReadableStream(
    <RemixServer
      context={remixContext}
      url={request.url}
      abortDelay={ABORT_DELAY}
    />,
    {
      signal: controller.signal,
      onError(error: unknown) {
        if (!controller.signal.aborted) {
          console.error(error);
        }
        responseStatusCode = 500;
      },
    },
  );

  body.allReady.then(() => {
    clearTimeout(timeoutId);
    // Gotcha: you must call flush otherwise events will not be sent to LD servers
    // due to the ephemeral nature of edge workers.
    // https://developers.cloudflare.com/workers/runtime-apis/context/#waituntil
    ldClient.flush().then(() => ldClient.close());
  });

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
