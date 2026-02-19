import type { Board, PrismaClient } from '../../board-app/generated/prisma/client.js';
import type { CreateBoardDTOType } from './dto/create-board.dto.js';

export class APIBoardRepository {
    constructor(private dbClient: PrismaClient) {}
    
    public async find(id: string): Promise<Board | null> {
        const room = await this.dbClient.board.findUnique({where: {id}});
        return room;
    }

    public async findMany(): Promise<Board[]> {
        const boards = await this.dbClient.board.findMany();
        return boards;
    }
    public async insert(dto: CreateBoardDTOType): Promise<Board> {
        return await this.dbClient.board.create({ data: dto });
    }

    public async update(id: string, dto: CreateBoardDTOType): Promise<Board | null> {
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
