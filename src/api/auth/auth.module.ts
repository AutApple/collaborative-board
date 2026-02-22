import type { Router } from 'express';
import dbClient from '../../db.js';
import { APIAuthService } from './auth.service.js';
import { APIAuthController } from './auth.controller.js';
import { APIAuthRouter } from './auth.router.js';
import { APIUserRepository } from '../user/user.repo.js';
import { APIUserService } from '../user/user.service.js';
import { APIRefreshTokenRepository } from './refresh-token.repo.js';
import { APIRefreshTokenService } from './refresh-token.service.js';

export default function createAuthApiModule(): Router {
	const userRepo = new APIUserRepository(dbClient);
	const userService = new APIUserService(userRepo); // TODO: inject from user module

	const refreshTokenRepo = new APIRefreshTokenRepository(dbClient);
	const refreshTokenService = new APIRefreshTokenService(refreshTokenRepo);

	const authService = new APIAuthService(refreshTokenService, userService);

	const controller = new APIAuthController(authService);
	const router = new APIAuthRouter(controller);

	return router.getRouter();
}
