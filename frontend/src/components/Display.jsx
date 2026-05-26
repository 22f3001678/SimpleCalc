import React from 'react'

export default function Display({value, error}){
  return (
    <div className="bg-black/60 rounded-lg p-4 screen-glow">
      <div className="text-right text-slate-400 text-sm truncate">{error ? 'Error' : ''}</div>
      <div className="text-right text-3xl font-mono mt-2">{error || value || '0'}</div>
    </div>
  )
}
