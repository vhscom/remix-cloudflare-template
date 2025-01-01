import { useState, type ReactElement } from 'react';
import { Button } from 'react-aria-components';

function BrokenRender(): ReactElement {
  throw new Error('This component intentionally failed during render');
}

function BrokenEffect(): ReactElement {
  useState(() => {
    throw new Error('This effect intentionally threw an error');
  });
  return <div>You should never see this</div>;
}

function BrokenEventHandler(): ReactElement {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Error from event handler (caught by boundary)');
  }

  return (
    <Button
      onPress={() => setShouldThrow(true)}
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      Click to throw caught error
    </Button>
  );
}

function AsyncError(): ReactElement {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Error from async operation (caught by boundary)');
  }

  return (
    <Button
      onPress={async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setShouldThrow(true);
      }}
      className="px-4 py-2 bg-orange-500 text-white rounded"
    >
      Throw Caught Async Error
    </Button>
  );
}

function TypeErrorTest(): ReactElement {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    const obj = null as unknown as { nonexistentMethod(): void };
    obj.nonexistentMethod();
  }

  return (
    <Button
      onPress={() => setShouldThrow(true)}
      className="px-4 py-2 bg-purple-500 text-white rounded"
    >
      Trigger Caught TypeError
    </Button>
  );
}

export default function ErrorBoundaryTestRoute(): ReactElement {
  const [showRenderError, setShowRenderError] = useState(false);
  const [showEffectError, setShowEffectError] = useState(false);

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Error Boundary Test Page</h1>
        <p className="text-gray-600">
          All these errors will be caught by the error boundary
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Button
            onPress={() => setShowRenderError(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Trigger Render Error
          </Button>
          {showRenderError && <BrokenRender />}
        </div>

        <div>
          <Button
            onPress={() => setShowEffectError(true)}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Trigger Effect Error
          </Button>
          {showEffectError && <BrokenEffect />}
        </div>

        <div>
          <BrokenEventHandler />
        </div>

        <div>
          <AsyncError />
        </div>

        <div>
          <TypeErrorTest />
        </div>
      </div>
    </div>
  );
}
