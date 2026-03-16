import type { ClientIdentity } from '../client/client-identity.js';
import type { UserRepository } from './user.repository.js';

export class ApplicationUserService {
    constructor (private readonly repo: UserRepository) {}
    public async getUser(email: string): Promise<ClientIdentity | null> {
        return this.repo.get(email);
    }
}