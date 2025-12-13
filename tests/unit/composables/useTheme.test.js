import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTheme } from '@/composables/useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    // Reset DOM
    document.documentElement.classList.remove('dark')
    localStorage.clear()
    // Reset theme to default state
    const { applyTheme } = useTheme()
    applyTheme('dark')
  })

  describe('isDark', () => {
    it('should default to dark mode', () => {
      const { isDark } = useTheme()
      expect(isDark.value).toBe(true)
    })

    it('should read from localStorage if available', () => {
      localStorage.getItem.mockReturnValue('light')
      const { theme, initTheme } = useTheme()
      initTheme()
      expect(theme.value).toBe('light')
    })

    it('should handle invalid localStorage values and default to dark', () => {
      localStorage.getItem.mockReturnValue('invalid')
      const { initTheme, isDark } = useTheme()
      initTheme()
      expect(isDark.value).toBe(true) // defaults to dark
    })
  })

  describe('toggleTheme', () => {
    it('should toggle from dark to light', () => {
      const { isDark, toggleTheme, applyTheme } = useTheme()
      applyTheme('dark') // Ensure we start dark
      expect(isDark.value).toBe(true)
      
      toggleTheme()
      
      expect(isDark.value).toBe(false)
      expect(document.documentElement.classList.contains('dark')).toBe(false)
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light')
    })

    it('should toggle from light to dark', () => {
      const { isDark, toggleTheme, applyTheme } = useTheme()
      applyTheme('light') // Ensure we start light
      expect(isDark.value).toBe(false)
      
      toggleTheme()
      
      expect(isDark.value).toBe(true)
      expect(document.documentElement.classList.contains('dark')).toBe(true)
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
    })

    it('should update theme-color meta tag', () => {
      // Remove any existing meta tag first
      const existing = document.head.querySelector('meta[name="theme-color"]')
      if (existing) existing.remove()
      
      const meta = document.createElement('meta')
      meta.name = 'theme-color'
      document.head.appendChild(meta)

      const { toggleTheme, applyTheme } = useTheme()
      
      // Start with dark theme - this will set the meta tag
      applyTheme('dark')
      expect(meta.getAttribute('content')).toBe('#0a0a0a')
      
      toggleTheme() // dark -> light
      expect(meta.getAttribute('content')).toBe('#ffffff')

      toggleTheme() // light -> dark
      expect(meta.getAttribute('content')).toBe('#0a0a0a')

      document.head.removeChild(meta)
    })
  })

  describe('initTheme', () => {
    it('should apply dark theme by default when no saved preference', () => {
      // Start with clean slate
      document.documentElement.classList.remove('dark')
      localStorage.getItem.mockReturnValue(null)
      
      const { initTheme } = useTheme()
      initTheme()
      
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should apply saved theme from localStorage', () => {
      localStorage.getItem.mockReturnValue('light')
      document.documentElement.classList.add('dark') // Start with dark
      
      const { initTheme } = useTheme()
      initTheme()
      
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })
})
