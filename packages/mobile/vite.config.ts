import { defineConfig } from 'vite';
import { alias } from '../../vite/alias';
import react from '@vitejs/plugin-react'

export default defineConfig({
  resolve: {
    alias,
  },
  plugins: [
    react()
  ]
});