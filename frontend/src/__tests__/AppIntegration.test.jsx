import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App.jsx';
import { ThemeProvider } from '../context/ThemeContext.jsx';

vi.mock('../utils/api.js', () => ({
  calculateExpression: vi.fn(),
}));
import * as api from '../utils/api.js';

describe('App integration tests', () => {
  beforeEach(() => {
    api.calculateExpression.mockReset();
    window.matchMedia = window.matchMedia || vi.fn(() => ({
      matches: false,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));
  });

  it('lets the user build an expression and evaluate it through the API', async () => {
    api.calculateExpression.mockResolvedValue({ result: 4 });

    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));

    await waitFor(() => expect(api.calculateExpression).toHaveBeenCalledWith('2+2', 'radians'));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('4'));
  });
});
