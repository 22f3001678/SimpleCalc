export function ResultPanel({ result, error, expression, loading }) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-inner">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Current expression</p>
        <p className="mt-4 break-words text-xl font-medium text-slate-100">{expression || 'No expression entered'}</p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-inner">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Result</p>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
            {loading ? 'Processing' : result !== null ? 'Success' : 'Idle'}
          </span>
        </div>
        <div className="mt-4 min-h-[5rem] rounded-3xl border border-slate-800 bg-slate-900 px-4 py-6 text-3xl font-semibold text-slate-100">
          {loading ? 'Loading…' : error ? <span className="text-rose-300">{error}</span> : result !== null ? result : 'Waiting for evaluation'}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-slate-400">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Trusted API</h3>
        <p className="leading-6">
          The UI sends expressions to the SimpleCalc backend using a secure API layer. The frontend is mobile-first, responsive, and prepared for deployment with GitHub Pages.
        </p>
      </div>
    </div>
  );
}
