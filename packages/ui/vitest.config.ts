import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

import { aliasPathMap } from '../../config/alias-path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: aliasPathMap
  },
  test: {
    environment: 'jsdom'
  }
});
