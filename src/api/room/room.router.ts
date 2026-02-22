import { APIBaseRouter } from '../common/base.router.js';
import { validateDTO } from '../common/middleware/validate-dto.middleware.js';
import { validateUUIDParam } from '../common/middleware/validate-uuid-param.middleware.js';
import type { APIRoomController } from './room.controller.js';
import { CreateRoomDTO } from './dtos/create-room.dto.js';
import { checkRoomExists } from './middleware/checkRoomExists.middleware.js';

export class APIRoomRouter extends APIBaseRouter {
	constructor(protected controller: APIRoomController) {
		super();
		this.bindRoutes();
	}

	private bindRoutes() {
		this.router.get('/', this.controller.get.bind(this.controller));
		this.router.get(
			'/:param',
			validateUUIDParam,
			checkRoomExists(this.controller.roomService),
			this.controller.getParam.bind(this.controller),
		);
		this.router.patch(
			'/:param',
			validateDTO(CreateRoomDTO),
			validateUUIDParam,
			checkRoomExists(this.controller.roomService),
			this.controller.patch.bind(this.controller),
		);
		this.router.put(
			'/:param',
			validateUUIDParam,
			checkRoomExists(this.controller.roomService),
			this.controller.put.bind(this.controller),
		);
		this.router.post('/', validateDTO(CreateRoomDTO), this.controller.post.bind(this.controller));
		this.router.delete(
			'/:param',
			validateUUIDParam,
			checkRoomExists(this.controller.roomService),
			this.controller.delete.bind(this.controller),
		);
	}
}
