import { describe, it, expect, beforeEach } from 'vitest'
import { useTheme } from '@/composables/useTheme'

describe('Theme Persistence Integration', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    // Reset to dark theme
    const { applyTheme } = useTheme()
    applyTheme('dark')
  })

  it('should persist theme changes across instances', () => {
    // First instance - set to light
    const theme1 = useTheme()
    theme1.applyTheme('dark') // Reset to dark first
    theme1.toggleTheme() // dark -> light
    expect(theme1.isDark.value).toBe(false)
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light')

    // Simulate page reload by reading from localStorage
    localStorage.getItem.mockReturnValue('light')
    const theme2 = useTheme()
    theme2.initTheme()
    expect(theme2.isDark.value).toBe(false)
  })

  it('should sync theme across DOM and localStorage', () => {
    // Start with clean slate
    document.documentElement.classList.remove('dark')
    localStorage.getItem.mockReturnValue(null)
    
    const { isDark, toggleTheme, initTheme } = useTheme()

    // Init dark theme
    initTheme()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(isDark.value).toBe(true)

    // Toggle to light
    toggleTheme()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(isDark.value).toBe(false)
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light')

    // Toggle back to dark
    toggleTheme()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(isDark.value).toBe(true)
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
  })

  it('should update meta theme-color when theme changes', () => {
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

    // Toggle to light
    toggleTheme()
    expect(meta.getAttribute('content')).toBe('#ffffff')

    // Toggle to dark
    toggleTheme()
    expect(meta.getAttribute('content')).toBe('#0a0a0a')

    document.head.removeChild(meta)
  })
})
