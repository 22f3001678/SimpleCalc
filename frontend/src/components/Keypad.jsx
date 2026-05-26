import React from 'react'
import Button from './Button'

const keys = [
  ['7','8','9','/'],
  ['4','5','6','*'],
  ['1','2','3','-'],
  ['0','.','%','+']
]

export default function Keypad({append, clear, evaluate, toggleSign, backspace, history}){
  async function handleEvaluate(){
    const res = await evaluate()
    if(res && history && history.push){ history.push(res) }
  }
  return (
    <div>
      <div className="grid grid-cols-4 gap-3">
        <Button onClick={clear} className="col-span-2 bg-red-600/30">C</Button>
        <Button onClick={backspace}>⌫</Button>
        <Button onClick={toggleSign}>±</Button>
        {keys.flat().map(k => (
          <Button key={k} onClick={() => append(k)}>{k}</Button>
        ))}
        <Button onClick={()=>append('(')}>(</Button>
        <Button onClick={()=>append(')')}>)</Button>
        <Button onClick={()=>append('^')}>^</Button>
        <Button onClick={handleEvaluate} className="col-span-2 bg-neon text-black">=</Button>
      </div>
    </div>
  )
}
