import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// В dev-режиме запросы /graphql проксируются на бэкенд — так не нужен CORS и в коде используется один и тот же адрес.
const backend = process.env.VITE_DEV_PROXY_TARGET ?? 'http://localhost:3000'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    port: 5173,
    proxy: { '/graphql': { target: backend, changeOrigin: true } },
  },
  preview: {
    port: 4173,
    proxy: { '/graphql': { target: backend, changeOrigin: true } },
  },
})
