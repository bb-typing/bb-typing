import { fileURLToPath } from 'url'
import {AliasOptions} from 'vite'

export const alias: AliasOptions = {
    "@bb/components": fileURLToPath(new URL('../packages/components/src', import.meta.url))
}