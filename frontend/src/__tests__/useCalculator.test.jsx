import React, { useEffect } from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../utils/api.js', () => ({
  calculateExpression: vi.fn(),
}));
import * as api from '../utils/api.js';
import { useCalculator } from '../hooks/useCalculator.js';

function TestCalculator({ onReady }) {
  const calculator = useCalculator();

  useEffect(() => {
    onReady(calculator);
  }, [calculator, onReady]);

  return (
    <div>
      <span data-testid="expression">{calculator.expression}</span>
      <span data-testid="result">{calculator.result === null ? 'null' : calculator.result}</span>
      <span data-testid="error">{calculator.error}</span>
      <span data-testid="loading">{calculator.loading ? 'true' : 'false'}</span>
      <span data-testid="history">{calculator.history.length}</span>
      <span data-testid="memory">{calculator.memory}</span>
      <span data-testid="angleMode">{calculator.angleMode}</span>
    </div>
  );
}

describe('useCalculator hook', () => {
  let calculator;
  const onReady = vi.fn((value) => {
    calculator = value;
  });

  beforeEach(() => {
    calculator = undefined;
    onReady.mockClear();
    api.calculateExpression.mockReset();
    window.localStorage.clear();
  });

  it('initializes with default state', async () => {
    render(<TestCalculator onReady={onReady} />);

    await waitFor(() => expect(calculator).toBeDefined());
    expect(screen.getByTestId('expression')).toHaveTextContent('');
    expect(screen.getByTestId('result')).toHaveTextContent('null');
    expect(screen.getByTestId('error')).toHaveTextContent('');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('history')).toHaveTextContent('0');
    expect(screen.getByTestId('memory')).toHaveTextContent('0');
    expect(screen.getByTestId('angleMode')).toHaveTextContent('radians');
  });

  it('updates expression and clears errors', async () => {
    render(<TestCalculator onReady={onReady} />);
    await waitFor(() => expect(calculator).toBeDefined());

    act(() => calculator.updateExpression('1+2'));
    expect(screen.getByTestId('expression')).toHaveTextContent('1+2');

    act(() => calculator.updateExpression((current) => `${current}-3`));
    expect(screen.getByTestId('expression')).toHaveTextContent('1+2-3');
  });

  it('deletes the last character and resets expression', async () => {
    render(<TestCalculator onReady={onReady} />);
    await waitFor(() => expect(calculator).toBeDefined());

    act(() => calculator.updateExpression('123')); 
    expect(screen.getByTestId('expression')).toHaveTextContent('123');

    act(() => calculator.deleteLastCharacter());
    expect(screen.getByTestId('expression')).toHaveTextContent('12');

    act(() => calculator.resetExpression());
    expect(screen.getByTestId('expression')).toHaveTextContent('');
    expect(screen.getByTestId('result')).toHaveTextContent('null');
  });

  it('toggles angle mode between degrees and radians', async () => {
    render(<TestCalculator onReady={onReady} />);
    await waitFor(() => expect(calculator).toBeDefined());

    act(() => calculator.toggleAngleMode());
    expect(screen.getByTestId('angleMode')).toHaveTextContent('degrees');

    act(() => calculator.toggleAngleMode());
    expect(screen.getByTestId('angleMode')).toHaveTextContent('radians');
  });

  it('evaluates expressions and saves history', async () => {
    api.calculateExpression.mockResolvedValue({ result: 42 });

    render(<TestCalculator onReady={onReady} />);
    await waitFor(() => expect(calculator).toBeDefined());

    act(() => calculator.updateExpression('6*7'));
    await act(async () => {
      await calculator.evaluateExpression();
    });

    await waitFor(() => expect(screen.getByTestId('result')).toHaveTextContent('42'));
    expect(screen.getByTestId('history')).toHaveTextContent('1');
    expect(JSON.parse(window.localStorage.getItem('simplecalc_history')).length).toBe(1);
  });

  it('handles memory operations after evaluation', async () => {
    api.calculateExpression.mockResolvedValue({ result: 10 });

    render(<TestCalculator onReady={onReady} />);
    await waitFor(() => expect(calculator).toBeDefined());

    act(() => calculator.updateExpression('5+5'));
    await act(async () => {
      await calculator.evaluateExpression();
    });

    await waitFor(() => expect(screen.getByTestId('memory')).toHaveTextContent('0'));
    act(() => calculator.addMemory());
    expect(screen.getByTestId('memory')).toHaveTextContent('10');

    act(() => calculator.subtractMemory());
    expect(screen.getByTestId('memory')).toHaveTextContent('0');

    act(() => calculator.recallMemory());
    expect(screen.getByTestId('expression')).toHaveTextContent('0');

    act(() => calculator.clearMemory());
    expect(screen.getByTestId('memory')).toHaveTextContent('0');
  });

  it('clears history and deletes single entries', async () => {
    api.calculateExpression.mockResolvedValue({ result: 1 });

    render(<TestCalculator onReady={onReady} />);
    await waitFor(() => expect(calculator).toBeDefined());

    act(() => calculator.updateExpression('1'));
    await act(async () => calculator.evaluateExpression());
    act(() => calculator.updateExpression('2'));
    await act(async () => calculator.evaluateExpression());

    await waitFor(() => expect(screen.getByTestId('history')).toHaveTextContent('2'));
    const history = JSON.parse(window.localStorage.getItem('simplecalc_history'));
    act(() => calculator.deleteHistoryEntry(history[0].timestamp));
    expect(screen.getByTestId('history')).toHaveTextContent('1');

    act(() => calculator.clearHistory());
    expect(screen.getByTestId('history')).toHaveTextContent('0');
  });

  it('does not update memory before a successful evaluation', async () => {
    render(<TestCalculator onReady={onReady} />);
    await waitFor(() => expect(calculator).toBeDefined());

    act(() => calculator.addMemory());
    expect(screen.getByTestId('memory')).toHaveTextContent('0');
    expect(screen.getByTestId('error')).toHaveTextContent('Evaluate an expression before updating memory.');

    act(() => calculator.subtractMemory());
    expect(screen.getByTestId('memory')).toHaveTextContent('0');
    expect(screen.getByTestId('error')).toHaveTextContent('Evaluate an expression before updating memory.');
  });

  it('persists memory state after adding and clearing memory', async () => {
    api.calculateExpression.mockResolvedValue({ result: 2.5 });

    render(<TestCalculator onReady={onReady} />);
    await waitFor(() => expect(calculator).toBeDefined());

    act(() => calculator.updateExpression('5/2'));
    await act(async () => calculator.evaluateExpression());

    await waitFor(() => expect(screen.getByTestId('result')).toHaveTextContent('2.5'));

    act(() => calculator.addMemory());
    expect(screen.getByTestId('memory')).toHaveTextContent('2.5');
    expect(JSON.parse(window.localStorage.getItem('simplecalc_memory'))).toBe(2.5);

    act(() => calculator.recallMemory());
    expect(screen.getByTestId('expression')).toHaveTextContent('2.5');

    act(() => calculator.clearMemory());
    expect(screen.getByTestId('memory')).toHaveTextContent('0');
    expect(JSON.parse(window.localStorage.getItem('simplecalc_memory'))).toBe(0);
  });
});
