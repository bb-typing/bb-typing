import type { MergedModifierCode } from 'super-hotkey';

import { Platform } from './platform';

export function filterModifierKey(key: MergedModifierCode): string {
  return key === 'Mod' ? (Platform.isMacos ? 'cmd' : 'ctrl') : key;
}
