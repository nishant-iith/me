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
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor: core React runtime (shared by all routes)
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // React Query (used by data-fetching pages)
          'vendor-query': ['@tanstack/react-query'],
          // SEO (react-helmet-async)
          'vendor-seo': ['react-helmet-async'],
          // DOMPurify (only used by BlogPost)
          'vendor-sanitize': ['dompurify'],
        }
      }
    }
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
