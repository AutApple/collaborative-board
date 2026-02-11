import { z } from 'zod';

export const CreateBoardDTO = z.object({
	name: z.string({error: 'Board name needs to be string'}).min(1, 'Board name is required'),
});

export type CreateBoardDTOType = z.infer<typeof CreateBoardDTO>;
