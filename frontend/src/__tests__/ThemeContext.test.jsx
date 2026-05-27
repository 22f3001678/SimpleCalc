import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider, useTheme } from '../context/ThemeContext.jsx';

function contrastRatio(hex1, hex2) {
  const normalize = (hex) => {
    const clean = hex.replace('#', '');
    const value = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
    return [0, 2, 4].map((i) => parseInt(value.substr(i, 2), 16) / 255);
  };

  const [r1, g1, b1] = normalize(hex1).map((channel) => {
    const c = channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
    return c;
  });
  const [r2, g2, b2] = normalize(hex2).map((channel) => {
    const c = channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
    return c;
  });

  const lum1 = 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
  const lum2 = 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

function TestThemeConsumer() {
  const { theme, toggleTheme, prefersReducedMotion } = useTheme();

  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="motion">{prefersReducedMotion ? 'reduced' : 'no-preference'}</span>
      <button type="button" onClick={toggleTheme}>Toggle theme</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  const mockMatchMedia = vi.fn((query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));

  beforeEach(() => {
    window.matchMedia = mockMatchMedia;
    window.localStorage.clear();
  });

  it('defaults to light theme when system dark mode is not preferred', async () => {
    render(
      <ThemeProvider>
        <TestThemeConsumer />
      </ThemeProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('theme')).toHaveTextContent('light'));
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(window.localStorage.getItem('simplecalc_theme')).toBe(JSON.stringify('light'));
  });

  it('toggles between dark and light theme classes', async () => {
    render(
      <ThemeProvider>
        <TestThemeConsumer />
      </ThemeProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('theme')).toHaveTextContent('light'));
    fireEvent.click(screen.getByRole('button', { name: /toggle theme/i }));
    await waitFor(() => expect(screen.getByTestId('theme')).toHaveTextContent('dark'));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('detects reduced motion preference and exposes it in context', async () => {
    window.matchMedia = vi.fn((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(
      <ThemeProvider>
        <TestThemeConsumer />
      </ThemeProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('motion')).toHaveTextContent('reduced'));
  });

  it('uses a WCAG AA-compliant foreground/background palette', () => {
    expect(contrastRatio('#020617', '#f8fafc')).toBeGreaterThan(7.0);
    expect(contrastRatio('#f8fafc', '#111827')).toBeGreaterThan(7.0);
  });
});
