import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from '../App.jsx';

function createMatchMedia() {
  return () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  });
}

describe('Responsive design', () => {
  beforeEach(() => {
    window.matchMedia = window.matchMedia || createMatchMedia();
  });

  it('prevents horizontal scrolling with an overflow-hidden root wrapper', () => {
    render(<App />);
    expect(screen.getByTestId('app-root')).toHaveClass('overflow-x-hidden');
  });

  it('uses responsive grid layout classes for portrait and landscape-friendly views', () => {
    render(<App />);
    const mainElement = screen.getByTestId('app-main');
    expect(mainElement).toHaveClass('grid', 'gap-6', 'xl:grid-cols-[1.5fr_0.95fr]');
  });

  it('renders cleanly in a mobile viewport simulation', () => {
    window.innerWidth = 375;
    window.innerHeight = 812;
    window.dispatchEvent(new Event('resize'));

    render(<App />);
    expect(screen.getByTestId('app-root')).toBeInTheDocument();
    expect(screen.getByTestId('app-main')).toBeInTheDocument();
  });
});
