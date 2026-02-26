import dbClient from '../../db.js';
import { APIUserController } from './user.controller.js';
import { APIUserRepository } from './user.repo.js';
import { APIUserRouter } from './user.router.js';
import { APIUserService } from './user.service.js';

export default function createUserApiModule() {
	const userRepo = new APIUserRepository(dbClient);
	const userService = new APIUserService(userRepo);
	const controller = new APIUserController(userService);
	const router = new APIUserRouter(controller);

	return {
		router: router.getRouter(),
		service: userService,
	};
}
