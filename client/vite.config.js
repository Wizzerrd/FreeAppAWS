import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // amazon-cognito-identity-js reads `global` in the browser bundle
  define: {
    global: 'globalThis',
  },
})
