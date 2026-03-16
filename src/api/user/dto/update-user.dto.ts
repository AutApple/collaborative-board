import { z } from 'zod';

export const UpdateUserDTO = z.object({
	email: z.optional(z.email()),
	username: z.optional(z.string()),
	isBanned: z.optional(z.boolean()),
	isAdmin: z.optional(z.boolean()),
});

export type UpdateUserDTOType = z.infer<typeof UpdateUserDTO>;
