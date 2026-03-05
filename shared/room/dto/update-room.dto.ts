import { z } from 'zod';

export const UpdateRoomDTO = z.object({
	name: z.optional(
		z.string({ error: 'Room name needs to be string' }).min(1, 'Room name is required'),
	),
	public: z.optional(z.boolean({ error: 'Provide room visibility option (public or private) ' })),
});

export type UpdateRoomDTOType = z.infer<typeof UpdateRoomDTO>;
