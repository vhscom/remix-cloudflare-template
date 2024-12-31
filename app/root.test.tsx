import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import {
  RouterProvider,
  createMemoryRouter,
  MemoryRouter,
  type LoaderFunctionArgs,
} from 'react-router';
import App, { loader } from './root';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLoaderData: () => ({ isBot: false }),
  };
});

vi.mock('@/platform/bot', () => ({
  BotHandler: vi.fn().mockImplementation(() => ({
    handleRequest: vi.fn().mockResolvedValue({
      isBot: false,
      botName: null,
      simplifiedContent: false,
      cacheControl: 'no-store',
    }),
  })),
}));

describe('App', () => {
  it('renders with createMemoryRouter', () => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: <App />,
        loader,
      },
    ]);

    const { container } = render(<RouterProvider router={router} />);
    const htmlElement = container.closest('html');
    expect(htmlElement).toHaveAttribute('lang', 'en');

    expect(document.querySelector('meta[charset="utf-8"]')).toBeInTheDocument();
    expect(document.querySelector('meta[name="viewport"]')).toBeInTheDocument();
  });

  it('renders with MemoryRouter', () => {
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    const htmlElement = container.closest('html');
    expect(htmlElement).toHaveAttribute('lang', 'en');

    expect(document.querySelector('meta[charset="utf-8"]')).toBeInTheDocument();
    expect(document.querySelector('meta[name="viewport"]')).toBeInTheDocument();
  });

  describe('loader', () => {
    it('handles bot detection', async () => {
      const request = new Request('https://example.com');
      const response = await loader({ request } as LoaderFunctionArgs);

      expect(response.data).toMatchObject({
        isBot: false,
        headers: expect.any(Headers),
      });

      const headers = response.data.headers;
      expect(headers.get('Cache-Control')).toBe('no-store');
    });
  });
});
