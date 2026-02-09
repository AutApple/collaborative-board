import { Board } from '../shared/board/board.js';
import { RemoteCursorMap } from '../shared/remote-cursor/remote-cursor-map.js';

export interface Room {
	board: Board;
	cursorMap: RemoteCursorMap;
}

export class RoomMap {
	private roomMap: Map<string, Room> = new Map();
	constructor() {}

	public add(boardId: string, boardName: string): Room {
		const board = new Board(boardName);
		const cursorMap = new RemoteCursorMap();

		this.roomMap.set(boardId, {
			board,
			cursorMap,
		});

		return { board, cursorMap };
	}

	public get(boardId: string): Room | undefined {
		return this.roomMap.get(boardId);
	}

	public remove(boardId: string) {
		this.roomMap.delete(boardId);
	}
}
