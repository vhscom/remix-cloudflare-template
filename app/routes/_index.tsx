import { useState } from 'react';
import type { MetaFunction } from 'react-router';
import { Button } from 'react-aria-components';

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix Cloudflare Template' },
    { name: 'description', content: 'This is an application template.' },
  ];
};

export default function Index() {
  const [clicks, setClicks] = useState(0);
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error('This is a test error from the index route');
  }

  return (
    <div className="p-3 dark:bg-gray-900 dark:text-white min-h-screen">
      <p>Testing ({clicks} clicks)</p>
      <div className="mt-2 space-x-2">
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
          onClick={() => setClicks((n) => n + 1)}
        >
          Click me
        </button>
        <Button
          onPress={() => setShouldError(true)}
          className="bg-red-500 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
        >
          Trigger Error
        </Button>
      </div>
    </div>
  );
}
