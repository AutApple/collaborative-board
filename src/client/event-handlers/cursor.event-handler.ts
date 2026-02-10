import { ServerBoardEvents } from '../../../shared/socket-events/board.socket-events.js';
import type { XY } from '../../../shared/utils/vec2.utils.js';
import type { AppContext } from '../../app-context.js';
import type { ServiceContainer } from '../../common/instance-container.js';
import { RoomService } from '../../room/room.service.js';
import type { Client } from '../client.js';
import { BaseEventHandler } from './base.event-handler.js';

export class CursorEventHandler extends BaseEventHandler {
	private roomService: RoomService;
	constructor(serviceContainer: ServiceContainer) {
		super(serviceContainer);
		this.roomService = serviceContainer.getInstance(RoomService);
	}

	public onLocalCursorMove(client: Client, pos: XY) {
		const boardId = client.getBoardId();
		const socket = client.getSocket();

		if (!boardId) return;

		const room = this.roomService.get(boardId);
		if (!room) return;

		socket.to(boardId).emit(ServerBoardEvents.RemoteCursorMove, {
			clientId: socket.id,
			worldCoords: pos,
		});

		room.cursorMap.setPosition(socket.id, pos);
	}
}
