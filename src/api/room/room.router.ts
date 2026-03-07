import { APIBaseRouter } from '../common/base.router.js';
import { validateDTO } from '../common/middleware/validate-dto.middleware.js';
import { validateUUIDParam } from '../common/middleware/validate-uuid-param.middleware.js';
import type { APIRoomController } from './room.controller.js';
import { checkRoomExists } from './middleware/check-room-exists.middleware.js';
import { safeValidateAndSetAccessToken } from '../auth/middleware/safe-validate-and-set-access-token.middleware.js';
import { CreateRoomDTO } from '../../../shared/room/dto/create-room.dto.js';
import { UpdateRoomDTO } from '../../../shared/room/dto/update-room.dto.js';
import { UpdateRoomEditorsDTO } from './dto/update-editors.dto.js';
import { isRoomOwner } from './middleware/is-room-owner.middleware.js';
import { validateAndSetAccessToken } from '../auth/middleware/validate-and-set-access-token.middleware.js';

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
			validateDTO(UpdateRoomDTO),
			validateUUIDParam,
			validateAndSetAccessToken,
			isRoomOwner(this.controller.roomService),
			this.controller.patch.bind(this.controller),
		);
		this.router.put('/:param', this.controller.put.bind(this.controller));
		this.router.post(
			'/',
			validateDTO(CreateRoomDTO),
			safeValidateAndSetAccessToken,
			this.controller.post.bind(this.controller),
		);
		this.router.delete(
			'/:param',
			validateUUIDParam,
			isRoomOwner(this.controller.roomService),
			this.controller.delete.bind(this.controller),
		);

		this.router.patch(
			'/:param/editors',
			validateUUIDParam,
			validateAndSetAccessToken,
			isRoomOwner(this.controller.roomService),
			validateDTO(UpdateRoomEditorsDTO),
			this.controller.updateEditors.bind(this.controller),
		);
	}
}
