import React from 'react'
import ThemeToggle from './ThemeToggle'

export default function Header(){
  return (
    <header className="w-full max-w-4xl mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-semibold">SimpleCalc</h1>
      <ThemeToggle />
    </header>
  )
}
