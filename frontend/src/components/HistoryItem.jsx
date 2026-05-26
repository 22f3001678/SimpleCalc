import React from 'react'

export default function HistoryItem({item, onClick}){
  return (
    <div onClick={onClick} className="p-2 rounded hover:bg-gray-800/30 cursor-pointer">
      <div className="text-sm text-slate-400">{item.expression}</div>
      <div className="font-mono">{item.result}</div>
    </div>
  )
}
