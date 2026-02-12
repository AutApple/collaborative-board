import type { Request, Response } from 'express';
import { APIBaseController } from '../common/base.controller.js';
import type { APIBoardService } from './board.service.js';
import { CreateBoardDTO, type CreateBoardDTOType } from './dtos/create-board.dto.js';
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
	public async post(req: Request, res: Response<any, { dto: CreateBoardDTOType }>): Promise<void> {
		const dto = res.locals.dto;
		const createdBoard = await this.service.create(dto);
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
