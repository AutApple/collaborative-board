import { z } from 'zod';

export const CreateUserDTO = z.object({
    email: z.email(),
    username: z.string(),
    hashedPassword: z.string()
});
export type CreateUserDTOType = z.infer<typeof CreateUserDTO>;
