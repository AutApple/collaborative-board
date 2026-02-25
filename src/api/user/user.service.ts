import type { RefreshToken, User } from '../../board-app/generated/prisma/client.js';
import type { CreateUserDTOType } from './dto/create-user.dto.js';
import type { APIUserRepository } from './user.repo.js';
import bcrypt from 'bcrypt';

export class APIUserService {
	constructor(private userRepo: APIUserRepository) {}

	public async getUser(email: string): Promise<User | null> {
		const user = await this.userRepo.find(email);
		return user;
	}

	public async getUserSafe(email: string): Promise<Partial<User> | null> {
		const user = await this.userRepo.find(email);
		if (!user) return null;
		return { email: user.email, username: user.username, createdAt: user.createdAt };
	}

	public async getUserById(id: string): Promise<User | null> {
		const user = await this.userRepo.findById(id);
		return user;
	}

	public async create(dto: CreateUserDTOType): Promise<User> {
		return await this.userRepo.insert(dto);
	}
}
