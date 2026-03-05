import { z } from 'zod';

export const OutputRoomDTO = z.object({
	id: z.uuid({ error: 'Id needs to be valid UUID ' }),
	name: z.string({ error: 'Room name needs to be string' }).min(1, 'Room name is required'),
	public: z.boolean({ error: 'Provide room visibility option (public or private) ' }),
	createdAt: z.date(),
	pngBase64: z.string(),
});

export type OutputRoomDTOType = z.infer<typeof OutputRoomDTO>;
