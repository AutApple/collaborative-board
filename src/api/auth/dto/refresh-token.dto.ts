import { z } from 'zod';

export const RefreshTokenDTO = z.object({
    refreshToken: z.string(),
});
export type RefreshTokenDTOType = z.infer<typeof RefreshTokenDTO>;