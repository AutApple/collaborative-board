import { APIRoomController } from './room.controller.js';
import { APIRoomService } from './room.service.js';
import { APIRoomRepository } from './room.repo.js';
import dbClient from '../../db.js';
import { APIRoomRouter } from './room.router.js';
import { APIBoardRepository } from '../board/board.repo.js';
import type { CommandBus } from '../../command-bus/command-bus.js';

export default function createRoomApiModule(commandBus: CommandBus) {
	const roomRepo = new APIRoomRepository(dbClient);
	const boardRepo = new APIBoardRepository(dbClient);

	const service = new APIRoomService(roomRepo, boardRepo, commandBus);
	const controller = new APIRoomController(service);
	const router = new APIRoomRouter(controller);

	return {
		router: router.getRouter(),
		service,
	};
}
