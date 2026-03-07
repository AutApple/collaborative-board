import type { APIRoomRepository } from './room.repo.js';
import type { APIBoardRepository } from '../board/board.repo.js';
import type { CommandBus } from '../../command-bus/command-bus.js';
import { RenderBlankCommand } from '../../command-bus/commands/renderer/render-blank.command.js';
import { UpdateRoomCommand } from '../../command-bus/commands/room/update-room.command.js';
import type { CreateRoomDTOType } from '../../../shared/room/dto/create-room.dto.js';
import type { UpdateRoomDTOType } from '../../../shared/room/dto/update-room.dto.js';
import type { APIUserService } from '../user/user.service.js';
import type { UpdateRoomEditorsDTOType } from './dto/update-editors.dto.js';
import { UpdateRoomEditorsCommand } from '../../command-bus/commands/room/update-room-editors.command.js';

export class APIRoomService {
	constructor(
		private roomRepo: APIRoomRepository,
		private boardRepo: APIBoardRepository,
		private userService: APIUserService,
		private commandBus: CommandBus,
	) {}

	public async getPublic() {
		return await this.roomRepo.findPublic();
	}
	public async get(id: string) {
		return await this.roomRepo.find(id);
	}

	public async create(dto: CreateRoomDTOType, userId: string | undefined) {
		if (userId === undefined && dto.public === true) {
			return null;
		}

		// query command bus to get blank thumbnail from app renderer service
		const thumbnailPngBytes = (await this.commandBus.execute(
			new RenderBlankCommand(),
		)) as Uint8Array<ArrayBuffer>;

		// create board
		const board = await this.boardRepo.insert({});

		return await this.roomRepo.insert({
			...dto,
			thumbnailPngBytes,
			boardId: board.id,
			authorId: userId ?? null,
		});
	}

	public async update(id: string, dto: UpdateRoomDTOType) {
		// Author only | admin
		const room = await this.roomRepo.update(id, dto);
		this.commandBus.execute(
			new UpdateRoomCommand({
				roomId: id,
				name: dto.name,
				protectedMode: dto.protectedMode,
			}),
		);
		if (room === null) throw new Error('Room not found');
		return room;
	}

	public async getEditors(id: string): Promise<string[]> {
		const room = await this.roomRepo.getEditors(id);
		if (!room) throw new Error('Room not found');
		return room.editors.map(e => e.username);
	}

	public async updateEditors(id: string, dto: UpdateRoomEditorsDTOType) {
		let addUserIds: string[] = [];
		let removeUserIds: string[] = [];

		if (dto.add) {
			const users = await this.userService.getManyByUsernames(dto.add);
			addUserIds = users.map((u) => u.id);
		}
		if (dto.remove) {
			const users = await this.userService.getManyByUsernames(dto.remove);
			removeUserIds = users.map((u) => u.id);
		}

		const res = await this.roomRepo.updateEditorIds(id, addUserIds, removeUserIds);
		this.commandBus.execute(
			new UpdateRoomEditorsCommand({
				roomId: id,
				addIds: addUserIds,
				removeIds: removeUserIds,
			}),
		);
		return res;
	}

	public async delete(id: string) {
		// Author only | admin
		const board = await this.roomRepo.delete(id);
		if (board === null) throw new Error('Board not found');
		return board;
	}
}
