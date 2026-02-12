import { APIBaseRouter } from '../common/base.router.js';
import { validateDTO } from '../common/middleware/validate-dto.middleware.js';
import type { APIBoardController } from './board.controller.js';
import { CreateBoardDTO } from './dtos/create-board.dto.js';

export class APIBoardRouter extends APIBaseRouter {
	constructor(controller: APIBoardController) {
		super(controller);
		this.bindRoutes();
	}

	private bindRoutes() {
		this.router.get('/', this.controller.get.bind(this.controller));
		this.router.get('/:param', this.controller.getParam.bind(this.controller));
		this.router.patch('/:param', this.controller.patch.bind(this.controller));
		this.router.put('/:param', this.controller.put.bind(this.controller));
		this.router.post('/', validateDTO(CreateBoardDTO), this.controller.post.bind(this.controller));
		this.router.delete('/:param', this.controller.delete.bind(this.controller));
	}
}
