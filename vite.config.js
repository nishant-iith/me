import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    // Strip console.log/warn/error in production to prevent info leaks
    minify: 'esbuild',
    target: 'es2020',
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~components': path.resolve(__dirname, './src/components'),
      '~hooks': path.resolve(__dirname, './src/hooks'),
      '~services': path.resolve(__dirname, './src/services'),
      '~pages': path.resolve(__dirname, './src/pages'),
      '~assets': path.resolve(__dirname, './src/assets'),
    },
  },
})
