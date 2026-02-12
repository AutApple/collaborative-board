import type { Request, Response } from 'express';
import { APIBaseController } from '../common/base.controller.js';
import type { APIBoardService } from './board.service.js';
import { type CreateBoardDTOType } from './dtos/create-board.dto.js';
import { OutputBoardDTO } from './dtos/output-board.dto.js';
import type { BoardModel } from '../../board-app/generated/prisma/models.js';

export class APIBoardController extends APIBaseController {
	constructor(public readonly boardService: APIBoardService) {
		super();
	}

	public async getParam(req: Request, res: Response<any, { board: BoardModel }>): Promise<void> {
		res.status(200).json(OutputBoardDTO.fromModel(res.locals.board));
	}

	public async get(_: Request, res: Response): Promise<void> {
		const models = await this.boardService.getAll();
		res.status(200).json(models.map((m) => OutputBoardDTO.fromModel(m)));
	}

	public async post(_: Request, res: Response<any, { dto: CreateBoardDTOType }>): Promise<void> {
		const dto = res.locals.dto;
		const createdBoard = await this.boardService.create(dto);
		res.status(201).json(OutputBoardDTO.fromModel(createdBoard));
	}

	public async patch(
		req: Request<{ param: string }>,
		res: Response<any, { dto: CreateBoardDTOType }>,
	): Promise<void> {
		// TODO: make UpdateBoardDTOType when board dto grows
		const dto = res.locals.dto;
		const id = req.params['param'];
		const board = await this.boardService.update(id, dto);
		res.status(200).json(OutputBoardDTO.fromModel(board));
	}
	public put(req: Request, res: Response): void {
		res.status(405).json({ message: 'PUT method not supported. Use PATCH instead.' });
	}
	public async delete(req: Request<{ param: string }>, res: Response): Promise<void> {
		const id = req.params['param'];
		const board = await this.boardService.delete(id);
		res.status(200).json(OutputBoardDTO.fromModel(board));
	}
}
