import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Firebase into its own chunk (~200KB)
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // Split charting lib (~180KB)
          recharts: ['recharts'],
          // Split animation lib (~60KB)
          'framer-motion': ['framer-motion'],
          // Split Excel export (~140KB) — loaded only when user exports
          xlsx: ['xlsx'],
        },
      },
    },
  },
})
