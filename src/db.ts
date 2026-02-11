import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './board-app/generated/prisma/client.js';

import dotenv from 'dotenv';

dotenv.config();
const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const dbClient = new PrismaClient({ adapter });

export default dbClient;
