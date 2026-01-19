import type { Server as HTTPServer } from 'node:http';
import { Server, Socket } from 'socket.io'
import { ClientBoardEvents, ServerBoardEvents } from '@shared/socket-events/board.socket-events.js';
import { type BoardMutationList } from '@shared/board/board-mutation.js';
import { AppContext } from './app-context.js';

export class BoardServer {
    private io: Server;
    private appContext: AppContext;

    constructor (httpServer: HTTPServer) {
        this.io = new Server(httpServer);
        this.appContext = new AppContext();
    }
    
    run() {
        this.io.on('connection', (socket: Socket) => {
            console.log('New client connected:', socket.id);
            socket.emit(ServerBoardEvents.RefreshBoard, this.appContext.board.getElements().map(element => element.toRaw()));
            socket.on(ClientBoardEvents.BoardMutations, (mutations: BoardMutationList) => {
                const broadcastMutations: BoardMutationList = [];
                for (const mutation of mutations) {            
                    // console.log('Got mutation: ', mutation);
                    // TODO: validate id and structure to be precise. Also validate point array length, etc etc. only then apply mutations. reject on weird data 
                    this.appContext.board.applyMutation(mutation, this.appContext.board);
                }
                socket.broadcast.emit(ServerBoardEvents.BoardMutations, mutations);
            })
        
            socket.on(ClientBoardEvents.RequestRefresh, () => {
                socket.emit(ServerBoardEvents.RefreshBoard, this.appContext.board.getElements().map(element => element.toRaw()));
            });
        });
    }
}