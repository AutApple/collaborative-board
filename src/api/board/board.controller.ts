import type { Request, Response } from 'express';
import { APIBaseController } from '../common/base.controller.js';
import type { APIBoardService } from './board.service.js';
import z from 'zod';
import { CreateBoardDTO } from './dtos/create-board.dto.js';
import { OutputBoardDTO } from './dtos/output-board.dto.js';

export class APIBoardController extends APIBaseController {
	constructor(protected service: APIBoardService) {
		super(service);
	}
	public getParam(req: Request, res: Response): void {
		throw new Error('Method not implemented.');
	}
	public get(req: Request, res: Response): void {
		throw new Error('Method not implemented.');
	}
	public async post(req: Request, res: Response): Promise<void> {
		const result = CreateBoardDTO.safeParse(req.body);
		if (!result.success) {
			res.status(400).json({ errors: result.error });
			return;
		}
		const data = result.data;
		const createdBoard = await this.service.create(data);
		res.status(201).json(OutputBoardDTO.fromModel(createdBoard));
	}
	public patch(req: Request, res: Response): void {
		throw new Error('Method not implemented.');
	}
	public put(req: Request, res: Response): void {
		throw new Error('Method not implemented.');
	}
	public delete(req: Request, res: Response): void {
		throw new Error('Method not implemented.');
	}
}
