import { motion } from 'framer-motion';

export function HistoryPanel({ history, onReuse, onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 shadow-soft backdrop-blur"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">History</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100">Recent calculations</h2>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-300"
          >
            Clear
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {history.map((entry, index) => (
            <li key={`${entry.expression}-${entry.timestamp}-${index}`} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm text-slate-400">{entry.expression}</p>
                  <p className="mt-1 text-lg font-semibold text-slate-100">{entry.result}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onReuse(entry.expression)}
                  className="rounded-3xl border border-slate-700 bg-slate-950/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300 transition hover:border-cyan-400/40 hover:bg-slate-900"
                >
                  Reuse
                </button>
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
