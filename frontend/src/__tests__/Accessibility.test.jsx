import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from '../App.jsx';
import { ThemeProvider } from '../context/ThemeContext.jsx';
import { CalculatorDisplay } from '../components/CalculatorDisplay.jsx';

beforeEach(() => {
  window.matchMedia = window.matchMedia || vi.fn(() => ({
    matches: false,
    media: '',
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }));
});

function renderApp() {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>,
  );
}

describe('Accessibility checks', () => {
  it('exposes descriptive aria labels for quick action buttons', () => {
    renderApp();

    expect(screen.getByRole('button', { name: 'Open parenthesis' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pi constant' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Square root function' })).toBeInTheDocument();
  });

  it('ensures calculator display uses aria-live, role region, and a screen-reader description', () => {
    render(
      <CalculatorDisplay expression="2+2" result={4} error="" loading={false} />,
    );

    const region = screen.getByRole('region');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveAttribute('aria-busy', 'false');
    expect(region).toHaveAttribute('aria-describedby', 'calculator-display-description');
    expect(screen.getByText('Calculator expression results and current status messages.')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('ensures history search has an accessible label', () => {
    renderApp();

    expect(screen.getByRole('searchbox', { name: 'Filter calculation history' })).toBeInTheDocument();
  });
});
