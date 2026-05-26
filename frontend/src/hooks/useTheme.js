import React from 'react'

export default function useTheme(){
  const [theme, setTheme] = React.useState(() => localStorage.getItem('sc_theme') || 'dark')
  React.useEffect(()=>{
    document.documentElement.classList.toggle('light', theme==='light')
    localStorage.setItem('sc_theme', theme)
  },[theme])
  return { theme, setTheme }
}
