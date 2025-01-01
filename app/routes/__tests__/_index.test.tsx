import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Index from '@/routes/_index';
import { BrowserRouter } from 'react-router-dom';
import type { ReactNode } from 'react';

function Wrapper({ children }: { children: ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

describe('Index route', () => {
  it('should increment counter when button is clicked', async () => {
    render(<Index />, { wrapper: Wrapper });

    const button = screen.getByRole('button', { name: /click me/i });
    const user = userEvent.setup();

    // Initial state
    expect(screen.getByText(/testing \(0 clicks\)/i)).toBeInTheDocument();

    // Click the button
    await user.click(button);

    // Check if the counter updated
    expect(
      await screen.findByText(/testing \(1 clicks\)/i),
    ).toBeInTheDocument();
  });

  it('should have error trigger button', () => {
    render(<Index />, { wrapper: Wrapper });

    expect(
      screen.getByRole('button', { name: /trigger error/i }),
    ).toBeInTheDocument();
  });
});
