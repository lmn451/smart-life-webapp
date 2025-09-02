import { ref, computed } from 'vue'

const THEME_KEY = 'theme'
const theme = ref('dark')
const isDark = computed(() => theme.value === 'dark')

function readSavedTheme () {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'dark' || saved === 'light') return saved
  } catch {}
  return null
}

function setRootClass (next) {
  const root = document.documentElement
  root.classList.toggle('dark', next === 'dark')
}

function updateThemeColorMeta (next) {
  const doc = document
  let meta = doc.querySelector('meta[name="theme-color"]')
  if (!meta) {
    meta = doc.createElement('meta')
    meta.setAttribute('name', 'theme-color')
    doc.head.appendChild(meta)
  }
  meta.setAttribute('content', next === 'dark' ? '#0a0a0a' : '#ffffff')
}

function applyTheme (next) {
  theme.value = next
  setRootClass(next)
  updateThemeColorMeta(next)
  try { localStorage.setItem(THEME_KEY, next) } catch {}
}

function toggleTheme () {
  applyTheme(isDark.value ? 'light' : 'dark')
}

function initTheme () {
  const saved = readSavedTheme()
  const initial = saved || 'dark'
  theme.value = initial
  // Only update if the current state doesn't match to avoid flash
  const currentIsDark = document.documentElement.classList.contains('dark')
  const shouldBeDark = initial === 'dark'
  if (currentIsDark !== shouldBeDark) {
    setRootClass(initial)
  }
  updateThemeColorMeta(initial)
  // Don't re-save if it's already saved
  if (!saved && initial === 'dark') {
    // Don't save default theme until user explicitly chooses
    return
  }
  if (saved) {
    try { localStorage.setItem(THEME_KEY, saved) } catch {}
  }
}

export function useTheme () {
  return { theme, isDark, toggleTheme, initTheme, applyTheme }
}
