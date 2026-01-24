import type { BoardMutationList } from '@shared/board/board-mutation.js';
import { ClientBoardEvents, type BoardClientSocket } from '@shared/socket-events/board.socket-events.js';
import type { XY } from '../../../shared/types/vec2.type.js';

export class NetworkService {
    constructor(private socket: BoardClientSocket) { }

    requestBoardRefresh() {
        this.socket.emit(ClientBoardEvents.RequestRefresh);
    }
    sendBoardMutationList(mutations: BoardMutationList) {
        this.socket.emit(ClientBoardEvents.BoardMutations, mutations);
    }
    sendHandshake(mousePos: XY) {
        this.socket.emit(ClientBoardEvents.Handshake, mousePos);
    }
    sendLocalCursorMove(mousePos: XY) {
        this.socket.emit(ClientBoardEvents.LocalCursorMove, mousePos);
    }
}