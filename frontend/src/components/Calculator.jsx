import React from 'react'
import Display from './Display'
import Keypad from './Keypad'
import ScientificPanel from './ScientificPanel'
import History from './History'
import useCalculator from '../hooks/useCalculator'
import useHistory from '../hooks/useHistory'

export default function Calculator(){
  const calculator = useCalculator()
  const history = useHistory()

  return (
    <main className="w-full max-w-4xl flex gap-6 flex-col md:flex-row items-stretch">
      <section className="flex-1 glass p-4 rounded-xl shadow-neon">
        <Display value={calculator.display} error={calculator.error} />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Keypad {...calculator} history={history} />
          <ScientificPanel {...calculator} />
        </div>
      </section>
      <aside className="w-full md:w-80 glass p-4 rounded-xl overflow-auto">
        <History items={history.items} onRecall={calculator.onRecall} onClear={history.clear} />
      </aside>
    </main>
  )
}
