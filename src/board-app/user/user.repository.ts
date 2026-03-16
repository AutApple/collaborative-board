import { ClientIdentity } from '../client/client-identity.js';
import { BaseRepository } from '../common/base.repository.js';

export class UserRepository extends BaseRepository {
    public async get(email: string): Promise<ClientIdentity | null> {
		const userModel = await this.client.user.findUnique({where: {email}});
        if (!userModel) return null;

		return new ClientIdentity(userModel.id, userModel.email, userModel.isBanned, userModel.isAdmin);
	} 
} 