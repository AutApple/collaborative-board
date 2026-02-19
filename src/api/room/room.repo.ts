import type { PrismaClient, Room } from '../../board-app/generated/prisma/client.js';
import type { CreateRoomDTOType } from './dtos/create-room.dto.js';

export class APIRoomRepository {
	constructor(private dbClient: PrismaClient) {}
	
	public async find(id: string): Promise<Room | null> {
		const room = await this.dbClient.room.findUnique({where: {id}});
		return room;
	}

	public async findMany(): Promise<Room[]> {
		const boards = await this.dbClient.room.findMany();
		return boards;
	}
	public async insert(dto: CreateRoomDTOType & { thumbnailPngBytes: Uint8Array<ArrayBuffer>, boardId: string }): Promise<Room> {
		return await this.dbClient.room.create({ data: dto });
	}

	public async update(id: string, dto: CreateRoomDTOType): Promise<Room | null> {
		const board = await this.find(id);
		if (!board) return null;
		return await this.dbClient.room.update({ where: { id }, data: dto });
	}

	public async delete(id: string): Promise<Room | null> {
		const board = await this.find(id);
		if (!board) return null;
		return await this.dbClient.room.delete({ where: { id } });
	}
}
