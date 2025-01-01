import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './error-boundary';
import { BrowserRouter } from 'react-router-dom';
import type { ReactNode, ReactElement } from 'react';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useRouteError: () => null,
  };
});

function Wrapper({ children }: { children: ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

function ThrowError(): ReactElement {
  throw new Error('Test error');
}

describe('ErrorBoundary', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>,
      { wrapper: Wrapper },
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error page when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
      { wrapper: Wrapper },
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('catches runtime errors in children', () => {
    const Child = () => {
      throw new Error('Runtime error');
    };

    render(
      <ErrorBoundary>
        <Child />
      </ErrorBoundary>,
      { wrapper: Wrapper },
    );

    expect(screen.getByText('Runtime error')).toBeInTheDocument();
  });
});
