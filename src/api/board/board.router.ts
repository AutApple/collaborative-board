import { APIBaseRouter } from '../common/base.router.js';
import { validateDTO } from '../common/middleware/validate-dto.middleware.js';
import { validateUUIDParam } from '../common/middleware/validate-uuid-param.middleware.js';
import type { APIBoardController } from './board.controller.js';
import { CreateBoardDTO } from './dtos/create-board.dto.js';
import { checkBoardExists } from './middleware/checkBoardExists.middleware.js';

export class APIBoardRouter extends APIBaseRouter {
	constructor(protected controller: APIBoardController) {
		super(controller);
		this.bindRoutes();
	}

	private bindRoutes() {
		this.router.get('/', this.controller.get.bind(this.controller));
		this.router.get(
			'/:param',
			validateUUIDParam,
			checkBoardExists(this.controller.boardService),
			this.controller.getParam.bind(this.controller),
		);
		this.router.patch(
			'/:param',
			validateDTO(CreateBoardDTO),
			validateUUIDParam,
			checkBoardExists(this.controller.boardService),
			this.controller.patch.bind(this.controller),
		);
		this.router.put(
			'/:param',
			validateUUIDParam,
			checkBoardExists(this.controller.boardService),
			this.controller.put.bind(this.controller),
		);
		this.router.post('/', validateDTO(CreateBoardDTO), this.controller.post.bind(this.controller));
		this.router.delete(
			'/:param',
			validateUUIDParam,
			checkBoardExists(this.controller.boardService),
			this.controller.delete.bind(this.controller),
		);
	}
}
