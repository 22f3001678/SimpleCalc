import { CalculatorButton } from './CalculatorButton.jsx';
import { keypadGroups } from '../utils/keypad.js';
import { memo } from 'react';

function _CalculatorKeypad({ onButtonClick }) {
  return (
    <div className="space-y-4">
      {keypadGroups.map((group) => (
        <div
          key={group.title}
          className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-4 shadow-soft backdrop-blur"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">{group.title}</h3>
            {group.hint && <span className="text-xs text-slate-500">{group.hint}</span>}
          </div>
          <div className={`grid gap-3 ${group.columns || 'grid-cols-4'}`}>
            {group.buttons.map((button) => (
              <CalculatorButton
                key={button.label}
                label={button.label}
                variant={button.variant}
                onClick={() => onButtonClick(button.value)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export const CalculatorKeypad = memo(_CalculatorKeypad);
