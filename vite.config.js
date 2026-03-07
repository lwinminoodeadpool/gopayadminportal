import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/baas': {
        target: 'https://uat-miniapp.kbzpay.com',
        changeOrigin: true,
      },
      '/service': {
        target: 'https://uat-miniapp.kbzpay.com',
        changeOrigin: true,
      }
    }
  }
})
