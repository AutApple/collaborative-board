import { Server } from 'node:http';
import { Board } from '../../../shared/board/board.js';
import type { AppContext } from '../app-context.js';
import type { BoardRepository } from '../board/board.repository.js';
import { BaseService } from '../common/base.service.js';
import { ServerRendererService } from '../../shared/renderer/renderer.service.js';
import type { Room } from './room-registry.js';

export class RoomService extends BaseService {
	constructor(
		private boardRepository: BoardRepository,
		private rendererService: ServerRendererService,
		private appContext: AppContext,
	) {
		super();
	}

	public async populateRegistryFromDb() {
		const boardList = await this.boardRepository.getAll(); // TODO: dynamic roomRegistry population (only keep the active boards)
		this.appContext.roomRegistry.registerMany(boardList);
	}

	private async loadIntoRegistryAndGet(boardId: string): Promise<Room | undefined> {
		const board = await this.boardRepository.get(boardId);
		if (!board) return undefined;
		const room = this.appContext.roomRegistry.register(board);
		return room;
	}

	public async get(boardId: string): Promise<Room | undefined> {
		let room = this.appContext.roomRegistry.get(boardId);
		if (room !== undefined) return room;
		room = await this.loadIntoRegistryAndGet(boardId);
		return room;
	}

	public async createRoom(name?: string): Promise<Room> {
		const boardInstance = new Board(undefined, name);
		const board = await this.boardRepository.save(boardInstance, this.rendererService.renderBoardToBytes(boardInstance));
		const room = this.appContext.roomRegistry.register(board);
		return room;
	}

	public async saveState(boardId: string): Promise<void> {
		const room = this.appContext.roomRegistry.get(boardId);
		if (!room) throw new Error('@RoomService.saveState: no board with given id');
		const { board } = room;
		await this.boardRepository.save(board, this.rendererService.renderBoardToBytes(board));
	}
}
