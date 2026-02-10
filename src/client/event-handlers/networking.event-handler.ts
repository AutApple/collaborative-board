import { ServerBoardEvents } from '../../../shared/socket-events/board.socket-events.js';
import type { XY } from '../../../shared/utils/vec2.utils.js';
import type { AppContext } from '../../app-context.js';
import type { RoomService } from '../../room/room.service.js';
import type { Client } from '../client.js';
import { BaseEventHandler } from './base.event-handler.js';

export class NetworkingEventHandler extends BaseEventHandler {
	constructor(
		protected appContext: AppContext,
		protected roomService: RoomService,
	) {
		super(appContext);
	}

	public async onHandshake(client: Client, boardId: string, cursorWorldCoords: XY) {
		if (client.didPassHandshake() === true) return;

		const socket = client.getSocket();

		let room = this.appContext.roomRegistry.get(boardId);
		if (!room) room = await this.roomService.createRoom();

		boardId = room.board.getId()!;
		const boardName = room.board.getName()!;

		client.setBoardId(boardId);

		const cursor = {
			clientId: client.getClientId(),
			worldCoords: cursorWorldCoords,
		};

		room.cursorMap.addCursor(cursor);
		socket.emit(
			ServerBoardEvents.Handshake,
			boardId,
			boardName,
			room.board.getElements().map((e) => e.toRaw()),
			room.cursorMap.toList(),
		);
		socket.to(boardId).emit(ServerBoardEvents.ClientConnected, client.getClientId(), cursor);

		client.markHandshakePass();
	}

	public async onDisconnect(client: Client) {
		const boardId = client.getBoardId();
		if (!boardId) return;
		await this.roomService.saveState(boardId);

		client.disconnect();
	}
}
