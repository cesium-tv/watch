import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue2';
import { sentryVitePlugin } from '@sentry/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 8002,
    origin: 'http://cesium.tv:8002',
  },
  preview: {
    host: '0.0.0.0',
    port: 8002,
  },
  plugins: [
    vue(),
    legacy(),
    sentryVitePlugin({
      org: 'sentry',
      project: 'cesium-tv-watch',
      url: 'http://localhost:9000/',
      authToken: '70943e7c1ae245188fd18b859ee2780b76d5631d211741169b38427dad1c3b38',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    sourcemap: true,
  },
});
