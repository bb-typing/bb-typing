import react from '@vitejs/plugin-react';
import { inspectorServer } from 'react-dev-inspector/plugins/vite';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

import { aliasPathMap } from '../../config/alias-path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0'
  },
  resolve: {
    alias: {
      ...aliasPathMap
    }
  },
  plugins: [
    react({
      babel: {
        plugins: []
      }
    }),
    // https://github.com/pd4d10/vite-plugin-svgr
    svgr(),
    // https://github.com/zthxxx/react-dev-inspector#usage-with-vite2
    inspectorServer()
  ],
  define: {
    __APP_ENV__: '"web"',
    'process.env': {}
  },
  build: {
    target: 'es2015',
    cssTarget: 'chrome80',
    brotliSize: false,
    chunkSizeWarningLimit: 2000,
    polyfillModulePreload: true
  }
});
