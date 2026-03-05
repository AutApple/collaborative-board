import { z } from 'zod';

export const UpdateRoomEditorsDTO = z.object({
	add: z.optional(
		z.array(z.string({ error: 'Username needs to be string' }).min(1, 'Username is required')),
	),
	remove: z.optional(
		z.array(z.string({ error: 'Username needs to be string' }).min(1, 'Username is required')),
	),
});

export type UpdateRoomEditorsDTOType = z.infer<typeof UpdateRoomEditorsDTO>;
