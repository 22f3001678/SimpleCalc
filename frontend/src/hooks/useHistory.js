import React from 'react'
import storage from '../utils/storage'

export default function useHistory(){
  const [items, setItems] = React.useState(() => storage.load('history') || [])

  function push(entry){
    setItems(prev => {
      const next = [entry, ...prev].slice(0,50)
      storage.save('history', next)
      return next
    })
  }
  function clear(){ storage.remove('history'); setItems([]) }

  return { items, push, clear }
}
