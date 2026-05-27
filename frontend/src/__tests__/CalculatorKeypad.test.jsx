import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CalculatorKeypad } from '../components/CalculatorKeypad.jsx';
import { keypadGroups } from '../utils/keypad.js';

describe('CalculatorKeypad component', () => {
  it('renders every button group and button', () => {
    render(<CalculatorKeypad onButtonClick={vi.fn()} />);

    keypadGroups.forEach((group) => {
      expect(screen.getByText(group.title)).toBeInTheDocument();
      group.buttons.forEach((button) => {
        expect(screen.getByRole('button', { name: button.label })).toBeInTheDocument();
      });
    });
  });

  it('calls onButtonClick when a keypad button is pressed', () => {
    const onButtonClick = vi.fn();
    render(<CalculatorKeypad onButtonClick={onButtonClick} />);

    fireEvent.click(screen.getByRole('button', { name: '7' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));

    expect(onButtonClick).toHaveBeenCalledTimes(3);
    expect(onButtonClick).toHaveBeenCalledWith('7');
    expect(onButtonClick).toHaveBeenCalledWith('+');
    expect(onButtonClick).toHaveBeenCalledWith('3');
  });
});
