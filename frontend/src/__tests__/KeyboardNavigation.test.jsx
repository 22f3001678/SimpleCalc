import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../utils/api.js', () => ({
  calculateExpression: vi.fn(),
}));
import * as api from '../utils/api.js';
import App from '../App.jsx';
import { ThemeProvider } from '../context/ThemeContext.jsx';

function renderApp() {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>,
  );
}

describe('Keyboard navigation', () => {
  beforeEach(() => {
    api.calculateExpression.mockReset();
    window.matchMedia = window.matchMedia || vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));
  });

  it('supports keyboard-only entry and evaluation using Enter', async () => {
    api.calculateExpression.mockResolvedValue({ result: 3 });

    renderApp();

    fireEvent.keyDown(window, { key: '1', code: 'Digit1' });
    fireEvent.keyDown(window, { key: '+', code: 'Equal' });
    fireEvent.keyDown(window, { key: '2', code: 'Digit2' });
    fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });

    await waitFor(() => expect(api.calculateExpression).toHaveBeenCalledWith('1+2', 'radians'));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('3'));
    expect(screen.getByDisplayValue('1+2')).toBeInTheDocument();
  });

  it('allows keyboard navigation in history with arrow keys and Enter', async () => {
    api.calculateExpression.mockResolvedValue({ result: 4 });

    renderApp();

    fireEvent.keyDown(window, { key: '2', code: 'Digit2' });
    fireEvent.keyDown(window, { key: '*', code: 'asterisk' });
    fireEvent.keyDown(window, { key: '2', code: 'Digit2' });
    fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('4'));

    const historyHeading = screen.getByText('Recent calculations');
    const historyPanel = historyHeading.closest('div[tabindex="0"]');
    expect(historyPanel).toBeTruthy();

    fireEvent.focus(historyPanel);
    fireEvent.keyDown(historyPanel, { key: 'ArrowDown' });
    fireEvent.keyDown(historyPanel, { key: 'Enter' });

    await waitFor(() => expect(screen.getByDisplayValue('2*2')).toBeInTheDocument());
  });
});
