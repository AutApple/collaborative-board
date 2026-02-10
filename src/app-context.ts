import { RoomRegistry } from './room/room-registry.js';

export class AppContext {
	public roomRegistry: RoomRegistry;

	constructor() {
		this.roomRegistry = new RoomRegistry();
	}
}
