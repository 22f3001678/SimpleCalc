import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CalculatorDisplay } from '../components/CalculatorDisplay.jsx';

describe('CalculatorDisplay component', () => {
  it('renders default placeholder text when expression and result are empty', () => {
    render(<CalculatorDisplay expression="" result={null} error="" loading={false} />);

    expect(screen.getByText('Enter your expression')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('—');
    expect(screen.getByText('Ready for input')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveAttribute('aria-busy', 'false');
    expect(screen.getByText('Calculator expression results and current status messages.')).toBeInTheDocument();
  });

  it('renders result and expression when provided', () => {
    render(<CalculatorDisplay expression="2+2" result={4} error="" loading={false} />);

    expect(screen.getByText('2+2')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('4');
    expect(screen.getByText('Ready for input')).toBeInTheDocument();
  });

  it('shows loading state when loading is true', () => {
    render(<CalculatorDisplay expression="5*5" result={null} error="" loading={true} />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading…');
    expect(screen.getByText('Evaluating expression')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveAttribute('aria-busy', 'true');
  });

  it('renders error status when error is present', () => {
    render(<CalculatorDisplay expression="5/0" result={null} error="Division by zero" loading={false} />);

    expect(screen.getByRole('status')).toHaveTextContent('—');
    expect(screen.getByText('Division by zero')).toBeInTheDocument();
    const statusElement = screen.getByText('Division by zero');
    expect(statusElement).toHaveClass('text-rose-300');
  });
});
