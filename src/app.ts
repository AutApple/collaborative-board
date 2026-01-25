import { type BoardServerSocket, type ClientBoardEventPayloads, type ServerBoardEventPayloads } from '@shared/socket-events/board.socket-events.js';
import type { Server as HTTPServer } from 'node:http';
import { Server } from 'socket.io';
import { AppContext } from './app-context.js';
import { ClientRegistry } from './client-registry.js';
import { Client } from './client.js';

export class BoardServer {
    private io: Server<ClientBoardEventPayloads, ServerBoardEventPayloads>;
    private appContext: AppContext;
    private clientRegistry: ClientRegistry = new ClientRegistry();

    constructor(httpServer: HTTPServer) {
        this.io = new Server<ClientBoardEventPayloads, ServerBoardEventPayloads>(httpServer);
        this.appContext = new AppContext();
    }

    run() {
        this.io.on('connection', (socket: BoardServerSocket) => {
            this.clientRegistry.registerClient(new Client(socket, this.appContext, this.clientRegistry));
        });
    }
}