// vite.config.js
import { fileURLToPath, URL } from 'node:url' // <-- Thêm dòng import này

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: { // <-- Thêm toàn bộ khối 'resolve' này
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})