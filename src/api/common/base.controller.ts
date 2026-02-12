import type { Request, Response } from 'express';
import type { APIBaseService } from './base.service.js';
export abstract class APIBaseController {
	constructor() {}
	public abstract get(req: Request, res: Response): void;
	public abstract getParam(req: Request, res: Response): void;
	public abstract post(req: Request, res: Response): void;
	public abstract patch(req: Request, res: Response): void;
	public abstract put(req: Request, res: Response): void;
	public abstract delete(req: Request, res: Response): void;
}
