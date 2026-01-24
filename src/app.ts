import type { Server as HTTPServer } from 'node:http';
import { Server } from 'socket.io';
import { type BoardServerSocket, type ClientBoardEventPayloads, ClientBoardEvents, type ServerBoardEventPayloads, ServerBoardEvents } from '@shared/socket-events/board.socket-events.js';
import { optimizeMutations, type BoardMutationList } from '@shared/board/board-mutation.js';
import { AppContext } from './app-context.js';
import type { Vec2, XY } from '../shared/types/vec2.type.js';

export class BoardServer {
    private io: Server<ClientBoardEventPayloads, ServerBoardEventPayloads>;
    private appContext: AppContext;

    constructor(httpServer: HTTPServer) {
        this.io = new Server<ClientBoardEventPayloads, ServerBoardEventPayloads>(httpServer);
        this.appContext = new AppContext();
    }

    run() {
        this.io.on('connection', (socket: BoardServerSocket) => {
            console.log('New client connected:', socket.id);
            // socket.emit(ServerBoardEvents.RefreshBoard, this.appContext.board.getElements().map(element => element.toRaw()));
            socket.emit(ServerBoardEvents.Handshake, this.appContext.board.getElements().map(element => element.toRaw()), this.appContext.cursorMap.toList());
            socket.on(ClientBoardEvents.Handshake, (mousePos: XY) => {
                const cursor = {clientId: socket.id, position: {... mousePos}};
                this.appContext.cursorMap.addCursor(cursor);
                socket.broadcast.emit(ServerBoardEvents.ClientConnected, socket.id, cursor);
            });
            socket.on('disconnect', () => {
                this.appContext.cursorMap.removeCursor(socket.id);
                socket.broadcast.emit(ServerBoardEvents.ClientDisconnected, socket.id);
            });

            socket.on(ClientBoardEvents.LocalCursorMove, (pos: XY) => {
                this.appContext.cursorMap.setPosition(socket.id, pos);
                socket.broadcast.emit(ServerBoardEvents.RemoteCursorMove, {clientId: socket.id, position: pos});
            });

            socket.on(ClientBoardEvents.BoardMutations, (mutations: BoardMutationList) => {
                mutations = optimizeMutations(mutations);
                for (const mutation of mutations) {
                    // console.log('Got mutation: ', mutation);
                    // TODO: validate point array length, etc etc. only then apply mutations. reject on weird data 
                    this.appContext.board.applyMutation(mutation);
                }
                socket.broadcast.emit(ServerBoardEvents.BoardMutations, mutations);
            });
          
            socket.on(ClientBoardEvents.RequestRefresh, () => {
                socket.emit(ServerBoardEvents.RefreshBoard, this.appContext.board.getElements().map(element => element.toRaw()));
            });
        });
    }
}