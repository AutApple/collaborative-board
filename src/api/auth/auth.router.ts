import { APIBaseRouter } from '../common/base.router.js';
import { validateDTO } from '../common/middleware/validate-dto.middleware.js';
import type { APIAuthController } from './auth.controller.js';
import { LoginDTO } from './dto/login.dto.js';
import { RegisterDTO } from './dto/register.dto.js';
import { RefreshTokenDTO } from './dto/refresh-token.dto.js';
import { validateAccessToken } from './middleware/validateAccessToken.js';

export class APIAuthRouter extends APIBaseRouter {
	constructor(protected controller: APIAuthController) {
		super();
		this.bindRoutes();
	}

	private bindRoutes() {
		this.router.post('/login', validateDTO(LoginDTO), this.controller.login.bind(this.controller));

		this.router.post(
			'/register',
			validateDTO(RegisterDTO),
			this.controller.register.bind(this.controller),
		);

		this.router.post(
			'/logout',
			validateDTO(RefreshTokenDTO),
			this.controller.logout.bind(this.controller),
		);

		this.router.post(
			'/refresh',
			validateDTO(RefreshTokenDTO),
			this.controller.refresh.bind(this.controller),
		);
	}
}
