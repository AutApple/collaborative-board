import {
	type BoardServerSocket,
	type ClientBoardEventPayloads,
	type ServerBoardEventPayloads,
} from '@shared/socket-events/socket-events.js';
import type { Server as HTTPServer } from 'node:http';
import { Server } from 'socket.io';
import { AppContext } from './app-context.js';
import { ClientEventHandlers } from './client/client-event-handlers.js';
import { ClientRegistry } from './client/client-registry.js';
import { Client } from './client/client.js';
import {
	InstanceContainer,
	type RepositoryContainer,
	type ServiceContainer,
} from './common/instance-container.js';
import { RoomService } from './room/room.service.js';
import dbClient from '../db.js';
import { ServerRendererService } from '../shared/renderer/renderer.service.js';
import { serverConfiguraion } from '../config/server.config.js';
import { RoomRepository } from './room/room.repository.js';

export class BoardServer {
	private io: Server<ClientBoardEventPayloads, ServerBoardEventPayloads>;
	private appContext: AppContext = new AppContext();

	private clientRegistry: ClientRegistry = new ClientRegistry();

	private repositoryContainer: RepositoryContainer;
	private serviceContainer: ServiceContainer;

	constructor(httpServer: HTTPServer) {
		this.io = new Server<ClientBoardEventPayloads, ServerBoardEventPayloads>(httpServer);

		this.repositoryContainer = new InstanceContainer([
			new RoomRepository(dbClient),
		]);

		const rendererService = new ServerRendererService(serverConfiguraion.thumbnailViewportWidth, serverConfiguraion.thumbnailViewportHeight);
		const roomService = new RoomService(this.repositoryContainer.getInstance(RoomRepository), rendererService, this.appContext);

		this.serviceContainer = new InstanceContainer([
			rendererService,
			roomService
		]);
	}

	public async run() {
		const roomService = this.serviceContainer.getInstance(RoomService);
		await roomService.populateRegistryFromDb();

		this.io.on('connection', (socket: BoardServerSocket) => {
			const client = new Client(socket, this.clientRegistry);
			const clientEventHandlers = new ClientEventHandlers(client, this.serviceContainer);
			client.bindHandlers(clientEventHandlers);

			this.clientRegistry.register(client);
		});
	}
}
