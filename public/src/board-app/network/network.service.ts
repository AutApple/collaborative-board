import type { BoardMutationList } from '@shared/board/board-mutation.js';
import { ClientBoardEvents, type BoardClientSocket } from '@shared/socket-events/socket-events.js';
import type { XY } from '../../../../shared/utils/vec2.utils.js';

export class NetworkService {
	constructor(private socket: BoardClientSocket) {}

	requestBoardRefresh() {
		this.socket.emit(ClientBoardEvents.RequestRefresh);
	}
	sendBoardMutationList(mutations: BoardMutationList) {
		this.socket.emit(ClientBoardEvents.BoardMutations, mutations);
	}
	sendHandshake(boardId: string, mousePos: XY, accessToken?: string) {
		this.socket.emit(ClientBoardEvents.Handshake, boardId, mousePos, accessToken);
	}
	sendLocalCursorMove(mousePos: XY) {
		this.socket.emit(ClientBoardEvents.LocalCursorMove, mousePos);
	}
}
