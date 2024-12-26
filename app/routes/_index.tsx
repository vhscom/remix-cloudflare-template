import { useState } from 'react';
import { useLoaderData } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import type { LDClient } from '@launchdarkly/cloudflare-server-sdk';
import { KVNamespace } from '@cloudflare/workers-types';

type LoaderContext = {
  ldClient: LDClient;
  env: {
    LD_KV: KVNamespace;
  } & Env;
};

export async function loader({ context }: LoaderFunctionArgs) {
  const { ldClient } = context as unknown as LoaderContext;

  const buttonText = await ldClient.variation(
    'button-text',
    { key: 'anonymous' },
    'Click away',
  );

  return { buttonText };
}

export default function Index() {
  const { buttonText } = useLoaderData<typeof loader>();
  const [clicks, setClicks] = useState(0);

  return (
    <div className="m-2">
      <p>Testing ({clicks} clicks)</p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-2 py-2 px-4 rounded"
        onClick={() => setClicks((n) => n + 1)}
      >
        {buttonText}
      </button>
    </div>
  );
}
