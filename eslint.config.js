import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  
  globalIgnores(['dist', 'coverage', 'playwright-report', 'test-results', 'docs']),
  {
    files: ['***.js'],
    languageOptions: { globals: globals.node },
  },
  {
    
    files: ['**/*.test.{js,jsx}'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
])
