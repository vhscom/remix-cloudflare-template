import { describe, expect, it, vi } from 'vitest';
import * as ReactDOM from 'react-dom/client';

vi.mock('react-dom/client', () => ({
  hydrateRoot: vi.fn(),
}));

vi.mock('react-router/dom', () => ({
  HydratedRouter: vi.fn(() => null),
}));

describe('entry.client', () => {
  it('should hydrate the app with HydratedRouter', async () => {
    await import('./entry.client');

    expect(ReactDOM.hydrateRoot).toHaveBeenCalledTimes(1);
    expect(ReactDOM.hydrateRoot).toHaveBeenCalledWith(
      document,
      expect.any(Object), // StrictMode wrapped HydratedRouter
    );
  });
});
