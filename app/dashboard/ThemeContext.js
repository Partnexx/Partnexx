'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({
  theme: 'clair',
  setTheme: () => {},
  isDark: false,
  colors: {},
})

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('clair')

  useEffect(() => {
    const saved = localStorage.getItem('partnexx_theme')
    if (saved) setThemeState(saved)
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('systeme')
    }
  }, [])

  const handleSetTheme = (t) => {
    setThemeState(t)
    localStorage.setItem('partnexx_theme', t)
  }

  const systemDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = theme === 'sombre' || (theme === 'systeme' && systemDark)

  const colors = isDark ? {
    bg: '#0f0f1a',
    bgSecondary: '#1a1a2e',
    surface: '#1e1e32',
    border: '#2d2d4a',
    text: '#f0f0ff',
    textSecondary: '#9090b0',
    textMuted: '#6060a0',
    cardBg: '#1e1e32',
    cardBorder: '#2d2d4a',
    inputBg: '#16162a',
    navHover: 'rgba(168,85,247,0.15)',
    shadow: '0 1px 6px rgba(0,0,0,0.4)',
  } : {
    bg: '#f8f9ff',
    bgSecondary: '#fff',
    surface: '#fff',
    border: '#f0f0f0',
    text: '#1a202c',
    textSecondary: '#718096',
    textMuted: '#a0aec0',
    cardBg: '#fff',
    cardBorder: '#f0f0f0',
    inputBg: '#fff',
    navHover: 'rgba(168,85,247,0.08)',
    shadow: '0 1px 6px rgba(0,0,0,0.04)',
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, isDark, colors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}