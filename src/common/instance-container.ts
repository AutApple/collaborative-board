import type { BaseRepository } from './base.repository.js';
import type { BaseService } from './base.service.js';

export class InstanceContainer<B> {
	constructor(private instances: B[]) {}

	getInstance<T extends B>(ctor: new (...args: any[]) => T): T {
		const instance = this.instances.find((r) => r instanceof ctor) as T | undefined;
		if (instance === undefined)
			throw new Error('Trying to get unexisting instance from InstanceContainer');
		return instance;
	}
}

export type RepositoryContainer = InstanceContainer<BaseRepository<any>>;
export type ServiceContainer = InstanceContainer<BaseService>;
