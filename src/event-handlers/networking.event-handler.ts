import { Board } from '../../shared/board/board.js';
import { ServerBoardEvents } from '../../shared/socket-events/board.socket-events.js';
import type { XY } from '../../shared/utils/vec2.utils.js';
import type { AppContext } from '../app-context.js';
import type { Client } from '../client/client.js';
import { serverConfiguraion } from '../config/server.config.js';
import type { RoomService } from '../room/room.service.js';
import { BaseEventHandler } from './base.event-handler.js';

export class NetworkingEventHandler extends BaseEventHandler {
	constructor(
		protected appContext: AppContext,
		protected client: Client,
		protected roomService: RoomService,
	) {
		super(appContext, client);
	}

	public async onHandshake(boardId: string, cursorWorldCoords: XY) {
		if (this.client.didPassHandshake() === true) return;

		let room = this.appContext.roomRegistry.get(boardId);
		if (!room) room = await this.roomService.createRoom();
		
		boardId = room.board.getId()!;
		const boardName = room.board.getName()!;

		this.client.setBoardId(boardId);

		const cursor = {
			clientId: this.client.getClientId(),
			worldCoords: cursorWorldCoords,
		};

		room.cursorMap.addCursor(cursor);
		this.socket.emit(
			ServerBoardEvents.Handshake,
			boardId,
			boardName,
			room.board.getElements().map((e) => e.toRaw()),
			room.cursorMap.toList(),
		);
		this.socket
			.to(boardId)
			.emit(ServerBoardEvents.ClientConnected, this.client.getClientId(), cursor);

		this.client.markHandshakePass();
	}

	public onDisconnect() {
		this.client.disconnect();
	}
}
