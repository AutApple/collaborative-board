import { type Express } from 'express';
import createRoomApiModule from './room/room.module.js';

export function createAndMapApiModules(app: Express) {
	const apiRoomModule = createRoomApiModule();
	app.use('/api/rooms', apiRoomModule);
}
