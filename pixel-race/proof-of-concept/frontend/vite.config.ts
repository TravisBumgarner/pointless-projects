import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: './dist',
    rollupOptions: {
      input: {
        main: './src/index.html',
      }
    },
  },
  server: {
    open: './src/index.html'
  }
});