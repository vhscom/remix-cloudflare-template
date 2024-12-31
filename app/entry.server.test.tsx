import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderToReadableStream } from 'react-dom/server';
import type { EntryContext } from 'react-router';
import { isbot } from 'isbot';
import { cleanup } from '@testing-library/react';
import type { GetLoadContextArgs } from '@/platform/load-context';
import type { CacheStorage } from '@cloudflare/workers-types';
import handleRequest from './entry.server';

// Silence console.error in tests
const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

vi.mock('isbot', () => ({
  isbot: vi.fn(),
}));

vi.mock('react-router', () => ({
  ServerRouter: vi.fn(() => null),
}));

// Create a base mock stream factory
const createMockStream = () => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('test'));
      controller.close();
    },
  });

  return Object.assign(stream, {
    allReady: Promise.resolve(),
  });
};

vi.mock('react-dom/server', () => ({
  renderToReadableStream: vi
    .fn()
    .mockImplementation(async () => createMockStream()),
}));

describe('handleRequest', () => {
  const mockRequest = new Request('https://example.com');
  const mockHeaders = new Headers();
  const mockContext = {} as EntryContext;

  const mockLoadContext = {
    cloudflare: {
      env: {} as Record<string, unknown>,
      caches: {} as CacheStorage,
      cf: undefined,
    },
  } as unknown as GetLoadContextArgs['context'];

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(renderToReadableStream).mockImplementation(async () =>
      createMockStream(),
    );
  });

  afterEach(() => {
    cleanup();
    consoleSpy.mockReset();
  });

  it('sets content type header correctly', async () => {
    const headers = new Headers();
    await handleRequest(
      mockRequest,
      200,
      headers,
      mockContext,
      mockLoadContext,
    );

    expect(headers.get('Content-Type')).toBe('text/html');
  });

  it('handles missing user-agent gracefully', async () => {
    const requestWithoutUA = new Request('https://example.com');
    vi.mocked(isbot).mockReturnValue(false);

    await handleRequest(
      requestWithoutUA,
      200,
      mockHeaders,
      mockContext,
      mockLoadContext,
    );

    expect(isbot).toHaveBeenCalledWith('');
  });

  it('handles render errors by setting 500 status', async () => {
    const error = new Error('Render error');

    vi.mocked(renderToReadableStream).mockImplementationOnce(
      async (_, options) => {
        if (options?.onError) {
          options.onError(error, {
            componentStack: '',
          });
        }
        return createMockStream();
      },
    );

    const response = await handleRequest(
      mockRequest,
      200,
      mockHeaders,
      mockContext,
      mockLoadContext,
    );

    expect(response.status).toBe(500);
    expect(consoleSpy).toHaveBeenCalledWith(error);
  });

  it('respects provided status code when no errors occur', async () => {
    const response = await handleRequest(
      mockRequest,
      404,
      mockHeaders,
      mockContext,
      mockLoadContext,
    );

    expect(response.status).toBe(404);
  });
});
