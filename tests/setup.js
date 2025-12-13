import { vi } from 'vitest'
import '@testing-library/jest-dom'

// Mock CSS imports
vi.mock('element-plus/theme-chalk/dark/css-vars.css', () => ({}))
vi.mock('element-plus/dist/index.css', () => ({}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
global.localStorage = localStorageMock

// Mock navigator.serviceWorker
Object.defineProperty(global.navigator, 'serviceWorker', {
  value: {
    register: vi.fn(() => Promise.resolve())
  },
  writable: true
})

// Reset mocks before each test
beforeEach(() => {
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.clear.mockClear()
})
