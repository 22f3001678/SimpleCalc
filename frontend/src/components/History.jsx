import React from 'react'
import HistoryItem from './HistoryItem'

export default function History({items, onRecall, onClear}){
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">History</h3>
        <button onClick={onClear} className="text-sm text-red-400">Clear</button>
      </div>
      <div className="space-y-2">
        {items.length===0 && <div className="text-sm text-slate-400">No history yet</div>}
        {items.map((h, i) => (
          <HistoryItem key={i} item={h} onClick={() => onRecall(h.expression)} />
        ))}
      </div>
    </div>
  )
}
