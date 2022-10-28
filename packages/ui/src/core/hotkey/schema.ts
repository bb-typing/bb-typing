import * as z from 'zod';

const baseHotkeyInfoSchema = z.object({
  id: z.string(),
  supportedPlatforms: z.array(z.string()),
  hotkeyContent: z.any(),
  scope: z.string()
});

export const userHotkeyInfoSchema = baseHotkeyInfoSchema.extend({
  defaultOriginId: z.string().optional(),
  updateTime: z.number(),
  status: z.union([z.literal('enable'), z.literal('disable'), z.literal('delete')])
});

export const userHotkeyMapSchema = z.record(
  z.string(),
  z.record(z.enum(['win', 'mac', 'default']), z.array(userHotkeyInfoSchema))
);
