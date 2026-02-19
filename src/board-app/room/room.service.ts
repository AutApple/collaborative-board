import { Board } from '../../../shared/board/board.js';
import type { AppContext } from '../app-context.js';
import { BaseService } from '../common/base.service.js';
import { ServerRendererService } from '../../shared/renderer/renderer.service.js';
import type { RoomRepository } from './room.repository.js';
import type { Room } from '../../../shared/room/room.js';

export class RoomService extends BaseService {
	constructor(
		private roomRepository: RoomRepository,
		private rendererService: ServerRendererService,
		private appContext: AppContext,
	) {
		super();
	}

	public async populateRegistryFromDb() {
		const roomList = await this.roomRepository.getAll(); // TODO: dynamic roomRegistry population (only keep the active boards)
		this.appContext.roomRegistry.registerMany(roomList);
	}

	private async loadIntoRegistryAndGet(roomId: string): Promise<Room | undefined> {
		const room = await this.roomRepository.get(roomId);
		if (!room) return undefined;
		this.appContext.roomRegistry.register(room);
		return room;
	}

	public async get(roomId: string): Promise<Room | undefined> {
		let room = this.appContext.roomRegistry.get(roomId);
		if (room !== undefined) return room;
		room = await this.loadIntoRegistryAndGet(roomId);
		return room;
	}

	public async saveState(roomId: string): Promise<void> {
		const room = this.appContext.roomRegistry.get(roomId);
		if (!room) throw new Error('@RoomService.saveState: no room with given id');
		const board = room.getBoard();
		await this.roomRepository.save(room, this.rendererService.renderBoardToBytes(board));
	}
}
