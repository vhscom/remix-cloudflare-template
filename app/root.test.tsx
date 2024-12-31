import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { RouterProvider } from 'react-router/dom';
import { createMemoryRouter, MemoryRouter } from 'react-router';
import App from './root';

describe('App', () => {
  it('renders with createMemoryRouter', () => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: <App />,
      },
    ]);

    const { container } = render(<RouterProvider router={router} />);
    const htmlElement = container.closest('html');
    expect(htmlElement).toHaveAttribute('lang', 'en');

    expect(document.querySelector('meta[charset="utf-8"]')).toBeInTheDocument();
    expect(document.querySelector('meta[name="viewport"]')).toBeInTheDocument();
  });

  // Example of simpler MemoryRouter approach
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
});
