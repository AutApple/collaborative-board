import { z } from 'zod';

export const CreateBoardDTO = z.object({
});

export type CreateBoardDTOType = z.infer<typeof CreateBoardDTO>;
