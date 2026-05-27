import { useCallback, useState } from 'react';
import { calculateExpression } from '../utils/api.js';
import { usePersistentState } from './usePersistentState.js';

const INITIAL_EXPRESSION = '';
const MAX_HISTORY_LENGTH = 20;

export function useCalculator(initialExpression = INITIAL_EXPRESSION) {
  const [expression, setExpression] = useState(initialExpression);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = usePersistentState('simplecalc_history', []);
  const [memory, setMemory] = usePersistentState('simplecalc_memory', 0);
  const [theme, setTheme] = usePersistentState('simplecalc_theme', 'dark');

  const updateExpression = useCallback((nextValue) => {
    setExpression((current) => {
      if (typeof nextValue === 'function') {
        return nextValue(current);
      }
      return nextValue;
    });
    setError('');
  }, []);

  const resetExpression = useCallback(() => {
    setExpression(INITIAL_EXPRESSION);
    setResult(null);
    setError('');
  }, []);

  const deleteLastCharacter = useCallback(() => {
    setExpression((current) => current.slice(0, -1));
    setError('');
  }, []);

  const evaluateExpression = useCallback(async () => {
    if (!expression.trim()) {
      setError('Please enter an expression to evaluate.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await calculateExpression(expression.trim());
      setResult(response.result);
      setHistory((currentHistory) => [
        {
          expression: expression.trim(),
          result: response.result,
          timestamp: Date.now(),
        },
        ...currentHistory,
      ].slice(0, MAX_HISTORY_LENGTH));
    } catch (err) {
      // Map some common backend errors to friendlier messages
      const message = err?.message || '';
      if (message.includes('division by zero') || message.toLowerCase().includes('divide by zero')) {
        setError('Division by zero is not allowed.');
      } else if (message.includes('Cannot have two operators')) {
        setError('Invalid sequence: you have two operators in a row.');
      } else {
        setError(message || 'Unable to evaluate expression');
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [expression, setHistory]);

  const reuseHistory = useCallback((nextExpression) => {
    setExpression(nextExpression);
    setError('');
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  const recallMemory = useCallback(() => {
    setExpression((current) => (current.trim() ? `${current}${memory}` : String(memory)));
    setError('');
  }, [memory]);

  const addMemory = useCallback(() => {
    if (result === null || error) {
      setError('Evaluate an expression before updating memory.');
      return;
    }

    const nextValue = Number(result);
    if (Number.isFinite(nextValue)) {
      setMemory((current) => Number(current) + nextValue);
    } else {
      setError('Memory update requires a numeric result.');
    }
  }, [error, result, setMemory]);

  const subtractMemory = useCallback(() => {
    if (result === null || error) {
      setError('Evaluate an expression before updating memory.');
      return;
    }

    const nextValue = Number(result);
    if (Number.isFinite(nextValue)) {
      setMemory((current) => Number(current) - nextValue);
    } else {
      setError('Memory update requires a numeric result.');
    }
  }, [error, result, setMemory]);

  const clearMemory = useCallback(() => {
    setMemory(0);
  }, [setMemory]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  return {
    expression,
    result,
    error,
    loading,
    history,
    memory,
    theme,
    updateExpression,
    resetExpression,
    deleteLastCharacter,
    evaluateExpression,
    reuseHistory,
    clearHistory,
    recallMemory,
    addMemory,
    subtractMemory,
    clearMemory,
    toggleTheme,
  };
}
