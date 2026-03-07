import type { CreateRoomDTOType } from '../../../shared/room/dto/create-room.dto.js';
import type { UpdateRoomDTOType } from '../../../shared/room/dto/update-room.dto.js';
import type { PrismaClient, Room } from '../../board-app/generated/prisma/client.js';

export class APIRoomRepository {
	constructor(private dbClient: PrismaClient) {}

	public async find(id: string): Promise<Room | null> {
		const room = await this.dbClient.room.findUnique({ where: { id } });
		return room;
	}

	public async findPublic(): Promise<Room[]> {
		const boards = await this.dbClient.room.findMany({ where: { public: true } });
		return boards;
	}
	public async insert(
		dto: CreateRoomDTOType & {
			thumbnailPngBytes: Uint8Array<ArrayBuffer>;
			boardId: string;
			authorId: string | null;
		},
	): Promise<Room> {
		return await this.dbClient.room.create({ data: dto });
	}

	public async update(id: string, dto: UpdateRoomDTOType): Promise<Room | null> {
		const board = await this.find(id);
		if (!board) return null;
		const updateFields = Object.fromEntries(
			Object.entries(dto).filter(([_, v]) => v !== undefined),
		);

		return await this.dbClient.room.update({ where: { id }, data: updateFields });
	}
	public async getEditors(roomId: string) {
		return await this.dbClient.room.findUnique({
			where: {id: roomId},
			select: 
			{editors: {select: {username: true, id: true, email: true}}}});
	}
	public async updateEditorIds(roomId: string, addIds: string[], removeIds: string[]) {
		return await this.dbClient.room.update({
			where: { id: roomId },
			data: {
				editors: {
					connect: addIds.map((v) => {
						return { id: v };
					}),
					disconnect: removeIds.map((v) => {
						return { id: v };
					}),
				},
			},
		});
	}

	public async delete(id: string): Promise<Room | null> {
		const board = await this.find(id);
		if (!board) return null;
		return await this.dbClient.room.delete({ where: { id } });
	}
}
