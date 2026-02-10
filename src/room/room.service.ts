import { Board } from '../../shared/board/board.js';
import type { BoardRepository } from '../board/board.repository.js';
import type { Room, RoomRegistry } from './room-registry.js';

export class RoomService {
	constructor(
		private boardRepository: BoardRepository,
		private roomRegistry: RoomRegistry,
	) {}

	public async createRoom(name?: string): Promise<Room> {
		const board = await this.boardRepository.save(new Board(undefined, name));
		const room = this.roomRegistry.register(board);
		return room;
	}
	public async saveState(boardId: string): Promise<void> {
		const room = this.roomRegistry.get(boardId);
		if (!room) throw new Error('@RoomService.saveState: no board with given id');
		const { board } = room;
		await this.boardRepository.save(board);
	}
}
