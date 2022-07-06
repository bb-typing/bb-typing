import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'

export default defineConfig({
    resolve: {
        alias: {
            "@bb/components": fileURLToPath(new URL('../components/src/index.ts', import.meta.url))
        }
    }
})