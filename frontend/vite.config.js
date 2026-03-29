import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    allowedHosts: 'all',
    proxy: {
      '/backend/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend\/api/, ''),
        proxyTimeout: 600000,
        timeout: 600000
      },
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        proxyTimeout: 600000,
        timeout: 600000
      }
    }
  }
})
