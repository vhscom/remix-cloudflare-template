import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import Index from '@/routes/_index';

describe('Index route', () => {
  it('should increment counter when button is clicked', async () => {
    render(<Index />);

    const button = screen.getByRole('button', { name: /click me/i });
    const user = userEvent.setup();

    // Initial state
    expect(screen.getByText(/testing \(0 clicks\)/i)).toBeInTheDocument();

    // Click the button
    await user.click(button);

    // Check if the counter updated (use findByText for async behavior)
    expect(
      await screen.findByText(/testing \(1 clicks\)/i),
    ).toBeInTheDocument();
  });
});
