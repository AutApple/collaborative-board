import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './board-app/generated/prisma/client.js';
import { env } from './config/env.config.js';

const connectionString = env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const dbClient = new PrismaClient({ adapter });

export default dbClient;
