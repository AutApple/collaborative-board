import type { PrismaClient } from '../generated/prisma/client.js';

export abstract class BaseRepository {
	constructor(protected client: PrismaClient) {}
}
