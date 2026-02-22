import type { PrismaClient, RefreshToken, User } from '../../board-app/generated/prisma/client.js';
import type { CreateUserDTOType } from './dto/create-user.dto.js';

export class APIUserRepository {
    constructor(private dbClient: PrismaClient) {}
    
    public async find(email: string): Promise<User | null> {
        const user = await this.dbClient.user.findUnique({where: { email }});
        return user;
    }

    public async findById(id: string): Promise<User | null> {
        const user = await this.dbClient.user.findUnique({where: { id }});
        return user;
    }
    
    public async findMany(): Promise<User[]> {
        const users = await this.dbClient.user.findMany();
        return users;
    }
    public async insert(data: CreateUserDTOType): Promise<User> {
        return await this.dbClient.user.create({ data: data });
    }

    public async update(email: string, data: CreateUserDTOType): Promise<User | null> { // TODO: make update dto
        const user = await this.find(email);
        if (!user) return null;
        return await this.dbClient.user.update({ where: { email }, data });
    }

    public async delete(email: string): Promise<User | null> {
        const user = await this.find(email);
        if (!user) return null;
        return await this.dbClient.user.delete({ where: { email } });
    }
}
