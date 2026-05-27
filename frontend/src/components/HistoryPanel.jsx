import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

export function HistoryPanel({ history, onReuse, onClear, onDelete, onCopy, reduceMotion = false }) {
  const [filter, setFilter] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const filteredHistory = useMemo(() => {
    const normalizedFilter = filter.trim().toLowerCase();
    if (!normalizedFilter) {
      return history;
    }

    return history.filter((entry) =>
      entry.expression.toLowerCase().includes(normalizedFilter) ||
      String(entry.result).toLowerCase().includes(normalizedFilter),
    );
  }, [filter, history]);

  useEffect(() => {
    if (selectedIndex >= filteredHistory.length) {
      setSelectedIndex(filteredHistory.length - 1);
    }
  }, [filteredHistory, selectedIndex]);

  const handleKeyDown = (event) => {
    if (!filteredHistory.length) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex((current) => Math.min(current + 1, filteredHistory.length - 1));
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex((current) => Math.max(current - 1, 0));
    }

    if (event.key === 'Enter' && selectedIndex >= 0) {
      event.preventDefault();
      onReuse(filteredHistory[selectedIndex].expression);
    }
  };

  const listMotion = reduceMotion
    ? { initial: false, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

  return (
    <motion.div
      {...listMotion}
      className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 shadow-soft backdrop-blur"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-describedby="history-panel-description"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">History</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100">Recent calculations</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            placeholder="Filter history"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="min-w-[180px] rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
            aria-label="Filter calculation history"
          />
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Clear all history entries?')) {
                  onClear();
                }
              }}
              className="rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {filteredHistory.length > 0 ? (
        <ul className="mt-5 space-y-3" id="history-panel-description">
          {filteredHistory.map((entry, index) => (
            <li
              key={`${entry.expression}-${entry.timestamp}-${index}`}
              className={`rounded-3xl border p-4 shadow-inner transition ${selectedIndex === index ? 'border-cyan-400/60 bg-slate-900/95' : 'border-slate-800 bg-slate-900/90'}`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm text-slate-400">{entry.expression}</p>
                  <p className="mt-1 text-lg font-semibold text-slate-100">{entry.result}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onReuse(entry.expression)}
                    className="rounded-3xl border border-slate-700 bg-slate-950/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300 transition hover:border-cyan-400/40 hover:bg-slate-900"
                  >
                    Reuse
                  </button>
                  <button
                    type="button"
                    onClick={() => onCopy(entry)}
                    className="rounded-3xl border border-slate-700 bg-slate-950/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 transition hover:border-cyan-400/40 hover:bg-slate-900"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(entry.timestamp)}
                    className="rounded-3xl border border-rose-700 bg-slate-950/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-300 transition hover:border-rose-400/40 hover:bg-slate-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-slate-400">Your recent calculations appear here after evaluation.</p>
      )}
    </motion.div>
  );
}
