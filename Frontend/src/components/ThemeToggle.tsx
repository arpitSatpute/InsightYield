import React from 'react'
import { Sun, Moon } from 'lucide-react'

export const ThemeToggle = () => {
  const [theme, setThemeState] = React.useState<'light' | 'dark'>('dark')
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    // Mark as mounted first
    setMounted(true)
    
    // Get saved theme from localStorage or use system preference
    const saved = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
    setThemeState(saved)
    
    // Apply theme to document
    if (saved === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent any event propagation that might interfere
    e.stopPropagation()
    e.preventDefault()
    
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    
    // Apply theme immediately to avoid flash
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Don't render button on server/until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div
        aria-label="Toggle theme loading"
        className="p-2.5 rounded-lg"
        style={{ width: '20px', height: '20px' }}
      />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggleTheme(e as any)
        }
      }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className="p-2.5 rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
      type="button">
      {theme === 'dark' ? (
        <Sun className="size-5 text-dark-400 dark:text-dark-400" aria-hidden="true" />
      ) : (
        <Moon className="size-5 text-indigo-500" aria-hidden="true" />
      )}
    </button>
  )
}