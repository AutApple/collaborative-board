import type { Router } from 'express';
import express from 'express';

export class APIBaseRouter {
	protected router: Router = express.Router();
	constructor() {}

	public getRouter() {
		return this.router;
	}
}
