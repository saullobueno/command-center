import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    // maplibre-gl cria um worker próprio e pode perder o arquivo gerado pelo
    // prebundle do Vite entre reloads do dev server.
    exclude: ['maplibre-gl'],
  },
  build: {
    // maplibre-gl e echarts são pesados de propósito e ficam em chunks
    // lazy-loaded separados (React.lazy em src/App.tsx) — não fazem parte
    // do bundle inicial, então o limite padrão de 500kB não se aplica.
    chunkSizeWarningLimit: 1000,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    exclude: ['e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['src/test/**', '**/*.stories.tsx', '.storybook/**'],
    },
  },
})
