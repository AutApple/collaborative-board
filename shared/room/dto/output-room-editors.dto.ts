import { z } from 'zod';

export const OutputRoomEditorsDTO = z.object({
    editors: z.array(z.string())
});

export type OutputRoomEditorsDTOType = z.infer<typeof OutputRoomEditorsDTO>;
