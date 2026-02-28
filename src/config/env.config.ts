import { z } from 'zod';
import dotenv from 'dotenv';

// loading .env in non-production
if (process.env.NODE_ENV !== 'PROD') {
	dotenv.config();
}

const envSchema = z.object({
	NODE_ENV: z.enum(['DEV', 'PROD']),
	APP_PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.string(),
	JWT_ACCESS_EXPIRATION_SECONDS: z.coerce.number(),
	JWT_REFRESH_EXPIRATION_DAYS: z.coerce.number(),
	JWT_ACCESS_SECRET: z.string(),
	JWT_REFRESH_SECRET: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error('Invalid environment variables: ', parsed.error.format());
	process.exit(1);
}

export const env = parsed.data;
