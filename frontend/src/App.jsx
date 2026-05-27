import React from 'react';
import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { useCalculator } from './hooks/useCalculator.js';
import { useTheme } from './context/ThemeContext.jsx';
import { CalculatorDisplay } from './components/CalculatorDisplay.jsx';
import { CalculatorKeypad } from './components/CalculatorKeypad.jsx';
import { HistoryPanel } from './components/HistoryPanel.jsx';
import { MemoryPanel } from './components/MemoryPanel.jsx';
import { ScientificPanel } from './components/ScientificPanel.jsx';
import { ThemeToggle } from './components/ThemeToggle.jsx';

function App() {
  const {
    expression,
    result,
    error,
    loading,
    history,
    memory,
    angleMode,
    updateExpression,
    resetExpression,
    evaluateExpression,
    deleteLastCharacter,
    reuseHistory,
    clearHistory,
    deleteHistoryEntry,
    copyHistoryEntry,
    recallMemory,
    addMemory,
    subtractMemory,
    clearMemory,
    toggleAngleMode,
  } = useCalculator();

  const { theme, toggleTheme, prefersReducedMotion } = useTheme();

  const statusLabel = loading ? 'Evaluating…' : error ? 'Error' : 'Ready';

  const insertValue = (value) => {
    if (value === 'C') {
      resetExpression();
      return;
    }
    if (value === 'DEL') {
      deleteLastCharacter();
      return;
    }
    if (value === '=') {
      evaluateExpression();
      return;
    }
    updateExpression((current) => current + value);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      const allowedInput = '0123456789.+-*/^()%!e';

      if (key === 'Enter') {
        event.preventDefault();
        evaluateExpression();
        return;
      }
      if (key === 'Backspace') {
        event.preventDefault();
        deleteLastCharacter();
        return;
      }
      if (key === 'Escape') {
        event.preventDefault();
        resetExpression();
        return;
      }
      if (allowedInput.includes(key)) {
        event.preventDefault();
        updateExpression((current) => current + key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteLastCharacter, evaluateExpression, resetExpression, updateExpression]);

  const expressionPreview = useMemo(() => expression || 'Enter a valid expression', [expression]);

  return (
    <motion.div
      data-testid="app-root"
      animate={{
        backgroundColor: theme === 'dark' ? '#020617' : '#f8fafc',
        color: theme === 'dark' ? '#f8fafc' : '#0f172a',
      }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: 'easeInOut' }}
      className={`min-h-screen overflow-x-hidden transition-colors duration-300 ease-in-out ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}
    >
      <div className="px-4 py-6 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <motion.header
            initial={prefersReducedMotion ? false : { opacity: 0, y: -18 }}
            animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft backdrop-blur"
          >
            <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr] lg:items-end">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-400/80">SimpleCalc</p>
                <h1 className="mt-3 text-4xl font-semibold text-slate-100 sm:text-5xl">TI-inspired scientific calculator</h1>
                <p className="mt-4 max-w-3xl text-slate-400 sm:text-lg">
                  Elegant glass-style UI for secure backend evaluation. Includes scientific functions, constants, and a responsive keypad designed for desktop and mobile.
                </p>
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 px-6 py-5 text-right shadow-inner">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Status</p>
                <p className="mt-3 text-3xl font-semibold text-slate-100">{statusLabel}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-end gap-3 lg:justify-end">
              <ThemeToggle theme={theme} onToggle={toggleTheme} reduceMotion={prefersReducedMotion} />
              <button
                type="button"
                onClick={toggleAngleMode}
                className="rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/40 hover:text-cyan-300"
                aria-label="Toggle angle mode"
              >
                {angleMode === 'degrees' ? 'Degrees' : 'Radians'}
              </button>
            </div>
          </motion.header>

          <main data-testid="app-main" className="grid gap-6 xl:grid-cols-[1.5fr_0.95fr]">
            <section className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft backdrop-blur">
              <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <div className="space-y-6">
                  <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-5 shadow-inner">
                    <label htmlFor="expression" className="mb-3 block text-xs uppercase tracking-[0.35em] text-slate-500">Expression</label>
                    <input
                      id="expression"
                      type="text"
                      value={expression}
                      onChange={(event) => updateExpression(event.target.value)}
                      placeholder="e.g. 2 * (π + 1)"
                      className="w-full border border-slate-800 bg-slate-900/95 px-4 py-4 text-xl font-medium text-slate-100 outline-none transition focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-400/20"
                      aria-describedby="expression-help"
                    />
                    <p id="expression-help" className="mt-3 text-sm text-slate-500">Live preview: {expressionPreview}</p>
                  </div>

                  <CalculatorDisplay expression={expression} result={result} error={error} loading={loading} reduceMotion={prefersReducedMotion} />
                  <HistoryPanel
                    history={history}
                    onReuse={reuseHistory}
                    onClear={clearHistory}
                    onDelete={deleteHistoryEntry}
                    onCopy={copyHistoryEntry}
                    reduceMotion={prefersReducedMotion}
                  />
                </div>

                <div className="space-y-6">
                  <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-5 shadow-inner">
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Quick actions</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {[
                        { label: '(', value: '(', ariaLabel: 'Open parenthesis' },
                        { label: ')', value: ')', ariaLabel: 'Close parenthesis' },
                        { label: 'π', value: 'π', ariaLabel: 'Pi constant' },
                        { label: 'e', value: 'e', ariaLabel: 'Euler constant' },
                        { label: 'sin(', value: 'sin(', ariaLabel: 'Sine function' },
                        { label: 'cos(', value: 'cos(', ariaLabel: 'Cosine function' },
                        { label: 'tan(', value: 'tan(', ariaLabel: 'Tangent function' },
                        { label: 'sqrt(', value: 'sqrt(', ariaLabel: 'Square root function' },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => insertValue(item.value)}
                          aria-label={item.ariaLabel}
                          className="rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/40 hover:bg-slate-800"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <ScientificPanel onInsert={insertValue} />
                  <MemoryPanel
                    memory={memory}
                    onMemoryAdd={addMemory}
                    onMemorySubtract={subtractMemory}
                    onMemoryRecall={recallMemory}
                    onMemoryClear={clearMemory}
                    reduceMotion={prefersReducedMotion}
                  />
                </div>
              </div>

              <div className="mt-6">
                <CalculatorKeypad onButtonClick={insertValue} reduceMotion={prefersReducedMotion} />
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 shadow-soft backdrop-blur">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Calculator layout</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-100">Scientific mode</h2>
                <p className="mt-4 text-slate-400 leading-7">
                  The keypad is organized for both power users and mobile screens. Core operators, numbers, and scientific functions are grouped for fast entry.
                </p>
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 shadow-soft backdrop-blur">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Keyboard support</p>
                <ul className="mt-4 space-y-3 text-slate-400">
                  <li>Press <span className="rounded-full bg-slate-900 px-2 py-1 text-cyan-300">Enter</span> to evaluate</li>
                  <li>Press <span className="rounded-full bg-slate-900 px-2 py-1 text-cyan-300">Backspace</span> to delete</li>
                  <li>Press <span className="rounded-full bg-slate-900 px-2 py-1 text-cyan-300">Escape</span> to reset</li>
                  <li>Press <span className="rounded-full bg-slate-900 px-2 py-1 text-cyan-300">Arrow keys</span> to navigate history when the panel is focused</li>
                </ul>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </motion.div>
  );
}

export default App;
