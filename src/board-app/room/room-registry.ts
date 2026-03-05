import type { UpdateRoomDTOType } from '../../../shared/room/dto/update-room.dto.js';
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

	public update(roomId: string, dto: UpdateRoomDTOType): void {
		const room = this.get(roomId);
		if (!room) return;

		if (dto.name !== undefined) room.setName(dto.name);
		if (dto.protectedMode !== undefined) room.setProtection(dto.protectedMode);

		console.log(`Update finished! Now room protection mode is set to ${room.isProtected()}`);
	}

	public remove(roomId: string) {
		this.roomMap.delete(roomId);
	}
}
