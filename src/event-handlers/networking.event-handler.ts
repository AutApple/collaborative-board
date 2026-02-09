import { ServerBoardEvents } from '../../shared/socket-events/board.socket-events.js';
import type { XY } from '../../shared/utils/vec2.utils.js';
import type { AppContext } from '../app-context.js';
import type { Client } from '../client.js';
import { BaseEventHandler } from './base.event-handler.js';

export class NetworkingEventHandler extends BaseEventHandler {
	constructor(
		protected appContext: AppContext,
		protected client: Client,
	) {
		super(appContext, client);
	}

	public onHandshake(cursorWorldCoords: XY) {
		if (this.client.didPassHandshake() === true) return;

		const cursor = {
			clientId: this.client.getClientId(),
			worldCoords: cursorWorldCoords,
		};

		this.appContext.cursorMap.addCursor(cursor);
		this.socket.emit(
			ServerBoardEvents.Handshake,
			this.appContext.board.getElements().map((e) => e.toRaw()),
			this.appContext.cursorMap.toList(),
		);
		this.socket.broadcast.emit(
			ServerBoardEvents.ClientConnected,
			this.client.getClientId(),
			cursor,
		);

		this.client.markHandshakePass();
	}

	public onDisconnect() {
		this.client.disconnect();
	}
}
