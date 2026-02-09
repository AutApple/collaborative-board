import {
	ServerBoardEvents,
	type BoardClientSocket,
} from '@shared/socket-events/board.socket-events.js';
import type { AnyRawBoardElement } from '../../../shared/board-elements/index.js';
import type { BoardMutationList } from '../../../shared/board/board-mutation.js';
import type { Cursor } from '../../../shared/remote-cursor/types/cursor.js';
import type { AppContext } from '../app-context.js';
import type { EventBus } from '../event-bus/event-bus.js';
import { SemanticEvents, type SemanticEventMap } from '../event-bus/index.js';
import type { NetworkService } from './network.service.js';
import type { NetworkUiAdapter } from './network.ui-adapter.js';

export class NetworkController {
	constructor(
		private appContext: AppContext,
		private networkUiAdapter: NetworkUiAdapter,
		private bus: EventBus<SemanticEventMap>,
		private networkService: NetworkService,
	) {}

	public bind(socket: BoardClientSocket) {
		socket.on(ServerBoardEvents.RefreshBoard, this.onRefreshBoard.bind(this));
		socket.on(ServerBoardEvents.BoardMutations, this.onBoardMutations.bind(this));
		socket.on(ServerBoardEvents.Handshake, this.onHandshake.bind(this));
		socket.on(ServerBoardEvents.ClientConnected, this.onClientConnected.bind(this));
		socket.on(ServerBoardEvents.ClientDisconnected, this.onClientDisconnected.bind(this));
		socket.on(ServerBoardEvents.RemoteCursorMove, this.onRemoteCursorMove.bind(this));
		socket.on('disconnect', this.onDisconnect.bind(this));
	}

	public onDisconnect() {
		this.networkUiAdapter.showDisconnectOverlay();
	}

	public onClientConnected(_: string, cursor: Cursor) {
		this.bus.emit(SemanticEvents.RemoteCursorConnect, { cursor });
	}

	public onClientDisconnected(clientId: string) {
		this.bus.emit(SemanticEvents.RemoteCursorDisconnect, { clientId });
	}

	public onRemoteCursorMove(cursor: Cursor) {
		this.bus.emit(SemanticEvents.RemoteCursorMove, { cursor });
	}

	public onRefreshBoard(raw: AnyRawBoardElement[]) {
		this.bus.emit(SemanticEvents.BoardRefresh, { rawData: raw });
	}
	public onBoardMutations(mutations: BoardMutationList) {
		this.bus.emit(SemanticEvents.BoardMutations, { mutations });
	}
	public onHandshake(
		boardId: string,
		boardName: string,
		raw: AnyRawBoardElement[],
		cursors: Cursor[],
	) {
		for (const cursor of cursors) this.bus.emit(SemanticEvents.RemoteCursorConnect, { cursor });
		this.appContext.board.setMetadata({ id: boardId, name: boardName });
		this.bus.emit(SemanticEvents.BoardRefresh, { rawData: raw });
	}
}
