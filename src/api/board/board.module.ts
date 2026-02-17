import { Router } from 'express';
import { APIBoardController } from './board.controller.js';
import { APIBoardService } from './board.service.js';
import { APIBoardRepository } from './board.repo.js';
import dbClient from '../../db.js';
import { APIBoardRouter } from './board.router.js';
import { ServerRendererService } from '../../shared/renderer/renderer.service.js';
import { serverConfiguraion } from '../../config/server.config.js';

export default function createBoardApiModule(): Router {
	const repository = new APIBoardRepository(dbClient);
	const rendererService = new ServerRendererService(serverConfiguraion.thumbnailViewportWidth, serverConfiguraion.thumbnailViewportHeight);
	const service = new APIBoardService(repository, rendererService);
	const controller = new APIBoardController(service);
	const router = new APIBoardRouter(controller);

	return router.getRouter();
}
