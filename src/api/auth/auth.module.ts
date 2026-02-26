import type { Router } from 'express';
import dbClient from '../../db.js';
import { APIAuthService } from './auth.service.js';
import { APIAuthController } from './auth.controller.js';
import { APIAuthRouter } from './auth.router.js';
import { APIUserService } from '../user/user.service.js';
import { APIRefreshTokenRepository } from './refresh-token.repo.js';
import { APIRefreshTokenService } from './refresh-token.service.js';

export default function createAuthApiModule(userService: APIUserService) {
	const refreshTokenRepo = new APIRefreshTokenRepository(dbClient);
	const refreshTokenService = new APIRefreshTokenService(refreshTokenRepo);

	const authService = new APIAuthService(refreshTokenService, userService);

	const controller = new APIAuthController(authService);
	const router = new APIAuthRouter(controller);

	return {
		router: router.getRouter(),
		service: [authService, refreshTokenService],
	};
}
