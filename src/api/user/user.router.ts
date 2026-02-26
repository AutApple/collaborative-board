import { validateAndSetAccessToken } from '../auth/middleware/validateAccessToken.js';
import { APIBaseRouter } from '../common/base.router.js';
import type { APIUserController } from './user.controller.js';

export class APIUserRouter extends APIBaseRouter {
	constructor(protected controller: APIUserController) {
		super();
		this.bindRoutes();
	}

	private bindRoutes() {
		this.router.get('/me', validateAndSetAccessToken, this.controller.me.bind(this.controller));
	}
}
