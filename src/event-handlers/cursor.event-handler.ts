import { ServerBoardEvents } from '../../shared/socket-events/board.socket-events.js';
import type { XY } from '../../shared/utils/vec2.utils.js';
import type { AppContext } from '../app-context.js';
import type { Client } from '../client.js';
import { BaseEventHandler } from './base.event-handler.js';

export class CursorEventHandler extends BaseEventHandler {
	constructor(
		protected appContext: AppContext,
		client: Client,
	) {
		super(appContext, client);
	}

	public onLocalCursorMove(pos: XY) {
		const boardId = this.client.getBoardId()!;
		const room = this.appContext.roomRegistry.get(boardId);
		if (!room) return;

		this.socket.to(boardId).emit(ServerBoardEvents.RemoteCursorMove, {
			clientId: this.socket.id,
			worldCoords: pos,
		});

		room.cursorMap.setPosition(this.socket.id, pos);
	}
}
