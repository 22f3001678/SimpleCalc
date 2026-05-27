import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeToggle } from '../components/ThemeToggle.jsx';

describe('ThemeToggle component', () => {
  it('renders light mode button when current theme is dark', () => {
    const onToggle = vi.fn();
    render(<ThemeToggle theme="dark" onToggle={onToggle} />);

    const button = screen.getByRole('button', { name: 'Switch to light theme' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Light mode');

    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders dark mode button when current theme is light', () => {
    const onToggle = vi.fn();
    render(<ThemeToggle theme="light" onToggle={onToggle} />);

    const button = screen.getByRole('button', { name: 'Switch to dark theme' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Dark mode');

    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
