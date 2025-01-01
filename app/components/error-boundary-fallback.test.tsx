import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundaryFallback } from './error-boundary-fallback';
import { BrowserRouter, useRouteError } from 'react-router-dom';
import type { ReactNode } from 'react';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useRouteError: vi.fn(),
  };
});

function Wrapper({ children }: { children: ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

describe('ErrorBoundaryFallback', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.mocked(useRouteError).mockReset();
  });

  it('renders error message from props', () => {
    const testError = new Error('Test error message');
    render(<ErrorBoundaryFallback error={testError} />, { wrapper: Wrapper });
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('shows default error message when no error provided', () => {
    render(<ErrorBoundaryFallback />, { wrapper: Wrapper });
    expect(
      screen.getByText('An unexpected error occurred'),
    ).toBeInTheDocument();
  });

  it('navigates back when Go Back button is clicked', async () => {
    const user = userEvent.setup();
    render(<ErrorBoundaryFallback />, { wrapper: Wrapper });

    await user.click(screen.getByText('Go Back'));
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('shows and hides error details modal', async () => {
    const user = userEvent.setup();
    const testError = new Error('Test error');
    testError.stack = 'Error stack trace';

    render(<ErrorBoundaryFallback error={testError} />, { wrapper: Wrapper });

    await user.click(screen.getByText('View Details'));
    expect(screen.getByText('Error Details')).toBeInTheDocument();
    expect(screen.getByText('Error stack trace')).toBeInTheDocument();

    await user.click(screen.getByText('Close'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('handles route errors correctly', () => {
    vi.mocked(useRouteError).mockReturnValue({
      status: 404,
      statusText: 'Not Found',
      data: { message: 'Page not found' },
      internal: true,
      error: new Error('Page not found'),
    });

    render(<ErrorBoundaryFallback />, { wrapper: Wrapper });
    expect(screen.getByText('404 - Not Found')).toBeInTheDocument();
  });
});
