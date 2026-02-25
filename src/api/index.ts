import { type Express } from 'express';
import createRoomApiModule from './room/room.module.js';
import createAuthApiModule from './auth/auth.module.js';
import createUserApiModule from './user/user.module.js';

export function createAndMapApiModules(app: Express) {
	const apiUserModule = createUserApiModule();
	const apiRoomModule = createRoomApiModule();
	const apiAuthModule = createAuthApiModule(apiUserModule.service);

	app.use('/api/users', apiUserModule.router);
	app.use('/api/rooms', apiRoomModule.router);
	app.use('/api/auth', apiAuthModule.router);
}
