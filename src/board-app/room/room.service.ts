import type { AppContext } from '../app-context.js';
import { BaseService } from '../common/base.service.js';
import { ServerRendererService } from '../../shared/renderer/renderer.service.js';
import type { RoomRepository } from './room.repository.js';
import type { Room } from '../../../shared/room/room.js';
import type { RoomSchedulerService } from './room-scheduler.service.js';

export class RoomService extends BaseService {
	constructor(
		private roomRepository: RoomRepository,
		private rendererService: ServerRendererService,
		private appContext: AppContext,
		private schedulerService: RoomSchedulerService,
		private cleanupDelayMs = 1000, 
		private saveDelayMs = 1000 * 60 * 2
	) {
		super();
	}

	private async loadIntoRegistryAndGet(roomId: string): Promise<Room | undefined> {
		const room = await this.roomRepository.get(roomId);
		if (!room) return undefined;
		this.appContext.roomRegistry.register(room);
		
		this.schedulerService.scheduleRegular(
			room.getId(),
			'save',
			this.saveDelayMs,
			this.saveState.bind(this)
		);

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

	public async removeFromRegistry(roomId: string): Promise<void> {
		this.schedulerService.unschedule(roomId, 'save');
		this.appContext.roomRegistry.remove(roomId);
	}
}
