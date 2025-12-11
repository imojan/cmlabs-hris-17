import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react({
      babel: {
        parserOpts: {
          sourceType: 'module',
          allowImportExportEverywhere: true,
        },
      },
    }), 
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
  },
})
