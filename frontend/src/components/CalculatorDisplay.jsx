import React, { memo } from 'react';
import { motion } from 'framer-motion';

function _CalculatorDisplay({ expression, result, error, loading, reduceMotion = false }) {
  const hasError = Boolean(error);

  const containerMotion = reduceMotion
    ? { initial: false, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

  const statusMotion = reduceMotion
    ? { animate: { x: 0, scale: 1 }, transition: { duration: 0 } }
    : {
        animate: hasError ? { x: [0, -6, 6, -6, 6, 0], scale: [1, 1.04, 1, 1.02, 1] } : { x: 0, scale: 1 },
        transition: { duration: hasError ? 0.55 : 0.2, ease: 'easeInOut', type: 'spring', stiffness: 260, damping: 18 },
      };

  return (
    <motion.div
      {...containerMotion}
      className="space-y-4 rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 shadow-soft backdrop-blur"
      role="region"
      aria-live="polite"
      aria-busy={loading}
      aria-describedby="calculator-display-description"
    >
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 text-slate-100 shadow-inner">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Expression</p>
        <p className="mt-4 min-h-[3rem] break-words text-2xl font-semibold leading-tight text-slate-100 sm:text-3xl">
          {expression || 'Enter your expression'}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-inner">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Result</p>
          <p role="status" aria-live="polite" className="mt-4 text-4xl font-semibold text-slate-100">
            {loading ? 'Loading…' : result ?? '—'}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-inner">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Status</p>
          <motion.p
            initial={false}
            className={`mt-4 text-lg font-semibold ${error ? 'text-rose-300' : 'text-cyan-300'}`}
            {...statusMotion}
          >
            {error || (loading ? 'Evaluating expression' : 'Ready for input')}
          </motion.p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-400">
        <p className="font-semibold text-slate-200">Tip</p>
        <p className="mt-2 leading-6">
          Use scientific functions like <span className="text-cyan-300">sin(</span>, <span className="text-cyan-300">log(</span>, and constants like <span className="text-cyan-300">π</span> or <span className="text-cyan-300">e</span>.
        </p>
      </div>
      <p id="calculator-display-description" className="sr-only">Calculator expression results and current status messages.</p>
    </motion.div>
  );
}

export const CalculatorDisplay = memo(_CalculatorDisplay);
