import { useState } from 'react';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix Cloudflare Template' },
    { name: 'description', content: 'This is an application template.' },
  ];
};

export default function Index() {
  const [clicks, setClicks] = useState(0);

  return (
    <div className="m-2">
      <p>Testing ({clicks} clicks)</p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-2 py-2 px-4 rounded"
        onClick={() => setClicks((n) => n + 1)}
      >
        Click me
      </button>
    </div>
  );
}
