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

	public update(roomId: string, name: string): void {
		// TODO: some kind of shared update room dto
		const room = this.get(roomId);
		if (!room) return;
		room.setName(name);
	}

	public remove(roomId: string) {
		this.roomMap.delete(roomId);
	}
}
