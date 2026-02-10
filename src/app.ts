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
import { BoardElementRepository } from './board-elements/board-element.repository.js';
import { RepositoryManager } from './common/repository-manager.js';
import { Board } from '../shared/board/board.js';
import { serverConfiguraion } from './config/server.config.js';
import { BoardRepository } from './board/board.repository.js';
import { RoomService } from './room/room.service.js';
import { ClientEventHandlers } from './client/client-event-handlers.js';

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

		const roomService = new RoomService(boardRepo, this.appContext);
		await roomService.populateRegistryFromDb();

		this.io.on('connection', (socket: BoardServerSocket) => {
			const client = new Client(socket, this.clientRegistry);
			const clientEventHandlers = new ClientEventHandlers(roomService, client);
			client.bindHandlers(clientEventHandlers);

			this.clientRegistry.register(client);
		});
	}
}
