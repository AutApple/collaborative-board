import type { BoardMutationList } from '@shared/board/board-mutation.js';
import {
	ClientBoardEvents,
	type BoardClientSocket,
} from '@shared/socket-events/board.socket-events.js';
import type { XY } from '../../../shared/utils/vec2.utils.js';

export class NetworkService {
	constructor(private socket: BoardClientSocket) {}

	requestBoardRefresh() {
		this.socket.emit(ClientBoardEvents.RequestRefresh);
	}
	sendBoardMutationList(mutations: BoardMutationList) {
		this.socket.emit(ClientBoardEvents.BoardMutations, mutations);
	}
	sendHandshake(mousePos: XY) {
		// TODO: remove this shit, its for testing rooms only!
		const path = window.location.pathname;
		const segment = path.split('/').filter(Boolean)[0];

		this.socket.emit(ClientBoardEvents.Handshake, segment ?? 'placeholderId', mousePos);
	}
	sendLocalCursorMove(mousePos: XY) {
		this.socket.emit(ClientBoardEvents.LocalCursorMove, mousePos);
	}
}
