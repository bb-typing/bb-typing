import react from '@vitejs/plugin-react';
import { rmSync } from 'fs';
import path from 'path';
import { inspectorServer } from 'react-dev-inspector/plugins/vite';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';

import pkg from './package.json';
import { aliasPathMap } from '../../config/alias-path';

removeDistDir();

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      ...aliasPathMap
    }
  },
  plugins: [
    react(),
    electron({
      main: {
        entry: 'main/bootstrap.ts',
        vite: {
          build: {
            sourcemap: false,
            outDir: 'dist/electron/'
          }
        }
      },
      preload: {
        input: {
          preload: path.join(__dirname, 'main/preload/index.ts')
        },
        vite: {
          build: {
            sourcemap: 'inline',
            outDir: 'dist/electron/'
          }
        }
      },
      // Enables use of Node.js API in the Renderer-process
      renderer: {}
    }),
    // https://github.com/zthxxx/react-dev-inspector#usage-with-vite2
    inspectorServer()
  ],
  server: {
    host: pkg.env.VITE_DEV_SERVER_HOST,
    port: pkg.env.VITE_DEV_SERVER_PORT
  },
  define: {}
});

function removeDistDir() {
  rmSync(path.join(__dirname, 'dist'), { recursive: true, force: true });
}
