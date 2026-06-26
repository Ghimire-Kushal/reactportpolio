import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext(null)

function getInitial() {
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') return true
    if (saved === 'light') return false
  } catch {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(dark) {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  try { localStorage.setItem('theme', dark ? 'dark' : 'light') } catch {}
}

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const initial = getInitial()
    // Apply immediately so there's no flash
    applyTheme(initial)
    return initial
  })

  const toggle = () => {
    setDark(prev => {
      const next = !prev
      applyTheme(next)
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
