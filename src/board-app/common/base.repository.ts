import type { PrismaClient } from '../generated/prisma/client.js';

export abstract class BaseRepository<T> {
	constructor(protected client: PrismaClient) {}

	public abstract getAll(): Promise<T[]>;
	public abstract save(entity: T, ...args: any): Promise<T>;
}
