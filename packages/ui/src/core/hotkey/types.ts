export type HotkeyPlatform = 'win' | 'mac' | 'default';

export type DefaultHotkeys = ReadonlyArray<Partial<Record<HotkeyPlatform, string>>>;
