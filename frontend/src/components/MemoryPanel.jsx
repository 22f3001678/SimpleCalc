import React from 'react';
import { motion } from 'framer-motion';

export function MemoryPanel({ memory, onMemoryAdd, onMemorySubtract, onMemoryRecall, onMemoryClear, reduceMotion = false }) {
  const memoryMotion = reduceMotion
    ? { initial: false, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

  return (
    <motion.div
      {...memoryMotion}
      className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 shadow-soft backdrop-blur"
    >
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Memory</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-100">Quick recall</h2>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-5 text-slate-100 shadow-inner">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Stored memory</p>
        <p className="mt-3 text-4xl font-semibold text-cyan-300">{memory ?? 0}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onMemoryAdd}
          className="rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/40 hover:bg-slate-800"
        >
          M+
        </button>
        <button
          type="button"
          onClick={onMemorySubtract}
          className="rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/40 hover:bg-slate-800"
        >
          M-
        </button>
        <button
          type="button"
          onClick={onMemoryRecall}
          className="rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/40 hover:bg-slate-800"
        >
          MR
        </button>
        <button
          type="button"
          onClick={onMemoryClear}
          className="rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/40 hover:bg-slate-800"
        >
          MC
        </button>
      </div>
    </motion.div>
  );
}
