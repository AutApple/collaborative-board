import { Board } from '../../../shared/board/board.js';
import { RemoteCursorMap } from '../../../shared/remote-cursor/remote-cursor-map.js';
import type { Room } from '../../../shared/room/room.js';

export class RoomRegistry {
	private roomMap: Map<string, Room> = new Map();
	constructor() {}

	public register(room: Room): void {
		const roomId = room.getId();
		this.roomMap.set(roomId, room);
	}
	public registerMany(roomList: Room[]): void {
		roomList.map((r) => {
			this.register(r);
		});
	}

	public get(roomId: string): Room | undefined {
		return this.roomMap.get(roomId);
	}

	public remove(roomId: string) {
		this.roomMap.delete(roomId);
	}
}
