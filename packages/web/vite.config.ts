import react from '@vitejs/plugin-react';
import path from 'path';
import { inspectorServer } from 'react-dev-inspector/plugins/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        // plugins: ['react-activation/babel', ['@babel/plugin-proposal-decorators', { legacy: true }]]
      }
    }),
    // https://github.com/zthxxx/react-dev-inspector#usage-with-vite2
    inspectorServer()
  ],
  define: {
    __APP_ENV__: '"web"'
  },
  build: {
    target: 'es2015',
    cssTarget: 'chrome80',
    brotliSize: false,
    chunkSizeWarningLimit: 2000,
    polyfillModulePreload: true
  },
  resolve: {
    alias: [
      {
        find: /@\//,
        replacement: path.resolve(__dirname, '../../packages/components/src') + '/'
      }
    ]
  }
});
