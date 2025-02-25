/// <reference types="vitest" />
/// <reference types="Vite/client" />

import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: { 
    'import.meta.vitest': 'undefined', 
  }, 
  test: {
    globals: true,
    includeSource: ['src/**/*.{js,ts}']
  },
})