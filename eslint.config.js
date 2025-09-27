// ESLint v9 flat config for Vue 3 + JS
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.browser
      }
    },
    rules: {
      // project-specific tweaks can go here
      'vue/multi-word-component-names': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }]
    }
  }
]
