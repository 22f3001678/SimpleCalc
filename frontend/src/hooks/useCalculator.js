import React from 'react'
import evaluator from '../utils/evaluator'
import axios from 'axios'

export default function useCalculator(){
  const [display, setDisplay] = React.useState('')
  const [error, setError] = React.useState(null)

  // append token to expression
  function append(token){
    setError(null)
    setDisplay(d => d + token)
  }

  function clear(){ setDisplay(''); setError(null) }
  function backspace(){ setDisplay(d => d.slice(0,-1)) }
  function toggleSign(){
    // naive toggle: wrap with (-1*) if not empty
    setDisplay(d => d ? `(-1*(${d}))` : d)
  }

  async function evaluate(){
    try{
      setError(null)
      const expr = display || '0'
      // prefer backend evaluation when available
      try{
        const res = await axios.post('/api/calculator/evaluate',{ expression: expr })
        const { result } = res.data
        setDisplay(String(result))
        return { expression: expr, result }
      }catch(_){
        // fallback to local evaluator
        const result = evaluator(expr)
        setDisplay(String(result))
        return { expression: expr, result }
      }
    }catch(e){
      setError('Invalid expression')
      return null
    }
  }

  // recall used by history
  function onRecall(expr){ setDisplay(expr); setError(null) }

  // keyboard support
  React.useEffect(()=>{
    function onKey(e){
      const key = e.key
      if((/^[0-9.+\-*/()%^]$/).test(key)){
        append(key)
      }else if(key === 'Enter'){
        evaluate()
      }else if(key === 'Backspace'){
        backspace()
      }
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  },[display])

  return { display, error, append, clear, backspace, toggleSign, evaluate, onRecall }
}
