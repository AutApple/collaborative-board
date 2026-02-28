import type { APIRoomRepository } from './room.repo.js';
import type { CreateRoomDTOType } from './dtos/create-room.dto.js';
import type { APIBoardRepository } from '../board/board.repo.js';
import type { CommandBus } from '../../command-bus/command-bus.js';
import { RenderBlankCommand } from '../../command-bus/commands/renderer/render-blank.command.js';

export class APIRoomService {
	constructor(
		private roomRepo: APIRoomRepository,
		private boardRepo: APIBoardRepository,
		private commandBus: CommandBus
	) {}

	public async getPublic() {
		return await this.roomRepo.findPublic();
	}
	public async get(id: string) {
		return await this.roomRepo.find(id);
	}

	public async create(dto: CreateRoomDTOType, userId: string | undefined) {
		if (userId === undefined && dto.public === true) dto.public = false; // TODO: make this shitty code more elegant

		// query command bus to get blank thumbnail from app renderer service
		const thumbnailPngBytes = (await this.commandBus.execute(new RenderBlankCommand())) as Uint8Array<ArrayBuffer>; 
		
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
