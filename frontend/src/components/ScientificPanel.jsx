import { CalculatorButton } from './CalculatorButton.jsx';
import { memo } from 'react';
const scientificActions = [
  { label: 'sin(', value: 'sin(' },
  { label: 'cos(', value: 'cos(' },
  { label: 'tan(', value: 'tan(' },
  { label: 'sqrt(', value: 'sqrt(' },
  { label: 'log(', value: 'log(' },
  { label: 'ln(', value: 'ln(' },
  { label: 'abs(', value: 'abs(' },
  { label: 'π', value: 'π' },
  { label: 'e', value: 'e' },
];

export function ScientificPanel({ onInsert }) {
  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 shadow-soft backdrop-blur">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Scientific panel</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-100">Advanced functions</h2>
        </div>
        <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.22em] text-cyan-300">
          9 keys
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {scientificActions.map((item) => (
          <CalculatorButton
            key={item.label}
            label={item.label}
            variant="action"
            onClick={() => onInsert(item.value)}
          />
        ))}
      </div>
      <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-400">
        <p className="text-slate-200">Tip</p>
        <p className="mt-2 leading-6">
          Tap functions then complete with <span className="text-cyan-300">)</span>. Use <span className="text-cyan-300">π</span> for precise circle calculations.
        </p>
      </div>
    </div>
  );
}

export default memo(ScientificPanel);
