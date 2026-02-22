import { z } from 'zod';

export const LoginDTO = z.object({
    email: z.email({ error: 'Invalid email' }),
    password: z.string()
});
export type LoginDTOType = z.infer<typeof LoginDTO>;
