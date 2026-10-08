import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // GitHub Pages serve o site em /<repositório>/. O workflow de deploy define
  // BASE_PATH; localmente (dev e preview) o site continua na raiz.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    modules: {
      // Classes em kebab-case no CSS, acessadas em camelCase no TSX.
      localsConvention: 'camelCaseOnly',
    },
  },
  server: {
    port: 5173,
  },
})
