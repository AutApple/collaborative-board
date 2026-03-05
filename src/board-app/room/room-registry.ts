import type { ServerRoom } from './server-room.js';

export class RoomRegistry {
	private roomMap: Map<string, ServerRoom> = new Map();
	constructor() {}

	public register(room: ServerRoom): void {
		const roomId = room.getId();
		this.roomMap.set(roomId, room);
	}
	public registerMany(roomList: ServerRoom[]): void {
		roomList.map((r) => {
			this.register(r);
		});
	}

	public get(roomId: string): ServerRoom | undefined {
		return this.roomMap.get(roomId);
	}

	public update(roomId: string, name: string, protectedMode: boolean): void {
		// TODO: some kind of shared update room dto
		const room = this.get(roomId);
		if (!room) return;
		room.setName(name);
		room.setProtection(protectedMode);
	}

	public remove(roomId: string) {
		this.roomMap.delete(roomId);
	}
}
