import { defineSuperStatus, SuperStatusBox } from '@mimi-utils/super-status-box';

const sidebarFoldStatusOrigin = defineSuperStatus([
  { alias: '仅图标', key: 'icon', unifyLabel: '图标' },
  { alias: '图标与文字', key: 'icon-text', unifyLabel: '图标与文字' },
  { alias: '隐藏', key: 'hide', unifyLabel: '隐藏' }
] as const);

export const sidebarFoldStatus = new SuperStatusBox(sidebarFoldStatusOrigin);
