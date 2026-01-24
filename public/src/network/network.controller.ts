import { ClientBoardEvents, ServerBoardEvents, type BoardClientSocket } from '@shared/socket-events/board.socket-events.js';
import type { AppContext } from '../app-context.js';
import type { RawBoardElement } from '../../../shared/board/elements/raw/index.js';
import type { BoardMutationList } from '../../../shared/board/board-mutation.js';
import type { EventBus } from '../event-bus/event-bus.js';
import { SemanticEvents, type SemanticEventMap } from '../event-bus/index.js';
import type { Cursor } from '../../../shared/remote-cursor/types/cursor.js';
import type { NetworkService } from './network.service.js';

export class NetworkController {
    constructor(private appContext: AppContext, private bus: EventBus<SemanticEventMap>, private networkService: NetworkService) { }

    public bind(socket: BoardClientSocket) {
        socket.on(ServerBoardEvents.RefreshBoard, this.onRefreshBoard.bind(this));
        socket.on(ServerBoardEvents.BoardMutations, this.onBoardMutations.bind(this));
        socket.on(ServerBoardEvents.Handshake, this.onHandshake.bind(this));
        socket.on(ServerBoardEvents.ClientConnected, this.onClientConnected.bind(this));
        socket.on(ServerBoardEvents.ClientDisconnected, this.onClientDisconnected.bind(this));
        socket.on(ServerBoardEvents.RemoteCursorMove, this.onRemoteCursorMove.bind(this));
    }

    public onClientConnected(_: string, cursor: Cursor) {
        this.bus.emit(SemanticEvents.RemoteCursorConnect, { cursor });
    }
    
    public onClientDisconnected(clientId: string) {
        this.bus.emit(SemanticEvents.RemoteCursorDisconnect, { clientId });
    }

    public onRemoteCursorMove(cursor: Cursor) {
        this.bus.emit(SemanticEvents.RemoteCursorMove, {cursor});
    }

    public onRefreshBoard(raw: RawBoardElement[]) {
        this.bus.emit(SemanticEvents.BoardRefresh, { rawData: raw });
    }
    public onBoardMutations(mutations: BoardMutationList) {
        this.bus.emit(SemanticEvents.BoardMutations, { mutations });
    }
    public onHandshake(raw: RawBoardElement[], cursors: Cursor[]) {
        for (const cursor of cursors)
            this.bus.emit(SemanticEvents.RemoteCursorConnect, { cursor });
        this.bus.emit(SemanticEvents.BoardRefresh, { rawData: raw });
        this.networkService.sendHandshake(this.appContext.localCursorPosition);
    }
};