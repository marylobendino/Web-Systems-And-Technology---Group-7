import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Keep browser requests same-origin during development; Vite forwards API calls to Express.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
})
