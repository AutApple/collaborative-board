import { Router } from 'express';
import { APIRoomController } from './room.controller.js';
import { APIRoomService } from './room.service.js';
import { APIRoomRepository } from './room.repo.js';
import dbClient from '../../db.js';
import { APIRoomRouter } from './room.router.js';
import { ServerRendererService } from '../../shared/renderer/renderer.service.js';
import { serverConfiguraion } from '../../config/server.config.js';
import { APIBoardRepository } from '../board/board.repo.js';

export default function createRoomApiModule(): Router {
	const roomRepo = new APIRoomRepository(dbClient);
	const boardRepo = new APIBoardRepository(dbClient);
	
	const rendererService = new ServerRendererService(serverConfiguraion.thumbnailViewportWidth, serverConfiguraion.thumbnailViewportHeight);
	const service = new APIRoomService(roomRepo, boardRepo, rendererService);
	const controller = new APIRoomController(service);
	const router = new APIRoomRouter(controller);

	return router.getRouter();
}
