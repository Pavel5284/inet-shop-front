import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

// Отдельный конфиг для приёмочного теста: не мешает обычной сборке (vite.config.ts).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    environment: 'jsdom',
    include: ['src/__acceptance__/**/*.test.tsx'],
    testTimeout: 60000,
    // jsdom не умеет относительные URL в fetch — указываем бэкенд напрямую
    env: { VITE_GRAPHQL_URL: process.env.API_URL ?? 'http://localhost:3000/graphql' },
    css: false,
  },
})
