import { ServerBoardEvents, type BoardClientSocket } from '@shared/socket-events/socket-events.js';
import type { AnyRawBoardElement } from '../../../../shared/board-elements/index.js';
import type { BoardMutationList } from '../../../../shared/board/board-mutation.js';
import type { AppContext } from '../app-context.js';
import type { EventBus } from '../event-bus/event-bus.js';
import { SemanticEvents, type SemanticEventMap } from '../event-bus/index.js';
import type { NetworkService } from './network.service.js';
import type { NetworkUiAdapter } from './network.ui-adapter.js';
import { Board } from '../../../../shared/board/board.js';
import { RenderLayerType } from '../renderer/enums/render-layer.enum.js';
import type { ClientData } from '../../../../shared/client-data/client-data.js';
import type { XY } from '../../../../shared/utils/vec2.utils.js';

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
		socket.on(ServerBoardEvents.BoardNotFound, this.onBoardNotFound.bind(this));
		socket.on('disconnect', this.onDisconnect.bind(this));
	}

	public onDisconnect() {
		this.networkUiAdapter.showDisconnectOverlay();
	}

	public onClientConnected(clientData: ClientData) {
		this.appContext.room.registerClient(clientData);
		const cursor = clientData.cursor;

		this.bus.emit(SemanticEvents.RemoteCursorConnect, {
			clientId: clientData.clientId,
			worldCoordsPosition: cursor.position,
		});
	}

	public onClientDisconnected(clientId: string) {
		this.appContext.room.unregisterClient(clientId);
		this.bus.emit(SemanticEvents.RemoteCursorDisconnect, { clientId });
	}

	public onRemoteCursorMove(clientId: string, position: XY) {
		this.bus.emit(SemanticEvents.RemoteCursorMove, {
			clientId,
			worldCoordsPosition: position,
		});
	}

	public onRefreshBoard(raw: AnyRawBoardElement[]) {
		this.bus.emit(SemanticEvents.BoardRefresh, { rawData: raw });
	}
	public onBoardMutations(mutations: BoardMutationList) {
		this.bus.emit(SemanticEvents.BoardMutations, { mutations });
	}
	public onBoardNotFound() {
		this.networkUiAdapter.redirectTo404();
	}

	public onHandshake(
		roomId: string,
		roomName: string,
		boardId: string,
		raw: AnyRawBoardElement[],
		clientDataList: ClientData[],
	) {
		// Initialize room
		this.appContext.room.initialize(roomId, roomName, new Board(boardId), clientDataList);
		// Initialize toolbox
		this.appContext.toolbox.initialize(this.appContext.room.getBoard());

		// TODO: put instead of these semantic events just past elements into room constructor (as an optional argument)
		// and same goes for the cursors - pass them into the room constructor and let room to pass merging logic to cursor map
		for (const clientData of clientDataList)
			this.bus.emit(SemanticEvents.RemoteCursorConnect, {
				clientId: clientData.clientId,
				worldCoordsPosition: clientData.cursor.position,
			});

		this.bus.emit(SemanticEvents.BoardRefresh, { rawData: raw });

		this.appContext.renderer.setLayerData(
			RenderLayerType.DebugStats,
			this.appContext.room.getDebugStats(),
		);
	}
}
