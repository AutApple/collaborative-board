import { optimizeMutations, type BoardMutationList } from '../shared/board/board-mutation.js';
import { ClientBoardEvents, ServerBoardEvents, type BoardClientSocket, type BoardServerSocket } from '../shared/socket-events/board.socket-events.js';
import type { XY } from '../shared/types/vec2.type.js';
import type { AppContext } from './app-context.js';
import type { ClientRegistry } from './client-registry.js';

const handshakeTimeoutMs = 5000; // TODO: place in config
export class Client {
    private connected = true;
    private passedHandshake = false;
    private handshakeTimer: NodeJS.Timeout;

    private boundHandlers = {
        onHandshake: (coords: XY) => this.onHandshake(coords),
        onDisconnect: () => this.onDisconnect(),
        onLocalCursorMove: (pos: XY) => this.onLocalCursorMove(pos),
        onBoardMutations: (mutations: BoardMutationList) => this.onBoardMutations(mutations),
        onRequestRefresh: () => this.onRequestRefresh(),
    };

    constructor(private socket: BoardServerSocket, private appContext: AppContext, private clientRegistry: ClientRegistry) {
        socket.emit(ServerBoardEvents.Handshake, appContext.board.getElements().map(e => e.toRaw()), appContext.cursorMap.toList());
        this.handshakeTimer = setTimeout(this._handshakePassCheck.bind(this), handshakeTimeoutMs);

        socket.on(ClientBoardEvents.Handshake, this.boundHandlers.onHandshake);
        socket.on('disconnect', this.boundHandlers.onDisconnect);
        socket.on(ClientBoardEvents.LocalCursorMove, this.boundHandlers.onLocalCursorMove);
        socket.on(ClientBoardEvents.BoardMutations, this.boundHandlers.onBoardMutations);
        socket.on(ClientBoardEvents.RequestRefresh, this.boundHandlers.onRequestRefresh);
    }

    public getClientId() {
        return this.socket.id;
    }
    
    private disconnect() {
        if (!this.connected) return;
        this.connected = false;

        this.clientRegistry.unregisterClient(this.socket.id);
        this.appContext.cursorMap.removeCursor(this.socket.id);
        
        this.socket.off(ClientBoardEvents.Handshake, this.boundHandlers.onHandshake);
        this.socket.off('disconnect', this.boundHandlers.onDisconnect);
        this.socket.off(ClientBoardEvents.LocalCursorMove, this.boundHandlers.onLocalCursorMove);
        this.socket.off(ClientBoardEvents.BoardMutations, this.boundHandlers.onBoardMutations);
        this.socket.off(ClientBoardEvents.RequestRefresh, this.boundHandlers.onRequestRefresh);
        
        this.socket.disconnect();
    }
    
    private onHandshake(cursorWorldCoords: XY) {
        const cursor = { clientId: this.socket.id, worldCoords: cursorWorldCoords };
        this.appContext.cursorMap.addCursor(cursor);
        this.socket.broadcast.emit(ServerBoardEvents.ClientConnected, this.socket.id, cursor);

        this.markHandshakePass();
    }

    private onDisconnect() {
        this.disconnect();
    }

    private onLocalCursorMove(pos: XY) {
        this.appContext.cursorMap.setPosition(this.socket.id, pos);
        this.socket.broadcast.emit(ServerBoardEvents.RemoteCursorMove, { clientId: this.socket.id, worldCoords: pos });
    }

    private onBoardMutations(mutations: BoardMutationList) {
        mutations = optimizeMutations(mutations);
        for (const mutation of mutations) {
            // console.log('Got mutation: ', mutation);
            // TODO: validate point array length, etc etc. only then apply mutations. reject on weird data 
            this.appContext.board.applyMutation(mutation);
        }
        this.socket.broadcast.emit(ServerBoardEvents.BoardMutations, mutations);
    }

    private onRequestRefresh() {
        this.socket.emit(ServerBoardEvents.RefreshBoard, this.appContext.board.getElements().map(element => element.toRaw()));
    }
    private markHandshakePass() {
        this.passedHandshake = true;
        clearTimeout(this.handshakeTimer);
    }

    private _handshakePassCheck() {
        if (!this.passedHandshake) this.disconnect(); // Disconnect socket if it didn't do handshake
    }



}