import { useState } from 'react';

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
