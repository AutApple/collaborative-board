import { Board } from '../../shared/board/board.js';
import type { AppContext } from '../app-context.js';
import type { BoardRepository } from '../board/board.repository.js';
import type { Room } from './room-registry.js';

export class RoomService {
	constructor(
		private boardRepository: BoardRepository,
		private appContext: AppContext,
	) {}

	public async populateRegistryFromDb() {
		const boardList = await this.boardRepository.getAll(); // TODO: do db load into board somewhere else
		this.appContext.roomRegistry.registerMany(boardList);
	}

	public get(boardId: string): Room | undefined {
		return this.appContext.roomRegistry.get(boardId);
	}

	public async getOrCreate(boardId: string): Promise<Room> {
		let room = this.get(boardId);
		if (!room) room = await this.createRoom();
		return room;
	}

	public async createRoom(name?: string): Promise<Room> {
		const board = await this.boardRepository.save(new Board(undefined, name));
		const room = this.appContext.roomRegistry.register(board);
		return room;
	}

	public async saveState(boardId: string): Promise<void> {
		const room = this.appContext.roomRegistry.get(boardId);
		if (!room) throw new Error('@RoomService.saveState: no board with given id');
		const { board } = room;
		await this.boardRepository.save(board);
	}
}
