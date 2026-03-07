import { z } from 'zod';

export const OutputRoomDTO = z.object({
	id: z.uuid({ error: 'Id needs to be valid UUID ' }),
	name: z.string({ error: 'Room name needs to be string' }).min(1, 'Room name is required'),
	public: z.boolean({ error: 'Provide room visibility option (public or private) ' }),
	protectedMode: z.boolean({ error: 'protectedMode needs to be a boolean' }),
	createdAt: z.string(),
	pngBase64: z.string(),
});

export type OutputRoomDTOType = z.infer<typeof OutputRoomDTO>;
