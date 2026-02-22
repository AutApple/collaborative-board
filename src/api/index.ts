import { type Express } from 'express';
import createRoomApiModule from './room/room.module.js';
import createAuthApiModule from './auth/auth.module.js';

export function createAndMapApiModules(app: Express) {
	const apiRoomModule = createRoomApiModule();
	const apiAuthModule = createAuthApiModule();

	app.use('/api/rooms', apiRoomModule);
	app.use('/api/auth', apiAuthModule);
}
