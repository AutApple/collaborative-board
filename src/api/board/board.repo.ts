import { Canvas } from 'canvas';
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
		// TODO: remove rendering logic from board repository, it's the last place where it should be. maybe make rendering service or something
		const canvas = new Canvas(300, 300); 
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, 300, 300);
		const pngBytes = new Uint8Array(canvas.toBuffer('image/png'));

		return await this.dbClient.board.create({ data: {...dto, pngThumbnail: pngBytes} });
	}

	public async update(id: string, dto: CreateBoardDTOType): Promise<Board | null> {
		console.log(dto);
		const board = await this.find(id);
		if (!board) return null;
		return await this.dbClient.board.update({ where: { id }, data: dto });
	}

	public async delete(id: string): Promise<Board | null> {
		const board = await this.find(id);
		if (!board) return null;
		return await this.dbClient.board.delete({ where: { id } });
	}
}
