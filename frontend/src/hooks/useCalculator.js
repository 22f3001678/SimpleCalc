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
  const [angleMode, setAngleMode] = usePersistentState('simplecalc_angle_mode', 'radians');

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
      const response = await calculateExpression(expression.trim(), angleMode);
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
      const message = err?.message || '';
      if (message.includes('division by zero') || message.toLowerCase().includes('divide by zero')) {
        setError('Division by zero is not allowed.');
      } else if (message.includes('Cannot have two operators')) {
        setError('Invalid sequence: you have two operators in a row.');
      } else if (message.toLowerCase().includes('timeout')) {
        setError('Calculation timed out. Please try again.');
      } else {
        setError(message || 'Unable to evaluate expression');
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [angleMode, expression, setHistory]);

  const reuseHistory = useCallback((nextExpression) => {
    setExpression(nextExpression);
    setError('');
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  const deleteHistoryEntry = useCallback(
    (timestamp) => {
      setHistory((currentHistory) => currentHistory.filter((entry) => entry.timestamp !== timestamp));
    },
    [setHistory],
  );

  const copyHistoryEntry = useCallback(
    async (entry) => {
      try {
        const text = `${entry.expression} = ${entry.result}`;
        await navigator.clipboard.writeText(text);
        setError('History item copied to clipboard.');
        window.setTimeout(() => setError(''), 2000);
      } catch {
        setError('Unable to copy to clipboard.');
      }
    },
    [],
  );

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

  const toggleAngleMode = useCallback(() => {
    setAngleMode((current) => (current === 'degrees' ? 'radians' : 'degrees'));
  }, [setAngleMode]);

  return {
    expression,
    result,
    error,
    loading,
    history,
    memory,
    angleMode,
    updateExpression,
    resetExpression,
    deleteLastCharacter,
    evaluateExpression,
    reuseHistory,
    clearHistory,
    deleteHistoryEntry,
    copyHistoryEntry,
    recallMemory,
    addMemory,
    subtractMemory,
    clearMemory,
    toggleAngleMode,
  };
}
