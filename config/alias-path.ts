import { fileURLToPath } from 'url';
import type { AliasOptions } from 'vite';

export const aliasPathMap: AliasOptions = {
  '@ui': fileURLToPath(new URL('../packages/ui/src', import.meta.url)),
  '@shared': fileURLToPath(new URL('../packages/shared', import.meta.url))
};
