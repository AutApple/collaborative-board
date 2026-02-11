import { Board } from '../../../shared/board/board.js';
import { RemoteCursorMap } from '../../../shared/remote-cursor/remote-cursor-map.js';

export interface Room {
	board: Board;
	cursorMap: RemoteCursorMap;
}

export class RoomRegistry {
	private roomMap: Map<string, Room> = new Map();
	constructor() {}

	public register(board: Board): Room {
		const boardId = board.getId();
		if (!boardId) throw new Error('RoomRegistry: trying to register board with no id assigned');
		const cursorMap = new RemoteCursorMap();

		this.roomMap.set(boardId, {
			board,
			cursorMap,
		});

		return { board, cursorMap };
	}
	public registerMany(boardList: Board[]): Room[] {
		const rooms: Room[] = [];
		boardList.map((b) => {
			const room = this.register(b);
			rooms.push(room);
		});
		return rooms;
	}

	public get(boardId: string): Room | undefined {
		return this.roomMap.get(boardId);
	}

	public remove(boardId: string) {
		this.roomMap.delete(boardId);
	}
}
