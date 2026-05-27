import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { useCalculator } from './hooks/useCalculator.js';
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
    theme,
    updateExpression,
    resetExpression,
    evaluateExpression,
    deleteLastCharacter,
    reuseHistory,
    clearHistory,
    recallMemory,
    addMemory,
    subtractMemory,
    clearMemory,
    toggleTheme,
  } = useCalculator();

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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const expressionPreview = useMemo(() => expression || 'Enter a valid expression', [expression]);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <motion.header
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
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
                <div className="flex items-center justify-end gap-3 lg:justify-end">
                  <ThemeToggle theme={theme} onToggle={toggleTheme} />
                </div>
          </motion.header>

          <main className="grid gap-6 xl:grid-cols-[1.5fr_0.95fr]">
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
                    />
                    <p className="mt-3 text-sm text-slate-500">Live preview: {expressionPreview}</p>
                  </div>

                  <CalculatorDisplay expression={expression} result={result} error={error} loading={loading} />
                  <HistoryPanel history={history} onReuse={reuseHistory} onClear={clearHistory} />
                </div>

                <div className="space-y-6">
                  <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-5 shadow-inner">
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Quick actions</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {['(', ')', 'π', 'e', 'sin(', 'cos(', 'tan(', 'sqrt('].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => insertValue(item)}
                          className="rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/40 hover:bg-slate-800"
                        >
                          {item}
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
                  />
                </div>
              </div>

              <div className="mt-6">
                <CalculatorKeypad onButtonClick={insertValue} />
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
                </ul>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
