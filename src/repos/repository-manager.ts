import type { BaseRepository } from './base.repository.js';

export class RepositoryManager {
  constructor(private repos: BaseRepository<any>[]) {}

  getRepo<T extends BaseRepository<any>>(ctor: new (...args: any[]) => T): T | undefined {
    return this.repos.find(r => r instanceof ctor) as T | undefined;
  }
}