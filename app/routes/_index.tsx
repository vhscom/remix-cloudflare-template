import { useState } from 'react';

export default function Index() {
  const [clicks, setClicks] = useState(0);

  return (
    <div>
      <p>Testing ({clicks} clicks)</p>
      <button onClick={() => setClicks((n) => n + 1)}>Click me</button>
    </div>
  );
}
