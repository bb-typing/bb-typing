import { defineActionConfig, defineType } from '../helper';

export const globalActionConfig = defineActionConfig('global', [
  {
    name: 'desktop:close-app',
    supportedPlatforms: ['desktop:mac', 'desktop:win'],
    commands: ['Restart app', '重启应用'],
    description: '重启应用',
    defaultHotkeys: [
      {
        mac: 'command+r',
        win: 'ctrl+r'
      }
    ],
    __params_type__: defineType<unknown>()
  },
  {
    name: 'open-search-modal',
    supportedPlatforms: ['desktop:mac', 'desktop:win', 'web:mac', 'web:win'],
    commands: ['Open search modal', '打开搜索框'],
    description: '打开搜索框，输入命令、描述等进行功能调用',
    defaultHotkeys: [
      {
        win: 'ctrl+shift+p',
        mac: 'command+shift+p'
      }
    ],
    __params_type__: defineType<unknown>()
  }
] as const);
