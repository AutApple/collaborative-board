import {
	type BoardServerSocket,
	type ClientBoardEventPayloads,
	type ServerBoardEventPayloads,
} from '@shared/socket-events/board.socket-events.js';
import type { Server as HTTPServer } from 'node:http';
import { Server } from 'socket.io';
import { AppContext } from './app-context.js';
import { ClientRegistry } from './client-registry.js';
import { Client } from './client.js';
import { BoardElementRepository } from './repos/board-element.repository.js';
import { RepositoryManager } from './repos/repository-manager.js';

export class BoardServer {
	private io: Server<ClientBoardEventPayloads, ServerBoardEventPayloads>;
	private appContext: AppContext = new AppContext();

	private clientRegistry: ClientRegistry = new ClientRegistry();

	private repositoryManager: RepositoryManager;

	constructor(httpServer: HTTPServer) {
		this.io = new Server<ClientBoardEventPayloads, ServerBoardEventPayloads>(httpServer);
		this.repositoryManager = new RepositoryManager([
			new BoardElementRepository(this.appContext.db),
		]);
	}

	public async run() {
		const elementRepo = this.repositoryManager.getRepo(BoardElementRepository);
		if (!elementRepo) throw new Error("Can't find the element repository");

		this.appContext.roomRegistry.add('placeholderId', 'Placeholder Board');

		// const elements = await elementRepo.getAll(); // TODO: do db load into board somewhere else
		// this.appContext.roomRegistry.get('placeholderId')?.board.refresh(elements);

		this.io.on('connection', (socket: BoardServerSocket) => {
			this.clientRegistry.register(
				new Client(socket, this.appContext, this.clientRegistry, this.repositoryManager),
			);
		});
	}
}
