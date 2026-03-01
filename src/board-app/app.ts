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
import { ApplicationRoomService } from './room/room.service.js';
import dbClient from '../db.js';
import { ApplicationServerRendererService } from './renderer/renderer.service.js';
import { serverConfiguraion } from '../config/server.config.js';
import { RoomRepository } from './room/room.repository.js';
import { RoomSchedulerService } from './room/room-scheduler.service.js';
import type { CommandBus } from '../command-bus/command-bus.js';
import { RendererCommandHandler } from './renderer/renderer.command-handler.js';
import { RoomCommandHandler } from './room/room.command-handler.js';
import { ApplicationAuthService } from './auth/auth.service.js';

export class BoardServer {
	private io: Server<ClientBoardEventPayloads, ServerBoardEventPayloads>;
	private appContext: AppContext = new AppContext();

	private clientRegistry: ClientRegistry = new ClientRegistry();

	private repositoryContainer: RepositoryContainer;
	private serviceContainer: ServiceContainer;

	private makeServices() {
		const rendererService = new ApplicationServerRendererService(
			serverConfiguraion.thumbnailViewportWidth,
			serverConfiguraion.thumbnailViewportHeight,
		);
		const roomSchedulerService = new RoomSchedulerService();

		const roomService = new ApplicationRoomService(
			this.repositoryContainer.getInstance(RoomRepository),
			rendererService,
			this.appContext,
			roomSchedulerService,
			serverConfiguraion.cleanupRegistryAfterRoomInactiveSec * 1000,
			serverConfiguraion.regularRoomSaveMins * 60 * 1000,
		);
		const authenticationService = new ApplicationAuthService();

		return [rendererService, roomSchedulerService, roomService, authenticationService];
	}

	constructor(
		httpServer: HTTPServer,
		private commandBus: CommandBus,
	) {
		this.io = new Server<ClientBoardEventPayloads, ServerBoardEventPayloads>(httpServer);

		this.repositoryContainer = new InstanceContainer([new RoomRepository(dbClient)]);

		this.serviceContainer = new InstanceContainer(this.makeServices());
	}

	public async run() {
		// TODO: encapsulate all of bootstrap code into some different component
		const roomService = this.serviceContainer.getInstance(ApplicationRoomService);
		const rendererService = this.serviceContainer.getInstance(ApplicationServerRendererService);

		const rendererCommandHandler = new RendererCommandHandler(rendererService, roomService);
		const roomCommandHandler = new RoomCommandHandler(roomService);

		rendererCommandHandler.register(this.commandBus);
		roomCommandHandler.register(this.commandBus);

		this.io.on('connection', (socket: BoardServerSocket) => {
			const client = new Client(socket, this.clientRegistry);
			const clientEventHandlers = new ClientEventHandlers(client, this.serviceContainer);
			client.bindHandlers(clientEventHandlers);

			this.clientRegistry.register(client);
		});
	}
}
