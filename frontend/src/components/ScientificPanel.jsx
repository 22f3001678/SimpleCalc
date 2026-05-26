import React from 'react'
import Button from './Button'

const sci = ['sin','cos','tan','sqrt','log','ln','pi','exp']

export default function ScientificPanel({append, evaluate}){
  return (
    <div className="mt-2">
      <div className="grid grid-cols-4 gap-3">
        {sci.map(s => (
          <Button key={s} onClick={() => append(s + (s==='pi' ? '' : '('))}>{s}</Button>
        ))}
      </div>
    </div>
  )
}
