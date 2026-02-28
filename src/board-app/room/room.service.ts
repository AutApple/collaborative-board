import type { AppContext } from '../app-context.js';
import { BaseService } from '../common/base.service.js';
import { ServerRendererService } from '../renderer/renderer.service.js';
import type { RoomRepository } from './room.repository.js';
import type { Room } from '../../../shared/room/room.js';
import type { RoomSchedulerService } from './room-scheduler.service.js';
import type { Cursor } from '../../../shared/remote-cursor/types/cursor.js';

export class RoomService extends BaseService {
	constructor(
		private roomRepository: RoomRepository,
		private rendererService: ServerRendererService,
		private appContext: AppContext,
		private schedulerService: RoomSchedulerService,
		private cleanupDelayMs = 1000,
		private saveDelayMs = 1000 * 60 * 2,
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
			this.saveState.bind(this),
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

	public async registerClient(roomId: string, clientId: string, clientCursor: Cursor) {
		this.schedulerService.unschedule(roomId, 'removeFromRegistry');
		const room = await this.get(roomId);
		if (!room) throw new Error('@RoomService.registerClient: no room with given id');
		room.registerClient(clientId, clientCursor);
		console.log('Client connected, now ', room.getClientsAmount());
	}

	public async unregisterClient(roomId: string, clientId: string) {
		const room = await this.get(roomId);
		if (!room) throw new Error('@RoomService.unregisterClient: no room with given id');
		room.unregisterClient(clientId);

		const clientsLeft = room.getClientsAmount();
		if (clientsLeft === 0)
			this.schedulerService.schedule(
				roomId,
				'removeFromRegistry',
				this.cleanupDelayMs,
				this.removeFromRegistry.bind(this),
			);
	}

	public async removeFromRegistry(roomId: string): Promise<void> {
		this.schedulerService.unschedule(roomId, 'save');
		await this.saveState(roomId);

		this.appContext.roomRegistry.remove(roomId);
	}

	public update(roomId: string, name: string) {
		console.log('Updating room ', name);
		this.appContext.roomRegistry.update(roomId, name);
	}
}
