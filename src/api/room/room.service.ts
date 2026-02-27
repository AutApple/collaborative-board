import type { ServerRendererService } from '../../shared/renderer/renderer.service.js';
import type { APIRoomRepository } from './room.repo.js';
import type { CreateRoomDTOType } from './dtos/create-room.dto.js';
import type { APIBoardRepository } from '../board/board.repo.js';

export class APIRoomService {
	constructor(
		private roomRepo: APIRoomRepository,
		private boardRepo: APIBoardRepository,
		private rendererService: ServerRendererService,
	) {}

	public async getPublic() {
		return await this.roomRepo.findPublic();
	}
	public async get(id: string) {
		return await this.roomRepo.find(id);
	}

	public async create(dto: CreateRoomDTOType, userId: string | undefined) {
		if (userId === undefined && dto.public === true) dto.public = false; // TODO: make this shitty code more elegant
		const thumbnailPngBytes = this.rendererService.renderBlankToBytes();

		// create board
		const board = await this.boardRepo.insert({});

		return await this.roomRepo.insert({
			...dto,
			thumbnailPngBytes,
			boardId: board.id,
			authorId: userId ?? null,
		});
	}

	public async update(id: string, dto: CreateRoomDTOType) {
		const board = await this.roomRepo.update(id, dto);
		if (board === null) throw new Error('Board not found');
		return board;
	}
	public async delete(id: string) {
		const board = await this.roomRepo.delete(id);
		if (board === null) throw new Error('Board not found');
		return board;
	}
}
