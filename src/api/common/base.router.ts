import type { Router } from 'express';
import express from 'express';
import type { APIBaseController } from './base.controller.js';

export class APIBaseRouter {
	protected router: Router = express.Router();
	constructor(protected controller: APIBaseController) {
	}

	public getRouter() {
		return this.router;
	}
}
