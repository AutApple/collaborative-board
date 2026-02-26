import { z } from 'zod';

export const CreateRoomDTO = z.object({
	name: z.string({ error: 'Room name needs to be string' }).min(1, 'Room name is required'),
	public: z.boolean({ error: 'Provide room visibility option (public or private) ' }),
});

export type CreateRoomDTOType = z.infer<typeof CreateRoomDTO>;
