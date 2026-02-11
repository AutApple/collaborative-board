import type { Board, PrismaClient } from '../../board-app/generated/prisma/client.js';
import type { CreateBoardDTOType } from './dtos/create-board.dto.js';

export class APIBoardRepository {
	constructor(private dbClient: PrismaClient) {}
	public async find(id: string): Promise<Board | null> {
		const board = await this.dbClient.board.findUnique({ where: { id } });
		return board;
	}

	public async findMany(): Promise<Board[]> {
		const boards = await this.dbClient.board.findMany();
		return boards;
	}
	public async insert(dto: CreateBoardDTOType): Promise<Board> {
		return await this.dbClient.board.create({ data: dto });
	}
}
