import React from 'react'

export default function ThemeToggle(){
  const [theme, setTheme] = React.useState(() => localStorage.getItem('sc_theme') || 'dark')
  React.useEffect(()=>{
    document.documentElement.classList.toggle('light', theme==='light')
    localStorage.setItem('sc_theme', theme)
  },[theme])
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="px-3 py-1 rounded bg-gray-800/40 hover:bg-gray-700/50"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? 'Dark' : 'Light'}
    </button>
  )
}
