import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    legacy({
      targets: ['chrome >= 53'],
      ignoreBrowserslistConfig: false,
      renderLegacyChunks: true,
      modernPolyfills: ['es/global-this'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    //target: 'es2015',
    outDir: 'dist/vite',
  },
  server: {
    host: '0.0.0.0'
  }
})
