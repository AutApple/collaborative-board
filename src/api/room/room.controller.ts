import type { Request, Response } from 'express';
import type { APIRoomService } from './room.service.js';
import type { Room } from '../../board-app/generated/prisma/client.js';
import type { DtoResponseLocals } from '../common/middleware/validate-dto.middleware.js';
import type { OptionalAccessTokenResponseLocals } from '../auth/middleware/safe-validate-and-set-access-token.middleware.js';
import type { OutputRoomDTOType } from '../../../shared/room/dto/output-room.dto.js';
import type { CreateRoomDTOType } from '../../../shared/room/dto/create-room.dto.js';
import type { UpdateRoomDTOType } from '../../../shared/room/dto/update-room.dto.js';
import type { UpdateRoomEditorsDTOType } from './dto/update-editors.dto.js';
import type { RoomResponseLocals } from './middleware/check-room-exists.middleware.js';
import type { AccessTokenResponseLocals } from '../auth/middleware/validate-and-set-access-token.middleware.js';

export class APIRoomController {
	constructor(public readonly roomService: APIRoomService) {}
	private outputRoomDtoFromModel(room: Room): OutputRoomDTOType {
		return {
			createdAt: room.createdAt.toDateString(),
			id: room.id,
			name: room.name,
			pngBase64: Buffer.from(room.thumbnailPngBytes).toString('base64'),
			protectedMode: room.protectedMode,
			public: room.public,
		};
	}

	public async getParam(req: Request, res: Response<any, { room: Room }>): Promise<void> {
		res.status(200).json(this.outputRoomDtoFromModel(res.locals.room));
	}

	public async get(_: Request, res: Response): Promise<void> {
		const models = await this.roomService.getPublic();
		res.status(200).json(models.map((m) => this.outputRoomDtoFromModel(m)));
	}

	public async post(
		_: Request,
		res: Response<any, DtoResponseLocals<CreateRoomDTOType> & OptionalAccessTokenResponseLocals>,
	): Promise<void> {
		const dto = res.locals.dto;
		const createdRoom = await this.roomService.create(dto, res.locals.jwtPayload?.userId);
		if (!createdRoom) {
			res.status(400).json({ message: 'Bad request' });
			return;
		}

		res.status(201).json(this.outputRoomDtoFromModel(createdRoom));
	}

	public async patch(
		req: Request<{ param: string }>,
		res: Response<any, DtoResponseLocals<UpdateRoomDTOType>>,
	): Promise<void> {
		// TODO: use res.locals.room in services
		const dto = res.locals.dto;
		const id = req.params['param'];
		const room = await this.roomService.update(id, dto);
		res.status(200).json(this.outputRoomDtoFromModel(room));
	}

	public async updateEditors(
		req: Request<{ param: string }>,
		res: Response<any, DtoResponseLocals<UpdateRoomEditorsDTOType>>,
	) {
		// TODO: pass actual .room local for every service call
		const room = await this.roomService.updateEditors(req.params.param, res.locals.dto);
		res.status(200).json(this.outputRoomDtoFromModel(room));
	}
	public async retrieveEditors(
		req: Request<{param: string}>,
		res: Response
	) {
		const editors = await this.roomService.getEditors(req.params.param);
		res.status(200).json({
			editors
		});
	}


	public put(_: Request, res: Response): void {
		res.status(405).json({ message: 'PUT method not supported. Use PATCH instead.' });
	}
	public async delete(req: Request<{ param: string }>, res: Response): Promise<void> {
		const id = req.params['param'];
		const room = await this.roomService.delete(id);
		res.status(200).json(this.outputRoomDtoFromModel(room));
	}
}
