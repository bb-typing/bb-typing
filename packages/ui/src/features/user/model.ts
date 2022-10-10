import * as z from 'zod';

export const userLoginFormSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不可为空')
});

export type UserLoginFormSchema = z.infer<typeof userLoginFormSchema>;
