import { ServerBoardEvents } from '../../shared/socket-events/board.socket-events.js';
import type { XY } from '../../shared/utils/vec2.utils.js';
import type { AppContext } from '../app-context.js';
import type { Client } from '../client.js';
import { BaseEventHandler } from './base.event-handler.js';

export class CursorEventHandler extends BaseEventHandler {
	constructor(
		protected appContext: AppContext,
		protected client: Client,
	) {
		super(appContext, client);
	}

	public onLocalCursorMove(pos: XY) {
		this.appContext.cursorMap.setPosition(this.socket.id, pos);
		this.socket.broadcast.emit(ServerBoardEvents.RemoteCursorMove, {
			clientId: this.socket.id,
			worldCoords: pos,
		});
	}
}
