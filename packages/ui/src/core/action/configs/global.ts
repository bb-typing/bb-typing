import { defineActionConfig, defineActionHotkeys, defineType } from '../helper';

export const globalActionConfig = defineActionConfig('global', [
  {
    name: 'desktop:close-app',
    commands: ['Restart app', '重启应用'],
    description: '重启应用',
    hotkeys: defineActionHotkeys([
      {
        mac: 'command+r',
        win: 'ctrl+r'
      }
    ]),
    __params_type__: defineType<unknown>()
  }
] as const);
