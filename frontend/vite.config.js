import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward /api calls to Spring Boot during development
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },
  // Output the build into Spring Boot's static resources folder
  build: {
    outDir: '../src/main/resources/static',
    emptyOutDir: true,
  }
})
