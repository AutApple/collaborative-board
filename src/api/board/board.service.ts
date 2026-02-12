import { APIBaseService } from '../common/base.service.js';
import type { APIBoardRepository } from './board.repo.js';
import type { CreateBoardDTOType } from './dtos/create-board.dto.js';

export class APIBoardService extends APIBaseService {
	constructor(private boardRepo: APIBoardRepository) {
		super();
	}

	public async getAll() {
		return await this.boardRepo.findMany();
	}
	public async get(id: string) {
		return await this.boardRepo.find(id);
	}
	public async create(dto: CreateBoardDTOType) {
		return await this.boardRepo.insert(dto);
	}
	public async update(id: string, dto: CreateBoardDTOType) {
		const board = await this.boardRepo.update(id, dto);
		if (board === null) throw new Error('Board not found');
		return board;
	}
	public async delete(id: string) {
		const board = await this.boardRepo.delete(id);
		if (board === null) throw new Error('Board not found');
		return board;
	}
}
