import 'element-plus/theme-chalk/dark/css-vars.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useTheme } from './composables/useTheme'

const { initTheme } = useTheme()
initTheme()

createApp(App)
  .use(router)
  .mount('#app')

// Register a minimal service worker to enable PWA install criteria
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
