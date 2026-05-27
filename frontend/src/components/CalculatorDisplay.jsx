import { motion } from 'framer-motion';

export function CalculatorDisplay({ expression, result, error, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-4 rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 shadow-soft backdrop-blur"
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
          <p className="mt-4 text-4xl font-semibold text-slate-100">{loading ? 'Loading…' : result ?? '—'}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-inner">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Status</p>
          <p className={`mt-4 text-lg font-semibold ${error ? 'text-rose-300' : 'text-cyan-300'}`}>
            {error || (loading ? 'Evaluating expression' : 'Ready for input')}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-400">
        <p className="font-semibold text-slate-200">Tip</p>
        <p className="mt-2 leading-6">
          Use scientific functions like <span className="text-cyan-300">sin(</span>, <span className="text-cyan-300">log(</span>, and constants like <span className="text-cyan-300">π</span> or <span className="text-cyan-300">e</span>.
        </p>
      </div>
    </motion.div>
  );
}
