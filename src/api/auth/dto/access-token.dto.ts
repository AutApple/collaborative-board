import { z } from 'zod';

export const AccessTokenDTO = z.object({
	accessToken: z.string(),
});
export type AccessTokenDTOType = z.infer<typeof AccessTokenDTO>;
