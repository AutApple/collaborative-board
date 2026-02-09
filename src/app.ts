import {
	type BoardServerSocket,
	type ClientBoardEventPayloads,
	type ServerBoardEventPayloads,
} from '@shared/socket-events/board.socket-events.js';
import type { Server as HTTPServer } from 'node:http';
import { Server } from 'socket.io';
import { AppContext } from './app-context.js';
import { ClientRegistry } from './client/client-registry.js';
import { Client } from './client/client.js';
import { BoardElementRepository } from './repos/board-element.repository.js';
import { RepositoryManager } from './repos/repository-manager.js';
import { Board } from '../shared/board/board.js';
import { serverConfiguraion } from './config/server.config.js';
import { BoardRepository } from './repos/board.repository.js';
import { RoomService } from './room/room.service.js';

export class BoardServer {
	private io: Server<ClientBoardEventPayloads, ServerBoardEventPayloads>;
	private appContext: AppContext = new AppContext();

	private clientRegistry: ClientRegistry = new ClientRegistry();

	private repositoryManager: RepositoryManager;

	constructor(httpServer: HTTPServer) {
		this.io = new Server<ClientBoardEventPayloads, ServerBoardEventPayloads>(httpServer);
		this.repositoryManager = new RepositoryManager([
			new BoardElementRepository(this.appContext.db),
			new BoardRepository(this.appContext.db),
		]);
	}

	public async run() {
		const boardRepo = this.repositoryManager.getRepo(BoardRepository);
		if (!boardRepo) throw new Error("Can't find the board repository");

		const boardList = await boardRepo.getAll(); // TODO: do db load into board somewhere else
		this.appContext.roomRegistry.registerMany(boardList);

		const roomService = new RoomService(boardRepo, this.appContext.roomRegistry);

		this.io.on('connection', (socket: BoardServerSocket) => {
			this.clientRegistry.register(
				new Client(socket, this.appContext, this.clientRegistry, roomService),
			);
		});
	}
}
