import type { Request, Response } from 'express';
import type { APIRoomService } from './room.service.js';
import { type CreateRoomDTOType } from './dtos/create-room.dto.js';
import { OutputRoomDTO } from './dtos/output-room.dto.js';
import type { Room } from '../../board-app/generated/prisma/client.js';
import type { DtoResponseLocals } from '../common/middleware/validate-dto.middleware.js';
import type { OptionalAccessTokenResponseLocals } from '../auth/middleware/safe-validate-and-set-access-token.middleware.js';

export class APIRoomController {
	constructor(public readonly roomService: APIRoomService) {}

	public async getParam(req: Request, res: Response<any, { room: Room }>): Promise<void> {
		res.status(200).json(OutputRoomDTO.fromModel(res.locals.room));
	}

	public async get(_: Request, res: Response): Promise<void> {
		const models = await this.roomService.getPublic();
		res.status(200).json(models.map((m) => OutputRoomDTO.fromModel(m)));
	}

	public async post(
		_: Request,
		res: Response<any, DtoResponseLocals<CreateRoomDTOType> & OptionalAccessTokenResponseLocals>,
	): Promise<void> {
		const dto = res.locals.dto;
		const createdRoom = await this.roomService.create(dto, res.locals.jwtPayload);
		res.status(201).json(OutputRoomDTO.fromModel(createdRoom));
	}

	public async patch(
		req: Request<{ param: string }>,
		res: Response<any, DtoResponseLocals<CreateRoomDTOType>>, // TODO: make updateRoomDtoType
	): Promise<void> {
		// TODO: make UpdateBoardDTOType when board dto grows
		const dto = res.locals.dto;
		const id = req.params['param'];
		const room = await this.roomService.update(id, dto);
		res.status(200).json(OutputRoomDTO.fromModel(room));
	}
	public put(req: Request, res: Response): void {
		res.status(405).json({ message: 'PUT method not supported. Use PATCH instead.' });
	}
	public async delete(req: Request<{ param: string }>, res: Response): Promise<void> {
		const id = req.params['param'];
		const room = await this.roomService.delete(id);
		res.status(200).json(OutputRoomDTO.fromModel(room));
	}
}
